/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 */
/**
 * @fileoverview 登录
 */
$import("sina/module/login/_login.js");
$import("sina/module/interface/interface_login.js");

//- code -
/**
 * 从登录接口返回登录情况
 * 		!本方法不做任何客户端验证方法
 * @param {Object} info
 * 		login_name
 *		login_pass
 *		login_remember
 *		login_check
 *		fromtype
 * @param {Function} callback 登录成功回调函数
 * 		onSuccess	成功时执行
 * 		onError		错误时执行
 * 		onFail		接口失败执行
 */
Module.Login.post = function (info, callback) {
	info = info || {};
	callback.onSuccess = callback.onSuccess || callback.onComplete || function () {};
	callback.onError = callback.onError || function () {};
	callback.onFail = callback.onFail || function () {};
	scope.Inter_Login.request({
		POST : info,
		onSuccess: function(_data){
			$Debug("login succ");
			callback.onSuccess(_data);
		},
		onError : function (_data) {
			$Debug(_data);
			callback.onError(_data);
		},
		onFail : function () {
			callback.onFail();
		}
	});
};
