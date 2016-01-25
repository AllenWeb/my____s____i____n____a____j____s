/**
 * @id Core.String.a2u
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");
$import("sina/core/string/toInt.js");

/**
 * @for Core.String.a2u
 * 将\uffff形式的字符串转换成unicode
 * @author xp | yanbo@staff.sina.com.cn
 * @param ｛String} str 需要进行转换字符串
 * @return ｛String} 转换后的字符串
 * Ascii to unicode
 * @example
 		var testStr = "\u5E74\u6708";
		var result = Core.String.a2u(testStr);
		alert(result)	//年月
 */
Core.String.a2u = function(str){
	return str.replace(/\\u[\da-fA-F]{4}/gi, function (a){
		a = Core.String.toInt(a.substr(2), 16);
		return String.fromCharCode(a);
	});
};