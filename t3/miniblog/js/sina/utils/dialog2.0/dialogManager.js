/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName DialogManager
 * @FileOverview 对话框多实例管理类
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-05-15
 * @Updated 2009-06-01
 */

$import("sina/sina.js");
$import("sina/utils/dialog2.0/dialog.js");
$import("sina/core/base/detect.js");

var DialogManager={
	dialogs:[],
	activeDialog:{},
	backShadow:null,
	
	/**
	 * 创建一个对话框实例并返回
	 * @param {String} tpl 要创建的对话框模板
	 * @param {String} name 要创建的对话框名称
	 */
	create:function(tpl,name){
		var _this=this;
		var dialog=new Dialog(tpl);
		this.dialogs.push(dialog);
		this.activeDialog=dialog;

		dialog.name=name || dialog.getUniqueID();
		dialog.entity.style.zIndex=1024;
		
		//当对话框的position="fixed"时，在对话框拖动的时候，实时更新坐标
		dialog.onDrag=function(){
			//修复IE6下fixed时改变位置后，滚动滚动条后位置会还原到初始状态的问题
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
		};
		
		
		dialog.onClose = function(){
			_this.removeDialog(this.name);
			_this.updateActiveDialog();
			_this.updateShadow();
			
			//将当前活动的dialog聚焦
			if(_this.activeDialog){
				_this.activeDialog.setFocus();
			}
			
		};
		dialog.onHidden = function(){
			this.isHidden=true;
			if(this==_this.activeDialog){
				_this.activeDialog=null;
			}
			_this.updateActiveDialog();
			_this.updateShadow();
			
			//将当前活动的dialog聚焦
			if(_this.activeDialog){
				_this.activeDialog.setFocus();
			}

		};
		dialog.onShow=function(){
			if (this.isHidden) {
				this.isHidden=false;
				//将当前显示的dialog移到栈顶
				var i,len=_this.dialogs.length;
				for(i=0;i<len;i++){
					if(_this.dialogs[i]==this){
						document.body.appendChild(_this.dialogs[i].entity);
						_this.dialogs.push(_this.dialogs[i]);
						_this.dialogs.splice(i,1);
					}
				}
				_this.activeDialog=this;
				_this.backShadow.show();
				_this.updateShadow();
			}
		};

		//更新阴影
		if (this.backShadow.isShow) {
			this.updateShadow();
		}else{
			this.backShadow.show();
		}
		dialog.hidden();
		return dialog;

	},
	
	/**
	 * 根据名称获取对话框实例
	 * @param {String} name 对话框的名称
	 */
	getDialog:function(name){
		var i=0,len=this.dialogs.length;
		for (i = 0; i < len; i++) {
			if (this.dialogs[i].name == name) {
				return this.dialogs[i];
			}
		}
	},
	
	/**
	 * 根据名称删除对话框
	 * @param {String} name 对话框的名称
	 */
	removeDialog:function(name){
		var i=0,len=this.dialogs.length;
		for (i = len-1; i >= 0; i--) {
			if (this.dialogs[i].name == name) {
				this.dialogs.splice(i,1);
				this.activeDialog=this.dialogs[this.dialogs.length-1];
				break;
			}
		}
	},
	
	/**
	 * 更新当前dialog,将栈中没有被隐藏的最后一个dialog设为当前的dialog
	 */
	updateActiveDialog:function(){
		var i,len=this.dialogs.length;
		for(i=len-1;i>=0;i--){
			if(!this.dialogs[i].isHidden){
				this.activeDialog=this.dialogs[i];
				break;
			}
		}
	},
	
	/**
	 * 更新阴影(移动阴影层到当前对话框的后面，如果没有当前对话框则隐藏阴影)
	 */
	updateShadow:function(){
		if(this.activeDialog && !this.activeDialog.isHidden){
			this.backShadow.insertBefore(this.activeDialog.entity);
			this.activeDialog.updateFixed();
		}else{
			this.backShadow.hidden();
		}
	},
	
	/**
	 * 关闭对话框
	 * @param {String} name 对话框的名称
	 */
	close:function(name){
		if(!name){
			if (this.activeDialog) {
				this.activeDialog.close();
			}
			return;
		}
		
		var i,len=this.dialogs.length;
		for(i=len-1;i>=0;i--){
			if(this.dialogs[i].name==name){
				this.dialogs[i].close();
				break;
			}
		}
	}
};
