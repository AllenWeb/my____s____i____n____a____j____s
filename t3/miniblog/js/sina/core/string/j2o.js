/**
 * @id Core.String.j2o
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符处理
 */
$import("sina/core/string/_string.js");

/**
 * @for Core.String.j2o
 * @param {String} json字符串
 * @return {Object} 被转换成的对象
 * Json string to object.
 *    Any error occured while parsing the string will just be ignored & function
 * json字符串转化成对象。
 * @author xp | yanbo@staff.sina.com.cn
 * returns null.
 */
Core.String.j2o = function(str){
	if(!str || str == ""){
		return null;
	}
	try{
		var o = window.eval("(" + str + ")");
		return o;
	}
	catch(e){
		$Debug("j2o : 数据分析出错");
		traceError(e);
		return null;
	}
};