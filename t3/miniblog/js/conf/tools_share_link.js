/**
 * @author liusong@staff.sina.com.cn
 */

$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/tools_share_link.js");
$import("jobs/publisher_simple.js");
$import("sina/core/dom/getLeft.js");
$import("jobs/suda.js");

function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add('init_input');
	jobs.add("tools_share_link");
	jobs.add("publisher_simple1");
	jobs.add("start_suda");	
    jobs.start();
}