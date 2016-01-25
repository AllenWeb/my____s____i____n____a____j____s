/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/operation/topics_widget.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("topics_widget");
	jobs.add("start_suda");
	jobs.start();
}