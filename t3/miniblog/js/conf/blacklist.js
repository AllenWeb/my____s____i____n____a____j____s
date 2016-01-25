/**
 * @author yuwei@staff.sina.com.cn
 * @fileoverview 黑名单管理页
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/inputHandler.js");
$import("jobs/topTray.js");
$import("jobs/miniblog_search.js");
$import("jobs/set_blacklist.js");
$import("jobs/suda.js");

function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add("init_input");
    jobs.add("start_suda");
    jobs.start();
}
