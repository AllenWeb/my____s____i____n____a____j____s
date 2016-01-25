/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 浏览器滚动条相关
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */
$import('sina/utils/browser/_browser.js');

/**
 * 获取滚动条的位置
 * @param {Object} oDocument 目标document对象，比如是当前窗口的document，还是某个iframe的窗口的document
 * @return {Array} oDocument的位置信息，数组中的元素依次是 xPosition,yPosition,width,height
 */
Utils.Browser.getScrollPos = function(oDocument) {
	oDocument = oDocument || document;
	var de = oDocument.documentElement;
	var db = oDocument.body;
	var st = de.scrollTop ? de.scrollTop : db.scrollTop;
	var sl = de.scrollLeft ? de.scrollLeft : db.scrollLeft;
	var sw = de.scrollWidth ? de.scrollWidth : db.scrollWidth;
	var sh = de.scrollHeight ? de.scrollHeight : db.scrollHeight;
	return [sl,st,sw,sh];
};
