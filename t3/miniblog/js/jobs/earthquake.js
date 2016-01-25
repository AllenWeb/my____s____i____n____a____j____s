/**
 * @fileoverview 青海地震赈灾点亮专题
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/request.js");
$import("diy/dialog.js");
$import("jobs/set_bless_icon.js");

$registJob("earthquake",function(){
    var _addEvent = Core.Events.addEvent;
    
    var oBless = $E("bless");
    var oCount = $E("count");
    var oLogin = $E("login");
    _addEvent(oLogin,function(){
        return App.ModLogin({func:function(){
            window.location.reload(true);
        }},$CLTMSG["CC1601"]);
    },"click");
    
    _addEvent(oBless,function(){
        if(!scope.$uid){
            return App.ModLogin({func:function(){
                window.location.reload(true);
            }},$CLTMSG["CC1601"]);
        }
        
        
        App.publisherDialog.success = function(){
            var dialog = App.alert($CLTMSG['CD0151'],{icon:3});
            setTimeout(function(){
                if(dialog && !dialog._distory){
                    dialog.close();
                }
            },2000);
            App.publisherDialog.close();
            if(scope.$bless != '1'){
                var count = parseInt(oCount.innerHTML);
                oCount.innerHTML = isNaN(count) ? 1 : count + 1;
                scope.setBlessIcon(function(){
                    
                });
            }
            
        };
        App.publisherDialog.show($CLTMSG['CD0158']);
    },"click");
});

/**
 *@param{String}content
 * */
scope.publishBless = function(content){
    App.publisherDialog.show(content);
    App.publisherDialog.success = function(){
        var dialog = App.alert($CLTMSG['CD0151'],{icon:3});
        setTimeout(function(){
            if(dialog && !dialog._distory){
                dialog.close();
            }
        },2000);
        App.publisherDialog.close();
        if(!scope.$bless){
            scope.setBlessIcon(function(){
                
            });
        }
    };
};