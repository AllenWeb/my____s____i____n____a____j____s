/**
 * @id Core.String.collapse
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");

/**
 * @for Core.String.collapse
 * Deal with wild character
 * 还原扩展的字符串String.prototype.expand的逆操作
 * @param {String} str 需要进行处理的字符串
 * @return {String} 返回操作后的字符串
 * @author xp | yanbo@staff.sina.com.cn
 * Added on 07.07.11
 */
Core.String.collapse = function(str){
	return str.replace(/\uffff/gi, "");
};