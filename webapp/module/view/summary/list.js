define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/summary/list.html');
	var model = new M({
        action: '/about/article'
	});
	var V = B.View.extend({
		model: model,
		template: H,
        lists: {
            2: '平台公告',
            64:'联合动态',
            65:'联合资讯',
            114: '财富课堂'
        },
		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
                $("#js-loading").show();
                t.listenTo(t.model, "change:pars", function() {
                    t.$el.hide();
                    t.listenToOnce(t.model, "sync", function(){
                        t.render();
                    });
                })
			});
		},
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            data.title = t.lists[data.pars.type_name];
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            $("#js-loading").hide();
		},
        syncRender: function(){
            var t = this;
            t.$el.show();
            $("#js-loading").hide();
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