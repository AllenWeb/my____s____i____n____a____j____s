/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName DialogPrototype
 * @FileOverview 单实例对话框类
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 */

$import("sina/utils/layer/layer.js");
$import("sina/utils/template.js");
$import("sina/core/base/parseParam.js");
$import("sina/utils/drag3.js");
$import("sina/utils/layer/layerPrototype.js");
$import("sina/core/system/winSize.js");
$import("sina/core/base/detect.js");


var DialogPrototype=function(tmpDialog){
	var _this=this;	
	_this.entity=null;
	_this.ifm=null;
	var Property={
		id:"",
		layer:new Layer(tmpDialog),
		titleUI:'<div>#{text1}</div>',
		titleContent:{
			text1:"text11"
		},
		UI:'<div id="#{id}">#{text1}</div>',
		content:{
			id:"id1",
			text1:"text1"
		},
		titleBarId:"",
		contentId:"",
		x:0,
		y:0,
		width:0,
		height:0,
		isFixed:false,
		canDrag:false,
		dragEntity:null,
		layerPrototype:new LayerPrototype(tmpDialog.template),
		dialogTemplate:tmpDialog
	};
	
	this.getProperty = function(){
		return Property;
	};
	
	(function initialize(){
		var p=_this.getProperty();
		_this.ifm=p.layer.ifm;
		p.id=p.layer.getProperty().entityId+"_dlgPtt";
		p.titleBarId=p.id+"_titleBar";
		p.contentId=p.id+"_content";
		_this.setTemplate({templateName:""});
		
		_this.hidden();
		
		var win = Core.System.winSize();
		
		p.dragEntity=new Utils.Drag3($E(p.titleBarId),_this.ifm?[_this.ifm,_this.entity]:[_this.entity]);
		$E(p.titleBarId).style.cursor="move";
		Core.Events.addEvent($E(p.titleBarId),function(){
			return false;
		},"selectstart");
		Core.Events.addEvent(_this.entity,function(){
			return false;
		},"selectstart");
	})();
};

DialogPrototype.prototype={
	/**
	 * opts.x:[number]
	 * opts.y:[number]
	 */
	setPosition:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		this.getProperty().layer.setPosition(opts);
	},
	
	/**
	 * opts.width:number
	 * opts.height:number
	 */
	setSize:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		p.layer.setSize(opts);
//		if (p.width != 0) {
//			$E(p.contentId).style.width = p.width + "px";
//		}
//		if (p.height != 0) {
//			$E(p.contentId).style.height = p.height + "px";
//		}
		
	},
	
	/**
	 * opts.isFixed:[bool]
	 */
	setFixed:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		this.getProperty().layer.setFixed(opts);
	},
	/**
	 * opts.templateName:[string]
	 */
	setTemplate:function(opts){
		var p = this.getProperty();
		var tempEntity=$C("div");
		
		Core.Base.parseParam(p,opts);
		
		p.layerPrototype.setTemplate(p.dialogTemplate.name);
		var tmp=new Utils.Template(p.layerPrototype.getProperty().activeTemplate || '<div id="#{layerId}"><div id="#{titleBarId}"></div><div id="#{contentId}"></div></div>');
		tempEntity.innerHTML=tmp.evaluate({layerId:p.id,titleBarId:p.titleBarId,contentId:p.contentId});
		document.body.appendChild(tempEntity);
		this.entity=$E(p.id);
		document.body.replaceChild(this.entity,p.layer.entity);
		if(this.ifm){
			document.body.insertBefore(this.ifm,this.entity);
		}
		document.body.removeChild(tempEntity);
		tempEntity=null;
		p.layer.entity=this.entity;
		p.layer.getProperty().contentId=p.contentId;
	},
	
	/**
	 * opts.canDrag:[bool]
	 */
	setDrag:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		if(p.canDrag){
			p.dragEntity.capture();
		}else{
			p.dragEntity.release();
		}
	},
	
	updateIfmSize:function(){
		this.getProperty().layer.updateIfmSize();
	},
	
	/**
	 * opts.titleUI:[string]
	 * opts.titleContent[Object]
	 */
	setTitleContent:function(opts){
		var p = this.getProperty();
		if (p.titleUI != opts.titleUI || p.titleContent != opts.titleContent) {
			Core.Base.parseParam(p, opts);
			var tmp = new Utils.Template(p.titleUI);
			$E(p.titleBarId).innerHTML = tmp.evaluate(p.titleContent);
		}
	},
	
	
	/**
	 * opts.UI:[string]
	 * opts.content[Object]
	 */
	setContent:function(opts){
		this.getProperty().layer.setContent(opts);
	},
	
	show:function(){
		this.getProperty().layer.show();
	},
	close:function(){
		this.getProperty().layer.hidden();
	},
	hidden:function(){
		this.getProperty().layer.hidden();
	},
	setOnDrag:function(func){
		this.getProperty().dragEntity.onDrag=func;
	},
	setAreaLocked:function(state){
		var p = this.getProperty();
		p.dragEntity.isLock=state;
		var _this=this;
		if(state){
			_this.updateLockArea();
			Core.Events.addEvent(window,function(){
				_this.updateLockArea();
			},"resize");
		}
	},
	updateLockArea:function(){
		var p = this.getProperty();
		var win = Core.System.winSize();
		if (p.isFixed) {
			if(Core.Base.detect.$IE6){
				p.dragEntity.lockArea = {
					left: document.documentElement.scrollLeft,
					right: document.documentElement.scrollLeft + win.width,
					top: document.documentElement.scrollTop,
					bottom: document.documentElement.scrollTop + win.height
				};
								
				Core.Events.addEvent(window,function(){
					p.dragEntity.lockArea = {
						left: document.documentElement.scrollLeft,
						right: document.documentElement.scrollLeft + win.width,
						top: document.documentElement.scrollTop,
						bottom: document.documentElement.scrollTop + win.height
					};
				},"scroll");
			}else{
				p.dragEntity.lockArea = {
					left: 0,
					right: win.width,
					top: 0,
					bottom: win.height
				};
			}
		}else{
			p.dragEntity.lockArea = {
				left: 0,
				right: document.documentElement.scrollWidth,
				top: 0,
				bottom: document.documentElement.scrollHeight
			};
		}
		
	}
};