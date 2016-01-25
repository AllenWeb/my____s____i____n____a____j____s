$import("sina/core/events/_events.js");
$import("sina/sina.js");
/**
 * 在指定节点上移除绑定的事件
 * @id Core.Events.removeEvent  
 * @method removeEvent2
 * @param {HTMLElement} elm 需要解除绑定的节点id
 * @param {Function} func 事件发生时相应的函数
 * @param {String} evType 事件的类型如:click, mouseover
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @global $removeEvent2
 * @update 08.02.23
 * @exception
 * 			function go() {};
 * 			Sina.events.removeEvent2(document.body, go, "click");
 * 			$removeEvent2(document.body, go, "click");
 */
Core.Events.removeEvent = function (oElement, fHandler, sName) {
	var _el = $E(oElement);
	if(_el == null){
		$Debug("removeEvent 找不到对象：" + oElement);return;
	}
	if (typeof fHandler != "function") {
		return;
	}
	if (typeof sName == 'undefined') {
		sName = 'click';
	}
	if (_el.addEventListener) {
		_el.removeEventListener(sName, fHandler, false);
	}
	else if (_el.attachEvent) {
		_el.detachEvent("on" + sName, fHandler);
	}
	fHandler[sName] = null;
};