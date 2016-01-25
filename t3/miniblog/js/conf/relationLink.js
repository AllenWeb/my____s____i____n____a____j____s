/*
 *@fileoverview : 企业微薄——友情链接 
 * 
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/modifyLinkInfo.js");

function main () {
	var myJob = new Jobs();

	myJob.add("edit");
	myJob.start();
}
