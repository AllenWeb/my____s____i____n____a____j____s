/**
 * @author haidong
 * 手机绑定
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/miniblog_mobile.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add("initPage");
    jobs.add('init_input');
    jobs.add("start_suda");
    jobs.start();
}
