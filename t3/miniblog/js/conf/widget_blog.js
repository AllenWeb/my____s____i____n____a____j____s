/**
 * @author Liusong liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/miniblogWidget.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("miniblog_widget");
	jobs.add("start_suda");
	jobs.start();
}


