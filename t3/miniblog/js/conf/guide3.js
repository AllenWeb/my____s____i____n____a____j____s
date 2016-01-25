/**
 * @author sinadmin
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/miniblog_search.js");
$import("jobs/guide3.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add("guide3");
    jobs.add('init_input');
    jobs.add("start_suda");
    jobs.start();
}
