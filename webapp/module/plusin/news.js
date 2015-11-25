/**
 * Created with PyCharm.
 * User: ge
 * Date: 15-11-23
 * Time: 下午12:15
 * To change this template use File | Settings | File Templates.
 */
define('plusin/news', ['$'], function(require) {
    var $ = window.jQuery || window.Zepto;
    if ($) {
        $.fn.extend({
            News:function(opt,callback){
                if(!opt) var opt={};
                var _div = this.eq(0);
                var _this= _div.find("ul:first");
                var ulH = _this.height();
                var lineH=_this.find("li:first").height(),
                    line=opt.line?parseInt(opt.line,10):parseInt(this.height()/lineH,10),
                    speed=opt.speed?parseInt(opt.speed,10):500,
                    timer=opt.timer?parseInt(opt.timer,10):3000;
                if(line==0) line=1;
                var upHeight= line*lineH;
                //滚动函数
                var animate_up = 0;
                scrollUp=function(){
                        _this.animate({
                                marginTop: animate_up-=lineH
                        },speed,function(){
//                                if(upHeight + animate_up == 0){
//                                    for(var i=1;i<=parseInt((ulH - upHeight)/lineH);i++){
                                        _this.find("li:first").appendTo(_this);
//                                    }
                                    animate_up = 0;
                                    _this.css({marginTop:0});
//                                }
                        });
                };
                setInterval("scrollUp()",timer);
                //鼠标事件绑定
//                _this.hover(function(){
//                        clearInterval(timerID);
//                },function(){
//
//                }).mouseout();
        }
        })
    }
});