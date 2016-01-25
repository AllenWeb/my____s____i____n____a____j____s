/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 浏览器相关的尺寸计算，如window大小，page大小
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */
$import('sina/utils/browser/_browser.js');
/**
 * 获取窗口的信息
 * @param {Object} _target? 目标窗口window对象,默认为当前窗口
 * @return {Object} {w:windowWidth,h:windowHeight} w为宽度，h为高度
 */
Utils.Browser.winSize = function(_target) {
		var w_w, w_h;
		if(_target) target = _target.document;
		else target = document;
		if (self.innerHeight) { // all except Explorer
			w_w = target.innerWidth;
			w_h = target.innerHeight;
		} else if (target.documentElement && target.documentElement.clientHeight) { // Explorer 6 Strict Mode
			w_w = target.documentElement.clientWidth;
			w_h = target.documentElement.clientHeight;
		} else if (target.body) { // other Explorers
			w_w = target.body.clientWidth;
			w_h = target.body.clientHeight;
		}
		return {w:w_w,h:w_h};
};
/**
 * 页面大小
 * @param {Object} _target 目标窗口对象
 * @return {Array} [pageWidth,pageHeight,windowWidth,windowHeight]
 */
Utils.Browser.pageSize = function(_target){
		if(_target) target = _target.document;
		else target = document;
		var _rootEl = (target.compatMode=="CSS1Compat"?target.documentElement:target.body);
		
		var xScroll, yScroll;
		if (window.innerHeight && window.scrollMaxY) {
			xScroll = _rootEl.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		}
		else if (_rootEl.scrollHeight > _rootEl.offsetHeight) {
			xScroll = _rootEl.scrollWidth;
			yScroll = _rootEl.scrollHeight;
		}
		else {
			xScroll = _rootEl.offsetWidth;
			yScroll = _rootEl.offsetHeight;
		}
		var win_s = Utils.Bsize.winSize(_target);
		if(yScroll < win_s.h){
			pageHeight = win_s.h;
		}else { 
			pageHeight = yScroll;
		}
		if(xScroll < win_s.w){
			pageWidth = win_s.w;
		}else {
			pageWidth = xScroll;
		}
		return [pageWidth,pageHeight,win_s.w,win_s.h];
};