/**
 * @author sinadmin
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/maybefriend.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add("attention");
    jobs.add('init_input');
    jobs.add("bind_mobile_info");
    jobs.add("start_suda");
    jobs.start();
}
