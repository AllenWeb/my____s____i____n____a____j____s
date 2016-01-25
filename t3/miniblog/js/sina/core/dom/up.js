/**
 * @id Core.Dom.up
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Sina用于节点查找的一些方法，及对dom节点对象的扩展
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * @for Core.Dom.up
 * 向上寻找制定class的节点
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Object} element
 * @param {Object} className
 */
Core.Dom.up = function(element, className) {
	var el = $E(element);
	while(el.parentNode){
		if(el.className.indexOf(className) != -1) {
			return el;
		}
		el = el.parentNode;
	}
};