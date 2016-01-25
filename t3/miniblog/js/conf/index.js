/**
 * @author Pjan | peijian@staff.sina.com.cn
 */
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/login.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/cardtips.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add("login");
    jobs.add('init_input');
    jobs.add("bind_mobile_info");
    jobs.add("start_suda");
    jobs.start();
}
