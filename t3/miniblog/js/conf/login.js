/*
 * miniblog登录
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/login.js");
$import("jobs/inputHandler.js");
$import("jobs/cardtips.js");
$import("jobs/suda.js");
$import("jobs/langSelect.js");
$import("jobs/cache.js");

function main(){
	var jobs = new Jobs();
	jobs.add("login");
	jobs.add('init_input');
	jobs.add("start_suda");
	jobs.add("unlogin_cache");
	jobs.start();
}
