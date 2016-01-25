/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName BackShadow
 * @FileOverview 背景阴影类
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 */

$import("sina/sina.js");
$import("sina/core/base/detect.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/events/addEvent.js");

var BackShadow=function(opacity){

	this.entity=null;
	
	var _this=this;

	this.isShow=false;
	this._ie6Fixed=function(){
		_this.entity.style.top=document.documentElement.scrollTop+"px";
		_this.entity.style.left=document.documentElement.scrollLeft+"px";
		if(_this.ifm){
			_this.ifm.style.top=document.documentElement.scrollTop+"px";
			_this.ifm.style.left=document.documentElement.scrollLeft+"px";
		}
	};
	
	(function initialize(){
		_this.entity=$C("div");
		_this.entity.style.position="absolute";
		_this.entity.style.width=_this.getAreaWidth()+"px";
		_this.entity.style.height=_this.getAreaHeight()+"px";
		_this.entity.style.left="0px";
		_this.entity.style.top="0px";
		_this.entity.style.backgroundColor="black";
		document.body.appendChild(_this.entity);
		Core.Dom.setStyle(_this.entity,"opacity",isNaN(opacity)?0.5:opacity);
		if(Core.Base.detect.$IE6){
			_this.entity.style.top=document.documentElement.scrollTop+"px";
			_this.addIframe();
		}
		Core.Events.addEvent(window,function(){_this.updateSize();},"resize");
		_this.setFixed(true);
	})();
};

BackShadow.prototype={
	show:function(){
		this.entity.style.display="";
		if(this.ifm){
			this.ifm.style.display="";
		}
		this.isShow=true;
	},
	hidden:function(){
		this.entity.style.display="none";
		if(this.ifm){
			this.ifm.style.display="none";
		}
		this.isShow=false;
	},
	addIframe:function(){
		this.ifm=$C("iframe");
		this.ifm.style.position="absolute";
		this.ifm.style.left=this.entity.style.left;
		this.ifm.style.top=this.entity.style.top;
		this.ifm.style.width=this.entity.style.width;
		this.ifm.style.height=this.entity.style.height;
		document.body.insertBefore(this.ifm,this.entity);
		Core.Dom.setStyle(this.ifm,"opacity",0);
	},
	insertBefore:function(obj){
		document.body.insertBefore(this.entity,obj);
		if (this.ifm) {
			document.body.insertBefore(this.ifm,this.entity);
		}
	},
	insertAfter:function(obj){
		document.body.insertAfter(this.entity,obj);
		if (this.ifm) {
			document.body.insertBefore(this.ifm,this.entity);
		}
	},
	updateSize:function(){
		this.entity.style.width=this.getAreaWidth()+"px";
		this.entity.style.height=this.getAreaHeight()+"px";
		if(this.ifm){
			this.ifm.style.width=this.getAreaWidth()+"px";
			this.ifm.style.height=this.getAreaHeight()+"px";
		}
	},
	getAreaHeight:function(){
		return document.documentElement.clientHeight;
	},
	getAreaWidth:function(){
		return document.documentElement.clientWidth;
	},
	setFixed:function(state){
		if (Core.Base.detect.$IE6) {
			var _this=this;
			if (state) {
				Core.Events.addEvent(window,_this._ie6Fixed, "scroll");
			}else{
				Core.Events.removeEvent(window,_this._ie6Fixed, "scroll");
			}
			
		}else{
			this.entity.style.position = state?"fixed":"absolute";
		}
	}
};
