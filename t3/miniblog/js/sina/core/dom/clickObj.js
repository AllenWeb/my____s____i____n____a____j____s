/**
 * @id Core.Dom.clickObj
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * 删除指定的元素的指定样式
 */
$import("sina/core/dom/_dom.js");
/**
 * @for Core.Dom.clickObj
 * <pre>
 * 执行对象的Click事件
 * </pre>
 * @module clickObj
 * @param {HTMLElement | Document} o 节点对象
 * @return {Void}
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
Core.Dom.clickObj = function (o) {
	o.fireEvent("onclick");
};
if(!$IE) {
	Core.Dom.clickObj = function (o) {
		var e = document.createEvent("MouseEvent");
		e.initEvent("click", false, false);
		o.dispatchEvent(e);
	};
}