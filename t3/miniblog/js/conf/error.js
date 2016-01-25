/*
 * miniblog首页js
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add('init_input');
    jobs.add("start_suda");
    jobs.start();
}
