/**
 * @fileoverview 隐私设置
 * @author yuwei@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/privacy.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add('init_input');
	jobs.add("privacy");
	jobs.add("start_suda");
	jobs.start();
}