define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/funding/index.html');
	var model = new M({
        action: '/zhongchou/zhongchou'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
                Jser.loadimages(t.$el);
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            var timestamp = data.data.zc_enddate;
            data.data.endtime = Jser.timestamp_format(timestamp);
            console.log(data);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
        back: function(){
          window.location.href="#crowdfunding/index";
        },
		bindEvent: function() {

		},
		changePars: function(pars) {
			var t = this;
			t.model.set("pars", pars);
		}
	});
	return function(pars) {
		model.set({
            pars: {
                id: pars.id
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})