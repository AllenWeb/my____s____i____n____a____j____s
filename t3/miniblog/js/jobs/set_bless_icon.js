/**
 * @fileoverview 点亮祈福头像图标
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/request.js");
$import("diy/dialog.js");

$registJob("setBlessIcon",function(){
   /* var _addEvent = Core.Events.addEvent;
    var link ;
    if(link = $E("bless_2012")){
        var icon = link.getElementsByTagName("img")[0];
        _addEvent(link,function(){
            if(!scope.$uid){
                return App.ModLogin({func:function(){
                    window.location.reload(true);
                }},$CLTMSG["CC1601"]);
            }
            if(icon){
                if(icon.className.indexOf("greensilk_off")!=-1){
                    scope.setBlessIcon(function(){
                        icon.className = "greensilk_on";
                        window.open("http://t.sina.com.cn/huodong/qhdz2010");
                    });
                }else{
                    window.open("http://t.sina.com.cn/huodong/qhdz2010");
                }
            }
        },"click");
    }*/
});

scope._lock = false;

/**
 * 点亮祈福头像图标
 * @param{Funtion}cb
 * */
scope.setBlessIcon = function(cb){
    if(!scope._lock){
        scope._lock = true;
        var url = "/person/aj_light.php";
        App.doRequest({},url,function(data,result){
            scope._lock = false;
            if(typeof cb === "function"){
                cb(result);
            }else{
                callback(result);
            }
        },function(result){
            scope._lock = false;
            callback(result);
        },"GET","ajax");
        
        function callback(result){
            var dialog ,config = {icon:2,width:370,height:120};
            if(result && result.code){
                if(result.code === "A00006"){
                    config.icon = 3;
                }
                dialog = App.alert($SYSMSG[result.code],config);
            }else{
                dialog = App.alert($CLTMSG["CD0092"],config);
            }
            setTimeout(function(){
                if(dialog && !dialog._distory){
                    dialog.close();
                }
            },2000);
        }
    }
};