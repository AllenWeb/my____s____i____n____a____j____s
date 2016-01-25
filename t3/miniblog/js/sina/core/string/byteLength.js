/**
 * @id Core.String.byteLength
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");

/**
 * 将unicode字符计算为2个
 * @param {String} str 需要进行处理的字符串
 * @return {Number} 返回长度
 * @for Core.String.byteLength
 * @example
	var nStrLength = Core.String.byteLength("中国");	//return 4
 */
 Core.String.byteLength = function(str){
	if(typeof str == "undefined"){
		return 0;
	}
	var aMatch = str.match(/[^\x00-\x80]/g);
	return (str.length + (!aMatch ? 0 : aMatch.length));
};

