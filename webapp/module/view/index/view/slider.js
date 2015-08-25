define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var Swipe = require('plusin/swipe');
	var H = require('text!../../../../tpl/index/view/slider.html');
	var model = new M();
	var V = B.View.extend({
		model: model,
		template: H,
		initialize: function() {
			var t = this;
//			if (t.model._loaded) {
//				t.render();
//			} else {
//				t.listenTo(t.model, "sync", function() {
//					t.render();
//				});
//			}
            t.render();
		},
		//待优化
		render: function() {
            var size = windowSize();
			var t = this,
//				data = t.model.toJSON();
            data = {data: [{picture: 'http://lama.piapiapiapia.com/webapp/union/webapp/resource/images/banner.png'},
            {picture: 'http://lama.piapiapiapia.com/webapp/union/webapp/resource/images/banner.png'}]};
			var html = _.template(t.template, data);
			t.$el.html(html);
            t.$el.find('.slider-box').height(size.width * 17/32);
            t.$el.show();
			t.doSlider();
			Jser.loadimages(t.$el);
		},
		doSlider: function() {
			var t=this;
			window.global_indexSwipe = Swipe(t.$el.find(".slider-box")[0], {
				stopPropagation: true,
				continuous: true,
				auto: 2000,
				speed: 800,
				callback: function(idx) {
					$("#js-index-sliderIdx li").removeClass().eq(idx % global_indexSwipe.getNumSlides()).addClass("on");
				}
			});
		}
	});
	return function(pars) {
		model.set({
			action: ''
		});		
		return new V({
			el: pars.el
		});
	}
})