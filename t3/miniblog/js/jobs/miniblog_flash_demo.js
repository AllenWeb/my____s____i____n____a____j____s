/**
 * @fileoverview 弹出层中播放flash微博简介
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("diy/dialog.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/flash/swf.js");
$registJob("flash_demo",function(){
	Core.Events.addEvent($E("flashdemo"),function(){
		var config = {
			title:$CLTMSG['CC2901'],
			height:410,
			width:560,
			btns:[]
		};
		var dialog = App.customDialog("<div id='flash_container' style='width:100%;height:100%;'>test<div>",config);
		var falsh_url = "http://i1.sinaimg.cn/blog/miniblog/swf/tblog_video.swf";
		Utils.Flash.swfView.Add(falsh_url, "flash_container", "miniblog_demo", "100%", "100%", "8.0.0.0", "##FFFFFF", {}, {
	        scale: "noscale",
	        allowScriptAccess: "always"
	    });
	    
	},"click");
});

/**
 * 选择微博语言
 * @param{String}lang
 * */
scope.switchLanguage = function(lang){
    var language = scope.$lang === "zh" ? "zh-cn" : scope.$lang;
    if(scope.$lang === lang){
        return;
    }
    
    App.confirm($CLTMSG['CD0150'],{
        icon:4,
        width:360,
        ok:function(){
            Utils.Io.Ajax.request("/person/aj_select_lang.php",{
                "onComplete"  : function (oResult){
                    if(oResult.code === "A00006"){
                        window.location.reload(true);
                    }
                    if(oResult.code === "M00003"){
                        return App.ModLogin(null,$CLTMSG["CD0058"]);
                    }
                },
                "onException" : function(e){},
                "returnType"  : "json",
                "POST"        : {
                    'uid':scope.$uid,
                    'lang':lang
                }
            });
        },
        cancel:function(){}
    });
};