define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
    var H = require('text!../../../tpl/account/friends.html');
	var model = new M({
        action: '/account/invite_friends',
        type: 'post'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {

		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
			});
		},
		syncRender: function() {
			var t = this;
//				data = t.model.toJSON();
//            //console.log(data, t.$el);
//			var _html = _.template(list_tpl, data);
//			t.$el.find(".products-list").html(_html)
            t.$el.show();
		},
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            data.data = data.data?data.data:{};
            var html = _.template(t.template, data.data);
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
                user_id: pars.user_id
            }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});

