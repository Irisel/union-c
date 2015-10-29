define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/index.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/user_data'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-back": "back",
			"click .js-withdraw": "withdraw",
			"click .js-recharge": "recharge"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
		syncRender: function() {
            var t = this;
            var _data = { data: []};
            $("#js-loading").show();
            Jser.getJSON(ST.PATH.ACTION + '/account/user_data', {}, function(result) {
                $("#js-loading").hide();
                if(result.status == "1")
                _data = result;
                t.checkLogin(result.status == "0");
                t.render(_data);
			}, function() {
                $("#js-loading").hide();
			});
		},
		//待优化
		render: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            console.log(data);
            t.checkLogin(data.status == "0");
			var html = _.template(t.template, data);
			t.$el.show().html(html);
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
		bindEvent: function() {
            
		},
		back: function(){
			window.history.back();
		},
		withdraw: function(){
			window.location.href = "#account/withdraw"
		},
		recharge: function(){
			window.location.href = "#account/recharge"
		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.model.set("pars", data);
		},
        reload: function(){
            var t = this;
            t.model.sync('read', t.model, {});
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