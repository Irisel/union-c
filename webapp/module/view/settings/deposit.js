define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/settings/deposit.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/shouquan'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-toggle": "deposit"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
        redirect: function(deposit){
            console.log(deposit);
            var t = this;
            var form = t.$el.find('#js-' + deposit + '-form');
            form && form.submit();
        },
        ifaccess: function(data){
            if(data.data.id_status!="1"){
                Jser.alert("请先实名认证!", function() {
                    window.location.href="#verifi/index";
                });
                return true;
            }
            return false;
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
        deposit: function(e){
            var t = this;
            var deposit_type = $(e.currentTarget).data('type');
            var deposit = t.$el.find('.js-'+ deposit_type);
            if(deposit.hasClass('on')){
                deposit.removeClass('on');
            }else{
                deposit.addClass('on');
            }
            t.redirect(deposit_type)
        },
		//待优化
		syncRender: function() {
            var t = this;
            var _data = { data: []};
            Jser.getJSON(ST.PATH.ACTION + '/account/shouquan', {}, function(result) {
                if(result.status == "1")
                _data = result;
                if(!(t.checkLogin(_data.status == "0")) && _data.data){
                    if(t.ifaccess(_data))return;
                }else{
                    return
                }
                t.render(_data);
			}, function() {

			});
		},
		//待优化
		render: function(rawdata) {
			var t = this,
				data = rawdata || t.model.toJSON();
            console.log(data);
            if(!(t.checkLogin(data.status == "0")) && data.data){
                t.ifaccess(data);
            }else{

            }
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
		bindEvent: function() {

		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.model.set("pars", data);
		},
		back: function(){
			window.history.back();
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