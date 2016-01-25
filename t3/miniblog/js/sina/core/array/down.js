/**
 * @id Core.Array.down  
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
/**
 * 将数组指定的元素下移n次
 * @for Core.Array.down  
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Number} index 需要移动的序号
 * @param {Number} num 	移动的次数
 * @return 指定元素移动后的数组
 * @example 
 * 		var testArray = [1, 2, 3, 4, 5];
 * 		testArray =Core.Array.down( testArray,1,2);
 * 		alert(testArray)	//[1,3,4,2,5]
 */
Core.Array.down = function (arr,index, num) {
  num = num > arr.length - index ? arr.length - index  : num;
  return arr.slice(0, index).concat(arr.slice(index + 1, index + num + 1), arr[index], arr.slice(index + num + 1));
};