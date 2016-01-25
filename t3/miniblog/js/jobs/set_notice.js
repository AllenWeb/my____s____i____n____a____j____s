/**
 * @fileoverview 通知设置
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/request.js");
$import("diy/curtain.js");
$import("sina/core/base/detect.js");

$registJob('set_notice',function(){
	Core.Events.addEvent($E("set_notice"),function(){
		$E("talk").style.display = $E("talk").style.display!="none"?"none":"block";
	},'click');
	var sUrl = "http://t.sina.com.cn/person/notice_post.php";
	if(scope.$pageid === "set_mail_notice"){
		sUrl= "http://t.sina.com.cn/person/mailnotice_modify_setting.php";
	}
	var new_comm = $E("new_comm"),new_msg = $E("new_msg"),new_atme = $E("new_atme"),new_fans = $E("new_fans");
	function handleTip(oTip,oResult){
		if(oResult.code === "M00003"){
			App.ModLogin(null,$CLTMSG["CD0058"]);
			return;
		}
		oTip.style.display = "block";
		App.curtain.droop(oTip);
		setTimeout(function(){
			App.curtain.raise(oTip);
			oTip.style.cssText="display:none;";//key!
			location.reload(true);
		},1500);
	}
	if($E("talk") && $E("notice")){
		var inputs = $E("talk").getElementsByTagName("input");
		var notice = $E("notice");
		var eles = $E('notice_yellow_tips').getElementsByTagName("LI");
		var nodes = [];
		for(var i = 0; i < 4; i += 1){
			nodes[i] = eles[i];//eles[i + 1];
		}
		var type = Core.Base.detect.$IE?"click":"change";
//		for(var index=0,len=inputs.length;index<len;index++){
        for(var index=0,len=nodes.length;index<len;index++){
			(function(i){
				Core.Events.addEvent(inputs[i],function(){
					if(inputs[i].checked){
						nodes[i].style.display = "";
						$E("notice").style.display = "";
						if(inputs[i].id=='new_atme' && $E('newaddtalk') ){
							$E('newaddtalk').style.display='';
						}
					}else{
						nodes[i].style.display = "none";
						if(!new_comm.checked && !new_msg.checked && !new_atme.checked && !new_fans.checked){
							$E("notice").style.display = "none";
						}
						if(inputs[i].id=='new_atme' && $E('newaddtalk')){
                            $E('newaddtalk').style.display='none';
                        }
					}
				},type,false);
			})(index);
		}
	}
	Core.Events.addEvent($E("submit"),function(){
		var oData = {};
		oData["new_comm"] = new_comm.checked ? 1 : 0;
		oData["new_msg"] = new_msg.checked ? 1 : 0;
		oData["new_fans"] = new_fans.checked ? 1 : 0;
		oData["new_atme"] = new_atme.checked ? 1 : 0;
		oData["lang"]     = $E("lang").value;
		var author = document.getElementsByName('atblogrelation');
		for(var i=0,len = author.length;i<len;i++){
			if(author[i].checked){
				oData['atblogrelation'] = author[i].value;
				break;
			}
		}
		var type = document.getElementsByName('atblogtype');
        for(var i=0,len = type.length;i<len;i++){
            if(type[i].checked){
                oData['atblogtype'] = type[i].value;
                break;
            }
        }
		var oTip = $E("tip"),oError= $E("tip_fail");
		App.doRequest(oData,sUrl,function(data,result){
			handleTip(oTip,result);
		},function(result){
			handleTip(oError,result);
		});
		
	},"click",false);
});