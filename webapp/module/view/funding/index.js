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
            console.log(data);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
        back: function(){
          var t = this,data = t.model.toJSON();
          if(data.pars.from == 'crowdfunding'){
              window.location.href="#account/crowdfunding"
          }else{
              window.history.back();
          }
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
                id: pars.id,
                from: pars.from
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})