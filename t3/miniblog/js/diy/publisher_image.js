/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('sina/core/dom/getXY.js');
$import('sina/core/string/trim.js');
$import("diy/TextareaUtils.js");
$import("diy/PopUpUpload.js");

(function(proxy){
    /**
     * wrote by yonglin
     * @param {Object} elements
     'button'	: $E('publisher_image')
     'form'		: $E('publisher_image_form')
     'perch'		: $E('publisher_perch')
     'file'		: $E('publisher_file')
     'fname'		: $E('publisher_perch_name')
     'del'		: $E('publisher_perch_delete')
     'loading'	: $E('publisher_image_loading')
     'preImage'	: $E('publisher_preimage')
     'preBox'	: $E('publisher_imgpreview')
     * @param {Object} config
     */
    proxy.miniblogPublisherImage = function(elements, config){
        //获取css样式
        var _getStylesheetValue = function(obj, attribute){
            return obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj, false)[attribute];
        }
        var that = {};
        var owner = {};
        
        var flush = function(pid){
            owner.set('pic', (pid && [pid]) || []);
            if (pid && !Core.String.trim(owner.getDom('editor').value)) {
                owner.getDom('editor').value = $CLTMSG['CX0117'];
            }
            if (!pid && Core.String.trim(owner.getDom('editor').value) == $CLTMSG['CX0117']) {
                owner.getDom('editor').value = "";
            }
            owner.limit();
        };
        
        var enabled = function(b){
            owner.enabled(b)
            if (b) {
                owner.limit()
            }
        }
        
        that.clear = function(){
            try {
                flush();
            } 
            catch (e) {
                if (scope.$uid == "1505834385") {
                    console.log(e)
                }
            }
        };
        
        that.init = function(args){
            owner = args;
        };
        elements["button"].onclick = function(){
            return false
        };
        Core.Events.addEvent(elements["button"], function(){
            //check user islogin
            if (!owner.checkLogin(arguments)) {
                return;
            };
            var u = App.popUpUpload(elements["button"], -32, 5, flush, enabled);
			that.clear = u.clear;
            return false;
        });
        
        
        return that;
    };
})(App);
