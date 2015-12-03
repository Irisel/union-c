define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/invite.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/friend'
	});
	var V = B.View.extend({
		model: model,
		template: H,
        text: '',
        invite: '',
		events: {
            "click .js-back": "back",
            "click .js-share": "share",
            "click .js-hide": "hide",
            "click .js-copy": "copy",
            "input #js-content": "prevent",
            "blur #js-content": "disable"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
        prevent: function(){
            var t = this;
            var obj = document.getElementById("js-content");
            $(obj).val(t.text);
            $(obj).attr("readonly",true);
            $(obj).blur();
        },
        copy: function(){
            var obj = document.getElementById("js-content");
            $(obj).attr("readonly",false);
            obj.setSelectionRange(0,obj.value.length);
            obj.focus();
        },
        disable: function(){
            var obj = document.getElementById("js-content");
            $(obj).attr("readonly",true);
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
		//待优化
		syncRender: function() {
            var t = this;
            var _data = { data: []};
            Jser.getJSON(ST.PATH.ACTION + '/account/friend', {}, function(result) {
                if(result.status == "1")
                _data = result;
                t.checkLogin(result.status == "0");
                t.render(_data);
			}, function() {

			});
		},
		setShare: function() {
			var t = this;
			// var url = ST.PATH.SHARE + "?fid=" + fid;
			var shareTitle = '联合金融';
			// alert("fid:"+fid+",name:"+Jser.getItem("fid" + fid));
			var descContent = "联合金融";
//			var url = 'http://www.lamakeji.com/mamago/index.php/weixin/productShare?fid=' + fid + '&shareUserId=' + Jser.getItem("user_id") + '&tpid=4&topic=' + shareTitle + '&ftitle=' + descContent + '&from=singlemessage&isappinstalled=1';
            var url = window.location.host + window.location.pathname + '?views=account&action=qrcode&message=' + t.invite;
			Jser.setshare({
				imgUrl: "http://ceshi.lianhejinrong.cn/Public/Wapapp/resource/images/minify/hbshare.png",
				lineLink: url,
				shareTitle: shareTitle, //"妈咪口袋" + Jser.getItem("fid" + fid),
				descContent: descContent
			});
		},
		//待优化
		render: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            //console.log(data, data.status == "0");
            t.checkLogin(data.status == "0");
            if(!data.data)data.data = {};
            t.invite = data.data.invite;
			var html = _.template(t.template, data);
			t.$el.html(html);
            t.$el.show();
            t.bindEvent();
            t.syncloading = false;
            var obj = document.getElementById("js-content");
            if(obj){
                t.text = $(obj).val();
                $(obj).height(obj.scrollHeight);
            }
		},
		back: function(){
			window.history.back();
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
            pars: {

		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});
