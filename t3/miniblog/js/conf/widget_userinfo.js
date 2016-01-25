/**
 * @author xp
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/widget/widget_userinfo.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("widget_userinfo");
	jobs.add("start_suda");
	jobs.start();
}
