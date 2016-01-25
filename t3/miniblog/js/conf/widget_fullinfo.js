/**
 * @author Liusong liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/miniblogWidgetInfomation.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("finishinfo");
	jobs.add("start_suda");
	jobs.start();
}