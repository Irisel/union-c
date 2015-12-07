define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/login/findback.html');
	var model = new M({
		pars: {

		}
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-findback-btn": "doFindback",
            "click .js-backpass-btn": "doBackpass",
            "click .js-vcode-btn":"doVcode"
		},
        form: {},
		initialize: function() {
			var t = this;
//			t.listenToOnce(t.model, "change:data", function() {
				t.render();
//			});
		},
		//待优化
		render: function() {
			var t = this,
				data = {};
            t.form = {};
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            t.$el.find('.form1').show();
            t.$el.find('.form2').hide();
            $("#js-loading").hide();
		},
		back: function(){
			window.history.back();
		},
		doVcode: function() {
			var t = this;
			var v1 = $.trim(t.$el.find(".js-tel").val());
			var reg = /^(\d{1,4}\-)?(13|15|17|18){1}\d{9}$/;
			if (reg.test(v1)) {
				var _data = {
					"tel": v1
				};
				Jser.getJSON(ST.PATH.ACTION + "/member/back_code", _data, function(result) {
					Jser.alert(result.info);
				}, function() {

				}, "post");
			} else {
				Jser.error(t.$el.find(".js-error"), "请输入正确的手机号码");
			}
		},
        doFindback: function(){
            var t = this;
				var _data = t.$el.find("#js-findback-form").serializeArray();
				var name, val;
				var _locData={};
				$.each(_data, function(i, item) {
					name = item.name;
					val = $.trim(item.value);
					_data[i].value = val;
					_locData[name]=val;
				});
            function extend_findback(){
                $.extend(t.form, _locData);
                t.$el.find('.form1').hide();
                t.$el.find('.form2').show();
            }
            if(t.checkCode()){
				Jser.getJSON(ST.PATH.ACTION + "/member/do_back", {code: _locData['code']}, function(result) {
                    console.log(result.status, result.data, result.status == '!' && result.data);
                    if(result.status == '1' && result.data){
                        extend_findback()
                    }else{
                        Jser.alert(result.info, function(){
                            t.$el.find('.js-code').val('');
                        })
                    }
				}, function(result) {
                        Jser.alert(result.info, function(){
                            t.$el.find('.js-code').val('');
                        })
				}, "post");
            }
        },
		checkCode: function() {
			var t = this;
			var t1 = t.$el.find(".js-tel");
			var t2 = t.$el.find(".js-code");
			var v1 = $.trim(t1.val());
			var v2 = $.trim(t2.val());
			if (v1.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请输入手机号!");
				return false;
			} else if (v2.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请输入验证码!");
				return false;
			}else{
                Jser.error(t.$el.find(".js-error"), "");
            }
			return true;
		},
		checkPass: function() {
			var t = this;
			var t1 = t.$el.find(".js-pass1");
			var t2 = t.$el.find(".js-pass2");
			var v1 = $.trim(t1.val());
			var v2 = $.trim(t2.val());
			if (v1.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请输入密码!");
				return false;
			} else if (v2.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请确认新密码!");
				return false;
			}else if (v1 != v2){
                Jser.error(t.$el.find(".js-error"), "*两次输入的密码不一致!");
                return false
            }else if (!(t.form['tel'] && t.form['code']))
            {
                Jser.error(t.$el.find(".js-error"), "*请填写手机号码和验证码!");
                return false
            }else{
                Jser.error(t.$el.find(".js-error"), "");
            }
			return true;
		},
        doBackpass: function(){
			var t = this;
			if (t.checkPass()) {
				var _data = t.$el.find("#js-backpass-form").serializeArray();
                //console.log(_data);
				var name, val;
				var _locData={};
				$.each(_data, function(i, item) {
					name = item.name;
					val = $.trim(item.value);
					_data[i].value = val;
					_locData[name]=val;
				});
                $.extend(_locData, t.form);
				Jser.getJSON(ST.PATH.ACTION + "/member/back_pass", _locData, function(result) {
                    if(result.status == 0)Jser.error(t.$el.find(".js-error"), "*" + result.info);
                    if(result.status == 1){
                        Jser.alert(result.info, function(){
                            window.location.href="#account/index";
                        })
                    }
				}, function() {
                    Jser.error(t.$el.find(".js-error"), "*找回密码失败!");
				}, "post");

			}
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
			action: '',
            pars: {

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})