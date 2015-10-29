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
        ifaccess: function(data){
            if(data.data.id_status!="1"){
                Jser.alert("请先实名认证!", function() {
                    window.location.href="#verifi/index/next:bank";
                });
                return true;
            }
            if(data.data.bank.toString() !="1"){
                Jser.alert("请先绑定银行卡!", function() {
                    window.location.href="#verifi/bank";
                });
                return true;
            }
            return false;
        },
		render: function(syncData) {
			var t = this,
				data = syncData || t.model.toJSON();
            console.log(data, data.status == "0");
            if(!data.data)data.data = {balance:0.00};
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            if(isNaN(data.data.balance))data.data.balance = 0;
            if(!(t.checkLogin(data.status == "0")) && data.data){
                if(t.ifaccess(data))return;
            }else{
                return
            }
		},
		back: function(){
			window.history.back();
		},
        moneyWithdraw: function(){
			var t = this,data = t.model.toJSON();
            var money = t.$el.find(".js-money").val();
            var re = /^((\d+)|(\d+\.\d{1,2}))$/ ;
            console.log(money);
            if(isNaN(money)){
			    Jser.error(t.$el.find(".js-error"), "*请输入正确的金额！");
                return;
            }else if (!re.test(money)){
			    Jser.error(t.$el.find(".js-error"), "*请输入正确的金额, 允许保留两位小数！");
                console.log('re');
                return
            }else if(parseInt(money)<100){
			    Jser.error(t.$el.find(".js-error"), "*请输入正确的金额, 最低金额为100！");
                return;
            }else if(parseInt(money)>parseInt(data.data.balance)){
			    Jser.error(t.$el.find(".js-error"), "*提现金额不可超过账户余额！");
                return;
            }
            $('#moneywithdraw') && $('#moneywithdraw').submit();
        },
		syncRender: function() {
            console.log('syncRender');
			var t = this;
            var _data = { data:{balance:0.00}};
            Jser.getJSON(ST.PATH.ACTION + '/account/withdrawal', {}, function(result) {
                if(result.status == "1")
                _data = result;
                if(!(t.checkLogin(_data.status == "0")) && _data.data){
                    if(t.ifaccess(_data))return;
                }
                if(isNaN(_data.data.balance))_data.data.balance = 0;
                t.$el.find('.js-withdrawAmount').html(_data.data.balance);
			}, function() {

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