define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/login/index.html');
	var model = new M({

	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-login-btn": "doLogin"
		},
		initialize: function() {
			var t = this;
		    t.render();
		},
		//待优化
		render: function() {
			var t = this,
				data = {};
			var html = _.template(t.template, data);
			$('.login-panel').show().html(html);
            Jser.setItem('login-init', true);
		},
		checkLogin: function() {
			var t = this;
			var t1 = t.$el.find(".js-username");
			var t2 = t.$el.find(".js-pass");
			var v1 = $.trim(t1.val());
			var v2 = $.trim(t2.val());
			if (v1.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请输入用户名");
				return false;
			} else if (v2.length == 0) {
				Jser.error(t.$el.find(".js-error"), "*请输入密码");
				return false;
			}else{
                Jser.error(t.$el.find(".js-error"), "");
            }
			return true;
		},
		doLogin: function() {
			var t = this;
			if (t.checkLogin()) {
				var _data = t.$el.find("#js-login-form").serializeArray();
				var name, val;
				var _locData={};
				$.each(_data, function(i, item) {
					name = item.name;
					val = $.trim(item.value);
					_data[i].value = val;
					_locData[name]=val;
				});
				Jser.getJSON(ST.PATH.ACTION + "/member/login", _locData, function(data) {
                    if(data.status == 0)Jser.error(t.$el.find(".js-error"), "*用户名不存在!");
					Jser.setItem("username", _locData["username"]);
					Jser.setItem("password",_locData["pass"]);
                    t.$el.hide();
                    if(data.status == 0)window.location.reload();
				}, function() {
                    if(data.status == 0)Jser.error(t.$el.find(".js-error"), "*登录失败!");
				}, "post");

			}
		},
		bindEvent: function() {

		}
	});
	return function(pars) {
		model.set({

		});
		return new V({
			el: pars.el
		});
	}
})