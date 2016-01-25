/**
 * 运营首页登陆
 * @author Liusong liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/loginAction.js");
$import("diy/mb_dialog.js");
$import("jobs/mod_login.js");
$import("jobs/fixelement.js");


$registJob("index_login", function () {
	
	var _p = {
		tipc : $E("index_login_error_tip_content"),
		tipp : $E("index_login_error_tip"),
		user : $E("index_login_user"),
		pass : $E("index_login_password"),
		remb : $E("index_login_remb"),
		ynlg : $E("YN_LOGIN"),
		subl : $E("index_login_submit")
	};
	
	if(_p.user){
		//初始化用户名输入
		App.initLoginInput(_p.user);
	}
	
	function showTip(){
		var tip = ""
	}
	
	function checkForm(el,errStr,fx,fy){
		if(!el.value || el.value==$SYSMSG["R01008"]){
			el.focus();
			el.className = "ipt-01 selected";
			//_p.tipp.style.display = "";
			//_p.tipc.innerHTML     = errStr;
			App.fixElement.setHTML(errStr,"",{ref:el,offsetX:fx,offsetY:fy});
			return false;			 
		}else{
			el.className = "ipt-01";
		}
		return true;
	}
	
	if(_p.subl){
		Core.Events.addEvent(_p.subl,function(){
			if(!checkForm(_p.user,$SYSMSG["M00901"],1,1)||!checkForm(_p.pass,$SYSMSG["M00902"],1,1)){
				return false;		
			}else{
				App.LoginAction({
					'name' : _p.user.value,
					'pwd' : _p.pass.value,
					'remb' : _p.remb.checked?"7":"0",
					'succ' : function(){
						window.location.reload();
					},
					'error' : function(reason,errno){
							var msg = "";
							if( errno == "4010"){					
								reason = App.getMsg({code:'R01011'});
								msg = App.getMsg("R01010", {mail:loginname.value});
							}else{											
								if(errno == "101" || errno == "5"){
									msg = App.getMsg({code:"R11111"});
								}
							}
							App.fixElement.setHTML(reason,msg,{ref:_p.user,offsetX:1,offsetY:1});							
					}
				});
			}
			return false;		
		},"click");
	}
	
	
	if(_p.ynlg){
		App.enterSubmit({
			parent : _p.ynlg,
			action : function(){
				Core.Events.fireEvent(_p.subl, 'click');
			}
		});
	}
});
/**
 * 首页手机登陆
 * @param {Object} el
 */
App.redirect = function(el){
	
	if(!scope.$uid){
		App.ModLogin({
			func:function(){
				location.href = "/setting/mobile";
			}
		});
		return false;
	}else{
		location.href = "/setting/mobile";
	}
}
