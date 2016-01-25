/**
 * @author Shin
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/check.js");
$import("diy/mb_dialog.js");
$import("sina/core/string/trim.js");
$import("jobs/base.js");
$import("diy/prompttip.js");
$import("diy/splitmail.js");
$import("diy/copy.js");
$import("jobs/miniblog_follow.js");
$import("jobs/toggle.js");
$import("diy/TextareaUtils.js");

App.defaultText = "";

App.mailInviteFriend = function(){
	var mail_input = $E("mail_input")	;
	var _mailBox = Core.String.trim(mail_input.value);
	var closeCB = function(){mail_input.focus();};
	if(_mailBox && (_mailBox != App.defaultText)){
		var mails = App.splitMail(_mailBox,[";","；"]);		
		for(var i =0,len = mails.length;i<len; i++){
			var mail = mails[i];
			if(!App.checkEml(mail)){
				var dia = App.alert($CLTMSG['CC2501']);
				dia.onClose = closeCB;
				return;
			}				
		}	
	}else {
		var dia = App.alert($CLTMSG['CC2502']);
		dia.onClose = closeCB;
		return;
	}
	Core.Events.removeEvent($E("mail_input_submit"),App.mailInviteFriend, "click");
	$E("mail_input_submit").className = "btn_notclick";
	_mailBox = _mailBox.replace(/；/ig,";");
	setTimeout(function(){
			Utils.Io.Ajax.request("/invite/aj_mailinvite.php",{
				"POST" : {
					"email" : _mailBox,
					icode   : $E("icode").value
				},
				"onComplete" : function (oResult){
					if(oResult.code=="A00006"){		
						App.alert($CLTMSG['CC2503'],{icon:3});
						setTimeout(function(){
							window.location.reload(true);
						},2000);
					}else{
						App.alert(oResult);
					}
					Core.Events.addEvent($E("mail_input_submit"),App.mailInviteFriend, "click");
					$E("mail_input_submit").className = "btn_normal";
				},
				returnType : "json"
			});	
		},500	
	);
};

App.showInviteLink = function(_url){
	var _randomId = "copy_invite_link" + (new Date().getTime());
	var _str = '\
		<div class="inviteLayer">\
	    	<p>'+$CLTMSG['CC2504']+'</p>\
	        <div class="inviteLayerInput">\
	        	<input id="' + _randomId + '" readonly="true" type="text" value="' + _url + '" class="PY_input" /><a class="btn_normal" id="' + _randomId + "copy" + '" href="javascript:void(0);"><em>'+$CLTMSG['CC2505']+'</em></span></a>\
	        </div>\
	        <p class="inviteLayer_tip">'+$CLTMSG['CC2506']+'</p>\
	    </div>';
	var _dialog = new App.Dialog.BasicDialog($CLTMSG['CC2507'],_str,{width:390,height:170,zIndex:100});
	
	Core.Events.addEvent($E(_randomId), function(){
		$E(_randomId).select();
	}, 'click');
	Core.Events.addEvent($E(_randomId), function(){
		$E(_randomId).select();
	}, 'mouseover');
	Core.Events.addEvent($E(_randomId + "copy"), function(){
		App.copyText($E(_randomId).value);
	}, 'click');
};

$registJob("mailboxfocus",function(){
	Core.Events.addEvent($E("mail_input"), function(){
		if($E("mail_input").value == App.defaultText){
			$E("mail_input").value = "";
		}
	}, 'focus');
	Core.Events.addEvent($E("mail_input"), function(){
		if($E("mail_input").value == ""){
			$E("mail_input").value = App.defaultText;
		}
	}, 'blur');
	/**
	if(parseInt((/([0-9]+)/.exec($E("leave_invite").innerHTML))[0]) > 0){
		Core.Events.addEvent($E("mail_input_submit"),App.mailInviteFriend, "click");
	} else {
		$E("mail_input_submit").className = "btn_notclick";
	}
	*/
	Core.Events.addEvent($E("mail_input_submit"),App.mailInviteFriend, "click");
	Core.Events.addEvent($E("copylink"),App.copyLink, "click");	
	
	Core.Events.addEvent($E('copytext'),function(){
		var input = $E('copytext');
		App.TextareaUtils.setCursor(input,0,input.value.length);
	});
});

/**
 * 复制链接
 * @param {Object} event
 */
App.copyLink = function(event){
	var copytext = $E("copytext");
	var sucStr   = $CLTMSG['CC2508']; 
	var options  = {icon:3};
	if(App.copyText(copytext.value) == false){
		sucStr   = $CLTMSG['CC2509'];
		options  = {icon:1};
	}
	App.flyDialog(sucStr,null,$E("copylink"),options);
	return false;
};

/**
 * 添加关注
 * @param {Object} uid
 * @param {Object} el
 */
App.mailfollow = function(uid,el){	
	var url =  "/attention/aj_addfollow.php";
	function cb(){
		el.parentNode.innerHTML = $CLTMSG["CC2510"];	
	}
	App.followOperation({uid:uid,fromuid:scope.$uid},url,cb);
	return false;
};
