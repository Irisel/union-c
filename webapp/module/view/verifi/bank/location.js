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
        options:'',
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
		syncRender: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            var options = '';
            $.each(data.data, function(i, item){
                options+='<option value="' + item.id + '">'+ item.cityname +'</option>';
            });
            if(data.raw_data){
                t.$el.find('.select-city').val(data.raw_data?data.raw_data.bank_city:'');
            }else{
                if(data.data && data.data.length)t.$el.find('.select-city').val(data.data[0].id);
            }
            t.options = options;
            t.$el.find('.select-city').html(options);
		},
        renew: function(raw_data, less, rid){
            var t = this;
            var _data = {};
            Jser.getJSON(ST.PATH.ACTION + '/member/getarea', {rid: rid || 0}, function(result) {
                if(result.status == "1")
                _data = result;
                _data.raw_data = raw_data;
                if(!less){
                    var option_pro = t.render(_data);
                    if(option_pro!=t.$el.find('.select-province').val()){
                        t.renew(raw_data, true, option_pro);
                    }else{
                        t.$el.find('.select-city').html(t.options);
                        t.$el.find('.select-city').val(raw_data?raw_data.bank_city:'');
                    }
                }else{
                    t.syncRender(_data);
                }
			}, function() {

			});
        },
		//待优化
		render: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            var options = {options_p: [], p_rid:'', bank_city:''};
            $.each(data.data, function(i, item){
                options.options_p.push({
                   name: item.cityname,
                    value: item.id
                });
            });
            if(data.raw_data){
                options.p_rid = data.raw_data?data.raw_data.bank_province:'';
                options.bank_city = data.raw_data?data.raw_data.bank_city:'';
                options.bank_address = data.raw_data?data.raw_data.bank_address:'';
            }else{
                if(options.options_p && options.options_p.length)options.p_rid = options.options_p[0].value;
                options.bank_city = data.raw_data?data.raw_data.bank_city:'';
                options.bank_address = '';
            }

			var html = _.template(t.template, options);
			t.$el.html(html);
            t.$el.find('.select-province').val(options.p_rid);
            t.changePars({
                rid: options.p_rid
            });
            t.$el.show();
            return options.p_rid;
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
});