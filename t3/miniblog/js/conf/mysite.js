/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/myurl.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add('myurl');
	jobs.add('init_input');
	jobs.add("start_suda");
	jobs.start();
}