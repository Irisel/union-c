define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/error.html');
	var model = new M({

	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
		    t.render();
            t.listenTo(t.model, "change:pars", function() {
                t.render();
            })
		},
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
            var t = this, data = t.model.toJSON();
            console.log(data);
            var html = _.template(t.template, data);
			t.$el.show().html(html);
            $("#js-loading").hide();
		},
		bindEvent: function() {

		},
        syncRender: function(){
            var t = this;
            t.render();
        }
	});
	return function(pars) {
		model.set({
            pars: {
                message: pars.message
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});