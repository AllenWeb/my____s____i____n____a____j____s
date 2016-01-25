/**
 * @fileoverview 运营专题活动--春晚
 * */
$import("sina/sina.js");
$import("sina/app.js");
$import('sina/core/events/addEvent.js');

$registJob('huodong',function(){
	var _addEvent = Core.Events.addEvent;
	
	scope.mod_login = function(){
		App.ModLogin({func:function(){
			window.location.reload(true);
		}},$CLTMSG["CC1601"]);
	};
	_addEvent($E("log_in"),function(){
		scope.mod_login();
	},"click");
});