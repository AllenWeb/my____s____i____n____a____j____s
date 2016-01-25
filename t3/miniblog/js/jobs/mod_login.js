/**
 * @author xinlin
 */
$import("sina/sina.js");
$import("diy/mb_dialog.js");
$import("sina/core/string/trim.js");
$import("sina/core/function/bind2.js");
$import("diy/enter.js");
$import("diy/loginAction.js");
$import('jobs/mod_register_login.js');
App.ModLogin = function(callBackFunction,title){
	var tit = title||$CLTMSG["CD0038"];
	//add by dimu 开发者平台跳到注册
	var regurl     =  /open\.t\.sina/.test(location.href) ? 'http://t.sina.com.cn/reg.php' : "/reg.php";
	//add by haidong 国际化
	regurl         += "?lang="+scope.$lang;
	var recoverurl = "http://login.sina.com.cn/cgi/getpwd/getpwd0.php?entry=sso";
	var rnd = (new Date()).getTime();
	var html = '<div class="loginLayer" id="login_wrap'+rnd+'">\
            	<table>\
                  <tbody>\
				  <tr>\
			      	   <th scope="row"/>\
	                        <td id="login_tip'+rnd+'"></td>\
	                    </tr>\
				  <tr>\
                    <th scope="row">' + $CLTMSG['CD0039'] + '&nbsp;&nbsp;</th>\
                    <td><span class="cInputBorder"><span class="cInputborderR"><input tabIndex="1" type="text" name="loginname" id="loginname'+rnd+'" class="inputType" style="width: 210px;"/></span></span></td>\
                    <td><a href="'+regurl+'" target="_blank">' + $CLTMSG['CD0040'] + '</a></td>\
                  </tr>\
                  <tr>\
                    <th scope="row">' + $CLTMSG['CD0041'] + '&nbsp;&nbsp;</th>\
                    <td><span class="cInputBorder"><span class="cInputborderR"><input tabIndex="2" type="password" name="password" id="password'+rnd+'" class="inputType" style="width: 210px;"/></span></span></td>\
                    <td><a href="'+recoverurl+'" target="_blank">' + $CLTMSG['CD0042'] + '</a></td>\
                  </tr>\
                  <tr>\
                    <th scope="row"/>\
                    <td><input type="checkbox" id="isremember'+rnd+'"  checked="checked"/>' + $CLTMSG['CD0043'] + '</td>\
                    <td/>\
                  </tr>\
                  <tr>\
                    <th scope="row"/>\
                    <td><a href="javascript:void(0);" id="login_submit'+rnd+'" class="btn_normal"><em>' + $CLTMSG['CD0044'] + '</em></a></td>\
                    <td/>\
                  </tr>\
                </tbody></table>\
            </div>';
	var cfg = {
		width:390,
		zIndex:1000
	};
	var dialog = new App.Dialog.BasicDialog(tit,html,cfg);
	var disableClass = "btn_notclick";
	var enableClass  = "btn_normal";
	var login_submit = $E("login_submit"+rnd);
	var login_tip    = $E("login_tip"+rnd);
	var loginname    = $E("loginname"+rnd);
	var password     = $E("password"+rnd);
	var isremember	 = $E("isremember"+rnd);
	
	var options = {
		zIndex:1010,
		ref:loginname,
		wrap:login_tip,
		offsetX:0,
		offsetY:1
	};	
	if(!$IE){
		options.offsetY = 10;
	}
	//初始化用户名输入
	App.initLoginInput(loginname);
	
	if(callBackFunction && callBackFunction.initErrorTip){//如果传入初始化错误提示
		App.fixElement.setHTML(callBackFunction.initErrorTip,"",options);	
	}
	
	function checkForm(el,errStr){
		if(!Core.String.trim(el.value) || (el.value == el.title && el.title)){
		    if(el && el.style && el.style.display !== "none"){
		        el.focus();
		    }
			App.fixElement.setHTML(errStr,"",options);			
			return false;			 
		}else{
			App.fixElement.hidden();
		}
		return true;
	}
	login_submit.onclick = function(){
		if(login_submit.className == disableClass){
			return false;
		}
		login_submit.className = enableClass;		
		if(!checkForm(loginname,App.getMsg({code:"M00901"}))){
			return false;
		}
		if(!checkForm(password,App.getMsg({code:"M00902"}))){
			return false;
		}
		App.LoginAction({
			name:loginname.value,
			pwd :password.value,
			remb:isremember.checked,
			error:function(reason,errno){
				var msg = "";
				if(errno == "4010"){					
					reason = App.getMsg({code:'R01011'});
					msg = App.getMsg("R01010", {mail:loginname.value});
				}else{											
					if(errno == "101" || errno == "5"){
						msg = App.getMsg({code:"R11111"});
					}
				}
				App.fixElement.setHTML(reason,msg,options);						
			},
			succ:function(){
				dialog.close();
				if(callBackFunction){
					scope.$uid = "123456";
					callBackFunction.func(callBackFunction.param);
				}else{
					location.reload();
				}
			}
		}); 		
	}
	//回车提交
	App.enterSubmit({
		parent : password.parentNode,
		action : function(){
			login_submit.onclick();
		}
	});
	/**
	 * 登录层下来框
	 */
	passcardOBJ.init(
		loginname,
		{
			overfcolor: "#999",
			overbgcolor: "#e8f4fc",
			outfcolor: "#000000",
			outbgcolor: ""
		},
		password,
		window
	);	
	return dialog;	
};
App.ModLogin = function(callBackFunction,title){
	if(App.modRunToRegisterOrLogin){
		App.modRunToRegisterOrLogin('login');
	}else{
		App.modRegisterAndLogin('login',false,callBackFunction);
	}
};


