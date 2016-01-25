/**
 * @id Core.String.expand
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");

/**
 * Deal with wild character
 * 扩展unicode字符转。将unicode字符计算为2个字符
 * @param {String} str 被处理的字符串
 * @return {String} 被转换后的字符串
 * @for Core.String.expand
 * @author xp | yanbo@staff.sina.com.cn
 * Added on 07.07.11
 * @example
 		var testStr = "年月";
 		alert(testStr.length);		//2
		var testStr = Core.String.expand(testStr);
 		alert(testStr.length);		//4
 */
Core.String.expand = function(str){
	var r= str.replace(/([\u00ff-\ufffe])/gi,"\uffff$1");
	return r;
};