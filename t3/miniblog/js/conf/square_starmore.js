/**
 * @fileoverview 微博广场-名人堂- 更多明星
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import('jobs/miniblogcard.js');
$import('jobs/square_star_more.js');
$import('jobs/square_news_dropdown.js');
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("hotsearch");
	jobs.add('init_input');
	jobs.add("miniblogCard");
	jobs.add("square_star_more");
	jobs.add("square_news_dropdown");
	jobs.add("start_suda");
	jobs.start();
}