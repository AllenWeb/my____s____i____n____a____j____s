/**
 * @fileoverview 私信上下文
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/message.js");

$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/topic.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/refurbishNumber.js");
$import("jobs/group_index.js");
$import("jobs/anti_cheat_tips.js");
$import("jobs/msg_context.js");
$import("jobs/suda.js");

function main(){
    var jobs = new Jobs();
    jobs.add("contactlist");
    jobs.add("topic");
    jobs.add("initSearch");
    jobs.add('init_input');
    jobs.add("bind_mobile_info");
    jobs.add("refurbishNumber");
    jobs.add("group_option");
    jobs.add("close_anti_cheat_tip");
    jobs.add("msg_context");
    jobs.add("start_suda");
    jobs.start();
}
