define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');

	var H = require('text!../../../tpl/index/index.html');
    var Slider = require("view/index/view/slider");
    var list_tpl = require('text!../../../tpl/index/view/list.html');
	var model = new M({
		pars: {
            limit: 5
		},
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
				t.listenTo(t.model, "sync", function() {
					t.syncRender();
				});
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = {};
			var html = _.template(t.template, data);
			t.$el.html(html);
			new Slider({
				el: t.$el.find(".js-slider-box")
			});
            t.$el.show()
		},
		syncRender: function() {
			var t = this,
				data = t.model.toJSON();
            data = data.data;
            var list = {list: data.list};
			var _html = _.template(list_tpl, list);
			var $list = t.$el.find(".js-index-list");
			$list.append(_html);
			Jser.loadimages($list);

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
			action: '/index/borrow',
            pars: {
                limit: 5
		    },
            type: 'post'
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})