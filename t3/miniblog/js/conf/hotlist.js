/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/hotlist.js");
$import("jobs/topTray.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add("hotlist");
    jobs.add("initSearch");
    jobs.add("information");
    jobs.add('init_input');
    jobs.add("start_suda");
    jobs.start();
}
