/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Input的扩展类
 */
$import('sina/utils/sinput/_sinput.js');
$import('sina/core/function/bind3.js');
$import('sina/core/events/addEvent.js');
$import('sina/core/string/_string.js');

/**
 * 通过正则进行表单元素的限制
 * @author xs | zhenhua1@staff.sina.com.cn
 * @param {HTMLElement} oTextNode
 * @param {RegExp} 用于过滤(限制字符)的正则表达式
 */
Utils.Sinput.RegLimit = function (oNode, re) {
	var keyup = function(){
		var ov = oNode.value;
		if (re.test(ov)) {oNode.value = ov.replace(re, '');}
	};
	Core.Events.addEvent(oNode, Core.Function.bind3(keyup,oNode), "keyup");
	Core.Events.addEvent(oNode, Core.Function.bind3(keyup,oNode), "blur");
};