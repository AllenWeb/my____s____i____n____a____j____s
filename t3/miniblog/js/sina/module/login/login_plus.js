/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 */
/**
 * 定义 Job —— 通行证登录 
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-15
 */
$import("sina/sina.js");
$import("sina/module/login/login_initSuggest_plus.js");
$import("sina/module/login/login_form_plus.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/events/getEvent.js");
$import("sina/utils/cookie/cookie.js");
$registJob("init_loginForm_plus", function(){

	Module.Login.initSuggest();
	Module.Login.Form.init();
	// 登录按钮的事件
//		var mylogin = new Module.Login.Validate();
	Core.Events.addEvent($E("login_button"), function(){
		$login();
	}, "click");
	
	// 取消按钮的事件
	/*Core.Events.addEvent($E("login_cancel"), function(){
		$Debug("cancel login!!!");
		if(parent.scope.loginDialog){
			parent.scope.loginDialog.hidden();
		}
	}, "click");*/
	Core.Dom.setStyle($E("login_error_msg"), "display", "none");
	// 监听密码输入框的回车事件
	Core.Events.addEvent($E("login_password"), function () {
		var _isError = (Utils.Cookie.getCookie("IS_ERROR") == "1");
		var _event = Core.Events.getEvent();
		if(_event != null && $E("login_password").value != ""){
			var _code = $MOZ ? _event.which : _event.keyCode;
			if(_code == 13 && _isError == false){
				$login();
				return;
			}
			else if(_code == 13){
				$E("login_vcode").focus();
			}
		}
	}, "keyup");
	Core.Events.addEvent($E("login_vcode"), function(){
		var _event = Core.Events.getEvent();
		if (_event != null && $E("login_vcode").value != "") {
			var _code = $MOZ ? _event.which : _event.keyCode;
			if (_code == 13) {
				$login();
				return;
			}
		}
	}, "keyup");
});