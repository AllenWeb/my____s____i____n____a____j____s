$import("sina/core/events/_events.js");
$import("sina/core/base/detect.js");
/**
 * 获取Event对象
 * @id Core.Events.getEvent  
 * @method getEvent
 * @return {Event} event对象
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @update 08.02.23
 * @global $getEvent
 * @exception
 * 			Core.events.getEvent();
 * 			$getEvent();
 */
Core.Events.getEvent = function () {
	return window.event;
};
if(!Core.Base.detect.$IE) {
	Core.Events.getEvent = function () {
		// 这里是为了处理高级版本的Opera里直接支持event的处理
		// FlashSoft 
		if(window.event)return window.event;
		var o = arguments.callee.caller;
		var e;
		var n = 0;
		while(o != null && n < 40){
			e = o.arguments[0];
			if (e && (e.constructor == Event || e.constructor == MouseEvent)) {
				return e;
			}
			n ++;
			o = o.caller;
		}
		return e;
	};
}