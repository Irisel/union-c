define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');

	var H = require('text!../../../tpl/financial/order.html');
	var model = new M({
        action: '/member/invest'
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
            Jser.alert("投资成功", function() {
                    window.location.hash = "#account/invest";
            });
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