define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/present.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/hongbao'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            if(!(Object.prototype.toString.call(data.data) === '[object Array]'))data.data = [];
            data.data.sort(function(a, b){
                if(a.status != b.status){
                    if(a.status=='1')return false;
                }
                if(a.expired_day != b.expired_day){
                    if(parseInt(a.expired_day) > parseInt(b.expired_day))return false;
                }
                if(a.money != b.money){
                    if(parseInt(a.money) > parseInt(b.money))return false;
                }
                return true;
            });
            console.log(data);
            t.checkLogin(data.status == "0");
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		syncRender: function() {
            var t = this;
            t.render();
		},
		bindEvent: function() {

		},
		back: function(){
			window.history.back();
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

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})