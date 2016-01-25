/**
 * @author dmfeng dimu.feng@staff.sina.com.cn
 */
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/miniblog_search.js");
$import("jobs/logostandard.js");
$import("jobs/topTray.js");
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("bindLogoBoxShow");	
	$import("jobs/suda.js");
	jobs.start();
}