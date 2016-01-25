/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 */
/**
 * @fileoverview 用户登录页面所需的程序模块
 */
//$import("msg/login.js");
//$import("blog/audioCheck.js");
$import("sina/module/login/_login.js");
$import("sina/utils/url.js");
$import("sina/core/class/create.js");
$import("sina/utils/cookie/cookie.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");

$import("sina/module/login/login_post.js");
$import("sina/msg/systemMSG.js");
$import("sina/msg/loginMSG.js");
//- code -
/**
 * @author stan | chaoliang@staff.sina.com.cn
 * @class 用户登录小页面的登录程序
 * 		主要是用户登录界面管理
 */

Module.Login.Form = {
	
	checkImageURL : "http://vlogin.blog.sina.com.cn/myblog/checkwd_image.php",
	/**
	 * 检查是否需要验证码
	 */
	isCheckImage : function() {
		this.checkImg = Utils.Cookie.getCookie("IS_ERROR") == "1";
	},
	reloadName : function() {
		var defaultName = Utils.Cookie.getCookie("remberloginname");
		if(defaultName != null && defaultName != ""){
			$E("login_username").value = unescape(unescape(defaultName));
			if ($E("login_save")) {
				$E("login_save").checked = true;
			}
		}
	},
	/**
	 * 添加验证码
	 */
	loadCheckImage : function() {
		var _this=this;
		this.isCheckImage();
		if(this.checkImg) {
			$Debug("需要输入验证码！");
			if ($E("login_ckimg").style.display == "none") {
				$E("login_ckimg").style.display = "";
			}
			this.reloadCheckImage();
			if (typeof scope.loginVcodeBinded == "undefined") {
				Core.Events.addEvent("reloadCode", function(){
					_this.reloadCheckImage();
					return false;
				},"click");
				Core.Events.addEvent("checkImg", this.reloadCheckImage.bind2(this),"click");
				scope.loginVcodeBinded = true;
			}
		}
	},
	/**
	 * 
	 */
	reloadCheckImage : function () {
		var chk_img_time = new Date().getTime();
		$E("checkImg").src = this.checkImageURL + "?" + chk_img_time;			
	},
	/**
	 * 检查输入是否合法
	 */
	check : function() {
		$E("login_error_msg").style.display = "none";
		var fg = true;
		var loginName = $E("login_username").value;
		var loginPass = $E("login_password").value;
		var loginCheck = $E("login_vcode").value;
		if(loginName == "") {
			$E("login_error_msg").innerHTML = "用户名为空";
			fg = false;
		}
		else{
			if(loginPass == "") {
				$E("login_error_msg").innerHTML = "密码为空";
				fg = false;
			}
			else{
				if(loginCheck == "" && this.checkImg) {
					$E("login_error_msg").innerHTML = "验证码为空";
					fg = false;
				}
				else{
				}
			}
		}
		if (!fg) {
			$E("login_error_msg").style.display = "";
		}
		this.resize();
		return fg;
	},
	logStart : function(handle) {
		this.handle = handle;
		if(this.check()){
			var info = {};
			info.loginname = $E("login_username").value;
			info.loginpwd = $E("login_password").value;
			if(this.checkImg){
				info.check_word = $E("login_vcode").value;
			}
			//if(parent.$CONFIG.$product != null){
			if($CONFIG.$product != null){
				//info.productid = scope.pid_map[parent.$CONFIG.$product];
				info.productid = scope.pid_map[$CONFIG.$product];
			}
			else {
				info.productid = scope.pid_map[$CONFIG.$product];
			}
			Module.Login.post(info, {
				onSuccess : this.parse.bind2(this),
				onError : this.parse.bind2(this),
				onFail : function () {
					$Debug("登录接口异常，请检查", "#F00");
				}
				});
		}
	},
	/**
	 * 解析登录状态码
	 * @param {Object} code
	 */
	parse : function(_data) {
		$Debug("parse... ");
		_data = _data || "";
		if(typeof _data == "string" || typeof _data.code != "undefined" && _data.code == "10011"){
			//parent.scope.loginDialog.hidden();
			scope.loginDialog.hidden();
			//种记住用户名的cookie
			if($E("login_save") && $E("login_save").checked){
				Utils.Cookie.setCookie("remberloginname", escape($E("login_username").value), 2400, "", "sina.com.cn");
			}
			else{
				Utils.Cookie.setCookie("remberloginname", "", 2400, "", "sina.com.cn");
			}
			if(this.callback){
				//parent.scope.login_interface.callback();
				scope.login_interface.callback();
//				parent.scope.loginDialog.hidden();
			}
			else if(this.handle){
				this.handle();
			}
			else{
				//parent.location.reload();
				window.location.reload();
			}

		}
		else if(typeof _data.code != "undefined" && _data.code == "00002"){
			//showError(code, {target : parent});
			showError(code, {target : window});
		}
		else{
			$E("login_password").value = "";
			$E("login_vcode").value = "";
			// 修复验证码错误时，会多次请求验证码的 BUG
			this.loadCheckImage();
			this.showError(_data.code);
		}
	},
	/**
	 * 显示错误信息
	 */
	showError : function(code) {
		var msg = $SYSMSG[code] || "";
		$E("login_error_msg").style.display = "";
		$E("login_error_msg").innerHTML = msg;
		this.resize();
	},
	/**
	 * 改变passcard大小
	 */
	resize: function(){
		//parent.scope.loginDialog.setHeight(document.body.scrollHeight);
//		$Debug("改变对话框大小");
		return;
},
	init : function () {
		$login = Module.Login.Form.logStart.bind2(this);
//		audioCheck.render("audioCheckCon");
		this.reloadName();
		this.loadCheckImage();
		//this.callback = new Utils.Url(location.href).getParam("callback");
		this.callback=scope.login_interface.callbackFunc;
//		this.resize();
	}
};
