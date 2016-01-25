/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import("sina/core/string/decodeHTML.js");
$import("diy/addmusic.js");
$import("diy/TextareaUtils.js");

(function(proxy){
	proxy.miniblogPublisherMusic = function(spec){
		var that = {}; 
		that.init = function(owner){
			var upMusic = function(el){
	            var _suc = function(json){
	                if (json) {
						owner.insertText( "  " + (Core.String.trim(json.singer).length>0? json.singer + "-" :"")  + json.name + "-" + json.shorturl + "  ");
					}
	            }
	            App.addmusic(spec['button'], _suc, function(){},owner);
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
