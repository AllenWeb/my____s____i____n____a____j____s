/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("diy/dialog.js");

(function(){
	var fail = function(oJson){
			var msg = $CLTMSG["CD0036"];
			(typeof oJson == "object") && oJson.code && (msg=$SYSMSG[oJson.code]||msg);
			App.alert(msg);
		};
	var succ = function(json){
		if(json && json.code=="A00006"){
			setTimeout(function(){
				window.location.reload(true)
			},100);
			return false;
		}
		fail(json);
	};
	App.apply = function(url,key){
		Utils.Io.Ajax.request(url, {
			"POST"        : {
				"appkey" : key
			},
			"onComplete"  : succ,
			"onException" : fail,
			"returnType"  : "json"
		});
	};	
})();

