/**
 * @id Core.String.toInt
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符处理
 */
$import("sina/core/string/_string.js");

/**
 * @for Core.String.toInt
 * Convert string to int
 * 字符串转整数
 * @param ｛String}str 需要转换的字符串
 * @param ｛Number} i 在 2 和 36 之间的表示 str 所保存数字的进制的值
 * @return {Number} 返回与保存在 str 中的数字值相等的整数
 * @author xp | yanbo@staff.sina.com.cn
 * @param i the scale of the number to use in convertion
 */
Core.String.toInt = function(str, i){
	return parseInt(str, i);
};
