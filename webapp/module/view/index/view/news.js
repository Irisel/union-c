define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
    var H = require('text!../../../../tpl/index/view/news.html');
    var news = require('plusin/news');
    var Login = require("view/login/index");
	var model = new M({

	});
	var V = B.View.extend({
		model: model,
		template: H,
        is_log: 0,
		events: {
            "click .js-share": "share"
		},
		initialize: function() {
			var t = this;
//			if (t.model._loaded) {
				t.render();
//			}
//            else {
//				t.listenTo(t.model, "sync", function() {
//					t.render();
//				});
//			}
		},
		syncRender: function() {
//			var t = this,
//				data = t.model.toJSON();
//            //console.log(data, t.$el);
//			var _html = _.template(list_tpl, data);
//			t.$el.find(".products-list").html(_html)
//            t.$el.show();
		},
        share: function(){
            if(window.is_login){
                window.location.href="#account/invite";
            }else{
                new Login({
				    el: $('.login-panel')
			    });
            }
        },
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            data = data.news;
            //console.log(data);
            data.data = data.data?data.data:{};
            data.data.list = data.data.list?data.data.list:{};
            data.data.list.list = data.data.list.list?data.data.list.list:[];
            var html = _.template(t.template, data.data);
            //console.log(data);
            t.$el.html(html).show();
            if(data.data.list.list.length)t.$el.News({
                line: data.data.list.list.length,
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
            news: pars.news
		});
		return new V({
			el: pars.el
		});
	}
})
