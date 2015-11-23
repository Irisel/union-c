
define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/hongbao/regist.html');
	var model = new M({

	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-regist-btn": "doRegist",
            "click .js-vcode-btn":"doVcode",
            "click .js-doValidate": "validate"
		},
		initialize: function() {
			var t = this;
		    t.render();
		},
        validate: function(){
            var t = this;
			var t1 = t.$el.find(".js-tel");
            var v1 = $.trim(t1.val());
            console.log(v1, t.$el.find('.hongbao-wrapper'));
			if (v1.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请输入手机号码");
			}else{
                t.$el.find('.hongbao-wrapper').removeClass('step1').addClass('step2');
            }
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
            console.log(v4);
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
				var _data = t.$el.find("#js-regist-form").serializeArray();
				var name, val;
				var _locData={};
				$.each(_data, function(i, item) {
					name = item.name;
					val = $.trim(item.value);
					_data[i].value = val;
					if(val)_locData[name]=val;
				});
                if(t.invite)_locData['invite'] = t.invite;
				Jser.getJSON(ST.PATH.ACTION + "/member/registor", _locData, function(result) {
                    if(result.status == 0)Jser.error(t.$el.find(".js-error"), "*" + result.info);
                    if(result.status == 1){
                        Jser.alert(result.info, function(){
                            window.location.href="#account/index"
                        })
                    }
				}, function() {
                    Jser.error(t.$el.find(".js-error"), "*注册失败!");
				}, "post");

			}
		},
		doVcode: function() {
			var t = this;
			var v1 = $.trim(t.$el.find(".js-tel").val());
            console.log(v1);
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
				data = {};
            t.invite = Jser.getUrlParam('invite');
            data['invite'] = t.invite;
            var size = windowSize();
			var html = _.template(t.template, data);
            t.$el.html(html);
            t.$el.find('.regist-topic').height(size.width * 11/15);
            t.$el.find('.receive-topic').height(size.width * 91/125);
            t.$el.show();
            var t1 = t.$el.find(".js-tel");
            var t2 = t.$el.find(".js-pass");
            var t3 = t.$el.find(".js-code");
            t1.val('');
            t2.val('');
            t3.val('');
            $("#js-loading").hide();
		},
		bindEvent: function() {

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