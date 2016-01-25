/**
 * @author xinlin
 */

$import("sina/app.js");
$import("diy/dialog.js");
$import("sina/utils/template.js");

App.getMsg = function(msgCode, replace){
	if (msgCode === undefined) {
		return "";
	}
	if(typeof(msgCode) == "object"){
		msgCode = msgCode.code;
	}
	var msg = $SYSMSG[msgCode] || $CLTMSG[msgCode] || ("Error[" + msgCode + "]");
	if (replace) {
		var tmp = new Utils.Template(msg);
		return tmp.evaluate(replace);
	}
	else {
		return msg;
	}
};
