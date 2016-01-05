define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../../tpl/verifi/bank/options.html');
	var model = new M(
        {
            action: '/member/b_list'
        }
    );
	var V = B.View.extend({
		model: model,
		template: H,
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "change:data", function() {
				t.render();
				t.listenTo(t.model, "sync", function() {

				});
			});
		},
        renew: function(raw_data){
            console.log('renew');
            var t = this;
            var _data = {};
            Jser.getJSON(ST.PATH.ACTION + '/member/b_list', {}, function(result) {
                if(result.status == "1")
                _data = result;
                _data.raw_data = raw_data;
                t.render(_data);
			}, function() {

			});
        },
		//待优化
		render: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            var options = {options: []};
            $.each(data.data, function(i, item){
                options.options.push({
                   name: i,
                    value: item
                });
            });
			var html = _.template(t.template, options);
			t.$el.html(html);
            t.$el.show();
            //console.log(data.raw_data);
            t.$el.val(data.raw_data?data.raw_data.bank_name:'');
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
        if(pars.raw_data)model.set({
            raw_data: pars.raw_data
		});
		return new V({
			el: pars.el
		});
	}
});