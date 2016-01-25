/**
 * @id Core.Array.hashBy 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/array/_array.js");
$import("sina/core/array/foreach.js");
/**
 * Create hash table object by one of attributes of array elements.
 * @for Core.Array.hashBy 
 * 数组到hash对象的转换
 * @param {Array} arr 要转换为hash对象的数组,数组中的元素必须为Object
 * @param {String} id 数组元素中Object中属性，将被转换为Hash对象中的key
 * @return 返回object格式为hash类型 
 * @author xp | yanbo@staff.sina.com.cn
 * @param id the attribute name to use
 * @ desc 
 * var x = [{
	            "id": 5,
	            "name": "Aptana_\u521d\u4f53\u9a8c"
	        },
			{
	            "id": 2,
	            "name": "\u6211\u7684JS\u811a\u672c\u5fc3\u5f97"
	        },
			{
	            "id": 4,
	            "name": "\u811a\u672c\u9ed1\u5ba2\u653b\u9632\u6280"
	        },
			{
	            "id": 3,
	            "name": "\u300e\u660e\u300f\u4ee5\u98df\u4e3a\u5929"
	        },
			{
	            "id": 1,
	            "name": "\u7ffb\u8bd1\u548c\u6574\u7406\u6587\u7ae0"
	        },
			{
	            "id": 7,
	            "name": "\u6211\u7684\u8d85\u68a6\u5e7b\u751f\u6d3b"
	        }];
	var y = Core.Array.hashBy(x, "id");
	for(var key in y){
		alert(key + " : " + y[key].name);
	}
 */
Core.Array.hashBy = function(arr,id){
  var o = {};
  Core.Array.foreach(arr, function (e){
    o[e[id]] = e;
  });
  return o;
};
