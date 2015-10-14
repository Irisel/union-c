define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/verifi/transfer.html');
	var model = new M({
        action:'/account/shouquan'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-submit": "submit"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		bindEvent: function() {

		},
        submit: function(){
            var t = this;
            t.$el.find('#js-transfer-form') && t.$el.find('#js-transfer-form').submit();
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
			action: '',
            pars: {

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})