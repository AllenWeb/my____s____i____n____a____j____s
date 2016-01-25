/**
 * @id Core.Array.up 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
/**
 * 将数组指定的元素上移n次
 * @for Core.Array.up 
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Array} arr 需要处理的数组
 * @param {Number} index 需要移动的序号
 * @param {Number} num 	移动的次数
 * @example 
 		var testArray = [1, 2, 3, 4, 5];
 		testArray = Core.Array.up(testArray, 3, 2);
 		alert(testArray)	//[1, 4, 2, 3, 5]
 */
Core.Array.up = function (arr,index, num) {
  num = num > index ? index : num;
  return arr.slice(0, index - num).concat(arr[index], arr.slice(index - num, index), arr.slice(index + 1));
};
