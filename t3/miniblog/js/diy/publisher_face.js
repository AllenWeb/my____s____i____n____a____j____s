/**
 * @author yuwei@staff.sina.com.cn
 */
$import("diy/PopUpFace.js");

(function(proxy){
    proxy.miniblogPublisherFace = function(spec){
        var that = {};
        that.init = function(owner){
            var flush = function(){
                owner.limit();
            };
            spec['button'].href = "####";
            spec['button'].onclick = function(){
                return false
            };
            
            var target;
            Core.Events.addEvent(spec['button'], function(e){
                target = target || e.srcElement || e.target;
				//check user islogin
                if (!owner.checkLogin(arguments)) {
                    return;
                };
                
                App.showFaces(spec['button'], owner.getDom('editor'), -32, 5, '360px', flush, function(face){
                    owner.insertText(face);
                    return true;
                });
                return false;
            }, 'click');
        };
        that.clear = function(){
        
        };
        return that;
    };
})(App);
