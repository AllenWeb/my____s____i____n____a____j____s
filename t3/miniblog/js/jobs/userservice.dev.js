/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/miniblog_search.js");

function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.start();
}