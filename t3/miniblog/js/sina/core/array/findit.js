/**
 * @id Core.Array.findit 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
$import("sina/core/array/foreach.js");

/**
 * 在指定数组中查找指定元素并返回该元素所在位置
 * @for Core.Array.findit 
 * param {Array} arr 被查找的数组
 * param {Number|String|Object|Array} v 被查找的数组元素
 * return 返回元素在数组中的位置，如果数组中不存在该元素则返回-1
 */
Core.Array.findit = function (arr,v) {
	var k = -1;
	Core.Array.foreach(arr, function(value, index){
		if (v == value) {
			k = index;
		}
	});
	return k;
};