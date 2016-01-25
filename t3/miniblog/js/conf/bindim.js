/**
 * @author chibin chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/inputHandler.js");
$import("jobs/bindim.js");
$import("jobs/topTray.js");
$import("jobs/miniblog_search.js");
$import("jobs/suda.js");


function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add("init_input");
    jobs.add("bindimrobot");
    jobs.add("start_suda");
    jobs.start();
}
