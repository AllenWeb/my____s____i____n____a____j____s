/*
 *@fileoverview : 操作日志 
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/diaryOption.js");
function main () {
	var odJob = new Jobs();
	
	odJob.add( "diaryJob" );
	odJob.start();
}
