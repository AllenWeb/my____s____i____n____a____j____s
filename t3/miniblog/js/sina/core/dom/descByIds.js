/**
 * @id Core.Dom.descByIds
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Sina用于节点查找的一些方法，及对dom节点对象的扩展
 */
$import("sina/core/dom/_dom.js");
/**
 * get sub element by ids or tagnames & ids.
 * 按照给定的id列表逐层查找某节点。
 * @param {Element} el 逐层查找的最上层
 * @param {String} ids id列表 例："#id#id#id"
 * @return {Element} s查找到的元素
 * 也可以按照tagname和id跨多级超找节点
 * @for Core.Dom.descByIds
 * @example
		Core.Dom.descByIds(some_element, "#id#id#id");
		Core.Dom.descByIds(some_element, "#id#tagName>id#>id"); 
 */
Core.Dom.descByIds = function (el, ids){
	if (el === null){
		el = document;
	} 
	if (typeof el == "string") {     /* for the case there is only one argument */
		ids = el;
		el = document;
	}
	if (typeof ids == "string") {
		ids = ids.split("#");
		if (ids[0] === "") {
			ids.shift();
		}                   /* remove first empty element */
	}
	
	if (el.nodeType == 9 && ids[0].indexOf(">") == -1){ /* document as root node */
		el = el.getElementById(ids[0]);
		ids.shift();
	}
	if (el === null){
		 return null;
	}     /* cant find the first element */
	
	for (var si = 0; si < ids.length; ++ si){
		var id = ids[si];
		
		/* get children or get all descendants */
		var cld, len;
		if (id.indexOf(">") >= 0){
			var tn = id.split(">");
			cld = el.getElementsByTagName(tn[0] || "*");
			len = cld.length;
			id = tn[1];
		}
		else {
			cld = el.childNodes;
			len = cld.length;
		}
		
		/* find element with the id */
		for (var i = 0; i < len; ++ i){
			var e = cld[i];
			if (e.nodeType == 1 && e.id == id){
				el = e;
				break;
			}
		}
		if (i == len) {
			return null; /* not found */
		} 
	}
	return el;
};
