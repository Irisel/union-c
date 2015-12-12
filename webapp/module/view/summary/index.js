define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/summary/index.html');
	var model = new M({
        action: '/about/article'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
			});
		},
		//待优化
        clearSelf: function(){
            var t = this;
            t.$el.find('.js-summary').empty();
            t.$el.find('.header').empty();
        },
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, {});
			t.$el.html(html);
            if(data.pars.type_name){
                t.$el.find('.js-summary').html(data.data?data.data.type_content:'');
                var title = t.$el.find('.js-summary h3');
                if(title)t.$el.find('.header').append(title.html());
                t.$el.find('.js-summary h3').remove();
            }else if(data.pars.id && data.data && data.data.length){
                t.$el.find('.js-summary').html(data.data[0].art_content);
                t.$el.find('.header').append(data.data[0].title);
            }
            t.$el.show();
		},
		back: function(){
			window.history.back();
		},
		bindEvent: function() {

		},
		changePars: function(pars) {
			var t = this;
            var data = {};
            if(pars.id){
                t.model.set("action", '/about/mc');
                data = {
                    id: pars.id
                }
            }else{
                t.model.set("action", '/about/article');
                data = {
                    type_name: pars.type_name
                }
            }
			t.model.set("pars", data);
		}
	});
	return function(pars) {
        var Pars = {
            action: '/about/article',
            pars: {
                type_name: pars.type_name
		    }
		};
        if(pars.id){
            Pars.action = '/about/mc';
            Pars.pars = {
                id: pars.id
            }
        }
		model.set(Pars);
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})