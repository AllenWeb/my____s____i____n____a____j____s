/**
 * @id Core.Class.extend 
 * Copyright (c) 2007, Sina Inc. All rights reserved. 
 * @fileoverview js中类的定义，继承的方法集合
 */
$import("sina/core/class/_class.js");
/**
 * 继承
 * @param {Object} destination 子类
 * @param {Object} source 父类
 */
Core.Class.extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};