define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/financial/index.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/financial/index'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-invest": "invest"
		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
			});
		},
		syncRender: function() {
            var t = this;
            var _data = t.model.toJSON();
            Jser.getJSON(ST.PATH.ACTION + '/financial/index', {id: _data.pars.id, from: _data.pars.from}, function(result) {
                if(result.status == "1")
                _data = result;
                t.render(_data);
			}, function() {

			});
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
		render: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            var size = windowSize();
            if(!data.data)data.data = {};
            if(!data.data.have_money){
                data.data.have_money = '0';
            }else{
                data.data.have_money = data.data.have_money.substring(1);
            }
            console.log(data);
			var html = _.template(t.template, data);
			t.$el.html(html);
            if(data.data && !isNaN((parseInt(data.data.b_m))) && !isNaN((parseInt(data.data.money_dec)))){
                var b_m = parseInt(data.data.b_m);
                var money_dec = parseInt(data.data.money_dec);
                console.log(b_m, money_dec, (b_m - money_dec) * 100 / b_m);
                t.$el.find('.list-progress .progress').css('width', ((b_m - money_dec) * 100 / b_m) + '%');
            }
            t.$el.find('.list-topic').height(size.width * 199/320);
            t.$el.find('.topic-benefit').css('bottom', (size.width * 199/550) + 'px' );
            t.$el.find('.topic-period').css('bottom', (size.width * 199/3520) + 'px' );
            t.$el.show();
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
        invest: function(){
            console.log('invest');
            var t = this, data = t.model.toJSON();
            if(!(t.checkLogin(data.status == "2")) && data.data){
                if(t.ifaccess(data))return;
            }else{
                return
            }
            var id = data.pars.id;
            var money = t.$el.find(".js-investamount").val();
            var re = /^\d+$/ ;
            console.log(money);
            if(isNaN(money)){
			    Jser.alert("请输入正确的金额！", function() {
                    t.$el.find(".js-investamount").val('');
			    });
                return;
            }else if (!re.test(money)){
			    Jser.alert("请输入正确的金额！", function() {
                    t.$el.find(".js-investamount").val('');
			    });
                console.log('re');
                return
            }else if(parseInt(money)<100){
			    Jser.alert("请输入正确的金额！", function() {
                    t.$el.find(".js-investamount").val('');
			    });
                return;
            }else if(parseInt(money)>parseInt(data.data.have_money)){
			    Jser.confirm("余额不够，请充值!", function() {
                    window.location.href = '#account/recharge/';
			    }, function(){

                });
                return;
            }
            window.location.href="#financial/order/id:" + id + "/money:" + money;
        },
        back: function(){
          var t = this,data = t.model.toJSON();
          if(data.pars.from == 'index'){
              window.location.href="#index/index"
          }else{
              window.location.href="#index/list";
          }
        },
		bindEvent: function() {

		},
		changePars: function(pars) {
			var t = this;
			t.model.set("pars", pars);
		}
	});
	return function(pars) {
		model.set({
            pars: {
                id: pars.id,
                from: pars.from
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})
