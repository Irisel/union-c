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
		render: function() {
			var t = this,
				data = t.model.toJSON();
            console.log(data);
            t.checkLogin(data.status == "0");
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
        chargetype: function(e){
            var chargetype = $(e.currentTarget);
            if(chargetype.data('type') == 'bankc'){
                $('.js-shortcutc').removeClass('on');
            }else if (chargetype.data('type') == 'shortcutc'){
                $('.js-bankc').removeClass('on');
            }
            $('.js-' + chargetype.data('type')).addClass('on');
        },
		syncRender: function() {
			var t = this;
            var _data = { data: 0};
            Jser.getJSON(ST.PATH.ACTION + '/account/charge', {}, function(result) {
                if(result.status == "1")
                _data = result;
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
        },
        moneyCharge: function(){
			var t = this;
            if(t.model.isCharging)return;
            var money = t.$el.find(".js-money").val();
            money = parseInt(money);
            if(isNaN(money)){
                Jser.error(t.$el.find(".js-error"), "*请输入正确的数字");
                return;
            }else if (money<=0){
                Jser.error(t.$el.find(".js-error"), "*请输入正确的数字");
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