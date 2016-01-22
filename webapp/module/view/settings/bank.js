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
        banks: null,
        locations: null,
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
        rerender: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            if(data.data["0"]){
                data.data = data.data["0"];
            }else{
                data.data = {};
            }
            data['unbind'] = !data.data.bank_num;
            var html = _.template(t.template, data);
			if(!t.banks && !t.locations){
                t.$el.html(html);
            }else{
                t.$el.find('.js-account-show').val(data.data?data.data.bank_num:'');
                t.$el.find('.js-submit').html(data.unbind?'绑定':'更新')
            }
			if(!t.banks){
                t.banks = new Banks({
                    el: t.$el.find(".select-bank"),
                    raw_data: data.data
                });
            }else{
                t.banks.renew(data.data);
            }
			if(!t.locations){
                t.locations =new Locations({
                    el: t.$el.find(".select-location"),
                    raw_data: data.data
                });
            }else{
                t.locations.renew(data.data);
            }
            return data;
		},
		render: function(rawdata) {
			var t = this;
            t.rerender(rawdata);
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
            if(t.checkError(_locData))return;
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
		checkError: function(_locData) {
            if (!(_locData['account'] && (_locData['account'].length>=16 && _locData['account'].length<=19) && !isNaN(_locData['account']))) {
				Jser.alert('请输入16-19位银行号码！', function(){

                });
				return true;
			}else if(!(_locData['bankname'])){
				Jser.alert('请输入银行名称！', function(){

                });
				return true;
            }else if(!(_locData['province'])){
				Jser.alert('请选择省份！', function(){

                });
				return true;
            }else if(!(_locData['city'])){
				Jser.alert('请选择城市！', function(){

                });
				return true;
            }else if(!(_locData['bankaddres'])){
				Jser.alert('请输入开户行支行名称！', function(){

                });
				return true;
            }else if(!(_locData['pwd'])){
				Jser.alert('请输入银行登录密码！', function(){

                });
				return true;
            }
			return false;
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
});