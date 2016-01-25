/*
 * search
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("jobs/mod_login.js");
$import("jobs/topic.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import("jobs/notinterest.js");
$import('jobs/miniblogcard.js');
$import('jobs/square_news_dropdown.js');
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("splitLoadMedia");
	jobs.add("initSearch");
	jobs.add('init_input');
	jobs.add("topic");
	jobs.add("miniblogCard");
	jobs.add("bindMouseoverFunction");
	jobs.add("square_news_dropdown");
	jobs.add("start_suda");
	jobs.start();
}
