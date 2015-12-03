define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/verifi/index.html');
	var model = new M({
        action: '/account/idcard'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back",
            "click .js-submit": "submit"
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
		checkError: function(_locData) {
			if (!(_locData['real_name'] && _locData['real_name'].length!=0)) {
				Jser.alert('请输入姓名！', function(){

                });
				return true;
			} else if (!(_locData['idcard'] && _locData['idcard'].length==18 && !isNaN(_locData['idcard']))) {
				Jser.alert('请输入18位身份证号码！', function(){

                });
				return true;
			}
			return false;
		},
		render: function() {
			var t = this,
				data = t.model.toJSON();
            if(!data.data)data.data = {};
            //console.log(data);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
		},
        submit: function(){
            var t = this,data = t.model.toJSON();
		    var _data = t.$el.find("#verifiIdcard").serializeArray();
			var name, val;
			var _locData={};
			$.each(_data, function(i, item) {
				name = item.name;
				val = $.trim(item.value);
				_data[i].value = val;
				_locData[name]=val;
			});
            if(t.checkError(_locData))return;
            //console.log(_locData);
            Jser.getJSON(ST.PATH.ACTION + '/account/saveid', _locData, function(result) {
                if(data.pars.next == 'bank'){
                    window.location.href="#verifi/bank";
                }else{
                    window.location.href="#verifi/access";
                }
			}, function() {

			}, 'post');
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
            pars:{
                next: pars.next
            }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})