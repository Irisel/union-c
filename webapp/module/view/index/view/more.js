define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
    var H = require('text!../../../../tpl/index/view/more.html');
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
		syncRender: function() {
//			var t = this,
//				data = t.model.toJSON();
//            console.log(data, t.$el);
//			var _html = _.template(list_tpl, data);
//			t.$el.find(".products-list").html(_html)
//            t.$el.show();
		},
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            var html = _.template(t.template, data.data);
            console.log(data, t.$el);
            t.$el.html(html).show();
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

            }
		});
		return new V({
			el: pars.el
		});
	}
})
