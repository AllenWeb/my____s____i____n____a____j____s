/**
 * @id Core.Array.copy  
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
/**
 * copy某数组
 * @for Core.Array.copy  
 * @param {Array} 被copy的数组 	
 * @return {Array} 复出的数组
 * @author stan | chaoliang@staff.sina.com.cn
 * @example 
 		var testArray0 = [1,2,3,4,5];
 		var testArray1 = [1,2,3,4,5];
		testArray2 = testArray0;
		testArray3 = testArray1.copy();
		testArray2.push(6);
		testArray3.push(6);
		$Debug(testArray0);	//[1,2,3,4,5,6]
		$Debug(testArray1);	//[1,2,3,4,5]
 */
Core.Array.copy = function(arr) {
	return arr.slice(0);
};
