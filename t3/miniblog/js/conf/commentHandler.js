/**
 * @author Liusong liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/miniblog_search.js");
$import("jobs/commentHandler.js");
$import("jobs/topic.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/getfocus.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/group_index.js");
$import("jobs/suda.js");
$import("diy/PopUpFace.js");
$import("jobs/anti_cheat_tips.js");

function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("topic");
	jobs.add("loadComment");
	jobs.add("init_commentList");
	jobs.add('init_input');
	jobs.add("hotsearch");
	jobs.add("bind_mobile_info");
	jobs.add("group_option");
	jobs.add("close_anti_cheat_tip");
	jobs.add("start_suda");
	jobs.start();
}