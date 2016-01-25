/**
 * @id Core.String.format
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");

/**
 * 对第字符串中的｛n｝进行替换
 * @author Jay Chan | chenjie@staff.sina.com.cn
 * format string (.net style)
 * @for Core.String.format
 * @param {String} 被替换的字符串
 * @param {String} 字符串中{0}被替换的内容
 * @param {String} 字符串中{1}被替换的内容
 * @return {String} 被替换后的字符串
 * @example
 *  var temp = "Greeting {0}, the method author is {1}";
 	temp = Core.String.format(temp, "SINA", "MaDFoX"); 
 	// return "Greeting SINA, the method author is MaDFoX"
	var temp = Core.String.format("15 == {0:16}", 15);
	// return "15 == f";
	
 */

Core.String.format = function(){
	var r = (!arguments[0] || typeof arguments[0] == "undefined")?"":arguments[0].toString();
	var re = /(.*?)({(\d+)(:([0-9a-z]+))?})/ig;
	var t = r.match(re);
	if(t){
		for(var i = 0, l = t.length; i<l; i++){
			t[i] = t[i].replace(re, "$1");
			switch(typeof arguments[parseInt(RegExp.$3)+1]){
				case "undefined" :
					t[i] += RegExp.$2;
					break;
				case "number" :
					t[i] += (isNaN(RegExp.$5) || RegExp.$5 =="") ? arguments[parseInt(RegExp.$3)+1] : arguments[parseInt(RegExp.$3)+1].toString(Math.max(Math.min(Math.round(RegExp.$5), 36), 2));
					break;
				default :
					t[i] += arguments[parseInt(RegExp.$3)+1];
			}
		}
		t.push(r.replace(re, ""));
		return t.join("");
	}
	return r;
};
