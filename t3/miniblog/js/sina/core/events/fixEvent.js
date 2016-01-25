$import("sina/core/events/_events.js");
/**
 * 以firefox下的event为标杆，转换event对象 ,目前只转换了部分的属性，详细请看源码
 * @id Core.Events.fixEvent  
 * @param {Event} e  event对象
 * @return {Event} 标准的event对象
 */
Core.Events.fixEvent = function (e) {
	if(typeof e == 'undefined')e = window.event;
	if (!e.target) {
		e.target = e.srcElement;
		e.pageX = e.x;
		e.pageY = e.y;
	}
	if(typeof e.layerX == 'undefined')e.layerX = e.offsetX;
	if(typeof e.layerY == 'undefined')e.layerY = e.offsetY;
	return e;
};