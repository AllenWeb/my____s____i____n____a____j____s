/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/mail/mail_follow.js");
$import("jobs/miniblog_flash_demo.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("flash_demo");
	jobs.add("follow_all");
	jobs.add("start_suda");
	jobs.start();
}