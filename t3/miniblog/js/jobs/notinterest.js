$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/request.js");
$import("sina/core/events/addEvent.js");

//不感兴趣功能
App.notInterest = function(uid, dom){
	_url =  "/pub/aj_disincline.php";
	_type = /type=([a-z0-9A-Z]+)/.exec(window.location.href)?/type=([a-z0-9A-Z]+)/.exec(window.location.href)[1]:"all"; 
	
	function cb(json){
		while(dom.nodeName.toLowerCase(0) != "li"){
			dom = dom.parentNode;
		}
		var _ul = $E("guess_container");
		_ul.removeChild(dom);
		if(_ul.getElementsByTagName("LI").length == 0){
			App.changeYourLike();
		}
	}
	App.doRequest({"nuid":uid,"type":_type},_url,cb, function(){},"get");
};
//换一换功能
App.changeYourLike = function(page){
	_url = "/pub/aj_change.php";
	_type = /type=([a-z0-9A-Z]+)/.exec(window.location.href)?/type=([a-z0-9A-Z]+)/.exec(window.location.href)[1]:"all";
	_page = page||"";
	function cb(json){
		//window.location.reload(true);
		window.location.href=window.location.href.indexOf("&p=")==-1&&_page!==""?window.location.href+"&p="+_page:window.location.href.replace(/p=([0-9])/g,'p='+_page);
	}
	App.doRequest({"type":_type},_url,cb, function(){},"get");
};


//用于鼠标滑动显示功能操作
$registJob('bindMouseoverFunction',function(){
	var _lis = $E("guess_container").getElementsByTagName("LI");
	for(var i=0,len=_lis.length;i<len;i++){
		(function(dom){
			var _p = dom.getElementsByTagName("P")[2];
			Core.Events.addEvent(dom,function(){
				_p.style["display"] = "";
			},"mouseover");
			Core.Events.addEvent(dom,function(){
                                _p.style["display"] = "none";
                        },"mouseout");
		})(_lis[i]);
	}
});
