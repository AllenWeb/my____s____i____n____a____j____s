/**
 * @author haidong
 * 推荐用户
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/rightlist_follow.js");
$import("jobs/miniblog_follow.js");
$import("jobs/request.js");

/**
 * 关注推荐用户
 */
App.attention = function(uid,el){
	App.rightSideFollow(uid,el,function(){
		location.reload();
	});
	return false;
};

/**
 * 关注所有用户
 * @param {Object} uids
 * @param {Object} el
 */
App.attentionAll = function(uids,btn){
	url =  "/attention/aj_addfollow.php";	
	uids = scope.recommendId ||uids;
	function cb(){		
		for(var i = 0,len = uids.length, uid; uid = uids[i]; i++){
			var el = $E("recomm_"  + uid);
			if(el){
				var a  = el.getElementsByTagName("a")[0];	
				if(a){
					var newDom = document.createElement("SPAN");
					newDom.innerHTML = $CLTMSG['CD0004'];		
					el.replaceChild(newDom,a);
				}
			}		
		}
		$E("attAllBtn").style.visibility = "hidden";
		location.reload();		
	}
	App.followOperation({uid:uids.join(","),fromuid:scope.$uid},url,cb);	
	return false;
};

$registJob("recommuser",function(){
	var uids = scope.recommendId ;
	if(uids){
		var url = "attention/aj_checkattention.php";		
		var param = {
			uid: uids.join(",")
		}
		var cb = function(data,josn){
			var data = josn.uid;
			for(var i = 0,len = data.length; i< len; i++){
				var el = $E("recomm_"  + data[i]);						
				if(el){
					var a  = el.getElementsByTagName("a")[0];	
					if(a){
						var newDom = document.createElement("SPAN");
						newDom.innerHTML = $CLTMSG['CD0004'];		
						el.replaceChild(newDom,a);
					}
				}
			}		
		}		
		App.doRequest(param,url,cb);
	}
});
/**
 * 输入框获取焦点
 */ 
App.focusEditor = function(){	
	location.hash = "fbq";
	$E("publish_editor").focus();
	return false;
};
