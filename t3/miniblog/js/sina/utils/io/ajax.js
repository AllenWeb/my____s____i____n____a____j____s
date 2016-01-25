/**
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Ajax类
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0 | 2008-08-29
 */

// 载入需要的文件
$import("sina/utils/io/_io.js");
$import("sina/utils/url.js");
$import("sina/core/string/encodeDoubleByte.js");
$import("sina/core/base/detect.js");
/**
 * ajax类
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Object} url
 * @param {Object} getArray
 */
Utils.Io.Ajax = {
	/**
	 * 创建 XMLHttpRequest 对象
	 */
	createRequest : function() {
		var request = null;
		try {
			request = new XMLHttpRequest();
		} catch (trymicrosoft) {
			try {
				request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (othermicrosoft) {
				try {
					request = ActiveXObject("Microsoft.XMLHTTP");
				} catch (failed) {}
			}
		}
		if(request == null){
			$Debug.error("<b>create request failed</b>", {'html':true});
		}
		else {
			return request;
		}
	},
	/**
	 * 请求参数接收
	 * 
	 * @param url 必选参数。请求数据的URL，是一个 URL 字符串，不支持数组
	 * @param option 可选参数 {
	 *  onComplete  : Function (Array responsedData),
	 *  onException : Function (),
	 *  returnType : "txt"/"xml"/"json", 返回数据类型
	 *  GET : {}, 通过 GET 提交的数据
	 *  POST : {} 通过 POST 提交的数据
	 * }
	 */
	request : function (url, option) {
		option = option || {};
		option.onComplete = option.onComplete || function () {};
		option.onException = option.onException || function () {};
		option.returnType = option.returnType || "txt";
		option.method = option.method || "get";
		option.data = option.data || {};
		if(typeof option.GET != "undefined" && typeof option.GET.url_random != "undefined" && option.GET.url_random == 0){
			this.rand = false;
			option.GET.url_random = null;
		}
		this.loadData(url, option);
	},
	/**
	 * 载入指定数据
	 * @param {Object} url
	 * @param {Object} option
	 */
	loadData: function (url, option) {
//		$Debug("Ajax url : " + url);
		var request = this.createRequest(), tmpArr = [];
		var _url = new Utils.Url(url);
		// 如果有需要 POST 的数据，加以整理
		if(option.POST){
			for (var postkey in option.POST) {
				var postvalue = option.POST[postkey];
				if(postvalue != null){
					tmpArr.push(postkey + '=' + Core.String.encodeDoubleByte(postvalue));
				}
			}
		}
		var sParameter = tmpArr.join("&") || "";
		// GET 方式提交的数据都放入地址中
		if (option.GET) {
			for(var key in option.GET){
				if (key != "url_random") {
					_url.setParam(key, Core.String.encodeDoubleByte(option.GET[key]));
				}
			}					
		}
		if (this.rand != false) {
			// 接口增加随机数
			_url.setParam("rnd", Math.random());
		}
//		alert(_url.toString());
		// 处理回调
		request.onreadystatechange = function() {
			if(request.readyState == 4){
				var response, type = option.returnType;
				try{
					// 根据类型返回不同的响应
					switch (type){
						case "txt":
							response = request.responseText;
							break;
						case "xml":
							if (Core.Base.detect.$IE) {
								response = request.responseXML;
							}
							else {
								var Dparser = new DOMParser();
								response = Dparser.parseFromString(request.responseText, "text/xml");
							}
							break;
						case "json":
								response = eval("(" + request.responseText + ")");
							break;
					}
					option.onComplete(response);
				}
				catch(e){
					option.onException(e.message, _url);
					return false;
				}
			}
		};
		try{
			// 发送请求
			if(option.POST){
				request.open("POST", _url, true);
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send(sParameter);
			}
			else {
				request.open("GET", _url, true);
				request.send(null);
			}
		}
		catch(e){
			option.onException(e.message, _url);
			return false;
		}
	}
};