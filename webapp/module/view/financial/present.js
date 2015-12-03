define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/financial/present.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/invest'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-choose": "choose",
            "click .js-ensure": "ensure"
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
            }
            if(Jser.getItem(data.pars.id + '_funding_reward') && data.data && data.data.rewards){
                var reward_id = Jser.getItem(data.pars.id + '_funding_reward');
                $.each(data.data.rewards, function(i, item){
                    item.choosen = (reward_id == item.id);
                })
            }
            //console.log(data);
            t.checkLogin(data.status == "0");
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
        choose: function(e){
            var t = this, data = t.model.toJSON();
            var present_id = $(e.currentTarget).data('id');
            t.$el.find('.inner-normal.chosen').removeClass('chosen');
            $(e.currentTarget).addClass('chosen');
            Jser.setItem(data.pars.id + '_funding_reward', present_id);
       },
		syncRender: function() {
            var t = this;
            t.render();
            //console.log('syncRender');
		},
		bindEvent: function() {

		},
		back: function(){
			window.history.back();
		},
        ensure: function(){
            var t = this, data= t.model.toJSON();
            window.location.href="#financial/order/id:" + data.pars.id + '/money:' + data.pars.money;
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