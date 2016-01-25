/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * 删除指定的元素的指定样式
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getXY.js");
/**
* <pre>
* 设定节点对象的XY值
* </pre>
* @module setXY
* @requires getStyle
* @param {HTMLElement } el 节点对象
* @param {Array} pos x,y数据
* @param {Boolean} noRetry 
* @return {Boolean} 是否设置成功
* @author FlashSoft
*/
Core.Dom.setXY = function (el, pos, noRetry) {
	var pos_style = Core.Dom.getStyle(el, "position");
	if(pos_style == "static") {
		Core.Dom.setStyle(el, "position", "relative");
		pos_style = "relative";
	}
	var page_xy = Core.Dom.getXY(el);
	if(page_xy == false) {
		return false;
	}
	var delta = [
		parseInt(Core.Dom.getStyle(el, "left"), 10),
		parseInt(Core.Dom.getStyle(el, "top"), 10)
	];
	if (isNaN(delta[0])) {
		delta[0] = (pos_style == "relative")? 0: el.offsetLeft;
	}
	if (isNaN(delta[1])) {
		delta[1] = (pos_style == "relative")? 0: el.offsetTop;
	} 
	
	if (pos[0] != null) {
		el.style.left = pos[0] - page_xy[0] + delta[0] + "px";
	}
	if (pos[1] != null) {
		el.style.top = pos[1] - page_xy[1] + delta[1] + "px";
	}
	return true;
};