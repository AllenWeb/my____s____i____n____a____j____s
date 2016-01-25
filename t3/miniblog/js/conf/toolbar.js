/**
 * @author chibin | chibin@staff.sina.com.cn
 * miniblog工具栏
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/toolbar.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add('init_input');
    jobs.add('toolbarinstall');
	jobs.add("start_suda");
    jobs.start();
}
