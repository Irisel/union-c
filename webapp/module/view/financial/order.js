define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
    var Login = require("view/login/index");
	var H = require('text!../../../tpl/financial/order.html');
	var model = new M({
        action: '/account/invest',
        isInvesting: false
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-submit": "submit",
            "click .js-back": "back",
            "click .js-present": "present"
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
            return logged;
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
		render: function() {
			var t = this,
				data = t.model.toJSON();
            if(!data.data)data.data = {};
            data.data.is_day = data.data.dur.indexOf('天') > -1;
            if(!(t.checkLogin(data.status == "0")) && data.data){
                t.ifaccess(data);
            }
            if(data.data && data.data.rewards){
                data.data.rewards.sort(function(a, b){
                if(a.status != b.status){
                    if(a.status=='1')return false;
                }
                if(a.expired_day != b.expired_day){
                    if(a.expired_day=='0')return true;
                    if(b.expired_day=='0')return false;
                }
                if(a.expired_time != b.expired_time){
                    if(parseInt(a.expired_time) < parseInt(b.expired_time))return false;
                }
                if(a.money != b.money){
                    if(parseInt(a.money) > parseInt(b.money))return false;
                }
                return true;
                });
                data.data.reward_choose = data.data.rewards[0];
            }
            console.log(Jser.getItem(data.pars.id + '_funding_reward'));
            if(Jser.getItem(data.pars.id + '_funding_reward') && data.data && data.data.rewards){
                var reward_id = Jser.getItem(data.pars.id + '_funding_reward');
                $.each(data.data.rewards, function(i, item){
                    if(reward_id == item.id)data.data.reward_choose = item;
                })
            }else if(data.data && data.data.reward_choose){
                Jser.setItem(data.pars.id + '_funding_reward', data.data.reward_choose.id);
            }
            console.log(data);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            if(data.data.reward_choose){
                t.$el.find('.reward_text').html(data.data.reward_choose.name);
                t.$el.find('.reward_id').val(data.data.reward_choose.id);
                t.$el.find('.reward_money').html(data.data.reward_choose.money);
            }
		},
        back: function(){
          window.location.href="#financial/index";
        },
		bindEvent: function() {

		},
        syncRender: function(){
			var t = this,
				data = t.model.toJSON();
            if(!(t.checkLogin(data.status == "0")) && data.data){
                if(t.ifaccess(data))return;
            }else{
                return
            }
            if(data.data && data.data.rewards){
                data.data.rewards.sort(function(a, b){
                if(a.status != b.status){
                    if(a.status=='1')return false;
                }
                if(a.expired_day != b.expired_day){
                    if(a.expired_day=='0')return true;
                    if(b.expired_day=='0')return false;
                }
                if(a.expired_time != b.expired_time){
                    if(parseInt(a.expired_time) < parseInt(b.expired_time))return false;
                }
                if(a.money != b.money){
                    if(parseInt(a.money) > parseInt(b.money))return false;
                }
                return true;
                });
                data.data.reward_choose = data.data.rewards[0];
            }
            if(Jser.getItem(data.pars.id + '_funding_reward') && data.data && data.data.rewards){
                var reward_id = Jser.getItem(data.pars.id + '_funding_reward');
                $.each(data.data.rewards, function(i, item){
                    if(reward_id == item.id)data.data.reward_choose = item;
                })
            }else if(data.data.reward_choose){
                Jser.setItem(data.pars.id + '_funding_reward', data.data.reward_choose.id);
            }
            if(data.data.reward_choose){
                t.$el.find('.reward_text').html(data.data.reward_choose.name);
                t.$el.find('.reward_money').html(data.data.reward_choose.money);
                console.log(data.data.reward_choose, t.$el.find('.reward_id').val());
                t.$el.find('.reward_id').val(data.data.reward_choose.id);
            }
        },
        present: function(){
            var t = this, data= t.model.toJSON();
            window.location.href="#financial/present/id:" + data.pars.id + '/money:' + data.pars.money;
        },
        submit: function(){
			var t = this,
				data = t.model.toJSON();
            if(t.model.isInvesting)return;
            if(!(data.data && data.data.money && data.data.dur && data.pars.id))return;
            var _data = t.$el.find("#js-tinvest-form").serializeArray();
				var name, val;
				var _locData={};
				$.each(_data, function(i, item) {
					name = item.name;
					val = $.trim(item.value);
					_data[i].value = val;
					_locData[name]=val;
				});
            if(parseInt(_locData['transfer_invest_num']) + parseInt((data.data.reward_choose?data.data.reward_choose.money:0))> Math.abs(parseInt(data.data.h_money))){
                Jser.confirm("余额不够，请充值!", function() {
                    window.location.href = '#account/recharge/';
			    }, function(){

                });
                return;
            }
            Jser.confirm('确认提交吗?',function(){
                t.$el.find('#js-tinvest-form') && t.$el.find('#js-tinvest-form').submit();
            }, function(){
                
            });
//            Jser.getJSON(ST.PATH.ACTION + '/account/tinvestmoney', {T_borrow_id: data.pars.id, transfer_invest_num: data.data.money, transfer_invest_month: data.data.dur, reward_id: data.data.reward_choose.id}, function(result) {
//                t.model.isInvesting = false;
//                if(result.status == "1"){
//                    Jser.alert("投资成功", function() {
//
//                    })
//                }
//                else{
//                     Jser.alert("投资失败", function() {
//
//                    })
//                }
//			}, function() {
//                t.model.isInvesting = false;
//                Jser.alert("投资失败", function() {
//
//                });
//			}, 'post');
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
                id: pars.id,
                money: pars.money
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})