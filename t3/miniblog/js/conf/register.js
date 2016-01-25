/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/information2.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
$import("jobs/langSelect.js");
$import("jobs/mod_login.js");
function main(){
	
	var jobs = new Jobs();
	jobs.add('init_input');
	jobs.add("information2");
	jobs.add("showCheckCode");
	jobs.add("login1");
	jobs.add("start_suda");
	jobs.start();
}
