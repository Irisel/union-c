//待优化
define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/crowdfunding/index.html');
    var _list = require('text!../../../tpl/crowdfunding/list.html');
	var model = new M({
        action: '/zhongchou/zlist',
        type: 'post'
	});
    var indexSelf = null;
	var V = B.View.extend({
		model: model,
		template: H,
        page: 1,
        showed: [],
		iTimer: null,
		isLoad: false, // 当加载数据的时候 禁止使用滑动加载 ,默认是false 即没有加载数据

		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
				t.listenTo(t.model, "sync", function() {
					t.pinterest();
				});
			});
		},
		render: function() {
			var t = this,
				data = t.model.toJSON();
            data = data.data;
            var list = {list: data.data};
            $.each(data.data, function(key, value){
                t.showed.push(value.id);
            });
            //console.log(list);
			var html = _.template(t.template, list);
			t.$el.show().html(html);
            Jser.loadimages(t.$el);
            indexSelf = t;
            t.bindEvent();
		},
        pinterest: function(){
			var t = this,
				data = t.model.toJSON();
            data = data.data;
            var list = {list: data.data};
            var news = [];
            $.each(data.data, function(key, value){
                news.push(value.id);
            });
            var news_str = news.join(',');
            var totla_str = t.showed.join(',');
            if(totla_str.indexOf(news_str)<0){
                t.showed = t.showed.concat(news);
			    var html = _.template(_list, list);
			    t.$el.find('.ul-crowd-list').append(html);
                Jser.loadimages(t.$el);
            }else if(t.page>1){
                t.finishScroll();
            }
            t.isLoad = false;
        },
		loadData: function() {
			var t = this;
            var _pars = t.model.get("pars");
            var _shu = _pars.shu;
		    var pars = {
				shu: _shu,
                url_pars: {
                    p: ++t.page
                }
			};
		    t.isLoad = true;
			t.changePars(pars);
		},
		doScroll: function() {
			var t = indexSelf,
				hash = window.location.hash;
			if (!t.iTimer && !t.isLoad && (hash == "" || hash.indexOf("#crowdfunding/index") != -1)) {
				t.iTimer = setTimeout(function() {
					var size = Jser.documentSize();
					if (t.$el.find('.ul-crowd-list').height() + t.$el.find('.ul-crowd-list').offset().top - size.fullHeight < 80) {
						t.loadData();
					}
					t.clearTime();
				}, 200);
			}
		},
		clearTime: function() {
			var t = this;
			if (t.iTimer) {
				clearTimeout(t.iTimer);
			}
			t.iTimer = null;
		},
		finishScroll: function() {
			var t = this;
			t.$el.find(".crowd-list").off('scroll', t.doScroll);
			t.clearTime();
		},
		back: function(){
			window.history.back();
		},
		bindEvent: function() {
			var t = this;
			t.finishScroll();
            //console.log(t.$el.find(".crowd-list"));
            t.$el.find(".crowd-list").on('scroll', t.doScroll);
		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
            //console.log(data, pars, 'data');
			t.model.set("pars", data);
		}
	});
	return function(pars) {
		model.set({
            pars: {
                shu: 5,
                url_pars: {
                    p: 1
                }
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})