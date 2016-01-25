/**
 * @author Pjan | peijian@staff.sina.com.cn
 * miniblog头像上传
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("diy/mb_dialog.js");
$import("jobs/base.js");
$import("jobs/head4miniblog.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("minihead");
	jobs.add('init_input');
	jobs.add("start_suda");
	jobs.start();
}
