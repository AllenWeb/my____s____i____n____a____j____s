/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview cookie操作类
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */

/**
 * @deprecated 
 * cookie的操作很特别，读写都是通过document.cookie来操作的
 * 1.读取的时候，浏览器并没有提供接口供按需读取，而是直接返回所有的cookie
 * 2.写入的时候，对document.cookie的赋值却是只会对设置的cookie name所对应的cookie值发生作用，不会影响其他的cookie值。删除操作与服务器端的做法相同都是将cookie设置为过期。
 * 这里可以发现浏览器的cookie操作是统一的入口，不论是服务器端还是客户端。
 */
$import("sina/utils/cookie/_cookie.js");

/**
 * 读取cookie,注意cookie名字中不得带奇怪的字符，在正则表达式的所有元字符中，目前 .[]$ 是安全的。
 * @param {Object} cookie的名字
 * @return {String} cookie的值
 * @example
 * var value = Utils.Cookie.getCookie(name);
 */
Utils.Cookie.getCookie = function (name) {
	name = name.replace(/([\.\[\]\$])/g,'\\\$1');
	var rep = new RegExp(name + '=([^;]*)?;','i'); 
	var co = document.cookie + ';';
	var res = co.match(rep);
	if (res) {
		return res[1] || "";
	}
	else {
		return "";
	}
};

/**
 * 设置cookie
 * @param {String} name cookie名
 * @param {String} value cookie值
 * @param {Number} expire Cookie有效期，单位：小时
 * @param {String} path 路径
 * @param {String} domain 域
 * @param {Boolean} secure 安全cookie
 * @example
 * Utils.Cookie.setCookie('name','sina',null,"")
 */
Utils.Cookie.setCookie = function (name, value, expire, path, domain, secure) {
		var cstr = [];
		cstr.push(name + '=' + escape(value));
		if(expire){
			var dd = new Date();
			var expires = dd.getTime() + expire * 3600000;
			dd.setTime(expires);
			cstr.push('expires=' + dd.toGMTString());
		}
		if (path) {
			cstr.push('path=' + path);
		}
		if (domain) {
			cstr.push('domain=' + domain);
		}
		if (secure) {
			cstr.push(secure);
		}
		document.cookie = cstr.join(';');
};

/**
 * 删除cookie
 * @param {String} name cookie名
 */
Utils.Cookie.deleteCookie = function(name) {
		document.cookie = name + '=;' + 'expires=Fri, 31 Dec 1999 23:59:59 GMT;'; 
};
