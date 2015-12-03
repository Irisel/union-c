define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');

	var H = require('text!../../../tpl/financial/history.html');
	var model = new M({
        action: '/financial/record'
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
 		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            if(!data.data)data.data = [];
            //console.log(data);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
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
                id: pars.id
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})