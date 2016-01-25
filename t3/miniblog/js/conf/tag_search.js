/**
 * @author chibin
 × 标签搜索
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import('jobs/miniblogcard.js');
$import('jobs/square_news_dropdown.js');
$import("jobs/suda.js");

$import("diy/mb_dialog.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/topic.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/scaleimg.js");
$import("jobs/miniblog_del.js");
$import("jobs/favourite.js");
$import("jobs/rightlist_follow.js");
$import("jobs/publisher2.js");
$import("jobs/publisher_dialog.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/suda.js");
$import("jobs/information_profile.js");
$import("jobs/search_new/search_tag.js");
$import("jobs/square_tag.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("hotsearch");
	jobs.add('init_input');
	jobs.add("miniblogCard");
	jobs.add("start_suda");
	jobs.add('search_tag')
	jobs.add("square_tag");
	jobs.start();
}