define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/verifi/bank.html');
	var model = new M({
        action:'/account/shouquan'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-submit": "submit"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
        submit: function(){
            var t = this;
		    var _data = t.$el.find("#verifiIdcard").serializeArray();
			var name, val;
			var _locData={};
			$.each(_data, function(i, item) {
				name = item.name;
				val = $.trim(item.value);
				_data[i].value = val;
				_locData[name]=val;
			});
            console.log(_locData);
            Jser.getJSON(ST.PATH.ACTION + '/account/bindBank', _locData, function(result) {
                console.log(result);
			}, function() {

			}, 'post');
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

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})