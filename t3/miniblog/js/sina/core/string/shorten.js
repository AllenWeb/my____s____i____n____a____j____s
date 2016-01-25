/**
 * @id Core.String.shorten
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");
$import("sina/core/string/expand.js");
$import("sina/core/string/collapse.js");

/**
 * @for Core.String.shorten
 * Deal with wild character
 * 截取指定长度的字符串。unicode字符计算为2个字符
 * @param {String} str 源字符串
 * @param {Number} len 截取长度
 * @param {String} suffix 在截取完成的字符串尾部添加的字符
 * @return {String} 将str截取len长度，并在追加suffix
 * @author xp | yanbo@staff.sina.com.cn
 * Added on 07.07.11
 * @example
 		var testStr = "2008年3月20日";
 		var result = Core.String.shorten(testStr, 8, "...");
		alert(result);	//2008年3...
 */
Core.String.shorten = function(str, len, suffix){
	if(suffix != "" && Core.String.expand(str).length > len){
		suffix = suffix || "...";
	}
	else{
		suffix = "";
	}
	return Core.String.collapse(Core.String.expand(str).substr(0, len)) + suffix;
};
