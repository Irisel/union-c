define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/invest.html');
    var list_tpl = require('text!../../../tpl/account/invest/list.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/tendbacking'
	});
	var V = B.View.extend({
		model: model,
		template: H,
        syncloading :true,
        syncaction: {
            '0': '/account/tendbacking',
            '1': '/account/tenddone'
        },
		events: {
            "click .js-invest": "invest",
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
                t.listenTo(t.model, "change:pars", function() {
                    t.listenToOnce(t.model, "sync", function(){
                        t.syncRender();
                    });
                })
			});
		},
        checkLogin: function(logged, type, href){
            if(logged){
                new Login({
				    el: $('.login-panel'),
                    type: type,
                    href: href
			    });
            }
        },
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            //console.log(data, data.status == "0");
            t.checkLogin(data.status == "0");
            if(!data.data)data.data = [];
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            t.bindEvent();
            t.syncloading = false;
		},
		syncRender: function() {
            //console.log('syncReader');
			var t = this;
            if(t.syncloading)return;
            var _data = { data: []};
            $("#js-loading").show();
            Jser.getJSON(ST.PATH.ACTION + t.syncaction[t.model.get("pars")["type"]], {}, function(result) {
                $("#js-loading").hide();
                if(result.status == "1")
                _data = result;
                t.checkLogin(result.status == "0");
                var _html = _.template(list_tpl, _data);
			    t.$el.find(".list-history").html(_html);
                t.syncloading = false;
			}, function() {
                $("#js-loading").hide();
                var _html = _.template(list_tpl, _data);
			    t.$el.find(".list-history").html(_html);
                t.syncloading = false;
			});
            t.$el.show();
		},
        invest: function(event){
            var target = $(event.currentTarget);
            var borrow_id = target.data('id');
            if(borrow_id){
                window.location.href="#financial/index/id:" + borrow_id +"/from:invest"
            }
        },
//        invest: function(e){
//            var t = this;
//            t.$el.find('.tabs ul li.on').removeClass('on');
//            $(e.currentTarget).addClass('on');
//            t.model.set("pars", {
//                type: $(e.currentTarget).data("invest")
//            });
//        },
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
                type: '0'
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});
