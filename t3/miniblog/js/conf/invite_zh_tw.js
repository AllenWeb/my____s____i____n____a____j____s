/**
 * @fileoverview 繁体邀请页
 * @author yuwei
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("diy/dialog.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
	jobs.add("start_suda");
	jobs.start();
}
/**
 * 选择微博语言
 * @param{String}lang:"zh-cn" or "zh-tw"
 * */
scope.switchLanguage = function(lang){
    App.confirm($CLTMSG['CD0150'],{
        icon:4,
        width:360,
        ok:function(){
            Utils.Io.Ajax.request("/person/aj_select_lang.php",{
                "onComplete"  : function (oResult){
                    if(oResult.code === "A00006"){
                        window.location.href = "/" + scope.$uid;
                    }else if(oResult.code === "M00003"){
                        return App.ModLogin(null,$CLTMSG["CD0058"]);
                    }else{
                        App.alert($SYSMSG[oResult.code]);
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