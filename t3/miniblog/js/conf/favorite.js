/**
 * @author chibin |chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/publisher3.js");
$import("jobs/topic.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/scaleimg.js");
$import("jobs/pop_manage.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/miniblog_del.js");
$import("jobs/refurbishNumber.js");
$import("jobs/recommUser.js");
$import("jobs/favourite.js");
$import("jobs/group_index.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
	jobs.add("splitLoadMedia");
    jobs.add("initSearch");
    if (scope.$uid == scope.$oid) {
        jobs.add("publisher3");
        jobs.add("recommuser");
    }
    jobs.add("hotsearch");
    jobs.add("topic");
    jobs.add("loadComment");
    jobs.add("more");
    jobs.add('init_input');
    jobs.add("bind_mobile_info");
    jobs.add("refurbishNumber");
    jobs.add("group_option");
	jobs.add("start_suda");
    jobs.start();
}
