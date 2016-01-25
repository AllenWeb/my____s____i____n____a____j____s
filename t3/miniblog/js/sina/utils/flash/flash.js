/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview flash相关操作
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */

$import("sina/utils/flash/_flash.js");

/**
 * 创建flash插入节点
 * @param {String} _sName flash节点的id，和name
 * @param {String} _sSrc flash地址
 * @param {Number} _sWidth flash节点宽度
 * @param {Number} _sHeight flash节点高度
 * @param {Enum} _sMode flash的模式 [window|transparent|Opaque] default window
 * @param {String} _aValue flashVars传给flash的变量，格式是值对的形式
 * @return {String} 返回嵌入swf的串，直接赋值给Dom节点的innerHTML即可。
 */
Utils.Flash.buildSwf = function(_sName, _sSrc, _sWidth, _sHeight, _sMode, _aValue) {
	var sValue = '';
	var aFlashVars = [];
	if (_aValue) {
		var i = 0;
		for (var key in _aValue) {
			aFlashVars[i] = key + "=" + _aValue[key];
			i++;
		}
		sValue = aFlashVars.join('&');
	}
	_sMode = _sMode ? 'transparent' : '';
	return '<embed id="' + _sName + '" name="' + _sName + '" src="' + _sSrc + '" wmode="' + _sMode + '" quality="high" align="top" salign="lt" allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="' + _sWidth + '" height="' + _sHeight + '" flashVars="' + sValue + '" \/>';
};
/**
 * IE 下因为安全更新使得页面的 object对象必须激活才能使用，flash受此影响，故需要在页面加载完成以后swarp一下，避过这个激活过程。注意此方法要生效，则其所在的脚本切不可为内联脚本
 * @example
 * window.onload = function(){
 * 		Utils.Flash.swarpFlash();
 * }
 */
Utils.Flash.swarpFlash = function() {
	//没有办法的办法，采用遍历页面的方法，
	var stripQueue = [];
	var objects = document.getElementsByTagName('object');
	for (var i=0; i<objects.length; i++){			
		var o = objects[i];	
		var h = o.outerHTML;
		var params = "";
		var hasFlash = true;
		for (var j = 0; j<o.childNodes.length; j++) {
			var p = o.childNodes[j];
			if (p.tagName == "PARAM"){
				params += p.outerHTML;		       
			}
		}	
		if (o.getAttribute("ignore")){
			continue;
		}		
		var tag = h.split(">")[0] + ">";			
		var newObject = tag + params + o.innerHTML + " </OBJECT>";	
		o.outerHTML = newObject;
	}
	var embed = document.getElementsByTagName('embed');
	for(var i=0;i<embed.length; i++){
		var o = embed[i];
		var h = o.outerHTML;
		var p = o.previousSibling;
		if(p){
			o.parentNode.removeChild(o);
			p.insertAdjacentHTML('afterEnd',h);
		}else{
			p = o.parentNode;
			p.removeChild(o);
			p.insertAdjacentHTML('afterBegin',h);
		}
	}
};
