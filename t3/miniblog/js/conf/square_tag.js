/**
 * @fileoverview 微博广场标签
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
$import('jobs/square_news_dropdown.js');
$import("jobs/suda.js");
$import("jobs/square_tag.js");

function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("hotsearch");
	jobs.add('init_input');
	jobs.add("miniblogCard");
	jobs.add("square_news_dropdown");
	jobs.add("start_suda");
	
	jobs.add("square_tag");
	jobs.start();
}