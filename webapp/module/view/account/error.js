define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/error.html');
	var model = new M({
        action:''
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
		},
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
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

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});