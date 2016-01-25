/**
 * @id Core.Class.create
 * Copyright (c) 2007, Sina Inc. All rights reserved. 
 * @fileoverview js中类的定义，继承的方法集合
 */
$import("sina/core/class/_class.js");
/**
 * @author xp
 * @for Core.Class.create
 * As an flag argument passed to class constructor
 * With presentation of this object as the 1st argument,
 constructor runs without initialize function called
 * 标志常量
 */
Core.Class.AsPrototype = {};
/**
 * @author xp
 * @for Core.Class.create 
 * Refine Core.Class.create.
 * 创建在继承中更加灵活的类
 * @return {Function} 返回一个以initialize开始执行的函数
 */
Core.Class.create = function (){
	return function (t){
		if (t != Core.Class.AsPrototype) {
			this.initialize.apply(this, arguments);
		}
	};
};


