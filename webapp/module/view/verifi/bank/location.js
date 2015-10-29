define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../../tpl/verifi/bank/locations.html');
	var model = new M(
        {
            action: '/member/getarea'
        }
    );
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "change .select-province": "getcity"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "change:data", function() {
				t.render();
				t.listenTo(t.model, "sync", function() {
					t.syncRender();
				});
			});
		},
        getcity: function(e){
            var t = this;
            var val = $(e.currentTarget).val();
            t.changePars({
                rid: val
            });
        },
		syncRender: function() {
            var t = this, data = t.model.toJSON();
            var options = '';
            $.each(data.data, function(i, item){
                options+='<option value="' + item.id + '">'+ item.cityname +'</option>';
            });
            if(data.raw_data){
                t.$el.find('.select-city').val(data.raw_data?data.raw_data.bank_city:'');
            }else{
                t.$el.find('.select-city').val(data.data[0].id);
            }
            t.$el.find('.select-city').html(options);
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            var options = {options_p: [], p_rid:''};
            $.each(data.data, function(i, item){
                options.options_p.push({
                   name: item.cityname,
                    value: item.id
                });
            });
            if(data.raw_data){
                options.p_rid = data.raw_data?data.raw_data.bank_province:'';
                options.bank_address = data.raw_data?data.raw_data.bank_address:'';
            }else{
                options.p_rid = options.options_p[0].value;
                options.bank_address = '';
            }

			var html = _.template(t.template, options);
			t.$el.html(html);
            t.changePars({
                rid: options.p_rid
            });
            t.$el.show();
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
                rid: 0
            }
		});
        if(pars.raw_data)model.set({
            raw_data: pars.raw_data
		});
		return new V({
			el: pars.el
		});
	}
})