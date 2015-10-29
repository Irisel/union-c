define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/history.html');
    var list_tpl = require('text!../../../tpl/account/history/list.html');
    var Login = require("view/login/index");
	var model = new M({
        action: '/account/history'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "sync", function() {
				t.render();
			});
		},
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            console.log(data, data.status == "0");
            t.checkLogin(data.status == "0");
            if(!data.data)data.data = [];
            $.each(data.data, function(i, item){
                var time = item.time.split(' ');
                if(time.length == 2){
                   item.ymd = time[0];
                    item.hms = time[1]
                }
            });
			var html = _.template(t.template, data);
			t.$el.show().html(html);
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
		syncRender: function() {
            console.log('syncReader');
			var t = this;
            var _data = { data: []};
            $("#js-loading").show();
            Jser.getJSON(ST.PATH.ACTION + '/account/history', {}, function(result) {
                $("#js-loading").hide();
                if(result.status == "1")
                _data = result;
                t.checkLogin(result.status == "0");
                var _html = _.template(list_tpl, _data);
			    t.$el.find(".list-charge").html(_html);
			}, function() {
                $("#js-loading").hide();
                var _html = _.template(list_tpl, _data);
			    t.$el.find(".list-charge").html(_html);
			});
            t.$el.show();
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