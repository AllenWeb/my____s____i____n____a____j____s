/**
 * @id Core.Dom.byId
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * 删除指定的元素的指定样式
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * @for Core.Dom.byId
 * get element by id，等同于 $E()
 * @param {String} id 节点的id
 * @return {Element} 查找到的节点
 * @example
	// 取得 ID 为 div1 的元素节点的引用
	var oDiv = byId("div1");
 */
Core.Dom.byId = $E;