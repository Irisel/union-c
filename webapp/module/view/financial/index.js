define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');

	var H = require('text!../../../tpl/financial/index.html');
	var model = new M({
		pars: {

		}
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {

		},
		initialize: function() {
			var t = this;
//			t.listenToOnce(t.model, "change:data", function() {
				t.render();
//			});
		},
		//待优化
		render: function() {
            var size = windowSize();
			var t = this,
				data = {};
			var html = _.template(t.template, data);
			t.$el.html(html);
            t.$el.find('.list-topic').height(size.width * 199/320);
            t.$el.find('.topic-benefit').css('bottom', (size.width * 199/550) + 'px' );
            t.$el.find('.topic-period').css('bottom', (size.width * 199/3520) + 'px' );
            t.$el.show();
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
			action: '',
            pars: {

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})
