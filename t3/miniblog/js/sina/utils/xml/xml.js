/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview XML 类
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */

$import("sina/utils/xml/_xml.js");

/** 
* 创建一个空白XML对象 [static]
* @example
* Utils.Xml.createXmlDoc();
*/
Utils.Xml.createXmlDoc = function(){
	if ((typeof DOMParser)!="undefined") {
		return document.implementation.createDocument('','',null);
	}else if(window.ActiveXObject){
		var ActiveX = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"];
		var _xml = null;
		for (var i in ActiveX) {
			try {_xml = new ActiveXObject(ActiveX[i]);break;}
			catch (ex) {}
		}
		if (_xml) {
			return _xml;
		}
		else {
			$Debug("No MSXML DOMDocument ActiveXObject");
		}
	}else{
		$Debug("browser do not support XML format");
	}
};

/**
 * 将传入的字符串解析成xml对象，并返回 [static]
 * @param {Object} str xml格式的字符串
 * @return {XML} xml对象
 * @example
 * var xml = Utils.Xml.parse('<root></root>');
 */
Utils.Xml.parse = function (str){
	try{
		var _xml;
		if ((typeof DOMParser)!="undefined") {						// Firefox,safari
			_xml = new DOMParser();
			return _xml.parseFromString(str, "text/xml");
		}else if(window.ActiveXObject){			//IE
			_xml = Utils.Xml.createXmlDoc();
			_xml.async = false;
			_xml.loadXML(str);
			return _xml;
		}
	}catch (e){
	   scope.trace("error occurs when parsing xml" + e); 
	}
};

/**
 * 将xml对象序列化成string [static]
 * @param {Object} xmldoc xml对象
 * @return {String} xml格式的字符串
 * @example
 * var xml = Utils.Xml.parse('<root>this is a test</root>');
 * var xmlstr = Utils.Xml.serialize(xml);
 * console.log(xmlstr);
 */
Utils.Xml.serialize = function (xmldoc){
	if(XMLSerializer){
		return (new XMLSerializer()).serializeToString(xml);
	}else if(xmldoc.xml){
		return xml.xml;
	}
};