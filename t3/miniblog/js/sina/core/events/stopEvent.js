$import("sina/core/events/_events.js");
$import('sina/core/events/getEvent.js');

/**
 * 停止事件冒泡
 * @id Core.Events.removeEvent  
 * @param {Event} el event对象
 */
Core.Events.stopEvent = function(el) {
	var ev = el? el: Core.Events.getEvent();
	ev.cancelBubble = true;
	ev.returnValue = false;
};
if(!$IE) {
	Core.Events.stopEvent = function(el) {
		var ev = el? el: Core.Events.getEvent();
		ev.preventDefault();
		ev.stopPropagation();
	};
}