/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 */
/**
 * @fileoverview 渲染登录所需要的界面
 * @author stan | chaoliang@staff.sina.com.cn
 */
//- source file -
$import("sina/module/login/_login.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/class/create.js");
$import("sina/utils/url.js");
$import("sina/utils/dialog.js");
$import("sina/core/system/winSize.js");

$import("sina/productCommon/blog/dialog/dialogConfig.js");
$import("sina/module/login/login_template.js");
$import("sina/module/login/login_form_plus.js");
$import("sina/module/login/login_plus.js");

//- main -
Module.Login.LoginUI = Core.Class.create();
Module.Login.LoginUI.prototype = {
	initialize : function(){

	},
	show : function(callback, isFlash) {
		checkAuthor();
		// 如果已经登录，就直接回调
		if($isLogin){
			callback();
			return;
		}
		if(!Core.Events.getEvent()){
			isFlash = true;
		}
		this.callbackFunc = callback;
		var rdm = new Date().valueOf();
		var url = new Utils.Url("http://icp.cws.api.sina.com.cn/login/pflogin.html");
		if (this.callbackFunc) {
			url.setParam("callback", "true");
		}
		//url.setParam("rdm", rdm);
		var content = url.toString();
/*
//		if (scope.loginDialog == null) {
			
			var obj = {
				ad: true,
				drag: true,
				title: "通行证登录",
				shadow: 1
			};
			var func = {
				onDragStart: function(){
				//				$Debug("拖动开始！");
				},
				onDrag: function(){
				//				$Debug("拖动中！");
				},
				onDragEnd: function(){
				//				$Debug("拖动结束！");
				},
				onContentUpdate: function(){
				//				$Debug("更新内容！");
				},
				onPosUpdate: function(){
				//				$Debug("位置更新！");
				},
				onShow: function(){
					window.isLoginShow=true;
				//				$Debug("显示dialog！");
				},
				onHidden: function(){
					if (window.isLoginShow) {
						window.isLoginShow=null;
					}
				//				$Debug("隐藏dialog！");
				}
			};
			dialog = new Sina.Utils.dialog(obj, func);
			dialog.setHelp("http://blog.sina.com.cn/lm/help/2009/index.html");
//			dialog.setSize(300, 190);
			dialog.setIframe({
				"url": content,
				"width" : 390,
				"height" : "170"
			});
			if (isFlash) {
				dialog.setMiddle();
			}
			else {
				dialog.setMiddle();
			}
			dialog.show();
			scope.loginDialog = dialog;*/
			
			scope.loginDialog=winDialog.createCustomsDialog({
				content:Module.Login.template,
				title:"通行证登录",
				help:"http://blog.sina.com.cn/lm/help/2009/index.html",
				width:390,
				height:170
			});

			$callJob("init_loginForm_plus");
	
			scope.loginDialog.setClose("close");
			scope.loginDialog.show();
			scope.loginDialog.setMiddle();
			scope.loginDialog.setAreaLocked(true);
			scope.loginDialog.onClose=function(){
				$login = scope.login_interface.show.bind2(scope.login_interface);
			};
	},
	hide : function() {
//		关闭登录浮层;
	},
	callback : function(){
		this.hide();
		this.callbackFunc.call();
		this.callbackFunc = null;
	}
};
$registJob("init_loginUI", function () {
	$Debug("初始化登录");
	scope.login_interface = new Module.Login.LoginUI();
	$login = scope.login_interface.show.bind2(scope.login_interface);
});
