define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/recharge.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/charge',
        isCharging: false
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-moneyCharge": "moneyCharge",
            "click .js-chargetype": "chargetype"
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
                    window.location.href="#verifi/index";
                });
                return true;
            }
            if(data.data.invest_auth!="1"){
                Jser.alert("请先开通转账授权!", function() {
                   window.location.href="#verifi/transfer";
                });
                return true;
            }
            if(data.data.secondary_percent!="1"){
                Jser.alert("请先开通二次分配授权!", function() {
                   window.location.href="#verifi/allocation";
                });
                return true;
            }
            return false;
        },
		render: function() {
			var t = this,
				data = t.model.toJSON();
            console.log(data);
            if(!(t.checkLogin(data.status == "0")) && data.data){
                if(t.ifaccess(data))return;
            }else{
                return
            }
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
        chargetype: function(e){
            var t = this;
            var chargetype = $(e.currentTarget);
            if(chargetype.data('type') == 'bankc'){
                t.$el.find('.js-shortcutc').removeClass('on');
                t.$el.find('.js-rechargeType').val('');
            }else if (chargetype.data('type') == 'shortcutc'){
                t.$el.find('.js-bankc').removeClass('on');
                t.$el.find('.js-rechargeType').val('2');
                console.log(t.$el.find('.js-rechargeType').val());
            }
            t.$el.find('.js-' + chargetype.data('type')).addClass('on');
        },
		syncRender: function() {
			var t = this;
            var _data = { data: 0};
            Jser.getJSON(ST.PATH.ACTION + '/account/charge', {}, function(result) {
                if(result.status == "1")
                _data = result;
                if(!(t.checkLogin(_data.status == "0")) && _data.data){
                    t.ifaccess(_data);
                }
			}, function() {

			});
            t.$el.show();
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
            return logged;
        },
        moneyCharge: function(){
			var t = this;
            if(t.model.isCharging)return;
            var money = t.$el.find(".js-money").val();
            money = parseInt(money);
            var re = /^((\d+)|(\d+\.\d{1,2}))$/ ;
            console.log(money);
            if(isNaN(money)){
                Jser.error(t.$el.find(".js-error"), "*请输入正确的金额！");
                return;
            }else if (!re.test(money)){
                Jser.error(t.$el.find(".js-error"), "*请输入正确的金额, 允许保留两位小数！");
                return
            }else if(parseInt(money)<1){
			    Jser.error(t.$el.find(".js-error"), "*请输入正确的金额,最低充值金额为1元！" +
                    "");
                return;
            }
            t.model.isCharging = true;
            $('#moneycharge') && $('#moneycharge').submit();
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