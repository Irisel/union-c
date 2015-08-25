define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');

	var H = require('text!../../../tpl/index/index.html');
    var Slider = require("view/index/view/slider");
    var list_tpl = require('text!../../../tpl/index/view/list.html');
	var model = new M({
		pars: {

		}
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {

		},
		initialize: function() {
			var t = this;
//			t.listenToOnce(t.model, "change:data", function() {
				t.render();
//				t.listenTo(t.model, "sync", function() {
					t.syncRender();
//				});
//			});
		},
		//待优化
		render: function() {
			var t = this,
				data = {};
			var html = _.template(t.template, data);
			t.$el.show().html(html);
			new Slider({
				el: t.$el.find(".js-slider-box")
			});
		},
		syncRender: function() {
			var t = this,
//				data = t.model.toJSON();
            data = {data: [
                {
                    name: '金房惠利',
                    description: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                },
                {
                    name: '当当有礼',
                    description: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                },
                {
                    name: '联农利牧',
                    description: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                }
            ]};
			var _html = _.template(list_tpl, data);
			var $list = t.$el.find(".js-index-list");
			$list.append(_html);
//			Jser.loadimages($list);

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
			action: '',
            pars: {

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})