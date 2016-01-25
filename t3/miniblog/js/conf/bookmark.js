/**
 * @author chibin | chibin@staff.sina.com.cn
 * miniblog共享书签
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("diy/mb_dialog.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/sharebookmarks.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add('init_input');
    jobs.add('sharebookmarks');
    jobs.add("start_suda");
    jobs.start();
}
