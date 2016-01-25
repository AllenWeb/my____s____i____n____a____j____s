/**
 * @author yuwei@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/loginAction.js");
$import("jobs/widget_login2.js");
$import("jobs/inputHandler.js");
$import("jobs/cardtips.js");
$import("jobs/miniblog_widget.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("login");
	jobs.add('init_input');
	jobs.add("miniblog_widget");
	jobs.add("start_suda");
	jobs.start();
}
