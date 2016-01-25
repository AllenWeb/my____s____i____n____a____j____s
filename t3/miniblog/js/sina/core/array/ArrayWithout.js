/**
 * @id Core.Array.ArrayWithout
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
$import("sina/core/array/foreach.js");
/**
 * 删除指定数组中指定的元素
 * @for Core.Array.ArrayWithout
 * @author stan | chaoliang@staff.sina.com.cn
 * @update 08.04.02	如果第二个参数是数组，将数组中每个元素都删除 
 * @param {Array) 指定的数组
 * @param {int|String|Object|Array) 指定数组中要删除的元素
 * @return {Array}	返回删除了指定元素的数组
 * @example
 		var testArray = [1,2,3,4,5,1,2];
 		var result = Core.Array.ArrayWithout(testArray, 1, 3);
 		alert(result)	//[2,4,5,2]
 		var testArray = [1,2,3,4,5,1,2];
 		var result = Core.Array.ArrayWithout(testArray, [1, 3]);
 		alert(result)	//[2,4,5,2]
 */
Core.Array.ArrayWithout = function(){
	if (arguments.length < 2) {
		return arguments.length == 1 ? arguments[0] : null;
	}
	var results = [];
	var aa = arguments[0];
	if (aa === null || aa.constructor != Array) {
		return null;
	}
	if(arguments[1].constructor == Array){
		var args = [];
		args[0] = aa;
		Core.Array.foreach(arguments[1], function(v, i){
			args[i+1] = v;
		});
	}
	else{
		args = arguments;
	}
	for(var i = 0;i < aa.length; i ++){
		var isWithout = true;
		for(var j = 1; j < args.length ; j ++){
			if(aa[i] == args[j]){
				isWithout = false;
				break;
			}
		}
		if (isWithout) {
			results.push(aa[i]);
		}
	}
	return results;
};
