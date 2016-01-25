/**
 * @id Core.Dom.childById
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * 删除指定的元素的指定样式
 */
$import("sina/core/dom/_dom.js");
/**
 * @for Core.Dom.childById
* @description
*     get Child element with the given id
*     按照id查找单级节点
*
* @param {HTMLElement} el parent element.
* @param {String} id  
* @return {HTMLElement}
*/
Core.Dom.childById = function(el, id){
	if (el === null) {
		return null;
	}
	var cld = el.children || el.childNodes;
	for (var i = 0; i < cld.length; ++ i){
		var o = cld[i];
		if (o.nodeType == 1 && o.id == id){   //Element and id is correct
			return o;
		}
	}
};