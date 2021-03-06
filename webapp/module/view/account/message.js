  define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/account/message.html');
    var Login = require("view/login/index");
    var list_tpl = require('text!../../../tpl/account/message/list.html');
	var model = new M({
        action:'/account/msg'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
            'click .js-doRemove': 'doRemove',
            "click .js-back": "back"
		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
			});
		},
		//待优化
		syncRender: function() {
            //console.log('syncReader');
			var t = this;
            var _data = { data: []};
            $("#js-loading").show();
            Jser.getJSON(ST.PATH.ACTION + '/account/msg', {}, function(result) {
                $("#js-loading").hide();
                if(result.status == "1")
                _data = result;
                t.checkLogin(result.status == "0");
                var _html = _.template(list_tpl, _data);
			    t.$el.find(".message-detail").html(_html);
                t.bindEvent();
			}, function() {
                $("#js-loading").hide();
			});
            t.$el.show();
		},
		render: function(syncData) {
			var t = this,
				data = syncData || t.model.toJSON();
            //console.log(data, data.status == "0");
            t.checkLogin(data.status == "0");
            if(!data.data)data.data = [];
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            t.bindEvent();
		},
		back: function(){
			window.history.back();
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
		bindEvent: function() {
			var t = this;
			var aLi = t.$el.find(".message-detail li");
			var start = {},
				isScrolling;
			var noop = function() {}; // simple no operation function
			var offloadFn = function(fn) {
				setTimeout(fn || noop, 0)
			}; //
            var timeout = undefined;
            var touchend = true;
			var events = {
				handleEvent: function(event) {

					switch (event.type) {
						case 'touchstart':
							this.start(event);
							break;
						case 'touchmove':
							this.move(event);
							break;
						case 'touchend':
							offloadFn(this.end(event));
							break;
					}
					event.stopPropagation();

				},
				start: function(event) {
					var touches = event.touches[0];

					// measure start values
					// 获取初始坐标
					start = {

						// get initial touch coords
						x: touches.pageX,
						y: touches.pageY,

						// store time to determine touch duration
						// 获取开始时间戳
						time: +new Date()

					};

					// used for testing first move event
					isScrolling = undefined;

					// reset delta and end measurements
					delta = {};

					// attach touchmove and touchend listeners
					event.currentTarget.addEventListener('touchmove', this, false);
					event.currentTarget.addEventListener('touchend', this, false);

				},
				move: function(event) {
//                    event.preventDefault();
					// ensure swiping with one touch and not pinching
					if (event.touches.length > 1 || event.scale && event.scale !== 1) {
                        return;
                    }
						// alert(options.disableScroll)
						// event.preventDefault();
					var touches = event.touches[0];

					// measure change in x and y
					delta = {
						x: touches.pageX - start.x,
						y: touches.pageY - start.y
					};
					// determine if scrolling test has run - one time test
//                    event.preventDefault();
//                    t.translate(event.currentTarget, delta.x + event.currentTarget.slidePos, 0);
                    if(window.mobileType.android() && Math.abs(delta.x) > Math.abs(delta.y)){
                        if(delta.x>0){
                            t.move(event.currentTarget, 0, 400);
                        }else if(delta.x<0){
                            t.move(event.currentTarget, -80, 400);
                        }
                        event.preventDefault();
                    }
					if (!isScrolling) {
						_x = Math.abs(delta.x);
                        isScrolling = _x > 30 && _x > Math.abs(delta.y);
					} else {
						t.translate(event.currentTarget, delta.x + event.currentTarget.slidePos, 0);
					}
					// //console.log(isScrolling);
					// if user is not trying to scroll vertically


				},
				end: function(event) {
					_x = delta.x;
					if (Math.abs(_x) > 30) {
						if (_x < 0) {
							t.move(event.currentTarget, -80, 400);
						} else {
							t.move(event.currentTarget, 0, 400);
						}
					}else{

                    }
					event.currentTarget.removeEventListener('touchmove', events, false)
					event.currentTarget.removeEventListener('touchend', events, false)

				}
			}
			aLi.each(function() {
					this.addEventListener('touchstart', events, false);
					this.slidePos = 0;
			});

		},
		move: function(elem, dist, speed) {
			this.translate(elem, dist, speed);
			elem.slidePos = dist;

		},
		translate: function(elem, dist, speed) {
			if (dist < -80) {
				dist = -80;
			} else if (dist > 0) {
				dist = 0;
			}

			var style = elem && elem.style;
			if (!style) return;

			style.webkitTransitionDuration =
				style.MozTransitionDuration =
				style.msTransitionDuration =
				style.OTransitionDuration =
				style.transitionDuration = speed + 'ms';
			// 3D加速
			style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
			style.msTransform =
				style.MozTransform =
				style.OTransform = 'translateX(' + dist + 'px)';

		},
		doRemove: function(e) {
			var t = this;
			var id = $(e.currentTarget).data('id');
            var ids = new Array();
            ids.push(id);
			Jser.confirm("确定要删除此信息么？", function() {
				Jser.getJSON(ST.PATH.ACTION + "/account/delmsg", {'idarr' :ids}, function(result) {
                    if(result.status!="1")Jser.alert('删除失败！');
                    t.syncRender();
				}, function() {
                    Jser.alert('删除失败！');
				}, "post");
			}, function(){

            });
			return false;
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
})