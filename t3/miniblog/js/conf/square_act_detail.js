/**
 * @author wangliang3@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
//common fucntion
$import("jobs/activity/validate.js");
//common job
$import("jobs/topTray.js");
$import("jobs/miniblog_search.js");
//$import("jobs/mod_forward.js");
$import("jobs/favourite.js");
$import("jobs/commentMethod.js");
$import("jobs/commentConsole.js");
$import('jobs/square_news_dropdown.js');
$import('jobs/miniblog_del.js');
$import('jobs/scaleimg.js');
$import('jobs/rightlist_follow.js');
$import("jobs/seevideo.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/publisher3.js");
//new jobs
$import("jobs/activity/act_info.js");
$import("jobs/activity/act_recommend.js");
$import("jobs/activity/act_pic_gliding.js");
$import("jobs/activity/act_delete.js");
$import("jobs/activity/act_feed_managent.js");

function main(){
    var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("splitLoadMedia");
	jobs.add("publisher3");
	jobs.add("pulley");
	jobs.add("square_news_dropdown");
	
	jobs.add("actInfo");
	jobs.add("actPicGliding");
    jobs.start();
}