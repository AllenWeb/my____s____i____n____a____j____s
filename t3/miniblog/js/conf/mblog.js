/**
 * 	微博详细页
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/topic.js");
$import("jobs/mod_forward.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/scaleimg.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/favourite.js");
$import("jobs/miniblog_del.js");
$import("jobs/tag.js");
$import("diy/PopUpFace.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/suda.js");
$import("jobs/information_profile.js");
$import("jobs/medal.js");
$import("jobs/autopublish.js");
$import("jobs/publisher_dialog.js");
function main(){
    var jobs = new Jobs();
	jobs.add("splitLoadMedia");
    jobs.add("initSearch");
    jobs.add("topic");
    if (scope.$uid != "") {
        jobs.add("loadComment");
    }
    jobs.add('init_input');
    jobs.add("bind_mobile_info");
    jobs.add("ratateImage");
    jobs.add("set_tag");
	jobs.add("start_suda");
	if (scope.$uid === '') {
        jobs.add("information3");
        jobs.add("showCheckCode");
    }
	jobs.add("medal");
    jobs.start();
}
