/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('sina/core/events/addEvent.js');

$import('jobs/insertTextArea.js');

(function(proxy){
	proxy.insertText = function(spec){
		var that = {};
		var getPos = function(){
            if (spec['dom'].createTextRange) {
                spec['dom'].caretPos = document.selection.createRange().duplicate();
            }
        };
		Core.Events.addEvent(spec['dom'], getPos, "keyup");
        Core.Events.addEvent(spec['dom'], getPos, "focus");
        Core.Events.addEvent(spec['dom'], getPos, "click");
        Core.Events.addEvent(spec['dom'], getPos, "select");
		that.action = function(str,isFocus,allowRepeat){
			App.insertTextArea(spec['dom'], str, isFocus,allowRepeat);
			return that;
		};
		return that;
	};
})(App);
