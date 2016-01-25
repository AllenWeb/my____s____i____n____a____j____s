/**
 * @author yuwei
 * @fileoverview 关闭私信和评论页的反欺诈提示(种植2个cookie:comment_cheat,msg_cheat,值为uid关闭2个提示)
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/cookie/cookie.js");

$registJob("close_anti_cheat_tip", function(){
    var addEvent = Core.Events.addEvent;
    if($E('close_comment_tip')){
        addEvent($E('close_comment_tip'), function(){
            if($E('anti_cheat_tip')){
                $E('anti_cheat_tip').style.display = "none";
            }
            Utils.Cookie.deleteCookie("comment_cheat");
            Utils.Cookie.setCookie('comment_cheat', "off", 360,'/','t.sina.com.cn' );
        }, "click", false);
    }
    if($E('close_msg_tip')){
        addEvent($E('close_msg_tip'), function(){
            if($E('anti_cheat_tip')){
                $E('anti_cheat_tip').style.display = "none";
            }
            Utils.Cookie.deleteCookie("msg_cheat");
            Utils.Cookie.setCookie('msg_cheat', "off", 360,'/','t.sina.com.cn' );
        }, "click", false);
    }
});