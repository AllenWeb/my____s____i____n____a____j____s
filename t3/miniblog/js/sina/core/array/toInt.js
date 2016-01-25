/*
 * @id Core.Array.toInt 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
$import("sina/core/string/toInt.js");
/**
 * Convert Array to int, elements in Array treated as a digit in the result number
 * 数组到整数转换
 * @param {Array} arr 被转换为整数的数组
 * @param {Number} i 进制选择
 * @Param {Number} 数组内容被转换成的一个整数
 * @for Core.Array.toInt
 * @author xp | yanbo@staff.sina.com.cn
 * @param i scale of the number 
 */
Core.Array.toInt = function (arr, i){
  return Core.String.toInt(arr.join(""),i);
};

