/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/topic.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/indexMsgCallBack.js");
$import("jobs/favourite.js");
$import("jobs/miniblog_del.js");
$import("jobs/scaleimg.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import("jobs/publisher_dialog.js");
$import('jobs/miniblogcard.js');
$import('jobs/square_news_dropdown.js');
$import("jobs/square_hottopic.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("splitLoadMedia");
	jobs.add("initSearch");
	jobs.add("hotsearch");
	jobs.add("topic");
	jobs.add("loadComment");
	jobs.add("indexMsgCallBack");
	jobs.add('init_input');
	jobs.add("bind_mobile_info");
	jobs.add("miniblogCard");
	jobs.add("square_news_dropdown");
	jobs.add("square_hottopic");
	jobs.add("start_suda");
	jobs.start();
}