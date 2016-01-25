/**
 * @id Core.Class.define 
 * Copyright (c) 2007, Sina Inc. All rights reserved. 
 * @fileoverview js中类的定义，继承的方法集合
 */
$import("sina/core/class/_class.js");
$import("sina/core/class/extend.js");
$import("sina/core/class/create.js");
/**
 * @author xp
 * @for Core.Class.define 
 * Define Class with constructor, superClass & methods hash
 * 创建类。
 * @param {Function} init constructor
 * @param {Object} superClz super class, it must be a function created by Class.define.
 * @param {Function} methods methods hash.
 */
Core.Class.define = function (init, superClz, methods) {
	if (init && init.__isClass && init.__isClass()) {
		throw new Error("class cnt be used as another class' constructor : " + init);
	}
	
	superClz = superClz || Object;
	methods = methods || {};
	
	methods.initialize = init || methods.initialize || superClz.prototype.initialize || (function (){});
	if (typeof(methods.initialize) != "function") {
		throw new Error("only function can be used as constructor");
	}
	
	methods.__isClass = function (){return true;};
	var clz = Core.Class.create();
	clz.__isClass = methods.__isClass;
	var proto = superClz == Object ? {} : new superClz(Core.Class.AsPrototype);
	clz.prototype = Core.Class.extend(proto, methods);
	return clz;
};

