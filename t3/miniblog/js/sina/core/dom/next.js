$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * 向下寻找指定className的节点
 * @id Core.Dom.next
 * @param {Element} elm 元素id或引用
 * @param {String} className 样式名
 * @return {Element} 指定className的节点
 */
Core.Dom.next = function(elm, _className) {
	var o = $E(elm);
	var next = o.nextSibling;
	if(!next)
		return null;
	else if(next.nodeType != 1){
		return Core.Dom.next(next, _className);
	}else if(next.nodeType == 8){
		next.parentNode.removeChild(next);
		return Core.Dom.next(o,_className);
	}
	if(next.className.indexOf(_className) != -1) {
		return next;
	}else{
		return Core.Dom.next(next, _className);
	}
};



