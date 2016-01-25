/**
 * @author Pjan | peijian@staff.sina.com.cn
 */
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/information_mail.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
$import("jobs/langSelect.js");
function main(){
	var jobs = new Jobs();
	jobs.add('init_input');
	jobs.add("informationMail");
	jobs.add("start_suda");
	jobs.start();
}
