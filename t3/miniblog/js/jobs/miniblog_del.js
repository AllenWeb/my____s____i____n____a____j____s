$import("sina/sina.js");
$import("jobs/request.js");
$import("diy/dialog.js");
$import("diy/flyDialog.js");
$import("diy/Wipe.js");
$import("sina/core/dom/getXY.js");
$import("diy/check_login.js");
$import("jobs/mod_login.js");
/**
 * 删除微博
 * @param {Object} id 
 * single 是否为单条页，如果是则删除后跳转到mymblog.php
 */
App.miniblogDel = function(id,single,el){
	var pos = Core.Dom.getXY(el);
	var x = pos[0]-((200 - el.offsetWidth)/2);
	var y = pos[1]-(el.offsetHeight) - 70;
	var alert = App.PopUpConfirm().position(x,y);
	var alert1 = App.PopUpAlert().position(x,y);
	single  = (scope.$pageid == 'mblog')?true:false;
	var requestURL;
	var sText;
	if(scope.$feedtype == "isat"){
		requestURL = "/myat/delete.php";
		sText = $CLTMSG['CC2801'];
	}else{
		requestURL = "/mblog/delete.php";
		sText = $CLTMSG['CC2802'];
	}
	
	var cb = function(json){
		if(single){
			setTimeout(function(){location.href = "/mymblog.php"},400);
			return;
		}
		setTimeout(function(){
			var feed = $E("mid_"+id);
			App.Wipe(null, feed).wipe("down",false,function(){
				var oid;
				if(App.refurbishUpdate && !(/\/atme/.test(window.location+""))){
					App.refurbishUpdate.add(-1);
				}
				feed.parentNode.parentNode.removeChild(feed.parentNode);
			});
		},10);
	} ;
	var oData = {
		mid : id
	};
	var ecb = function(json){
		if(json && json.code){
			if(json.code=="M00009"){
				json.code = "M01160";
			}
			alert1.content(App.getMsg(json.code)).position(x,y+22).icon(1).wipe("up").lateClose(1500);	
		}
	};
	alert.content(sText).icon(4).yes(function(){
		if(!scope.loginKit().isLogin){
			App.ModLogin({
	            func: function(){
					Core.Events.fireEvent(el, "click");
	            }
      		});
			return;
		}
		App.doRequest(oData,requestURL,cb,ecb,"get");
	}).wipe("up",true)
};
