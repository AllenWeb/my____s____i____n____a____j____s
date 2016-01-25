/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
//$import("jobs/base.js");
$import("jobs/searchuser.js");
$import("jobs/topTray.js");
$import('jobs/square_news_dropdown.js');
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("square_news_dropdown");
	jobs.add("start_suda");
	jobs.start();
}