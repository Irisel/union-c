define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');

	var H = require('text!../../../tpl/financial/order.html');
	var model = new M({
        action: '/account/invest',
        isInvesting: false
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-submit": "submit",
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            console.log(data);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
        back: function(){
          window.location.href="#financial/index";
        },
		bindEvent: function() {

		},
        submit: function(){
			var t = this,
				data = t.model.toJSON();
            if(t.model.isInvesting)return;
            if(!(data.data && data.data.money && data.data.dur && data.pars.id))return;
            console.log(ST.PATH.ACTION + '/account/tinvestmoney', {T_borrow_id: data.pars.id, transfer_invest_num: data.data.money, transfer_invest_month: data.data.dur});
            Jser.getJSON(ST.PATH.ACTION + '/account/tinvestmoney', {T_borrow_id: data.pars.id, transfer_invest_num: data.data.money, transfer_invest_month: data.data.dur}, function(result) {
                t.model.isInvesting = false;
                if(result.status == "1"){
                    Jser.alert("投资成功", function() {

                    })
                }
                else{
                     Jser.alert("投资失败", function() {

                    })
                }
			}, function() {
                t.model.isInvesting = false;
                Jser.alert("投资失败", function() {

                });
			}, 'post');
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
                id: pars.id,
                money: pars.money
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})