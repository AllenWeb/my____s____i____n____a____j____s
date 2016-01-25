/*-------------------------------------------------
 * @fileoverview : 测试
 * @date : 2010-12-15 14:45:09
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/isTest.js");

function main () {
	
	var myJob = new Jobs();

	myJob.add("jobTest");
	myJob.start();
}
