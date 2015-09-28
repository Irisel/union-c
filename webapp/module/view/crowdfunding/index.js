define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/crowdfunding/index.html');
	var model = new M({
        action: '/zhongchou/zlist',
        type: 'post'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "change:data", function() {
				t.render();
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            data = data.data;
            var list = {list: data.data};
            console.log(list);
			var html = _.template(t.template, list);
			t.$el.show().html(html);
            Jser.loadimages(t.$el);
		},
        back: function(){
          window.location.href="#crowdfunding/index";
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
                limit: 5,
                page: 1
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})