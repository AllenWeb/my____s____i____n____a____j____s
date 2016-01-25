/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/miniblog_search.js");
$import("jobs/square_top.js");
$import("jobs/publisher_dialog.js");
$import('jobs/miniblogcard.js');
$import('jobs/square_news_dropdown.js');
$import('jobs/class_dropdown.js');
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();	
	jobs.add("initSearch");
	jobs.add("init_input");
	jobs.add("square_top");
	jobs.add("miniblogCard");
	jobs.add("square_news_dropdown");
	jobs.add("start_suda");
	jobs.add("class_dropdown");
	jobs.start();
}
