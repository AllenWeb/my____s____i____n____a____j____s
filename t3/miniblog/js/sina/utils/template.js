/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Js模板引擎类
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */
/**
 * @example 
	var tpl = 'this is a #{vo}';
	var tmp = new Utils.Template(tpl);
	var data = {'vo':'test'};
	console.log(tmp.evaluate(data)); // output:this is a test;

	data = [{vo:test},{vo:bug}];
	var reverse = true;
	console.log(tmp.evaluateMulti(data,reverse));// output:this is a bugthis is a test
 */
$import("sina/utils/utils.js");
$import('sina/core/function/bind2.js');
$import('sina/core/array/foreach.js');

Utils.Template = function (tmpl) {
	this.tmpl = tmpl;
	this.pattern = /(#\{(.*?)\})/g;
};
Utils.Template.prototype = {	
	/**
	 * 渲染单条数据的方法
	 * @param {Object} data 渲染模板所需要的数据,对应与模板中需要的数据
	 * @return {String} 替换好的模板
	 * @example
	 * var tpl = 'this is a #{vo}';
	 * var 
	 */
	evaluate : function (data) {
	   return this.tmpl.replace(this.pattern, function(){
		   return data[arguments[2]] || "";
	   });
	},
	/**
	 * 渲染多条数据的方法
	 * @param {Array} data 渲染模板所需要的数据(多条) data[{},{}]
	 * @param {Object} reverse	是否进行反向
	 */
	evaluateMulti : function (data, reverse) {
		var _buffer = [];
		Core.Array.foreach(data, Core.Function.bind2(function (v, i){
			i = reverse ? data.length - i : i;
			_buffer[i] = this.evaluate(v);
		}, this));
		return _buffer.join("");	
	}
};