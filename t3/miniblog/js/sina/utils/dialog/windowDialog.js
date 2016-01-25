/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName WindowDialog
 * @FileOverview 用户接口的对话框类
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 */

$import("sina/core/base/parseParam.js");
$import("sina/utils/dialog/dialog.js");
$import("sina/core/base/detect.js");
$import("sina/utils/backShadow.js");
$import("sina/utils/layer/layerManager.js");

var WindowDialog=function(tmpDialog,tmpWinDialog,backShadowOpacity){
	var _this=this;
	var Property = {
		layerManager:new LayerManager(),
		backShadow:new BackShadow(backShadowOpacity),
		dialogTemplate:tmpDialog,
		windowDialogTemplate:tmpWinDialog,
		icons:null
	};
	
	
	this.getProperty = function(){
		return Property;
	};
	(function initialize(){
		var p=_this.getProperty();
		
		p.backShadow.entity.style.zIndex=1024;
		
		p.backShadow.hidden();
	})();
	
};

WindowDialog.prototype={
	beforeShow:function(){
		var _this=this;
		var p = this.getProperty();
		var d=new Dialog(p.dialogTemplate,p.windowDialogTemplate);
		if(p.icons){
			d.getProperty().iconSet=p.icons;
		}
		
		d.entity.style.zIndex=1024;
		
		p.layerManager.addLayer(d);
		d.setFixed({isFixed:true});
		d.setAreaLocked(true);
		d.setOnDrag(function(){
			if (d.getProperty().isFixed) {
				d.setPosition({
					x: (parseInt(d.entity.style.left) - document.documentElement.scrollLeft),
					y: (parseInt(d.entity.style.top) - document.documentElement.scrollTop)
				});
			}
		});
		d.onClose=function(){
			_this.clearUp(this);
			_this.onClose();
		};
		d.onHidden=function(){
			_this.clearUp(this);
			_this.onHidden();
		};
		d.onShow=function(){
			_this.onShow();
		};
		if(p.backShadow.isShow){
			p.backShadow.insertBefore(p.layerManager.activeLayer.entity);
		}else{
			p.backShadow.show();
		}
	},
	alert:function(opts){
		this.beforeShow();
		var p = this.getProperty();
		p.layerManager.activeLayer.alert(opts);
	},
	
	confirm:function(opts){
		this.beforeShow();
		var p = this.getProperty();
		p.layerManager.activeLayer.confirm(opts);
	},
	showIframe:function(opts){
		this.beforeShow();
		var p = this.getProperty();
		p.layerManager.activeLayer.showIframe(opts);
	},
	closeIframe:function(iframeName){
		var p = this.getProperty();
		var isClosed=false;
		for(var i=p.layerManager.layers.length-1;i>=0;i--){
			if(p.layerManager.layers[i].getProperty().name==iframeName){
				p.layerManager.layers[i].hidden();
				isClosed=true;
			}
		}
		//如果没有对应的name则删除最后打开的Iframe
		if(!isClosed){
			for (var i = p.layerManager.layers.length - 1; i >= 0; i--) {
				if(p.layerManager.layers[i].getProperty().name){
					p.layerManager.layers[i].hidden();
					break;
				}
			}
		}
	},
	setIframeSize:function(iframeName, nWidth, nHeight) {
		var p = this.getProperty();
		for(var i=p.layerManager.layers.length-1;i>=0;i--){
			if(p.layerManager.layers[i].getProperty().name==iframeName){
				p.layerManager.layers[i].setSize({
					width: nWidth,
					height: nHeight
				});
				var iframeNode = $E(p.layerManager.activeLayer.getProperty().iframeId);
				if (nWidth) {
					iframeNode.style.width = nWidth+"px";
				}
				if(nHeight){
					iframeNode.style.height = nHeight+"px";
				}
			}
		}
	},
	clearUp:function(oDlg){
		var p = this.getProperty();
		p.layerManager.removeLayer(oDlg);
		// 修复IE丢失光标问题
//		if (!Core.Base.detect.$IE6) {
		var iframes = oDlg.entity.getElementsByTagName("iframe");
		for(var i = 0; i < iframes.length; i ++ ) {
			try{
				iframes[i].src = "";
			}catch(e){}
		}
		document.body.removeChild(oDlg.entity);
//		}
		oDlg.entity=null;
		if (oDlg.ifm) {
			document.body.removeChild(oDlg.ifm);
			oDlg.ifm=null;
		}
		if(p.layerManager.activeLayer){
			p.backShadow.insertBefore(p.layerManager.activeLayer.entity);
		}else{
			p.backShadow.hidden();
		}
	},
	setIcons:function(objIcons){
		this.getProperty().icons=objIcons;
	},
	onShow:function(){
	},
	onClose:function(){
	},
	onHidden:function(){
	}
};

Sina.Utils.WindowDialog=WindowDialog;