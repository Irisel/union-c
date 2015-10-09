define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/withdraw.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/withdrawal'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-moneyWithdraw": "moneyWithdraw"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
		//待优化
		render: function(syncData) {
			var t = this,
				data = syncData || t.model.toJSON();
            console.log(data, data.status == "0");
            t.checkLogin(data.status == "0");
            if(!data.data)data.data = 0;
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		back: function(){
			window.history.back();
		},
        moneyWithdraw: function(){
			var t = this;
            var money = t.$el.find(".js-money").val();
            money = parseInt(money);
            if(isNaN(money)){
                Jser.error(t.$el.find(".js-error"), "*请输入正确的数字");
                return;
            }else if(money<100){
                Jser.error(t.$el.find(".js-error"), "*最低金额不低于100");
                return;
            };
            $('#moneywithdraw') && $('#moneywithdraw').submit();
        },
		syncRender: function() {
			var t = this;
            var _data = { data: 0};
            Jser.getJSON(ST.PATH.ACTION + '/account/withdrawal', {}, function(result) {
                if(result.status == "1")
                _data = result;
                t.$el.find('.js-withdrawAmount').html(_data.data);
			}, function() {
                t.$el.find('.js-withdrawAmount').html(_data.data);
			});
            t.$el.show();
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