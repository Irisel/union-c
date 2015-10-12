define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/settings/deposit.html');
	var model = new M({
        action: '/account/shouquan'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-toggle": "deposit"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
        deposit: function(e){
            var t = this;
            var deposit = t.$el.find('.js-'+ $(e.currentTarget).data('type'));
            if(deposit.hasClass('on')){
                deposit.removeClass('on');
            }else{
                deposit.addClass('on');
            }
        },
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            console.log(data);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		bindEvent: function() {

		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.model.set("pars", data);
		},
		back: function(){
			window.history.back();
		}
	});
	return function(pars) {
		model.set({
            pars: {

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})