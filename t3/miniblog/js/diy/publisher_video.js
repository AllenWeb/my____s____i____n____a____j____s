/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/core/string/decodeHTML.js");
$import("diy/addvideo.js");
$import("diy/TextareaUtils.js");

(function(proxy){
    proxy.miniblogPublisherVideo = function(spec){
        var that = {};
        that.init = function(owner){
            var upMusic = function(el){
                var _suc = function(json){
                    try {
                        if (json) {
                            owner.insertText(" " + json.data.shorturl + " ");
                        }
                    } 
                    catch (exp) {
                        //console.log(exp);
                    }
                }
                App.addvideo(spec['button'], _suc, function(){
                }, owner);
                Core.Events.stopEvent();
                return false;
            };
            Core.Events.addEvent(spec['button'], function(){
                //check user islogin
                if (!owner.checkLogin(arguments)) {
                    return;
                };
                upMusic();
            }, "click");
        };
        that.clear = function(){
        
        };
        return that;
    };
})(App);
