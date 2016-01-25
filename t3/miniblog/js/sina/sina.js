/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Sina类库的根节点和基础方法
 */
 
 
//全局变量定义
if(!$CONFIG){
	$CONFIG = {};
}
var scope = $CONFIG;
Function.prototype.bind2 = function(object){
    var __method = this;
    return function(){
        return __method.apply(object, arguments)
    }
};
scope.$VERSION = 't3';
scope.$BASEIMG = 'http://timg.sjs.sinajs.cn/'+ scope.$VERSION +'/';
scope.$BASECSS = 'http://timg.sjs.sinajs.cn/'+ scope.$VERSION +'/';
scope.$BASEJS = 'http://tjs.sjs.sinajs.cn/'+ scope.$VERSION +'/';
scope.$BASESTATIC = 'http://tjs.sjs.sinajs.cn/'+ scope.$VERSION +'/';
scope._ua = navigator.userAgent.toLowerCase();
scope.$IE = /msie/.test(scope._ua);
scope.$OPERA = /opera/.test(scope._ua);
scope.$MOZ = /gecko/.test(scope._ua);
scope.$IE5 = /msie 5 /.test(scope._ua);
scope.$IE55 = /msie 5.5/.test(scope._ua);
scope.$IE6 = /msie 6/.test(scope._ua);
scope.$IE7 = /msie 7/.test(scope._ua);
scope.$SAFARI = /safari/.test(scope._ua);
scope.$winXP = /windows nt 5.1/.test(scope._ua);
scope.$winVista = /windows nt 6.0/.test(scope._ua);
var $IE = scope.$IE, $MOZ = scope.$MOZ, $IE6 = scope.$IE6;
function $import(url){
}
var Boot = {};
Boot.addDOMLoadEvent = function(func){
	if (!window.__load_events) {
		var init = function(){
			if (arguments.callee.done) {
				return
			}
			arguments.callee.done = true;
			if (window.__load_timer) {
				clearInterval(window.__load_timer);
				window.__load_timer = null
			}
			for (var i = 0; i < window.__load_events.length; i++) {
				window.__load_events[i]()
			}
			window.__load_events = null
		};
		if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", init, false)
		}
		if (/WebKit/i.test(navigator.userAgent)) {
			window.__load_timer = setInterval(function(){
				if (/loaded|complete/.test(document.readyState)) {
					init()
				}
			}, 10)
		}
		if(window.ActiveXObject){				
			window.__load_timer = setInterval(function () {
			  try {
				document.body.doScroll('left');
				init();
			  } catch(ex) {				  	
			  };
			},10);
		}
		window.onload = init;
		window.__load_events = []
	}
	window.__load_events.push(func);
};
Boot.getJsVersion = function(){	
	var ver = false;
	if ($CONFIG) {
		ver = $CONFIG.js ? $CONFIG.js : "";
	}
	if (ver) {
		return "?v=" + ver;
	}
	else {
		return "";
	}
};
try {
	Boot.addDOMLoadEvent(main);
}catch(e){}



$Import("debug_base");


/**
 * @class Sina{Object}做为整个类结构的根scope
 * @author stan | chaoliang@staff.sina.com.cn
 */
if (typeof Sina == 'undefined') {
	Sina = {};
}

/**
 * 在Sina下建立子对象
 * @author stan | chaoliang@staff.sina.com.cn
 * @example
 		Sina.pkg("Core.Array");
 		alert(typeof Core.Array);	//[Object Object]
 */
Sina.pkg = function(ns) {
    if (!ns || !ns.length){
		return null;
	}
    var levels = ns.split(".");
    var nsobj = Sina;
    for (var i= (levels[0] == "Sina") ? 1 : 0; i< levels.length; ++ i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }
	return nsobj;
};

/**
 * 根据元素的id获取对应节点的引用
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {String} id 节点的id或者节点本身
 * @modified 修正fangchao修改造成的无节点的情况下返回值前后不一致的问题
 */
function $E(oID) {
	//return typeof(id) == 'string' ? document.getElementById(id) : id;
	var node = typeof oID == "string"? document.getElementById(oID): oID;
	if (node != null) {
		return node;
	}
	else {
//		$Debug("对象: " + oID + " 不存在");
	}
	return null;
}

/**
 * 根据tagname创建制定类型的节点元素
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {String} tagName 制定的节点类型
 */
function $C(tagName) { 
	return document.createElement(tagName);
}

try{
	document.execCommand("BackgroundImageCache", false, true);
}catch(e){}
