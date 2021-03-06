
define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/hongbao/invite.html');
    var Friends = require("view/account/hongbao/friends");
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/friend'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-share": "share",
            "click .js-hide": "hide"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
		syncRender: function() {
            var t = this;
            t.$el.show();
		},
        hide: function(){
            var t = this;
            t.$el.find('.pop').hide();
        },
        share: function(){
            var t = this;
            loadwxconfig(function(){
                t.setShare();
                t.$el.find('.pop').show();
            });
        },
		setShare: function() {
			var t = this;
			var shareTitle = '送你50元红包，来联合金融享受安全高收益的网络理财吧，猛戳此处领取！';
			var descContent = "恭喜发财，快来领红包啦！";
            var url = window.location.host + window.location.pathname + '?views=account&action=qrcode&invite=' + t.invite + '&name=' + t.name;
			Jser.setshare({
				imgUrl: "http://ceshi.lianhejinrong.cn/Public/Wapapp/resource/images/minify/hbshare.png",
				lineLink: url,
				shareTitle: shareTitle,
				descContent: descContent
			});
		},
		//待优化
        checkLogin: function(logged, type, href){
            if(logged){
                new Login({
				    el: $('.login-panel'),
                    type: type,
                    href: href
			    });
            }
        },
		render: function() {
			var t = this,
				data = t.model.toJSON();
            var size = windowSize();
            t.checkLogin(data.status == "0");
            if(!data.data)data.data = {};
            t.invite = data.data.invite;
            t.name = data.data.name;
			var html = _.template(t.template, data);
            //console.log(data);
            t.$el.html(html);
            t.$el.find('.invite-topic').height(size.width * 214/375);
            t.$el.show();
            new Friends({
                el: t.$el.find(".js-friends-box"),
                user_id: t.invite
            });
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