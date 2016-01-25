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
$import('jobs/square_news_dropdown.js');
//new jobs
$import("jobs/activity/act_create.js");



function main(){
    var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("square_news_dropdown");
	//new jobs
	jobs.add("actCreate");
    jobs.start();
}