define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');

	var H = require('text!../../../tpl/index/index.html');
    var Slider = require("view/index/view/slider");
    var News = require("view/index/view/news");
    var Recommand = require("view/index/view/recommand");
    var More = require("view/index/view/more");
    //var list_tpl = require('text!../../../tpl/index/view/list.html');
	var model = new M({
        action: '/index/news'
	});
	var V = B.View.extend({
		model: model,
		template: H,
        news: {

        },
		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "change:data", function() {
				t.render();
//				t.listenTo(t.model, "sync", function() {
//					t.syncRender();
//				});
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, data);
            window.is_login = data.data.is_login;
			t.$el.html(html);
			new Slider({
				el: t.$el.find(".js-slider-box")
			});
            new News({
				el: t.$el.find(".js-news-box"),
                news: data
			});
            new Recommand({
                el: t.$el.find(".js-recommend-box")
            });
            new More({
                el: t.$el.find(".js-more-box")
            });
            t.$el.show()
		},
		syncRender: function() {
//            var list = {list: data.list};
//			var _html = _.template(list_tpl, list);
//			var $list = t.$el.find(".js-index-list");
//			$list.html(_html);
//			Jser.loadimages($list);
            $("#js-loading").show();
            Jser.getJSON(ST.PATH.ACTION + '/index/news', {}, function(result) {
                $("#js-loading").hide();
                window.is_login = result.data.is_login;
			}, function() {
                $("#js-loading").hide();
			});
		},
		back: function(){
			window.history.back();
		},
		bindEvent: function() {

		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.model.set("pars", data);
		}
	});
	return function(pars) {
		model.set({
            pars: {
                type_id: 2,
                limit: 5
            }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})