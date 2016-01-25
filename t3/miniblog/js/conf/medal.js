/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/medal.js");
$import("jobs/publisher_dialog.js");
$import("jobs/miniblog_search.js");
$import("jobs/medaldemo.js");
$import("jobs/pulley.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("pulley");
	jobs.add("medal");
	jobs.add("medaldemo");
	jobs.start();
}