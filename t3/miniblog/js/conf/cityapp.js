/**
 * @author honglei li | honglei@staff.sina.com.cn
 */
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/information_city.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("information_city");
	jobs.add('init_input');
	jobs.add("start_suda");
	jobs.start();
}