/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Input的扩展类
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */
/**
 * Super Input ,超级input，作为增强input,textarea等输入控件的功能，如验证，限制等到
 */
$import('sina/utils/sinput/_sinput.js');
$import('sina/core/function/bind3.js');
$import('sina/core/events/addEvent.js');
$import('sina/core/string/_string.js');
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
/**
 * 自动按字节截断input框中的文字长度
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @param {HTMLElement} oTextNode
 * @param {Number} nMaxLen
 * @exception
 * 			Sina.util.LimitMaxLen(input1, 10);
 */
Utils.Sinput.limitMaxLen = function (oTextNode, nMaxLen) {
	var nValue;
	var keyup = function(){
		nValue = oTextNode.value;
		var strLen = Core.String.byteLength(nValue);
		if (strLen > nMaxLen) {
			oTextNode.value = Core.String.leftB(nValue,nMaxLen);
		}
	};
	Core.Events.addEvent(oTextNode, Core.Function.bind3(keyup, oTextNode), "keyup");
	Core.Events.addEvent(oTextNode, Core.Function.bind3(keyup, oTextNode), "blur");
	Core.Events.addEvent(oTextNode, Core.Function.bind3(keyup, oTextNode), "focus");
};
