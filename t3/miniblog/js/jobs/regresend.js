/**
 * @author Pjan | peijian@staff.sina.com.cn
 */
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import('diy/check.js');
$import("diy/prompttip.js");

App.resendMail = function(){
	var _user = $E("user");
	window.location.href = 'reg/resend.php?user=' + _user.value + '&invitecode=' + $E("invitecode").value;
	return false;
	Utils.Io.Ajax.request('/reg/aj_resend.php', {
		'POST'		: {"user":_user.value,"invitecode":$E("invitecode").value},
		'onComplete': function(json){
			if(json.code == "A00006"){
				window.location.href = "/reg/afteresend.php?user=" + _user.value + "&invitecode=" + $E("invitecode").value;
			} else {
				App.alert($SYSMSG[json.code]);
			}
		},
		'onException': function(json){
			return false;
		},
		'returnType': 'json'
	});
};
