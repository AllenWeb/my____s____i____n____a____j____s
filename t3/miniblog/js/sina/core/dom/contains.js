/**
 * @id Core.Dom.contains
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * 删除指定的元素的指定样式
 */
$import("sina/core/dom/_dom.js");
/**
 * @for Core.Dom.contains
 * @param {HTMLElement | Document} oParentNode 父节点
 * @param {HTMLElement} oNode 需要判断的子节点
 * @return {Boolean} 是否是父节点的子节点
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
Core.Dom.contains = function (oParentNode, oNode) {
	return oParentNode.contains(oNode);
};
if(!$IE) {
	Core.Dom.contains = function (oParentNode, oNode) {
		do {
			if (oParentNode == oNode) return true;
		}
		while (oNode = oNode.parentNode);
		return false;
	};
}