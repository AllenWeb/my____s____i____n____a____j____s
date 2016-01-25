/**
 * @id Core.Array.each 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");

/**
 * 用指定的方法遍历数组中的每一个元素
 * @for Core.Array.each 
 * @author xp | yanbo@staff.sina.com.cn
 * @param {Array} ar 被遍历的数组
 * @param {Function} insp 遍历数组时所执行的函数
 * @return 每个元素都被处理之后的数组
 * @example
 * 		var testArray = [1,2,3,4,5,1,2];
 * 		$each(testArray, function(i){
 * 			alert(i)
 * 		})
 * @global $each
   @ 不推荐使用，见Core.Array.foreach(ar,insp)
 */
Core.Array.each = function (ar, insp){
  var r = [];
  for(var i=0;i<ar.length;i++){
    var x = insp(ar[i], i);
    if (x !== null) {
		r.push(x);
	}
  }
  return r;
};