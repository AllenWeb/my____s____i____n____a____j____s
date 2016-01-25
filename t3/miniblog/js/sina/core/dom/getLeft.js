$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * 取得static元素距左
 * @id Core.Dom.getLeft
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Element} element 节点id或引用
 * @return {String} element节点距左边距离
 * @global $getLeft
 */
Core.Dom.getLeft = function (element) {
	var left = 0;
	var el = $E(element);
	if (el.offsetParent) {
		while (el.offsetParent) {
			left += el.offsetLeft;
			el = el.offsetParent;
		}
	}
	else 
		if (el.x) {
			left += el.x;
		}
	return left;
};