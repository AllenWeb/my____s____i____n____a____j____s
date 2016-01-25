/*
 * Copyright (c) 2007, Sina Inc. All rights reserved. 
 * @fileoverview 正在保存提示框
 */
$import("sina/app.js");
$import("sina/jobs.js");
$import("sina/core/class/create.js");
$import("sina/core/math/getRandomNumber.js");
$import("sina/core/function/bind2.js");
$import("sina/core/system/getScrollPos.js");

/**
 * 正在保存提示框
 * @author stan | chaoliang@staff.sina.com.cn
 * @modified 08.11.04 
 * 从blog5.0代码移植
 * @example 使用单例模式进行使用
 */
App.processTip = Core.Class.create();
App.processTip.prototype = {
	initialize : function() {
		var div = $C("div");
		this.id = Core.Math.getRandomNumber(10,999);
		div.className = "CP_waiting";
		div.innerHTML = this.getStruc();
		div.id = "processTip"+this.id;
		div.style.position = "absolute";
		div.style.top = "0px";
		div.style.right = "0px";
		document.body.appendChild(div);
		this.tip = div;
		this.tip.style.display = "none";
	},
	defaultProgress : "正在保存中...",
	setTipText:function(text){
		$E("tip_text_"+this.id).innerHTML=text;
	},
	show : function() {
		this.tip.style.display = "";
	},
	hide : function() {
		this.tip.style.display = "none";
	},
	lock : function() {
//		var p = Core.System.getScrollPos();
//		this.tip.style.top = p[0] + "px";
//		this.tip.style.right = 2 - p[1] + "px";
		this.timer = setInterval(function(){
			var p = Core.System.getScrollPos();
			this.tip.style.top = p[0] + "px";
			this.tip.style.right = 2 - p[1] + "px";
		}.bind2(this),50);
	},
	unlock : function() {
		clearInterval(this.timer);
	},
	onInit : function () {
		
	},
	onProgress : function () {
		this.lock();
		this.show();
	},
	onComplete : function () {
		window.setTimeout(function(){
			this.hide();
			this.unlock();
		}.bind2(this), 500);
	},
	onError : function (){
		//
	},
	getStruc:function(){
		return '<img align="absmiddle" title="" alt="" src="http://simg.sinajs.cn/common/images/CP_i.gif" class="CP_i CP_i_wait"/><strong>正在保存中...</strong>';
	}
};





