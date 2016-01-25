/**
 * 音乐播放器
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/system/pageSize.js");
$import("diy/swfobject.js");
$import("diy/check_login.js");

$registJob("initMiniPlayer", function () {
	var params = {
		menu: "false",
		scale: "noScale",
		allowFullscreen: "true",
		allowScriptAccess: "always",
		bgcolor: "#f1f4fd"
	};
	var attributes = {
		"id":"MPlayer",
		"align":"middle",
		"style":"margin:0 auto"
	};

	var obj = {
		songUrl      : scope.songUrl,
		mblogContent : scope.mblogContent,
		mblogId      : scope.mblogId,
		title        : scope.title,
		artist       : scope.artist,
		yuekuUrl     : scope.yuekuUrl,
		mblogUrl     : scope.mblogUrl,
		url          : scope.url
	}

	with(document.body.style){
		width = "100%";
		margin = "0px";
		padding = "0px";
		overflow = "hidden";
		textAlign = "center"; 
		backgroundColor = "#f1f4fd";	
	}
	
	swfobject.embedSWF([scope.$BASESTATIC+"miniblog/static/swf/player/MPlayer.swf",Boot.getJsVersion()].join(""), "playerWarper", "734", "532", "10.0.0", scope.$BASESTATIC+"miniblog/static/swf/player/playerProductInstall.swf", obj, params, attributes);
	
	Core.Events.addEvent(window,function(event){
		try{
			swfobject.getObjectById("MPlayer").beforeunload();
		}catch(e){}
	},"beforeunload");
	
});