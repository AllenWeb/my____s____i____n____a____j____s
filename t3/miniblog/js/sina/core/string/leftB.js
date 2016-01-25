/**
 * @id Core.String.leftB
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");
$import("sina/core/string/byteLength.js");
/**
 * @for Core.String.leftB
 * 返回指定长度的字符[中文算2]
 * @param {String} str 源字符串
 * @param {Number} len 截取长度
 * @return {String} 从str中截取len长度的字符串
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
Core.String.leftB = function(str, len){
	var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
	str = str.slice(0, s.slice(0, len).replace(/\*\*/g, " ").replace(/\*/g, "").length);
	if(Core.String.byteLength(str) > len) str = str.slice(0,str.length -1);
	return str;
};
