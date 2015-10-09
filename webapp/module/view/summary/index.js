define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/summary/index.html');
	var model = new M({
        action: '/about/article'
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
                t.listenTo(t.model, "change:pars", function() {
                    t.listenToOnce(t.model, "sync", function(){
                        t.render();
                    });
                })
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, {});
			t.$el.html(html);
            t.$el.find('.js-summary').html(data.data?data.data.type_content:'');
            var title = t.$el.find('.js-summary h3');
            if(title)t.$el.find('.header').html(title.html());
            t.$el.find('.js-summary h3').hide();
            t.$el.show();
		},
        syncRender: function(){
            var t = this;
            t.$el.show();
        },
		back: function(){
			window.history.back();
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
                type_name: pars.type_name
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})