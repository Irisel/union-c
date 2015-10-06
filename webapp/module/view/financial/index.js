define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/financial/index.html');
	var model = new M({
        action: '/financial/index'
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
		//待优化
		render: function() {
            var size = windowSize();
			var t = this,
				data = t.model.toJSON();
            console.log(data);
			var html = _.template(t.template, data);
			t.$el.html(html);
            if(data.data && !isNaN((parseInt(data.data.b_m))) && !isNaN((parseInt(data.data.money_dec)))){
                var b_m = parseInt(data.data.b_m);
                var money_dec = parseInt(data.data.money_dec);
                console.log(b_m, money_dec, (b_m - money_dec) * 100 / b_m);
                t.$el.find('.list-progress .progress').css('width', ((b_m - money_dec) * 100 / b_m) + '%');
            }
            t.$el.find('.list-topic').height(size.width * 199/320);
            t.$el.find('.topic-benefit').css('bottom', (size.width * 199/550) + 'px' );
            t.$el.find('.topic-period').css('bottom', (size.width * 199/3520) + 'px' );
            t.$el.show();
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
