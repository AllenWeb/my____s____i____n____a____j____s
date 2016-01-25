/**
 * @id Core.Array.foreach 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
/**
 * 用指定的方法遍历数组中的每一个元素
 * @for Core.Array.foreach 
 * @param {Array} ar 被遍历的数组
 * @param {Function} insp 遍历数组时所执行的函数
 * @return 每个元素都被处理之后的数组
 * @author stan | chaoliang@staff.sina.com.cn
 * @example
 		var testArray = [1,2,3,4,5,1,2];
 		Core.Array.foreach(testArray, function(i){
 			alert(i)
 		})
 * @global Core.Array.foreach
 */
Core.Array.foreach = function (ar, insp){
	if(ar == null && ar.constructor != Array){
		return [];
	}
	var i=0, len = ar.length, r = [];
	while(i<len){
		var x = insp(ar[i], i);
		if (x !== null) {
			r[r.length] = x;
		}
		i++;
	}
	return r;
};