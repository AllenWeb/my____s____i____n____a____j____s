/**
 * @id Core.String.encodeHTML
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");

/**
 * 字符串 html 编码
 * @for Core.String.encodeHTML
 * @param {String} str 需要html编码的字符串
 * @return {String} 返回对str进行html编码后的字符串
 * @author xs | zhenhua1@staff.sina.com.cn
 *         chenjie | chenjie@staff.sina.com.cn
 * @example
 * 	var htmlText = "<script>alert(1);</script>";
 * 	alert(Core.String.encodeHTML(htmlText));
 */
Core.String.encodeHTML = function(str){
	var div = document.createElement("div");
	div.appendChild(document.createTextNode(str));
	return div.innerHTML.replace(/\s/g, "&nbsp;");
};
