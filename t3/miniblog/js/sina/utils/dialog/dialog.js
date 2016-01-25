/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName Dialog
 * @FileOverview 对话框类
 * @Author Random | YangHao@staff.sina.com.cn
 * @Created 2009-03-24
 */

$import("sina/utils/layer/layer.js");
$import("sina/utils/dialog/dialogPrototype.js");
$import("sina/utils/template.js");
$import("sina/core/base/parseParam.js");
$import("sina/core/system/winSize.js");
$import("sina/core/events/addEvent.js");
$import('sina/core/events/getEvent.js');
$import('sina/core/events/fixEvent.js');

var Dialog=function(tmpDialog,tmpWinDialog){
	var _this=this;
	_this.entity=null;
	_this.ifm=null;
	var Property={
		id:"",
		x:0,
		y:0,
		width:0,
		height:0,
		isFixed:false,
		dialogPrototype:new DialogPrototype(tmpDialog),
		title:"提示",
		icon:"01",
		windowDialogTemplate:tmpWinDialog,
		dialogTemplate:tmpDialog,
		
		/**
		*icon:"01" 叹号
	 	*icon:"02" 红叉
	 	*icon:"03" 绿勾
	 	*icon:"04" 问号
	 	**/
		iconSet:{
			"01":{"class":"gIcoC05","alt":"警告"},
			"02":{"class":"gIcoC06","alt":"失败"},
			"03":{"class":"gIcoC07","alt":"成功"},
			"04":{"class":"gIcoC08","alt":"询问"}
		},
		text1:"",
		text2:"",
		ok:"确认",
		cancel:"取消",
		funcOk:function(){},
		funcCancel:function(){},
		iframeId:"",
		url:"",
		name:""
	};
	
	this.getProperty = function(){
		return Property;
	};
	
	(function initialize(){
		var p = _this.getProperty();
		p.id=p.dialogPrototype.getProperty().id+"_dlg";
		_this.entity=p.dialogPrototype.entity;
		_this.ifm=p.dialogPrototype.ifm;
		p.width=parseInt(_this.entity.style.width);
	})();
	
};

Dialog.prototype={
	/**
	 * opts.x:[number]
	 * opts.y:[number]
	 */
	setPosition:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		this.getProperty().dialogPrototype.setPosition(opts);
	},
	
	/**
	 * opts.width:number
	 * opts.height:number
	 */
	setSize:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		p.dialogPrototype.setSize(opts);
	},
	
	/**
	 * opts.isFixed:[bool]
	 */
	setFixed:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		this.getProperty().dialogPrototype.setFixed(opts);
	},
	
	updateIfmSize:function(){
		this.getProperty().dialogPrototype.updateIfmSize();
	},

	
	/**
	 * opts.templateName:[string]
	 */
	setTemplate:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		p.dialogPrototype.setTemplate(opts);
	},
	
	/**
	 * opts.canDrag:[bool]
	 */
	setDrag:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		this.getProperty().dialogPrototype.setDrag(opts);
	},
	
	/***
	 * opts.title:[string]
	 * opts.icon:[string]("01"|"02"|"03"|"04")
	 * opts.text1:[string]
	 * opts.ok:[string]
	 * opts.funOk:[function]
	 * opts.width:[number]
	 * opts.height:[number]
	 */
	alert:function(opts){
		
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		
		var btnCloseId=p.id+"_ale_Close";
		var btnOkId=p.id+"_ale_Ok";
		
		var titleUI=p.windowDialogTemplate.template["alert"][p.windowDialogTemplate.alertName]["title"];
		var titleContent={titleName:p.title,btnCloseId:btnCloseId};
		this.setTitleContent({titleUI:titleUI,titleContent:titleContent});

		var UI=p.windowDialogTemplate.template["alert"][p.windowDialogTemplate.alertName]["content"];

		var content = {
			iconClass: p.iconSet[p.icon]["class"],
			iconAlt: p.iconSet[p.icon]["alt"],
			text1: p.text1,
			btnOkId: btnOkId,
			ok: p.ok
		};
		this.setContent({UI:UI,content:content});
		
		
		var win = Core.System.winSize();
		
		this.updateIfmSize();
		
		var _this=this;
		e = Core.Events.getEvent();//Core.Events.fixEvent();
		
		Core.Events.addEvent($E(btnCloseId),function(){
			_this.close();
		},"click");
		Core.Events.addEvent($E(btnCloseId),function(){
			if (e.keyCode == 13) {
				_this.close();
			}
		},"keydown");
		
		Core.Events.addEvent($E(btnOkId),function(){
			p.funcOk();
			_this.hidden();
		},"click");
		Core.Events.addEvent($E(btnOkId),function(){
			if (e.keyCode == 13) {
				_this.hidden();
			}
		},"keydown");
		this.show();
		
		var contentNode = $E(p.dialogPrototype.getProperty()["contentId"]);
		var contentArea = {
			width: contentNode.offsetWidth,
			height: contentNode.offsetHeight
		};
		this.setPosition({x:win.width/2-contentArea.width/2,y:win.height/2-contentArea.height/2});
		
		this.setSize({width:p.width,height:p.height});
		
		
	},
	
	/**
	 * opts.title:[string]
	 * opts.icon:[string]("01"|"02"|"03"|"04")
	 * opts.text1:[string]
	 * opts.text2:[string]
	 * opts.ok:[string]
	 * opts.cancel:[string]
	 * opts.funcOk:[function]
	 * opts.funCancel[function]
	 * opts.width:[number]
	 * opts.height:[number]
	 */
	confirm:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);

		var btnCloseId=p.id+"_cfm_Close";
		var btnOkId=p.id+"_cfm_Ok";
		var btnCancelId=p.id+"_cfm_Cancel";
		
		var titleUI=p.windowDialogTemplate.template["confirm"][p.windowDialogTemplate.confirmName]["title"];
		var titleContent={titleName:p.title,btnCloseId:btnCloseId};
		this.setTitleContent({titleUI: titleUI,titleContent: titleContent});
		
		var UI=p.windowDialogTemplate.template["confirm"][p.windowDialogTemplate.confirmName]["content"];
		var content = {
			iconClass: p.iconSet[p.icon]["class"],
			iconAlt: p.iconSet[p.icon]["alt"],
			text1: p.text1,
			text2: p.text2,
			btnOkId: btnOkId,
			btnCancelId:btnCancelId,
			ok: p.ok,
			cancel:p.cancel
		};
		this.setContent({UI:UI,content:content});
		
		var win = Core.System.winSize();
		this.updateIfmSize();
		
		var _this=this;
		e = Core.Events.getEvent();//Core.Events.fixEvent(Core.Events.getEvent());
		
		Core.Events.addEvent($E(btnCloseId),function(){
			_this.close();
		},"click");
		Core.Events.addEvent($E(btnCloseId),function(){
			if (e.keyCode == 13) {
				_this.close();
			}
		},"keydown");
		
		Core.Events.addEvent($E(btnCancelId),function(){
			p.funcCancel();
			_this.hidden();
		},"click");
		Core.Events.addEvent($E(btnCancelId),function(){
			if (e.keyCode == 13) {
				p.funcCancel();
				_this.hidden();
			}
		},"keydown");
		
		Core.Events.addEvent($E(btnOkId),function(){
			p.funcOk();
			_this.hidden();
		},"click");
		Core.Events.addEvent($E(btnOkId),function(){
			if (e.keyCode == 13) {
				p.funcOk();
				_this.hidden();
			}
		},"keydown");
		
		this.show();
		
		var contentNode = $E(p.dialogPrototype.getProperty()["contentId"]);
		var contentArea = {
			width: contentNode.offsetWidth,
			height: contentNode.offsetHeight
		};
		this.setPosition({x:win.width/2-contentArea.width/2,y:win.height/2-contentArea.height/2});
		
		this.setSize({width:p.width,height:p.height});
	},
	
	 /**
	  *  opts.title:[string]
	  *  opts.url:[string]
	  *  opts.name:[string]
	  *  opts.width:[number]
	  *  opts.height:[number]
	  */
	showIframe:function(opts){
		var p = this.getProperty();
		if(!opts.name){
			opts.name=this.getUniqueId().toString();
		}
		Core.Base.parseParam(p,opts);
		
		p.iframeId=p.id+"_ifm";
		var btnCloseId=p.id+"_ifm_Close";
		var loadStateId=p.id+"_ifm_loadState";
			
		var titleUI=p.windowDialogTemplate.template["iframe"][p.windowDialogTemplate.iframeName]["title"];
		var titleContent={titleName:p.title,btnCloseId:btnCloseId};
		this.setTitleContent({titleUI: titleUI,titleContent: titleContent});
		
		var UI=p.windowDialogTemplate.template["iframe"][p.windowDialogTemplate.iframeName]["content"];

		var content = {
			loadStateId:loadStateId,
			iframeId:p.iframeId,
			iframeUrl:p.url
		};
		
		this.setContent({UI:UI,content:content});
		$E(p.iframeId).style.display="none";
		
		// Fix FlashSoft 解除没有阴影的问题
		$E(p.iframeId).style.width = "100%";	
		
//		if (p.width) {
//			$E(p.iframeId).style.width = p.width+"px";	
//		}

		if(p.height){
			$E(p.iframeId).style.height = p.height+"px";
		}
		this.setSize({width:p.width,height:p.height});
		
		var win = Core.System.winSize();
		this.setPosition({x:win.width/2-p.width/2,y:win.height/2-p.height/2});
		this.updateIfmSize();
		
		var _this=this;
		Core.Events.addEvent($E(btnCloseId),function(){
			_this.close();
		},"click");
		Core.Events.addEvent($E(p.iframeId),function(){
			try {
				$E(loadStateId).style.display = "none";
				$E(p.iframeId).style.display = "";
			}catch(e){}
		},"load");

		this.show();
		
	},
	onShow:function(){
	},
	onClose:function(){
	},
	onHidden:function(){
	},
	
	/**
	 * opts.title:[Object]
	 */
	setTitleContent:function(opts){
		this.getProperty().dialogPrototype.setTitleContent(opts);
	},
	
	/**
	 * opts:content[Object]
	 */
	setContent:function(opts){
		this.getProperty().dialogPrototype.setContent(opts);
	},
	

	show:function(){
		this.getProperty().dialogPrototype.show();
		this.onShow();
	},
	close:function(){
		this.getProperty().dialogPrototype.close();
		this.onClose();
	},
	hidden:function(){
		this.getProperty().dialogPrototype.hidden();
		this.onHidden();
	},
	setOnDrag: function(func){
		this.getProperty().dialogPrototype.setOnDrag(func);
	},
	setAreaLocked:function(state){
		this.getProperty().dialogPrototype.setAreaLocked(state);
	},
	getUniqueId:function(){
		return parseInt(Math.random()*10000).toString()+(new Date).getTime().toString();
	}
};