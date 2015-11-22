
define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/hongbao/regist.html');
	var model = new M({

	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {

		},
		initialize: function() {
			var t = this;
		    t.render();
		},
		//待优化
		render: function() {
			var t = this,
				data = {};
            var size = windowSize();
			var html = _.template(t.template, data);
            t.$el.html(html);
            t.$el.find('.regist-topic').height(size.width * 11/15);
            t.$el.show();
            $("#js-loading").hide();
		},
		bindEvent: function() {

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