/**
 * @id Core.String.StringBuffer
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 字符串 html 编码/解码
 */
$import("sina/core/string/_string.js");

/**
 * @for Core.String.StringBuffer
 * 将几个字符串连接到一起，尤其对循环添加字符串
 * @example
var thisStr = new StringBuffer();
for(var i = 0;i<str.length;i++){
     thisStr.append(str[i]);
}

alert(thisStr.toString());
	
 */


Core.String.StringBuffer = function() { 
    this.buffer = []; 
};
/**
 * 以数组的方式连接字符串，将需要连接的字符串放入数组中
 * @param {String} str 需要连接的字符串
 * @return {Object} 返回 Core.String.StringBuffer 对象
 */
Core.String.StringBuffer.prototype.append = function(str) {
    this.buffer.push(str);
    return this;
};
/**
 * 以数组的方式连接字符串，将数组中字符通过join方便连接
 * @return {String} 数组中的字符连接后的字符串
 */
Core.String.StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};
