/**
 * @id Core.Array.uniq 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
$import("sina/core/array/findit.js");

/**
 * 去除数组中重复的元素
 * @for Core.Array.uniq
 * @param {Array} ar 需要去除重复元素的数组
 * @param {Array} 去除了重复元素的数组
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @example
	var testArray = [1, 3, 5, 2, 3, 4, 1];
	alert(Core.Array.uniq(testArray));
 */
Core.Array.uniq = function(ar){
	var result = [];
	for(var i = 0;i < ar.length; i ++){
		var x = ar[i];
		if(Core.Array.findit(result, x) == -1) {
			result.push(x);
		}
	}
	return result;
};