/**
 * @author xinlin
 */
//$import("");
/**
 * 登陆通用模块,执行登陆提交，以及回调流程。传入参数，绑定回调即可
 * 
 * 注意此模块需要使用sso登陆脚本，请在页面中引入 http://i.sso.sina.com.cn/js/ssologin.js 脚本
 * @param {Object} cfg{
 * 	name	:	String,
 * 	pwd	:	String,
 * 	remb	:	Bool,
 * 	succ	:	Function 没有参数
 * 	error	:	Function 接收一个参数，为错误说明
 * }
 */

/**
 * @update by liusong@staff.sina.com.cn
 * + 如果没有加载 ssologin.js 则先追加 ssologin.js 再进行登陆操作
 * + $import("sina/utils/io/jsload.js");
 */

$import("sina/sina.js");
$import("sina/core/string/trim.js");
$import("jobs/fixelement.js");
//$import("msg/msg.js");
$import("sina/utils/cookie/cookie.js");
$import("jobs/setUsername.js");
//$import("sina/utils/io/jsload.js");

/**
 * 登陆模块弹出层，负微博的登录
 */
window.sinaSSOConfig = {
	"feedBackUrl"					:"http://"+window.location.hostname+"/ajaxlogin.php",
	"service"						:"miniblog",
	"domain"						:"sina.com.cn",
	"framelogin"					:"1",
	"pageCharset"					: "utf-8",
	"isCheckLoginState"				:false,
	"customLoginCallBack"			:function(){},
	"customUpdateCookieCallBack"	:function(){},
	"entry"				: "miniblog"
};

App.initLoginInput = function( oUserInput, text  ){
	if( oUserInput ){
		(function( sText, oInput, sValue ){
			oInput.style.color = "#999999";
			oInput.alt = oInput.title = sText;
			if( !sValue ){ oInput.value = sText }
			if( !oInput.binded ){
				Core.Events.addEvent( oInput, function(){
					oInput.style.color = "#333333";
					if(oInput.value==sText){ oInput.value = "" }
				}, "focus" );
				Core.Events.addEvent( oInput, function(){
					oInput.style.color = "#999999";
					if(oInput.value==""){ oInput.value = sText }
				}, "blur" );
				oUserInput.binded = true;
			}
		})((text?$SYSMSG[text]:$CLTMSG["R01008"]), oUserInput, oUserInput.value);
	}
	if (oUserInput && (Core.String.trim(oUserInput.value) == '' || oUserInput.value == ((text ? $SYSMSG[text] : $CLTMSG["R01008"])))) {
		App.setUsername(oUserInput);
	}
};

App.LoginAction = function(cfg){
	var login_name = Core.String.trim(cfg.name);
	var login_pwd = Core.String.trim(cfg.pwd);
	var login_remb = cfg.remb? "7" : "0";
	
	// check value
	if(!login_name){
		cfg.error($CLTMSG['CL0801']);
		return;
	}else if(!login_pwd){
		cfg.error($CLTMSG['CL0802']);
		return;
	}
	
	// sso login
	//if(!sinaSSOController){alert("SSO Login script is required!!!\n This page must include this script:http://i.sso.sina.com.cn/js/ssologin.js");return false;}
	
	var doLogin = function(){
		var Login = window.sinaSSOController;

		Login.customLoginCallBack = function(res){
			// login success
			if(res.result){
				Login.customLoginCallBack = function(){};
				//在cookie里面保存用户名
				//chibin modify 将cookie写死在t.sina.com.cn
				Utils.Cookie.setCookie('un', login_name, 240,'/','t.sina.com.cn' );
				cfg.succ();
			}
			else{
				cfg.error(res.reason,res.errno);
				login_pwd.value = "";
			}
			Login.customLoginCallBack = function(){};
			Login = null;
		}
		// 参数 用户名，密码，保存天数0-30天
		Login.login(login_name,login_pwd,login_remb);
	};

	if(typeof window.sinaSSOController!="undefined"){
		doLogin();
	}else{

		var d = document, j = d.createElement("script"), h = d.body, s = false;
		j.type = "text/javascript";
		j.charset = "UTF-8";
		j.src =  "http://tjs.sjs.sinajs.cn/t3/miniblog/static/js/sso.js";
		j.onload = j.onreadystatechange = function(){
			if(!s && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")){
				s = true;
				j.onload = j.onreadystatechange = null;
				setTimeout(doLogin, 1000);
			}
		}
		try {h.appendChild(j)}catch(e){}

		
//		Utils.Io.JsLoad.request("http://tjs.sjs.sinajs.cn/t3/miniblog/static/js/sso.js", {
//            onComplete: function(){
//				try{
//                	doLogin();
//				}catch(exp){
//					setTimeout(doLogin,1000);
//				}
//            },
//            onException: function(){
//            },
//            timeout: 30000
//        });
	}
	
};
