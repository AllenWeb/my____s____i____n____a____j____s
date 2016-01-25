/**
 * @id Core.String.trim
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符处理
 */
$import("sina/core/string/_string.js");
$import("sina/core/string/trimHead.js");
$import("sina/core/string/trimTail.js");

/**
 * @for Core.String.trim
 * Trim function
 * 截取首尾空白，删除字符串首尾的空格
 * @param {String} str 需要删除空格的字符串
 * @return {String} 删除str首尾空格的字符串
 * @author xp | yanbo@staff.sina.com.cn
 *         chenjie | chenjie@staff.sina.com.cn
 * Added on 07.07.12
 * @example
 * 		var testStr = "     前后均是空白     ";
 * 		var result = Core.String.trim(testStr);
 * 		alert(result);	//"前后均是空白"
 */
Core.String.trim = function(str){
	return Core.String.trimHead(Core.String.trimTail(str));
};

