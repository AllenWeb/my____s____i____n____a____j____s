$import("sina/core/events/_events.js");
/**
 * 在指定节点上绑定相应的事件
 * @id Core.Events.addEvent  
 * @method addEvent
 * @param {String} elm 需要绑定的节点id
 * @param {Function} func 事件发生时相应的函数
 * @param {String} evType 事件的类型如:click, mouseover
 * @global $addEvent
 * @update 08.02.23
 * @author Stan | chaoliang@staff.sina.com.cn
 *         FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * 		//鼠标点击testEle则alert "clicked"
 * 		addEvent("testEle", function () {
 * 			alert("clicked");
 * 		},'click');
 */
Core.Events.addEvent = function(elm, func, evType, useCapture) {
	var _el = $E(elm);
	if(_el == null){
		$Debug("addEvent 找不到对象：" + elm);return;
	}
	if (typeof useCapture == 'undefined') {
		useCapture = false;
	}
	if (typeof evType == 'undefined') {
		evType = 'click';
	}
	if (_el.addEventListener) {
		_el.addEventListener(evType, func, useCapture);
		return true;
	}
	else if (_el.attachEvent) {
		var r = _el.attachEvent('on' + evType, func);
		return true;
	}
	else {
		_el['on' + evType] = func;
	}
};