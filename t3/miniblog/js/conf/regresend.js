/**
 * @author Pjan | peijian@staff.sina.com.cn
 */
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/inputHandler.js");
$import("jobs/regresend.js");
$import("jobs/cardtips.js");
$import("jobs/mod_login.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add('init_input');
	jobs.add("start_suda");
	jobs.start();
}