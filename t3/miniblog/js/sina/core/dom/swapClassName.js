$import("sina/core/dom/_dom.js");
/**
 * @id Core.Dom.swapClassName
 * 交换两个元素的属性
 * @param {HTMLlElement} ele1
 * @param {HTMLlElement} ele2
 * @param {String} 属性名
 */
Core.Dom.swapClassName = function (ele1, ele2, type) {
	var tem = ele1[type];
	ele1[type] = ele2[type];
	ele2[type] = tem;
};