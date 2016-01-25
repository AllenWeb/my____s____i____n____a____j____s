/**
 * @fileoverview 邮件通知设置
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/request.js");
$import("diy/curtain.js");
$import("diy/check.js");
//$import("msg/msg.js");
//$import("msg/clientmsg.js");
$import("diy/dialog.js");

$registJob('set_mail_notice',function(){
	var _addEvent	= Core.Events.addEvent;
	Core.Events.addEvent($E("set_mail"),function(){
		$E("talk").style.display = $E("talk").style.display!="none"?"none":"block";
	},'click');
	
	var oTip = $E("tip"),oError= $E("tip_fail");
	
	//-----------------------------------step1--------------------------------------
	var email = $E("email"),emailTip = $E("red_email"),tdCon = $E("tdCon");
	var initHTML = tdCon.innerHTML;
	function checkEmail(){
		if(App.checkEml(Core.String.trim(email.value))){
			emailTip.className = "cudTs4";
			tdCon.innerHTML = "";
			tdCon.style.display = "";
		}else{
			emailTip.className = "cudTs3";
			emailTip.style.display = ""; 
			tdCon.style.display = "";
			tdCon.innerHTML = initHTML;
		}
	}
//	_addEvent(email,checkEmail,'keyup');
	_addEvent(email,checkEmail,'blur');
	_addEvent(email,function(){
		if(Core.String.trim(email.value).length == 0){
			emailTip.style.display = ""; 
			emailTip.className = "cudTs";
			tdCon.style.display = "";
			tdCon.innerHTML = $SYSMSG['R01002'];
		}
	},'focus');
	_addEvent($E("submit_email"),function(){
		if(App.checkEml(Core.String.trim(email.value))){
			var oData = {
				email:Core.String.trim(email.value)
			};
			var sUrl = "http://t.sina.com.cn/person/mailnotice_active.php";
			App.doRequest(oData,sUrl,function(data,result){
				handleTip(oTip,result,function(){
					$E("step1").style.display = "none";
					$E("step2").style.display = "block";
					$E("show_email").innerHTML = Core.String.trim(email.value);
					var a = $E("step2").getElementsByTagName("A")[0];
					a.setAttribute("href",result.data);
					if(result.mail){
						a.innerHTML = '<em>'+ $CLTMSG['CD0090'].replace(/#\{mail\}/,'<span class="fb">'+result.mail+'</span>&nbsp;') +'</em>';
					}else{
						a.innerHTML = '<em>'+ $CLTMSG['CD0090'].replace(/#\{mail\}/,"") +'</em>';
					}
					
					
				});
			},function(result){
				handleTip(oError,result);
			});
		}
	},"click",false);
	
	//-----------------------------------step2--------------------------------------------
	_addEvent($E("resend_email"),function(){
		var sUrl = "http://t.sina.com.cn/person/mailnotice_active.php";
		request(sUrl);
	},'click');
	
	_addEvent($E("update_email"),updateEmail,'click',false);
	
	//-----------------------------------step3--------------------------------------------
	_addEvent($E("edit_email"),updateEmail,'click',false);
	_addEvent($E("unbind_email"),function(){
		App.confirm($CLTMSG["CD0091"],{icon:4,width:350,height:120,ok:function(){
			var sUrl = "http://t.sina.com.cn/person/mailnotice_unbind.php";
			
			//request(sUrl,updateEmail);
			//modify by Robin Young | yonglin@staff.sina.com.cn at 2010.08.18
			App.doRequest({},sUrl,function(data,result){
				if(result && result.code){
					var dialog = App.alert($SYSMSG[result.code],{icon:3,width:370,height:120,ok:function(){window.location.reload()}});
					setTimeout(function(){
						if(!dialog._distory){
							dialog.close();
							window.location.reload();
						}
					},2000);
				}
			},function(result){
				var dialog ;
				if(result && result.code){
					dialog = App.alert($SYSMSG[result.code],{icon:2,width:370,height:120});
				}else{
					dialog = App.alert($CLTMSG["CD0092"],{icon:2,width:370,height:120});
				}
				setTimeout(function(){
					if(!dialog._distory){
						dialog.close();
					}
				},2000);
			});
			//end modify by Robin Young
			
		}});
	},'click',false);
	
	//--------------------------------common util-----------------------------------------
	function request(sUrl,callback){
		App.doRequest({},sUrl,function(data,result){
			if(result && result.code){
				var dialog = App.alert($SYSMSG[result.code],{icon:3,width:370,height:120,ok:callback});
				setTimeout(function(){
					if(!dialog._distory){
						dialog.close();
					}
				},2000);
			}
		},function(result){
			var dialog ;
			if(result && result.code){
				dialog = App.alert($SYSMSG[result.code],{icon:2,width:370,height:120});
			}else{
				dialog = App.alert($CLTMSG["CD0092"],{icon:2,width:370,height:120});
			}
			setTimeout(function(){
				if(!dialog._distory){
					dialog.close();
				}
			},2000);
		});
	}
	
	function updateEmail(){
		$E("step1").style.display = "block";
		$E("step2").style.display = "none";
		$E("step3").style.display = "none";
		email.value = "";
		email.focus();
	}
	
	function handleTip(oTip,oResult,callback){
		if(oResult.code === "M00003"){
			App.ModLogin(null,$CLTMSG["CD0058"]);
			return;
		}
		oTip.style.display = "block";
		App.curtain.droop(oTip);
		setTimeout(function(){
			App.curtain.raise(oTip);
			oTip.style.cssText="display:none;";
			
			if(typeof callback === "function"){
				callback();
			}
		},1500);
	}
});