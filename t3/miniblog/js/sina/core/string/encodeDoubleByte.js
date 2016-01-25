/**
 * @id Core.String.encodeDoubleByte
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");

/**
 * 对字符进行 encodeURI 编码，用于数据接口交互中的数据编码
 * @for Core.String.encodeDoubleByte
 * @author liming1 | liming1@staff.sina.com.cn
 * @param {String} str 字符串
 * @retrun {String} encodeURIComponent转换的字符串
 * @example
	var htmlText = "中文编码|English";
	alert(Core.String.encodeDoubleByte(htmlText));
 */
Core.String.encodeDoubleByte = function (str) {
	if(typeof str != "string") {
		return str;
	}
	return encodeURIComponent(str);
};
