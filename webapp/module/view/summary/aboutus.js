define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/summary/aboutus.html');
	var model = new M({
		pars: {

		}
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
//			t.listenToOnce(t.model, "change:data", function() {
				t.render();
//			});
		},
		//待优化
		render: function() {
			var t = this,
				data = {};
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            var $img = t.$el.find(".content");
			Jser.loadimages($img);
            $("#js-loading").hide();
		},
		bindEvent: function() {

		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.model.set("pars", data);
		},
		back: function(){
			window.history.back();
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