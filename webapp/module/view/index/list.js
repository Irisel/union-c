define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
    var list_tpl = require('text!../../../tpl/index/view/more.html');
	var H = require('text!../../../tpl/index/list.html');
	var model = new M({
        action: '/financial/more'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-product": "product",
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "change:data", function() {
				t.render();
                t.syncRender();
                t.listenTo(t.model, "change:pars", function() {
                    t.listenToOnce(t.model, "sync", function(){
                        t.syncRender();
                    });
                })
			});
		},
		syncRender: function() {
			var t = this,
				data = t.model.toJSON();
            console.log(data);
			var _html = _.template(list_tpl, data);
			t.$el.find(".products-list").html(_html);
		},
		//待优化
		render: function() {
			var t = this,
				data = {};
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		bindEvent: function() {

		},
        product: function(e){
            var t = this;
            t.$el.find('.index-products-list li.on').removeClass('on');
            $(e.currentTarget).addClass('on');
            t.model.set("pars", {
                name_id: $(e.currentTarget).data("name")
            });
        },
        back: function(){
          window.location.href="#financial/index";
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
                name_id: 0
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})