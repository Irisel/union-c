define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');

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
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            if(data.data && data.data.rewards){
                data.data.rewards.sort(function(a, b){
                    if(a.status != b.status){
                        if(a.status=='1')return false;
                    }
                    if(a.expired_day != b.expired_day){
                        if(parseInt(a.expired_day) > parseInt(b.expired_day))return false;
                    }
                    if(a.money != b.money){
                        if(parseInt(a.money) > parseInt(b.money))return false;
                    }
                    if(a.add_time != b.add_time){
                        if(parseInt(b.add_time) > parseInt(a.add_time))return false;
                    }
                    if(a.id != b.id){
                        if(parseInt(b.id) > parseInt(a.id))return false;
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
            }else if(data.data.reward_choose){
                Jser.setItem(data.pars.id + '_funding_reward', data.data.reward_choose.id);
            }
            console.log(data);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
        back: function(){
          window.location.href="#financial/index";
        },
		bindEvent: function() {

		},
        syncRender: function(){
			var t = this,
				data = t.model.toJSON();
            if(data.data && data.data.rewards){
                data.data.rewards.sort(function(a, b){
                    if(a.status != b.status){
                        if(a.status=='1')return false;
                    }
                    if(a.expired_day != b.expired_day){
                        if(parseInt(a.expired_day) > parseInt(b.expired_day))return false;
                    }
                    if(a.money != b.money){
                        if(parseInt(a.money) > parseInt(b.money))return false;
                    }
                    if(a.add_time != b.add_time){
                        if(parseInt(b.add_time) > parseInt(a.add_time))return false;
                    }
                    if(a.id != b.id){
                        if(parseInt(b.id) > parseInt(a.id))return false;
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
            t.$el.find('.reward_text').html(data.data.reward_choose.order);
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
            console.log(ST.PATH.ACTION + '/account/tinvestmoney', {T_borrow_id: data.pars.id, transfer_invest_num: data.data.money, transfer_invest_month: data.data.dur});
            Jser.getJSON(ST.PATH.ACTION + '/account/tinvestmoney', {T_borrow_id: data.pars.id, transfer_invest_num: data.data.money, transfer_invest_month: data.data.dur}, function(result) {
                t.model.isInvesting = false;
                if(result.status == "1"){
                    Jser.alert("投资成功", function() {

                    })
                }
                else{
                     Jser.alert("投资失败", function() {

                    })
                }
			}, function() {
                t.model.isInvesting = false;
                Jser.alert("投资失败", function() {

                });
			}, 'post');
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