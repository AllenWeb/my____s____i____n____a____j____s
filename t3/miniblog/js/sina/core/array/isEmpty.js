/**
 * @id Core.Array.isEmpty 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");

/**
 * 判断数组是否位空数组
 * @for Core.Array.isEmpty 
 * @param {Array} arr 需要进行判断的数组
 * @return {Boolean} 空数组:ture；非空数组:false
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @example
	 Core.Array.isEmpty([]);
 */
Core.Array.isEmpty = function (arr){
  return arr.length > 0 ? false : true;
};