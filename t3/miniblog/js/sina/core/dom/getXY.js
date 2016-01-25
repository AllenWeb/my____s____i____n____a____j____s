$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/system/getScrollPos.js");
/**
* 获取节点对象的距文档的XY值
* @id Core.Dom.getXY
* @method getXY
* @param {HTMLElement } el 节点对象
* @return {Array} x,y的数组对象
* @author FlashSoft | fangchao@staff.sina.com.cn
* @update 08.02.23
* @global $getXY
* @exception
* 			Core.Dom.getXY($E("input"));
* 			$getXY($E("input"));
*/
Core.Dom.getXY = function (el) {
	if ((el.parentNode == null || el.offsetParent == null || Core.Dom.getStyle(el, "display") == "none") && el != document.body) {
		return false;
	}
	var parentNode = null;
	var pos = [];
	var box;
	var doc = el.ownerDocument;
	// IE
	box = el.getBoundingClientRect();
	var scrollPos = Core.System.getScrollPos(el.ownerDocument);
	return [box.left + scrollPos[1], box.top + scrollPos[0]];
	// IE end
	parentNode = el.parentNode;
	while (parentNode.tagName && !/^body|html$/i.test(parentNode.tagName)) {
		if (Core.Dom.getStyle(parentNode, "display").search(/^inline|table-row.*$/i)) { 
			pos[0] -= parentNode.scrollLeft;
			pos[1] -= parentNode.scrollTop;
		}
		parentNode = parentNode.parentNode; 
	}
	return pos;
};
if(!$IE) {
	Core.Dom.getXY = function (el) {
		if ((el.parentNode == null || el.offsetParent == null || Core.Dom.getStyle(el, "display") == "none") && el != document.body) {
			return false;
		}
		var parentNode = null;
		var pos = [];
		var box;
		var doc = el.ownerDocument;
		
		// FF
		pos = [el.offsetLeft, el.offsetTop];
		parentNode = el.offsetParent;
		var hasAbs = Core.Dom.getStyle(el, "position") == "absolute";
		
		if (parentNode != el) {
			while (parentNode) {
					pos[0] += parentNode.offsetLeft;
					pos[1] += parentNode.offsetTop;
					if (scope.$SAFARI && !hasAbs && Core.Dom.getStyle(parentNode,"position") == "absolute" ) {
							hasAbs = true;
					}
					parentNode = parentNode.offsetParent;
			}
		}
		
		if (scope.$SAFARI && hasAbs) {
			pos[0] -= el.ownerDocument.body.offsetLeft;
			pos[1] -= el.ownerDocument.body.offsetTop;
		}
		parentNode = el.parentNode;
		// FF End
		while (parentNode.tagName && !/^body|html$/i.test(parentNode.tagName)) {
			if (Core.Dom.getStyle(parentNode, "display").search(/^inline|table-row.*$/i)) { 
				pos[0] -= parentNode.scrollLeft;
				pos[1] -= parentNode.scrollTop;
			}
			parentNode = parentNode.parentNode; 
		}
		return pos;
	};
}