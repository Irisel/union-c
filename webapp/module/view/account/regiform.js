
define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/hongbao/regiform.html');
    var Login = require("view/login/index");
	var model = new M({

	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-regist-btn": "doRegist",
            "click .js-vcode-btn":"doVcode"
		},
		initialize: function() {
			var t = this;
		    t.render();
		},
        Login: function(logged, type, href){
            if(logged){
                new Login({
				    el: $('.login-panel'),
                    type: type,
                    href: href
			    });
            }
        },
        autoLogin: function(username, password){
               $("#js-loading").show();
               var t = this;
				Jser.getJSON(ST.PATH.ACTION + "/member/login", {
                    user_name: username,
                    pass: password
                }, function(data) {
                    $("#js-loading").hide();
                    if(data.status == 0)t.Login(true, '0', '#index/index');
                    if(data.status == 1){
                        window.location.href = '#index/index';
                    }
				}, function() {
                    $("#js-loading").hide();
                    t.Login(true, '0', '#index/index');
				}, "post");
        },
		checkLogin: function() {
			var t = this;
			var t1 = t.$el.find(".js-tel");
			var t2 = t.$el.find(".js-pass");
            var t3 = t.$el.find(".js-code");
            var t4 = t.$el.find(".js-agreement");
			var v1 = $.trim(t1.val());
			var v2 = $.trim(t2.val());
            var v3 = $.trim(t3.val());
            var v4 = t4.is(':checked');
            //console.log(v4);
			if (v1.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请输入手机号码");
				return false;
			} else if (v2.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请输入密码");
				return false;
			}else if (v3.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请输入手机验证码");
				return false;
			}else if (!v4){
                Jser.error(t.$el.find(".js-error"), "请同意并接受注册服务协议");
                return false;
            }else {
                Jser.error(t.$el.find(".js-error"), "");
            }
			return true;
		},
		doRegist: function() {
			var t = this;
			if (t.checkLogin()) {
				var _data = t.$el.find("#js-qrcode-form").serializeArray();
				var name, val;
				var _locData={};
				$.each(_data, function(i, item) {
					name = item.name.replace('regist-', '');
					val = $.trim(item.value);
					_data[i].value = val;
					if(val)_locData[name]=val;
				});
                if(t.invite)_locData['invite'] = t.name;
				Jser.getJSON(ST.PATH.ACTION + "/member/registor", _locData, function(result) {
                    if(result.status == 0)Jser.error(t.$el.find(".js-error"), "*" + result.info);
                    if(result.status == 1){
//                        Jser.alert(result.info, function(){
//                            t.Login(true, '0', '#index/index');
//                        })
                        t.autoLogin(_locData['tel'], _locData['pass']);
                    }
				}, function() {
                    Jser.error(t.$el.find(".js-error"), "*注册失败!");
				}, "post");

			}
		},
		doVcode: function() {
			var t = this;
			var v1 = $.trim(t.$el.find(".js-tel").val());
            //console.log(v1);
			var reg = /^(\d{1,4}\-)?(13|15|17|18){1}\d{9}$/;
			if (reg.test(v1)) {
				var _data = {
					"tel": v1
				};
				Jser.getJSON(ST.PATH.ACTION + "/member/send_code", _data, function(result) {
					Jser.alert(result.info);
				}, function() {

				}, "post");
			} else {
				Jser.error(t.$el.find(".js-error"), "请输入正确的手机号码");
			}
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            t.invite = Jser.getItem('invite');
            t.name = Jser.getItem('name');
            data['form_style'] = 'regiest-form-' + data.pars.id;
            data['name'] = t.name;
            data['invite'] = t.invite;
            //console.log(data);
            var size = windowSize();
			var html = _.template(t.template, data);
            t.$el.html(html);
            t.$el.show();
            t.$el.find('.form-topic').height(size.width * 11/15);
            var t1 = t.$el.find(".js-tel");
            var t2 = t.$el.find(".js-pass");
            var t3 = t.$el.find(".js-code");
            t1.val('');
            t2.val('');
            t3.val('');
            $("#js-loading").hide();
		},
		syncRender: function() {
            var t = this;
            t.$el.show();
		},
		bindEvent: function() {

		}
	});
	return function(pars) {
		model.set({
            pars: {
                id: (!isNaN(pars.id))?(pars.id>8?8:parseInt(pars.id)):1
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})