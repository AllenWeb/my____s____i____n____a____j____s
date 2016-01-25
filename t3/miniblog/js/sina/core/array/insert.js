/**
 * @id Core.Array.insert 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");

/**
 * 在数组指定位置插入元素
 * @for Core.Array.insert 
 * @param {Number} arr 被操作的数组
 * @param {Number} index 需要插入元素的下标
 * @param {Object} value 被插入元素
 * @return {Array} 插入新元素后的数组
 * @author stan | chaoliang@staff.sina.com.cn
 * @example 
 		var testArray = [1,2,3,4,5];
 		var result = Core.Array.insert(testArray, 2, 7);
 		$Debug(result)	//[1,2,7,3,4,5];
 */
Core.Array.insert = function(arr, index, value) {
	return arr.slice(0, index).concat(value, arr.slice(index));
};