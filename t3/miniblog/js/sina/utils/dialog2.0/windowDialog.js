/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName WindowDialog
 * @FileOverview 用户接口的对话框类(每个产品可以自己去实现)
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-05-15
 * @Updated 2009-06-01
 */

$import("sina/core/base/parseParam.js");
$import("sina/core/system/winSize.js");
$import("sina/core/system/getScrollPos.js");
$import('sina/core/events/getEvent.js');
$import("sina/utils/dialog2.0/dialog.js");
$import("sina/utils/dialog2.0/dialogManager.js");
$import("sina/utils/dialog2.0/backShadow.js");
$import("sina/utils/dialog2.0/customsDialog.js");
$import("sina/utils/dialog2.0/layerTemplate.js");
(function() {
	/**
	 * @param {Object} objTemplate 对话框模板的对象
	 * @param {Object} backShadow 对话框的阴影实例
	 */
	var WindowDialog=function(backShadow,objTemplate){
		this.template=objTemplate || {};
		
		//初始化对话框管理类的影阴对象
		DialogManager.backShadow=backShadow;
	};
	
	WindowDialog.prototype={
		/**
		 * 显示图标配置
		 *	"01":[!]
		 *  "02":[×]
		 *  "03":[√]
		 *  "04":[?]
		 */
		iconSet:{
			"01":{"class":"gIcoC05","alt":"警告"},
			"02":{"class":"gIcoC06","alt":"失败"},
			"03":{"class":"gIcoC07","alt":"成功"},
			"04":{"class":"gIcoC08","alt":"询问"}
		},
		
		/**
		 * @param {String}  text 对话框显示的文本
		 * @param {Object}  cfg 对话框的配置参数
		 * 						funcOk {Function} "确定"按钮执行的方法
		 * 						textOk {String} "确定"按钮的文本
		 * 						title {String} 标题
		 * 						icon {String} 显示图标 ["01","01","03","04"]
		 * 						width {Number} 宽度
		 * 						height {Number} 高度
		 * 						subText {String} 次级文本
		 * 
		 * @param {String}  name 对话框的名称
		 */
		alert:function(text,cfg,name){
			cfg=cfg||{};
			var dialog=DialogManager.create(this.template.alert || LayerTemplate.alert,name);
			var win = Core.System.winSize();
			var nodes=dialog.getNodes();
			
			
			
			dialog.show();
			
			dialog.setFixed(true);
			dialog.setAreaLocked(true);
			
			
			

			//按钮默认聚焦
			if (nodes.linkOk) {
				nodes.linkOk.focus();
				dialog.getProperty().focusNode = nodes.linkOk;
			}
			
			if (nodes.text) {
				nodes.text.innerHTML = text;
			}
			if (nodes.titleName) {
				nodes.titleName.innerHTML = cfg["title"] || "提示";
			}
			if (nodes.icon) {
				nodes.icon.className = cfg["icon"] ? this.iconSet[cfg["icon"]]["class"] : this.iconSet["01"]["class"];
				nodes.icon.alt = cfg["icon"] ? this.iconSet[cfg["icon"]]["alt"] : this.iconSet["01"]["alt"];
			}
			if (nodes.ok) {
				nodes.ok.innerHTML = cfg["textOk"] || "确定";
			}
			if (nodes.subText) {
				cfg["subText"] = cfg["subText"] || "";
				if (cfg["subText"] != "") {
					nodes.subText.innerHTML = cfg["subText"];
				}
			}
			dialog.setSize({
				width: cfg["width"] || nodes.content.offsetWidth,
				height: cfg["height"] || nodes.content.offsetHeight
			});
			dialog.setPosition({
				x: win.width / 2 - dialog.getProperty().width / 2,
				y: win.height / 2 - dialog.getProperty().height / 2
			});
			
			
			//节点事件绑定
			Core.Events.addEvent(nodes.btnOk, function(){
				if (cfg["funcOk"]) {
					cfg["funcOk"]();
				}
				dialog.close();
			}, "click");
			Core.Events.addEvent(nodes.linkOk, function(){
				var e = Core.Events.getEvent();
				if (e.keyCode == "13") {
					if (cfg["funcOk"]) {
						cfg["funcOk"]();
					}
					dialog.close();
				}
			}, "keydown");
			
			Core.Events.addEvent(nodes.btnClose, function(){
				dialog.close();
			}, "click");
			
			//取消关闭按钮的事件冒泡
			Core.Events.addEvent(nodes.btnClose, function(){
				var e = Core.Events.getEvent();
				e.cancelBubble = true;
			}, "mousedown");
		},
		
		
		/**
		 * @param {String}  text 对话框显示的文本
		 * @param {Object}  cfg 对话框的配置参数
		 * 						funcOk {Function} 点击"确定"按钮执行的方法
		 * 						textOk {String} "确定"按钮的文本
		 * 						funcCancel {Function} 点击"取消"按钮执行的方法
		 * 						textCancel {String} "取消"按钮的文本
		 * 						defaultButton {Number} 要聚焦的按钮，1 表示"确定"按钮默认聚焦，0 表示"取消"按钮默认聚焦，默认是"确定"按钮聚焦
		 * 						title {String} 标题
		 * 						icon {String} 显示图标 ["01","01","03","04"]
		 * 						width {Number} 宽度
		 * 						height {Number} 高度
		 * 						subText {String} 次级文本
		 * 
		 * @param {String}  name 对话框的名称
		 */
		confirm:function(text,cfg,name){
			cfg=cfg||{};
			var dialog=DialogManager.create(this.template.confirm || LayerTemplate.confirm,name);
			var win = Core.System.winSize();
			var nodes=dialog.getNodes();
			
			dialog.show();
			dialog.setFixed(true);
			dialog.setAreaLocked(true);
			
			
			

			//按钮默认聚焦
			if (cfg["defaultButton"] == 0) {
				if (nodes.linkCancel) {
					nodes.linkCancel.focus();
					dialog.getProperty().focusNode = nodes.linkCancel;
				}
			}
			else {
				if (nodes.linkOk) {
					nodes.linkOk.focus();
					dialog.getProperty().focusNode = nodes.linkOk;
				}
			}
			
			if (nodes.text) {
				nodes.text.innerHTML = text;
			}
			if (nodes.titleName) {
				nodes.titleName.innerHTML = cfg["title"] || "提示";
			}
			if (nodes.icon) {
				nodes.icon.className = cfg["icon"] ? this.iconSet[cfg["icon"]]["class"] : this.iconSet["01"]["class"];
				nodes.icon.alt = cfg["icon"] ? this.iconSet[cfg["icon"]]["alt"] : this.iconSet["01"]["alt"];
			}
			if (nodes.ok) {
				nodes.ok.innerHTML = cfg["textOk"] || "确定";
			}
			if (nodes.cancel) {
				nodes.cancel.innerHTML = cfg["textCancel"] || "取消";
			}
			if (nodes.subText) {
				cfg["subText"] = cfg["subText"] || "";
				if (cfg["subText"] != "") {
					nodes.subText.innerHTML = cfg["subText"];
				}
			}
			
			
			dialog.setSize({
				width: cfg["width"] || nodes.content.offsetWidth,
				height: cfg["height"] || nodes.content.offsetHeight
			});
			dialog.setPosition({
				x: win.width / 2 - dialog.getProperty().width / 2,
				y: win.height / 2 - dialog.getProperty().height / 2
			});
			
			
			//节点事件绑定
			Core.Events.addEvent(nodes.btnOk, function(){
				if (cfg["funcOk"]) {
					cfg["funcOk"]();
				}
				dialog.close();
			}, "click");
			Core.Events.addEvent(nodes.linkOk, function(){
				var e = Core.Events.getEvent();
				if (e.keyCode == "13") {
					if (cfg["funcOk"]) {
						cfg["funcOk"]();
					}
					dialog.close();
				}
			}, "keydown");
			
			Core.Events.addEvent(nodes.btnCancel, function(){
				if (cfg["funcCancel"]) {
					cfg["funcCancel"]();
				}
				dialog.close();
			}, "click");
			Core.Events.addEvent(nodes.linkCancel, function(){
				var e = Core.Events.getEvent();
				if (e.keyCode == "13") {
					if (cfg["funcCancel"]) {
						cfg["funcCancel"]();
					}
					dialog.close();
				}
			}, "keydown");
			
			Core.Events.addEvent(nodes.btnClose, function(){
				dialog.close();
			}, "click");
			
			//取消关闭按钮的事件冒泡
			Core.Events.addEvent(nodes.btnClose, function(){
				var e = Core.Events.getEvent();
				e.cancelBubble = true;
			}, "mousedown");

		},
		
		
		/**
		 * @param {Object}  cfg 对话框的配置参数
		 * 						title {String} 标题
		 * 						url {String} iframe的地址
		 * 						width {Number} 宽度
		 * 						height {Number} 高度
		 * 						fixed {Boolean}	是否使用Fixed方式显示,默认为false
		 * 
		 * @param {String}  name 对话框的名称
		 */
		showIframe:function(cfg,name){
			cfg=cfg||{};
		
			var dialog=DialogManager.create(this.template.iframe || LayerTemplate.iframe,name);
			var win = Core.System.winSize();
			
			var scroll_pos = Core.System.getScrollPos();
			
			var nodes=dialog.getNodes();
			
			dialog.show();
			dialog.setFixed(cfg.fixed);
			dialog.setAreaLocked(true);
			
			if (nodes.titleName) {
				nodes.titleName.innerHTML = cfg["title"] || "";
			}
			nodes.iframe.src=cfg["url"] || "about:blank";
			
			
			dialog.setSize({
				width: cfg["width"] || nodes.content.offsetWidth,
				height: cfg["height"] || nodes.content.offsetHeight
			});
			dialog.setPosition({
				x: win.width / 2 - dialog.getProperty().width / 2,
				y: win.height / 2 - dialog.getProperty().height / 2 + (cfg.fixed? 0: scroll_pos[0])
			});
			
			//节点事件绑定
			Core.Events.addEvent(nodes.iframe,function(){
				if (nodes.loadState) {
					nodes.loadState.style.display = "none";
				}
			},"load");
			
			Core.Events.addEvent(nodes.btnClose,function(){
				dialog.close();
			},"click");
			
			//取消关闭按钮的事件冒泡
			Core.Events.addEvent(nodes.btnClose,function(){
				var e = Core.Events.getEvent();
				e.cancelBubble=true;
			},"mousedown");
		},
		/**
		 * 创建自定义对话框
		 * @param {Object} cfg
		 * 					content 对话框的内容(支持模板方式)
		 * 					title 标题
		 * 					width 宽度
		 * 					height 高度
		 * 					help 帮助链接
		 * 					tpl 对话框的模板
		 * @param {String} name 对话框的名称
		 */
		createCustomsDialog:function(cfg,name){
			cfg=cfg||{};
			var customsDialog=new CustomsDialog(cfg.tpl || this.template.customs || LayerTemplate.customs,name);
			customsDialog.setContent(cfg.content || "");
			customsDialog.setTitle(cfg.title || "提示");
			customsDialog.setHelp(cfg.help || "");
			customsDialog.setSize(cfg.width || 320,cfg.height || 150);
			customsDialog.setClose("hidden");
			return customsDialog;
		},
		
		/**
		 * 获取指定名称的对话框实例
		 * @param {Object} name 对话框的名称
		 */
		getDialog:function(name){
			return DialogManager.getDialog(name);
		},
		
		/**
		 * 关闭指定名称的对话框实例
		 * @param {Object} name 对话框的名称
		 */
		close:function(name){
			DialogManager.close(name);
		}
	};
	
	Sina.Utils.WindowDialog=WindowDialog;
})();
