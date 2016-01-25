/**
 * @author liusong@staff.sina.com.cn
 * 
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/addEvent.js");
$import("diy/dialog.js");
$import("diy/htmltojson.js");
$import("diy/check.js");

$registJob("edit_information",function(){
	var _trim       = Core.String.trim;
	var _checkNick  = App.checkMiniName;
	var _htmlToJson = App.htmlToJson;
	var _addEvent   = Core.Events.addEvent;
	var _api        = "http://open.t.sina.com.cn/aj_saveuser.php";
	var _byteLength = Core.String.byteLength;
	
	var oConfig = {
		"name"   : "name",
		"site"   : "site",
		"phone"  : "phone",
		"mail"   : "mail",
		"type"   : "type",
		"nError" : "name_error",
		"sError" : "site_error",
		"pError" : "phone_error",
		"mError" : "mail_error"
	};
	
	var oElements = {
		"submit"            : $E("submit"),
		"cancel"			: $E("cancel_btn"),
		"systemInformation" : $E("system_information"),
		"wrapper"           : $E("wrapper"),
		"nError"            : $E(oConfig["nError"]),
		"sError"            : $E(oConfig["sError"]),
		"pError"            : $E(oConfig["pError"]),
		"mError"            : $E(oConfig["mError"]),
		"name"              : $E("d_name"),
		"site"              : $E("d_site"),
		"phone"             : $E("d_phone"),
		"mail"              : $E("d_mail")
	};
	
	var errorTip = function(el,info,allow){
		if(allow){
			el.className = "co_kd2 ok_color";
			el.innerHTML = "";
			return false;
		}
		el.className = "errorTs error_color";
		el.innerHTML = info;
		return true;
	};
	var navigateTo = function(){
			App.alert({"code":"A00006"});
			var clock = setTimeout(function(){
				window.location.href = "/index.php";
			},2000);
		};
	var succ = function(oJson){
			(typeof oJson == "object") && oJson.code=="A00006" && navigateTo();
		};
	var fail = function(oJson){
			var msg = $CLTMSG["CD0036"];
			(typeof oJson == "object") && oJson.code && (msg=$SYSMSG[oJson.code]||msg);
			App.alert(msg);
		};
	var submit = function(){
			var data = App.htmlToJson(oElements.wrapper);
			var allow = (check.name() && check.site() && check.phone() && check.mail());
			allow &&
			(function(){
				Utils.Io.Ajax.request(_api, {
					"POST"        : data,
					"onComplete"  : succ,
					"onException" : fail,
					"returnType"  : "json"
				});
			})();
		};
		//验证,时间紧,写一大坨先
		var check = {
			"name" : function(){
				var subKey = true;
				var errorInfo = "";
				var value = oElements.name.value;
				if(!value){
					subKey = false; 
					errorInfo= $CLTMSG['CL0807']
				}else if( !( /^[\w\u4e00-\u9fa5.]*$/.test( value ) && (!/^[_.]+|[_.]+$/.test( value )) )){
				//}else if(!App.checkMiniName(value) || /^[0-9]*$/.test(value)){
					subKey = false;
					errorInfo= $CLTMSG['CL0818']
				}else if (_byteLength(_trim(value))>20) {
					subKey = false;
					errorInfo= $CLTMSG['CL0814'];
				}else if( !( /^[\w\u4e00-\u9fa5.]*$/.test( value ) && (!/^[_.]+|[_.]+$/.test( value )) )){
					
				}
				if(errorTip(oElements.nError,errorInfo,subKey)){return false};
				return true;
			},
			"site" : function(){
				var subKey = true;
				var errorInfo = "";
				var value = oElements.site.value;
				if(!value){
					subKey = false;
					errorInfo="个人/公司网站不能为空";
				}else if(!App.checkURLoose(value)){
					subKey = false;
					errorInfo="你输入的个人/公司网站格式不正确.";
				}else if (_byteLength(_trim(value))>100) {
					subKey = false;
					errorInfo="不超过100个字符";
				}
				if(errorTip(oElements.sError,errorInfo,subKey)){return false};
				return true;
			},
			"phone" : function(){
				var subKey = true;
				var errorInfo = "";
				var value = oElements.phone.value;
				if(!value){
					subKey = false;
					errorInfo="联系电话不能为空";
				}else if(!/(\+86)?((^\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/.test(value)){
					subKey = false;
					errorInfo="你输入的联系电话格式不正确.";
				}
				if(errorTip(oElements.pError,errorInfo,subKey)){return false};
				return true;
			},
			"mail" : function(){
				var subKey = true;
				var errorInfo = "";
				var value = oElements.mail.value;
				if(!value){
					subKey = false;
					errorInfo="Email不能为空";
				}else if(!App.checkEml(value)){
					subKey = false;
					errorInfo="你输入的Email格式不正确.";
				}
				if(errorTip(oElements.mError,errorInfo,subKey)){return false};
				return true;
			}
		};
		var defData = App.htmlToJson(oElements.wrapper);
		var cancel = function(){
			var data = App.htmlToJson(oElements.wrapper);
			var go = function(){
				setTimeout(function(){
					window.location.href = "/index.php"; 
				},1)
				
			}
			for(var v in data){			
				if ( data[v] != defData[v] ) {
					App.confirm($CLTMSG['CF0104'], {
        				ok: function(){   go();     }	
					})
					return;
				}
			}
			go();
		}
		oElements.cancel && Core.Events.addEvent(oElements.cancel, cancel, "click");
		oElements.submit && Core.Events.addEvent(oElements.submit, submit, "click");
		oElements.name  && Core.Events.addEvent(oElements.name, check.name, "blur");
		oElements.site  && Core.Events.addEvent(oElements.site, check.site, "blur");
		oElements.phone && Core.Events.addEvent(oElements.phone, check.phone, "blur");
		oElements.mail  && Core.Events.addEvent(oElements.mail, check.mail, "blur");
});
