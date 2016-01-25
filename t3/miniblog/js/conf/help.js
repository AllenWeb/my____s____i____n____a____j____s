/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/langSelect.js");
$import("jobs/suda.js");
$import("diy/help.js");
$import("jobs/topTray.js");
$import("jobs/miniblog_search.js");
function main(){
    var jobs = new Jobs();
    jobs.start();
}