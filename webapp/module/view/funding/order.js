define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/funding/order.html');
	var model = new M({
		pars: {

		}
	});
	var V = B.View.extend({
		model: model,
		template: H,
        order_number: 1,
		events: {
             "click .js-back": "back",
             "click .js-minus":"minus",
            "click .js-plus":"plus",
            "input .js-num": "enter"
		},
		initialize: function() {
			var t = this;
//			t.listenToOnce(t.model, "change:data", function() {
				t.render();
//			});
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
		back: function(){
			window.history.back();
		},
        plus: function(){
            var t = this;
            t.order_number+=1;
            t.$el.find('.js-num').val(t.order_number);
        },
        minus: function(){
            var t = this;
            if(t.order_number)t.order_number-=1;
            t.$el.find('.js-num').val(t.order_number);
        },
        enter: function(e){
            var t = this;
            var inputNum = $(e.currentTarget).val();
            if(!isNaN(inputNum)){
                if(inputNum)
                t.order_number = inputNum;
            }else{
                $(e.currentTarget).val(t.order_number);
            }
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
			action: '',
            pars: {

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})