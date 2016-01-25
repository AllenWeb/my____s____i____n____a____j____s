$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * @id Core.Dom.getTop
 * 取得static元素距上
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Element} element 节点id或引用
 * @return {String} static元素上面的距离
 * @global $getTop
 */
Core.Dom.getTop = function (element) {
	var top = 0;
	var el = $E(element);
	if (el.offsetParent) {
		while (el.offsetParent) {
			top += el.offsetTop;
			el = el.offsetParent;
		}
	}
	else 
		if (el.y) {
			top += el.y;
		}
	return top;
};