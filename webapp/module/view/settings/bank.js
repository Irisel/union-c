define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/settings/bank.html');
    var Banks = require("view/verifi/bank/option");
    var Locations = require("view/verifi/bank/location");
	var model = new M({
        action:'/account/bank_info'
	});
	var V = B.View.extend({
		model: model,
		template: H,
        account: '',
        account_show: '',
		events: {
            "click .js-back": "back",
            "click .js-submit": "submit"
//            ,
//            "change .js-account-show": "fill"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
        fill: function(e){
            var t = this;
            var input = $(e.currentTarget).val();
            var input_new, account_new = t.account;
            if(input && input.length){
                if(input.length > t.account.length){
                    account_new+= input.substring(t.account.length);
                }else{
                    account_new = t.account.substring(0, input.length);
                }
                var m = input.substring(0, 13).replace(/./g, "*");
                input_new =  m + input.substr(13, input.length);
            }else{
                account_new = '';
            }
            if((!isNaN(parseInt(account_new)) || !account_new)){
                t.account = parseInt(account_new).toString();
                //console.log(t.account, input_new);
                if(t.account.length != input_new.length){
                    $(e.currentTarget).val(t.account_show);
                }else{
                    t.account_show = input_new;
                    $(e.currentTarget).val(t.account_show);
                }
            }else{
                $(e.currentTarget).val(t.account_show);
            }
            t.$el.find('.js-account').val(t.account);
        },
		back: function(){
			window.history.back();
		},
		syncRender: function() {
            var t = this;
            var _data = { data: {}};
            Jser.getJSON(ST.PATH.ACTION + '/account/bank_info', {}, function(result) {
                if(result.status == "1")
                _data = result;
                t.render(_data);
			}, function() {

			});
		},
		//待优化
		render: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            if(data.data["0"]){
                data.data = data.data["0"]
            }else{
                data.data = {};
            }
            data['unbind'] = !data.data.bank_num;
            var html = _.template(t.template, data);
			t.$el.html(html);
			new Banks({
				el: t.$el.find(".select-bank"),
                raw_data: data.data
			});
			new Locations({
				el: t.$el.find(".select-location"),
                raw_data: data.data
			});
            t.$el.show();
		},
        submit: function(){
            var t = this;
		    var _data = t.$el.find("#js-bank-form").serializeArray();
			var name, val;
			var _locData={};
			$.each(_data, function(i, item) {
				name = item.name;
				val = $.trim(item.value);
				_data[i].value = val;
				_locData[name]=val;
			});
            //console.log(_locData);
            Jser.getJSON(ST.PATH.ACTION + '/account/bindBank', _locData, function(result) {
                var info = result.status=="1"?'更新成功!':('更新失败：'+ result.data);
                Jser.alert(info, function(){
                    if(result.status=="1")
                    window.location.href="#account/index"
                });
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