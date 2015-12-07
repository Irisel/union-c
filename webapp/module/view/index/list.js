define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
    var list_tpl = require('text!../../../tpl/index/view/ul-list.html');
	var H = require('text!../../../tpl/index/list.html');
	var model = new M({
        action: '/financial/more'
	});
	var V = B.View.extend({
		model: model,
		template: H,
        loading: false,
		events: {
            "click .js-product": "product",
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenToOnce(t.model, "change:data", function() {
				t.render();
                t.syncRender();
                t.listenTo(t.model, "change:pars", function() {
                    $("#js-loading").show();
                    t.listenToOnce(t.model, "sync", function(){
                        t.syncRender();
                    });
                })
			});
		},
        sliderProducts: function(ele){
            var inners = $(ele).find('.index-products-list li');
            var ulw = 20;
            $.each(inners, function(key, inner){
                var w = ($(inner).width())||0;
                var pl = $(inner).css('padding-left').replace('px', '') ||0;
                var pr = $(inner).css('padding-left').replace('px', '')||0;
                var ml = $(inner).css('margin-left').replace('px', '')||0;
                var mr = $(inner).css('margin-right').replace('px', '')||0;
                ulw+= w + parseInt(pl) + parseInt(pr) + parseInt(ml) + parseInt(mr);
            });
            $(ele).find('.index-products-list').width(ulw);
            var label_width = $(ele).find('.label').width() || 0;
            $(ele).find('.product-scroll').width($(ele).width() - label_width);
        },
		ascRender: function() {
			var t = this,
				data = t.model.toJSON();
            t.loading = false;
            //console.log(t.model);
            t.$el.find('.index-products-list li.on').removeClass('on');
            t.$el.find('.index-products-list li#' + parseInt(data.pars.name_id)).addClass('on');
			var _html = _.template(list_tpl, data);
			t.$el.find(".products-list").html(_html);
            $("#js-loading").hide();
		},
        syncRender: function(cj){
            var t = this,
            data = t.model.toJSON();
            if(cj && cj.name_id!=data.pars.name_id){
                t.changePars(cj);
            }
            t.$el.show();
            t.ascRender();
        },
		back: function(){
			window.history.back();
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            t.sliderProducts('.index-products');
		},
		bindEvent: function() {

		},
        product: function(e){
            var t = this;
            if(t.loading)return;
            t.loading = true;
            t.$el.find('.index-products-list li.on').removeClass('on');
            $(e.currentTarget).addClass('on');
            t.model.set("pars", {
                name_id: $(e.currentTarget).data("name")
            });
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
                name_id: !isNaN(pars.name_id)?pars.name_id:1,
                from: pars.from,
                id: pars.id
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})