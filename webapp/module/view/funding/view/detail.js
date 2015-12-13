define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../../tpl/funding/view/detail.html');
	var model = new M({
        action: '/zhongchou/detail'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-guide":"guide"
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
			var html = _.template(t.template, data);
			t.$el.html(html).show();
            $.each(['breif', 'capital', 'use', 'risk'], function(i, item){
                t.$el.find('.' + item).html(data.data[item]);
            });
		}
	});
	return function(pars) {
		model.set({
            pars: {
                id: pars.id
		    }
		});
		return new V({
			el: pars.el
		});
	}
})