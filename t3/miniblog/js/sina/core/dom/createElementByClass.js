/**
 * @id Core.Dom.createElementByClass
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * 删除指定的元素的指定样式
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * @for Core.Dom.createElementByClass
 * 按照指定 ClassName 创建节点
 * @param {String} type 要创建的tagName
 * @param {String} className	对象的样式名
 * @return {Element} 返回所创建的节点
 */
Core.Dom.createElementByClass = function(type, className){
	var ele = $C(type);
	ele.className = className;
	return ele;
};