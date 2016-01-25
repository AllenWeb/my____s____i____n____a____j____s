/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview �字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");


/**
 * 字符串 html 解码
 * @author xs | zhenhua1@staff.sina.com.cn
 *         chenjie | chenjie@staff.sina.com.cn
 * @param {String} HTML 字符串
 * @return {String} 被html解码后的字符串或undefined
 * @example
 * 	var htmlText = "&lt;script&gt;alert(1);&lt;/script&gt;";
 * 	alert(Core.String.encodeHTML(htmlText));
 */
Core.String.decodeHTML = function(str){
	var div = document.createElement("div");
	div.innerHTML = str;
	return div.innerText== undefined?div.textContent:div.innerText;
};