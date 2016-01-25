/**
 * 邮件开通微博
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/mail/mail_information.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("mail_information");
	jobs.add("start_suda");
	jobs.start();
}