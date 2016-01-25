/**
 * @author wangliang3@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
//common fucntion
$import("jobs/topTray.js");
$import("jobs/activity/validate.js");
//common job
$import("jobs/miniblog_search.js");
$import('jobs/square_news_dropdown.js');

function main(){
    var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("square_news_dropdown");
    jobs.start();
}