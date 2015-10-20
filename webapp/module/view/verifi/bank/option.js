define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../../tpl/verifi/bank/options.html');
	var model = new M(
        {
            action: '/member/b_list'
        }
    );
	var V = B.View.extend({
		model: model,
		template: H,
		initialize: function() {
			var t = this;
			if (t.model._loaded) {
				t.render();
			} else {
				t.listenTo(t.model, "sync", function() {
					t.render();
				});
			}
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            var options = {options: []};
            $.each(data.data, function(i, item){
                options.options.push({
                   name: i,
                    value: item
                });
            });
			var html = _.template(t.template, options);
			t.$el.html(html);
            t.$el.show();
		}
	});
	return function(pars) {
		model.set({
            pars: {

            }
		});
		return new V({
			el: pars.el
		});
	}
})