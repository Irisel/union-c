define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
    var H = require('text!../../../../tpl/index/view/news.html');
    var news = require('plusin/news');
	var model = new M({
        action: '/index/news'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {

		},
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
            data.data = data.data?data.data:{};
            data.data.list = data.data.list?data.data.list:[];
            var html = _.template(t.template, data.data);
            console.log(data, t.$el);
            t.$el.html(html).show();
            if(data.data.list.length)t.$el.News({
                line: data.data.list.length,
                speed: 500,
                timer: 10000
            })
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
                type_id: 2,
                limit: 5
            }
		});
		return new V({
			el: pars.el
		});
	}
})
