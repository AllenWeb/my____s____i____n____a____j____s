/**
 * @author Pjan
 * 获取已登录保存在cookie的用户名
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/cookie/cookie.js");
//$import("msg/clientmsg.js");

App.setUsername = function(id){
	var _username_input = $E(id);
	var _username = "";
	if(_username_input){
		if(_username_input.value == $CLTMSG["R01008"] || _username_input.value == $CLTMSG["CR0001"]){
			_username = Utils.Cookie.getCookie("un");
			if(_username){
				_username_input.value = unescape(_username);
				return true;
			}
		}
	}
	return false;
};
