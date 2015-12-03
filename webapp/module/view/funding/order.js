define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/funding/order.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/zinvest'
	});
	var V = B.View.extend({
		model: model,
		template: H,
        order_number: 1,
        order_money: null,
        order_min:null,
        order_max:null,
        num_changing: false,
        fundingOrder: false,
        jq_total: false,
        jq_num: false,
        jq_minus: false,
        jq_plus:false,
		events: {
             "click .js-back": "back",
             "click .js-minus":"minus",
            "click .js-plus":"plus",
            "input .js-num": "enter",
            "click .js-submit": "submit"
		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
			});
		},
        checkLogin: function(logged, type, href){
            if(logged){
                new Login({
				    el: $('.login-panel'),
                    type: type,
                    href: href
			    });
            }
        },
        ifaccess: function(data){
            if(data.data.id_status!="1"){
                Jser.alert("请先实名认证!", function() {
                    window.location.href="#verifi/index";
                });
                return true;
            }
            if(data.data.invest_auth!="1"){
                Jser.alert("请先开通转账授权!", function() {
                   window.location.href="#verifi/transfer";
                });
                return true;
            }
            if(data.data.secondary_percent!="1"){
                Jser.alert("请先开通二次分配授权!", function() {
                   window.location.href="#verifi/allocation";
                });
                return true;
            }
            return false;
        },
		//待优化
        syncRender: function(){
            var t = this;
            t.render();
        },
		render: function() {
			var t = this,
				data = t.model.toJSON();
            if(!(t.checkLogin(data.status == "0")) && data.data){
                t.ifaccess(data);
            }else{

            }
            if(!data.data)data.data = {};
            //console.log(data, '万'.indexOf(data.data.d_money));
            if('万'.indexOf(data.data.d_money) != -1){
                data.data.d_total = data.data.d_money.replace('万', '');
                t.order_money = parseInt(data.data.d_total);
                data.data.d_unit = '万';
            }else{
                data.data.d_total = data.data.d_money;
                t.order_money = parseInt(data.data.d_total);
            }
            t.order_min = parseInt(data.data.min);
            t.order_max = parseInt(data.data.max);
            //console.log(t.order_min, t.order_max);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            t.fundingOrder = $('#fundingOrder');
            t.jq_num = t.$el.find('.js-num');
            t.jq_total = t.$el.find('.js-total');
            t.jq_minus = t.$el.find('.js-minus');
            t.jq_plus = t.$el.find('.js-plus');
            t.check_limit();
		},
        checkformData: function(formData){
            var reg = /^(\d{1,4}\-)?(13|15|17|18){1}\d{9}$/;
            if(!formData['upayeename'] ||formData['upayeename'].length==0){
                Jser.confirm("请输入收件人姓名!", function() {

			    }, function(){

                });
                return false;
            }else if (!formData['uphone'] || formData['uphone'].length==0){
                Jser.confirm("请输入手机号码!", function() {

			    }, function(){

                });
                return false;
            }else if (!reg.test(formData['uphone'])){
                Jser.confirm("请输入正确的手机号码!", function() {
                    $('#uphone').val('');
			    }, function(){

                });
                return false;
            }else if (!formData['uaddress'] ||formData['uaddress'].length==0){
                Jser.confirm("请输入快递地址!", function() {

			    }, function(){

                });
                return false;
            }else if (!formData['transfer_invest_num'] || formData['transfer_invest_num'].length==0 || parseFloat(formData['transfer_invest_num']) <=0){
                Jser.confirm("众筹份额无效!", function() {

			    }, function(){

                });
                return false;
            }
            return true;
        },
        submit: function(){
            var t = this, data = t.model.toJSON();
		    var _data = t.$el.find("#fundingOrder").serializeArray();
			var name, val;
			var _locData={};
			$.each(_data, function(i, item) {
				name = item.name;
				val = $.trim(item.value);
				_data[i].value = val;
				_locData[name]=val;
			});
            $.extend(_locData, {
                transfer_invest_num: t.order_number,
                T_borrow_id: data.pars.id
            });
            if(data.data.y_money < t.order_money * t.order_number){
			    Jser.confirm("余额不够，请充值!", function() {
                    window.location.href = '#account/recharge/';
			    }, function(){

                });
                return;
            }
            if(t.checkformData(_locData))t.fundingOrder && t.fundingOrder.submit();
//            Jser.getJSON(ST.PATH.ACTION + '/account/investmoney', _locData, function(result) {
//                //console.log(result);
//			}, function() {
//
//			}, 'post');
        },
		bindEvent: function() {

		},
		back: function(){
			window.history.back();
		},
        plus: function(){
            var t = this;
            if(t.num_changing)return;
            t.num_changing = true;
            //console.log(t.order_max, 'plus', t.order_number>= t.order_max, t.order_money);
            if(!isNaN(t.order_max) && t.order_number>= t.order_max){
                t.num_changing = false;
                return;
            }
            t.order_number+=1;
            if(!isNaN(t.order_money))t.jq_total.html(t.order_money * t.order_number);
            t.jq_num.val(t.order_number);
            t.check_limit();
            t.num_changing = false;
        },
        minus: function(){
            var t = this;
            if(t.num_changing)return;
            t.num_changing = true;
            //console.log(t.order_min, 'minus', t.order_number<= t.order_min, t.order_money);
            if(!isNaN(t.order_min) && t.order_number<= t.order_min && t.order_number<=1){
                t.num_changing = false;
                return;
            }
            if(t.order_number)t.order_number-=1;
            if(!isNaN(t.order_money))t.jq_total.html(t.order_money * t.order_number);
            t.jq_num.val(t.order_number);
            t.check_limit();
            t.num_changing = false;
        },
        check_limit: function(){
            var t = this;
            if(t.order_number<= t.order_min){
                t.jq_minus.removeClass('on');
            }else{
                t.jq_minus.addClass('on');
            }
            if(t.order_number>= t.order_max){
                t.jq_plus.removeClass('on');
            }else{
                t.jq_plus.addClass('on');
            }

        },
        enter: function(e){
            var t = this;
            var inputNum = $(e.currentTarget).val();
            if(inputNum && !isNaN(inputNum)){
                if(inputNum){
                    if(parseInt(inputNum)> t.order_max)inputNum = t.order_max;
                    if(parseInt(inputNum)< t.order_min)inputNum = t.order_min;
                    t.order_number = parseInt(inputNum);
                    $(e.currentTarget).val(t.order_number);
                    if(!isNaN(t.order_money))t.jq_total.html(t.order_money * t.order_number);
                }

            }else{
                $(e.currentTarget).val(t.order_number);
                if(!isNaN(t.order_money))$('.js-total').html(t.order_money * t.order_number);
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
            pars: {
                id: pars.id
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})