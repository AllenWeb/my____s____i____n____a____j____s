/**
 * @id Core.Dom.getChildrenByClass 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 */
$import("sina/core/dom/_dom.js");
/**
 * @for Core.Dom.getChildrenByClass 
 * @param {Element} el 查找的顶层节点
 * @param {String} clz  className
 * @return {Element} el节点中className为clz的节点
 * 按照classname查找节点，仅向下查找1级深度，即childNode级别
 */
Core.Dom.getChildrenByClass = function(el, clz){
	var rs = [];
	var cldr = el.childNodes || el.children;
	var clz = ' ' + clz + ' ';
	var len = cldr.length;
	for (var i = 0; i < len; ++ i){
		var o = cldr[i];
		var ecl = " " + o.className + " ";
		if (ecl.indexOf(clz) != -1){
			rs[rs.length] = o;
		}
	}
	return rs;
};