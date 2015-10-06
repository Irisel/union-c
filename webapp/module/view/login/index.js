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
            t.$el.show().html(html);
            var t1 = t.$el.find(".js-username");
            var t2 = t.$el.find(".js-pass");
            if(Jser.getItem("username") && Jser.getItem("password"))
            {
                t1.val(Jser.getItem("username"));
                t2.val(Jser.getItem("password"));
            }
            Jser.popstate(true);
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
			var t = this, model = t.model.toJSON();
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
					Jser.setItem("username", _locData["user_name"]);
					Jser.setItem("password",_locData["pass"]);
                    if(data.status == 1){
                        t.$el.hide();
                        switch(model.redirects.type){
                            case '0':
                                window.location.href = model.redirects.href;
                                break;
                            default:
                                window.location.reload();
                                break;
                        }
                    }
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
            redirects: {
                type: pars.type,
                href: pars.href
		    }
		});
		return new V({
			el: pars.el
		});
	}
})