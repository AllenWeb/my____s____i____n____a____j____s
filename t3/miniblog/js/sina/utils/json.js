/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Json类，实现Json <--> Object 的相互转换
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */
$import("sina/utils/utils.js");

Utils.Json = {
	/**
	 * 将Json转换成为javascript的一个对象，并返回
	 * @param {String} str Json格式的一个字符串
	 * @return {Object} 解析生成的对象
	 */
	eval:function(str){
		return eval('('+str+')');
	},
	/**
	 * 将一个对象序列化成一个 Json串
	 * @param {Object} x javascript中除了Function外所有的基本类型都可以，不过这里最多的还是object和array
	 */
	flatten:function (x) {
		var self = Utils.Json;
		if(x == null) return null;
		else if (x.constructor.toString() == String) return self.str2json(x);
		else if (x.constructor.toString() == Array) return self.arr2json(x);
		else if (x.constructor.toString() == Object) return self.obj2json(x);
		else if (x.constructor.toString() == Boolean) return self.bool2json(x);
		else if (x.constructor.toString() == Number) return self.num2json(x);
		else if (x.constructor.toString() == Date) return self.date2json(x);
		else return null;
	},
	arr2json:function (x) {
		var self = Utils.Json;
		var p = [];
		var l = x.length;
		var t;
		for (var i = 0; i < l; ++i) {
			t = self.flatten(x[i]);
			if (t) p.push(t);
		}
		return '[' + p.join(',') + ']';
	},
	obj2json : function (x) {
		var self = Utils.Json;
		var p = [];
		var t;
		for (var i in x) {
			t = self.flatten(x[i]);
			if (t) p.push(self.flatten(i) + ':' + t);
		}
		return '{' + p.join(',') + '}';
	},
	date2json:function (x) {
			function f(n) {return n < 10 ? '0' + n : n;};
		    return '"' + x.getFullYear() + '-' +
				f(x.getMonth() + 1) + '-' +
				f(x.getDate()) + 'T' +
				f(x.getHours()) + ':' +
				f(x.getMinutes()) + ':' +
				f(x.getSeconds()) + '"';
	},
	num2json:function (x) {
		return x ? String(x) : "0";
	},
	bool2json:function (x) {
		return String(x);
	},
	str2json: function(x){
		var m = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"': '\\"',
			'\\': '\\\\'
		};
		if (/["\\\x00-\x1f]/.test(x)) {
			return '"' +
			x.replace(/([\x00-\x1f\\"])/g, function(a, b){
				var c = m[b];
				if (c) 
					return c;
				c = b.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) +
			'"';
		}
		return '"' + x + '"';
	}
};
