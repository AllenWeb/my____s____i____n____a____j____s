/**
 * @id Core.String.toArray
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串对象转换到其他类型对象
 */
$import("sina/core/string/_string.js");

/**
 * @for Core.String.toArray
 * Convert string to array. Each of the result array element spans N chars in
 * the source string.
 * 按指定宽度切分字符串
 * @param {String} str 源字符串
 * @param {String} n 分割标准
 * @return {Array} str以n 分割的数组
 * @author xp | yanbo@staff.sina.com.cn
 * @param n how many chars the result array element spans.
 */
Core.String.toArray = function(str, n){
	n = n || 1;
	if (n == 1) {
		return str.split("");
	}
	var reg = new RegExp(".{1," + n + "}", "gim");
	return str.match(reg);
};