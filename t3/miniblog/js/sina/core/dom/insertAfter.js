$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * 插入节点后面,遵循dom操作的标准，在结束时返回当前的操作对象
 * @id Core.Dom.insertAfter
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Element} newElement 需要插入的元素
 * @param {Element} targetElement 目标元素
 * @return {Element} newElement
 * @global $insertAfter
 */
Core.Dom.insertAfter = function (newElement, targetElement) {
	var parent = targetElement.parentNode;
	if(parent.lastChild == targetElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
	return newElement;
};