/**
 * @id Core.Base.parseParam 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Array类的扩展
 */
$import("sina/core/base/_base.js");
/**
 * @for Core.Base.parseParam 
 * @method Sina.base.parseParam
 * @param {Object} oSource 需要被赋值参数的对象
 * @param {Object} oParams 传入的参数对象
 * @return {object} oSource 对象中增加了oParams的属性
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @update 08.08.25
 */
(function () {
	var parseParam = function (oSource, oParams) {
		var key;
		try {
			if (typeof oParams != "undefined") {
				for (key in oSource) {
					if (oParams[key] != null) {
						oSource[key] = oParams[key];
					}
				}
			}
		}
		finally {
			key = null;
			return oSource;
		}
	};
	Core.Base.parseParam = parseParam;
	//regist("$parseParam", "Sina.base.parseParam", parseParam, "FlashSoft", "解析传入参数赋值给默认参数,用来做方法的参数解析用");
})();