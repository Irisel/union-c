define(function(require, exports) {
    var B = require('backbone');
    //导航菜单视图
    var navView = B.View.extend({
        el: $("#js-navs"),
        map: {
            "index": 0,
            "crowdfunding": 1,
            "account": 2
        },
        initialize: function() {
            var t = this;
            t.navs = this.$el.find("li");
        },
        initNav: function(m) {
            var t = this;
            var idx = t.map[m];
            if(idx!=undefined){
                t.navs.each(function(i, v) {
                    $(this).toggleClass("on", i == idx);
                });
                t.$el.show();
            }  else {
                t.$el.hide();
            }
        },

        bindEvent: function() {

        }
    });

    //配置路由
    var motelRouter = B.Router.extend({
        routes: {
            '': 'index',
            'base': 'error',
            ':model(/:action)(/*condition)': 'loadmodel',
            '404': "error",
            "*error": "error"
        },
        error: function() {
            this.loadmodel('error', 'index');
            return false;
        },
        /*初始化,预留做登录用户检测*/
        initialize: function() {
            this.nav = new navView();
        },
        index: function() {
            this.loadmodel('index', 'index');
        },
        //按照module/action(/conditions) 格式
        loadmodel: function(md, ac, con) {
            var t = this;
            t.nav.initNav(md);
            if (!ac) ac = "index";
            //动态创建元素
            var el = B.$("#" + md + "_" + ac),
                cj = {
                    model: md,
                    action: ac
                };
            //参数获取转换   将参数字符串'a:123/b:456'转换为json对象{a:123, b:456}
            if (con && con.indexOf(':') > -1) {
                con.replace(/(\w+)\s*:\s*([\w-]+)/g, function(a, b, c) {
                    if (b != "model" && b != "action") b && (cj[b] = c);
                });
            }
            //动态生成容器;
            if (!el.length) B.$("<section />").attr("id", md + "_" + ac).appendTo($("#js-wrap"));
            B.$("#js-wrap").children("section").hide();
            $(".js-wrapper .pop").hide();
            //加载model目录下对应的模块

            var view = md + ac;
            if (!App.Views[view]) {
                $("#js-loading").show();
                require.async(['view', md, ac].join('/'), function(cb) {
                    if (cb) {
                        App.Views[view] = cb(cj);
                        App.Views[view].cj = $.extend({}, cj);
                    } else {
                        // location.hash="404";
                    }
                })
            }
            else {
                var result = false;
                if (md == "account") {
                    result = true;
                } else {
                    $.each(App.Views[view].cj, function(i, item) {
                        if (cj[i] != item) {
                            result = true;
                            return false;
                        }
                    });
                }
                if (result) {
                    delete cj["model"];
                    delete cj["action"];
                    App.Views[view].cj = $.extend({}, cj);
                    App.Views[view].clearSelf && App.Views[view].clearSelf();
                    App.Views[view].changePars && App.Views[view].changePars(cj);
                } else {
                    App.Views[view].$el.show();
                }
                App.Views[view].syncRender && App.Views[view].syncRender();
            }
        }
    });
    //定义全局变量App
    window.App = {
        Models: {},
        Views: {},
        Collections: {},
        initialize: function() {
            new motelRouter();
            B.history.start();
        }
    };

    exports.run = App.initialize;
});