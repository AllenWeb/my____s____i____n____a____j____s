/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName CusomsDialog
 * @FileOverview 自定义对话框类
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-06-01
 */


$import("sina/sina.js");
$import("sina/utils/dialog2.0/dialog.js");
$import("sina/utils/dialog2.0/dialogManager.js");
$import("sina/core/system/winSize.js");
$import("sina/utils/template.js");
$import("sina/core/base/detect.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/system/getScrollPos.js");

/**
 * 自定义对话框类
 * @param {String} tpl 模板HTML
 * @param {String} name 对话框的名称
 */
function CustomsDialog(tpl,name){
	this._dialog=DialogManager.create(tpl,name);
	this._contentTemplate="";
	this.nodes={};
	
	var _this=this;
	
	(function initialize(){
		_this._dialog.onDrag = function(){
			//当对话框的position="fixed"时，在对话框拖动的时候，实时更新坐标
			if (Core.Base.detect.$IE6) {
					if (this.getProperty().isFixed) {
						this.setPosition({
							x: (parseInt(this.entity.style.left) - document.documentElement.scrollLeft),
							y: (parseInt(this.entity.style.top) - document.documentElement.scrollTop)
						});
					}
			}else{
				if (this.getProperty().isFixed) {
					this.setPosition({
						x: parseInt(this.entity.style.left),
						y: parseInt(this.entity.style.top)
					});
				}
			}
			
			_this.onDrag();
		};
		
		_this.updateNodes();
		
		//取消关闭按钮的事件冒泡
		Core.Events.addEvent(_this.nodes.btnClose,function(){
			Core.Events.getEvent().cancelBubble=true;
		},"mousedown");
		
	})();
	
	this._hiddenDialog=function(){
		_this.hidden();
	};
	this._closeDialog=function(){
		_this.close();
	};
}

CustomsDialog.prototype={
	/**
	 * 设置对话框的内容
	 * @param {String} tpl 内容的模板HTML
	 */
	setContent:function(tpl){
		this._contentTemplate=tpl;
		var tmp=new Utils.Template(this._contentTemplate);
		this.nodes.content.innerHTML=tmp.evaluate(this.getContentNodes("i"));
		this.updateNodes();
	},
	
	/**
	 * 设置对话框标题
	 * @param {String} title
	 */
	setTitle:function(title){
		if (this.nodes.titleName) {
			this.nodes.titleName.innerHTML = title;
		}
	},
	
	/**
	 * 设置对话框的帮助链接
	 * @param {String} help
	 */
	setHelp:function(helpLink){
		if(this.nodes.btnHelp){
			if(helpLink){
				this.nodes.btnHelp.style.display="";
				this.nodes.btnHelp.href = helpLink;
			}else{
				this.nodes.btnHelp.style.display="none";
			}
		}
	},
	
	/**
	 * 设置关闭模式
	 * @param {String} mode
	 * 					"hidden" 隐藏
	 * 					"close" 关闭(从页面移除)
	 */
	setClose:function(mode){
		var _this = this;
		if (_this.nodes.btnClose) {
			mode = mode || "hidden";
			switch (mode) {
				case "hidden":
					Core.Events.addEvent(_this.nodes.btnClose,_this._hiddenDialog,"click");
					break;
				case "close":
					Core.Events.addEvent(_this.nodes.btnClose,_this._closeDialog,"click");
					break;
			}
		}
	},
	
	/**
	 * 设置对话框的位置
	 * @param {Number} x
	 * @param {Number} y
	 */
	setPosition:function(x,y){
		this._dialog.setPosition({x:x,y:y});
	},
	
	/**
	 * 将对话框设置为居中
	 */
	setMiddle:function(){
		var win = Core.System.winSize();
		var scrollPos = Core.System.getScrollPos();
		var posTop=this._dialog.getProperty().isFixed ? 0 : scrollPos[0];
		var posLeft=this._dialog.getProperty().isFixed ? 0 : scrollPos[1];
		this._dialog.setPosition({
			x: win.width / 2 - this.nodes.content.offsetWidth / 2 + posLeft,
			y: win.height / 2 - this.nodes.content.offsetHeight / 2 + posTop
		});
	},
	
	/**
	 * 设置对话框的大小
	 * @param {Number} width 需要设置的宽度值
	 * @param {Number} height 需要设置的高度值
	 */
	setSize:function(width,height){
		this._dialog.setSize({width:width,height:height});
	},
	
	/**
	 * 设置对话框是否为fixed状态
	 * @param {Bool} state 状态值
	 */
	setFixed:function(state){
		this._dialog.setFixed(state);
	},
	
	/**
	 * 设置是否在对话框拖动的时候，将其锁定在屏幕可见范围内(要在show了之后使用。。。- -!)
	 * @param {Bool} state
	 */
	setAreaLocked:function(state){
		this._dialog.setAreaLocked(state);
	},
	
	/**
	 * 设置要聚焦的节点
	 * @param {Object} focusNode 要聚焦的节点对象
	 */
	setFocusNode:function(focusNode){
		this._dialog.getProperty().focusNode=focusNode;
	},
	
	/**
	 * 获取宽度
	 */
	getWidth:function(){
		return this._dialog.getProperty().width;
	},
	
	/**
	 * 获取高度
	 */
	getHeight:function(){
		return this._dialog.getProperty().height;
	},
	
	/**
	 * 获取X坐标
	 */
	getX:function(){
		return this._dialog.getProperty().x;
	},
	
	/**
	 * 获取Y坐标
	 */
	getY:function(){
		return this._dialog.getProperty().y;
	},
	
	/**
	 * 显示对话框
	 */
	show:function(){
		this._dialog.show();
		this.onShow();
	},
	
	/**
	 * 隐藏对话框
	 */
	hidden:function(){
		this._dialog.hidden();
		this.onHidden();
	},
	
	/**
	 * 关闭对话框
	 */
	close:function(){
		var _this=this;
		_this._dialog.close();
		_this.onClose();
		Core.Events.removeEvent(_this.nodes.btnClose,_this._hiddenDialog,"click");
		Core.Events.removeEvent(_this.nodes.btnClose,_this._CloseDialog,"click");
	},
	
	/**
	 * 更新当前的模板节点
	 */
	updateNodes:function(){
		this.nodes=this._dialog.getNodes();
		var contentNodes=this.getContentNodes();
		for(k in contentNodes){
			this.nodes[k]=contentNodes[k];
		}
	},
	
	/**
	 * 获取对话框内容区域内的模板节点
	 * @param {String} mode "o":返回对象的属性为dom对象(默认)
	 * 						"i":返回对象的属性为dom对象的ID
	 */
	getContentNodes:function(mode){
		var m=mode || "o";
		var pattern=/[^\{\}]+(?=\})/g;
		var i;
		var nodes={};
		var result = this._contentTemplate.match(pattern);
		if (result) {
			for (i = 0; i < result.length; i++) {
				var r = result[i];
				switch (m) {
					case "o":
						nodes[r] = $E(this.nodes.content.id + "_" + r);
						break;
					case "i":
						nodes[r] = this.nodes.content.id + "_" + r;
						break;
				}
			}
		}

		return nodes;
	},
	
	onDrag:function(){

	},
	onShow:function(){
		
	},
	onHidden:function(){
		
	},
	onClose:function(){
		
	}
};
