/**
 * 验证用户登陆
 * - 运行scope.loginKit();会得到一个对象
 * - isLogin {Boolean} true/false 是否登陆
 * - isAdmin {Boolean} true/false 是否拥有当前页管理权限
 * - uid {Number} 登陆用户uid
 * @example 
 * var loginInfo = scope.isLogin();
 * var isLogin = loginInfo.isLogin;
 * var isAdmin = loginInfo.isAdmin;
 * @author liusong@staff.sina.com.cn
 * @return {"isLogin":true/false,"isAdmin":true/false,"uid":123456}
 */

scope.loginKit = function(){
	var documentCookie = document.cookie + ";";
	var supRegExp = ['SUP','=([^;]*)?;'].join("");
	var uidRegExp = ["(\\?|&)","uid","=([^&]*)(&|$)"].join("");
	var info = documentCookie.match(new RegExp(supRegExp ,'i'));
		info = (info)?info[1]||"":"";
		info = unescape(info);
	var uid = info.match(new RegExp(uidRegExp));
		uid = (uid)?uid[2]||"":"";
	var oid = scope["$oid"];
	return {
		"uid"     : uid,
		"isLogin" : !!uid,
		"isAdmin" : uid && oid && ( uid==oid )
	};
};

/**
 * 用户是否已经登陆
 * @return {Boolean} true/false;
 */
scope.$isLogin = function(){
	return scope.loginKit().isLogin;
};

/**
 * 用户是否拥有当前页面管理权限
 * @return {Boolean} true/false;
 */
scope.$isAdmin = function(){
	return scope.loginKit().isAdmin;
};
	
	

	