$import("sina/core/events/_events.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
/**
 * 获取触发事件的元素
 * @id Core.Events.getEventTarget  
 * @method getEventTarget
 * @return {Element} 触发事件的元素
 * @author dg.liu | dongguang@staff.sina.com.cn

 */
Core.Events.getEventTarget = function (ev) {
	ev = ev || Core.Events.getEvent();
	Core.Events.fixEvent(ev);
	return ev.target;
};