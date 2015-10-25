define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/invite.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/friend'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-share": "share",
            "click .js-hide": "hide"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
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
        hide: function(){
            var t = this;
            t.$el.find('.pop').hide();
        },
        share: function(){
            var t = this;
            t.$el.find('.pop').show();
        },
		//待优化
		syncRender: function() {
            var t = this;
            var _data = { data: []};
            Jser.getJSON(ST.PATH.ACTION + '/account/friend', {}, function(result) {
                if(result.status == "1")
                _data = result;
                t.checkLogin(result.status == "0");
                t.render(_data);
			}, function() {

			});
		},
		//待优化
		render: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            console.log(data, data.status == "0");
            t.checkLogin(data.status == "0");
            if(!data.data)data.data = [];
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            t.bindEvent();
            t.syncloading = false;
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

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});
