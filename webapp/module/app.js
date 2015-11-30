define(function(require, exports) {
    var B = require('backbone');
    //导航菜单视图
    var extras = {
        'error': true,
        'qrcode': true
    };
    var navView = B.View.extend({
        el: $("#js-navs"),
        map: {
            "index": 0,
            "crowdfunding": 2,
            "account": 3
        },
        action: {
            "error": true,
//            "invite": true,
            "qrcode": true,
            "friends": true
//            ,
//            "hongbao_invite": true
        },
        direct: {
            "index/list": 1
        },
        initialize: function() {
            var t = this;
            t.navs = this.$el.find("li");
        },
        initNav: function(m, a) {
            var t = this;
            var idx = t.map[m];
            idx = t.direct[m + '/' + a]?t.direct[m + '/' + a]:idx;
            if(idx!=undefined && !t.action[a] ){
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
        loadmodel: function(_md, _ac, con) {
            var invite = Jser.getUrlParam('invite');
            var name =Jser.getUrlParam('name');
            var md = _md, ac = _ac;
            if(Jser.getUrlParam('views') && Jser.getUrlParam('action') && !window.location.hash){
                md = Jser.getUrlParam('views');
                ac = Jser.getUrlParam('action');
                var path = window.location.pathname + '#' + md + '/' + ac;
                if(md == 'account' && extras[ac]){
                    path+= '/message:' + Jser.getUrlParam('message');
                    var message = Jser.getUrlParam('message');
                    con = 'message:' + message;
                    if(ac=='error' && message){
                        message = Jser.getUrlParam('data');
                        Jser.setItem('message-error', message);
                    }
                }
                if (typeof history.replaceState === 'undefined') {
                    window.location.href = window.location.host + path;
                    return;
                }else{
                    window.history.replaceState(null, null, path);
                }
            }
            if(ac=='qrcode'){
                Jser.setItem('invite', invite);
                Jser.setItem('name', name);
            }
            var t = this;
            t.nav.initNav(md, ac);
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
                        location.hash="#account/error";
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
                App.Views[view].syncRender && App.Views[view].syncRender(cj);
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