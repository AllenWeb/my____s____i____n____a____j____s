/**
 * @author sinadmin
 */
$import("sina/sina.js");
$import("jobs/base.js");
$import("diy/enter.js");
$import("sina/core/events/fireEvent.js");
$import("sina/utils/url.js");
$import("diy/loginAction.js");
$import("jobs/fixelement.js");
$import("sina/core/events/stopEvent.js");
$import("diy/mb_dialog.js");
$import("sina/core/string/trim.js");
$registJob("login",function(){
	var submit = $E("login_submit_btn");
	var loginname	= $E("loginname");
	var password	= $E("password");
	var remusrname	= $E("remusrname");
	var login_form	= $E("login_form");
	if(!remusrname){
	    remusrname = {
	        'checked':true
	    };
	}
	//初始化用户名输入
	App.initLoginInput(loginname);
	
	var options = {
		zIndex:1010,
		ref:loginname,		
		offsetY:1,
		offsetX:1
	};	
	function checkForm(el,errStr){
		if(!Core.String.trim(el.value) || (el.value == el.title && el.title)){
			el.focus();			
			App.fixElement.setHTML(errStr,"",options);			
			return false;			 
		}else{
			App.fixElement.hidden();
		}
		return true;
	}	
		
	Core.Events.addEvent(submit,function(event){
		if(!checkForm(loginname,App.getMsg({code:"M00901"}))){
			return false;		
		}
		if(!checkForm(password,App.getMsg({code:"M00902"}))){
			return false;
		}else{
			App.LoginAction({
				name:loginname.value,
				pwd :password.value,
				remb:remusrname.checked,
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
					var redirect = scope.redirect ? Core.String.trim(scope.redirect) : "http://t.sina.com.cn/";
					location.replace(redirect);
				}
			}); 		
		}
		Core.Events.stopEvent(event);		
	},"click");
	
	//给form绑定键盘回车提交
	if(login_form){
		App.enterSubmit({
			parent : $E("password").parentNode,
			action : function(){
				Core.Events.fireEvent("login_submit_btn", 'click');
			}
		});
	}
	passcardOBJ.init(
		loginname,		
		{
			overfcolor: "#999",
			overbgcolor: "#e8f4fc",
			outfcolor: "#000000",
			outbgcolor: ""
		},
		password,
	parent);
	//chibin add for 360
	if(Core.String.trim(loginname.value)!='' && Core.String.trim(password.value)!=''){
		setTimeout(function(){Core.Events.fireEvent(submit,'click');},100);
	}
	if(scope.isActiveBack === true){
		App.fixElement.setHTML($CLTMSG['CY0115'],'',options);
		$E('mod_login_title').className = '';
		$E('mod_login_title').style.color = '#f00';
		$E('mod_login_title').style.fontWeight = 'bold';
	}
});


$registJob("login1",function(){
	var submit = $E("login_submit_btn1");
	var loginname	= $E("loginname1");
	var password	= $E("password1");
	var remusrname	= $E("remusrname1");
	var login_form	= $E("login_form1");
	if(!remusrname){
        remusrname = {
            'checked':true
        };
    }
	//初始化用户名输入
	App.initLoginInput(loginname, "CR0001");
	
	var options = {
		zIndex:1010,
		ref:loginname,		
		offsetY:1,
		offsetX:1
	};	
	function checkForm(el,errStr){
		if(!Core.String.trim(el.value) || (el.value == el.title && el.title)){
			el.focus();			
			App.fixElement.setHTML(errStr,"",options);			
			return false;			 
		}else{
			App.fixElement.hidden();
		}
		return true;
	}	
		
	Core.Events.addEvent(submit,function(event){
		if(!checkForm(loginname,App.getMsg({code:"M00901"}))){
			return false;		
		}
		if(!checkForm(password,App.getMsg({code:"M00902"}))){
			return false;
		}else{
			App.LoginAction({
				name:loginname.value,
				pwd :password.value,
				remb:remusrname.checked,
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
					var redirect = scope.redirect ? Core.String.trim(scope.redirect) : "http://t.sina.com.cn/";
					location.replace(redirect);
				}
			}); 		
		}
		Core.Events.stopEvent(event);	
	},"click");
	
	//给form绑定键盘回车提交
	if(login_form){
		App.enterSubmit({
			parent : password.parentNode,
			action : function(){
				Core.Events.fireEvent("login_submit_btn1", 'click');
			}
		});
	}
	passcardOBJ.init(
                loginname,
                {
                        overfcolor: "#999",
                        overbgcolor: "#e8f4fc",
                        outfcolor: "#000000",
                        outbgcolor: ""
                },
                password,
        parent);
});
