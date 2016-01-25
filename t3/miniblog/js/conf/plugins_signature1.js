/**
 * @desc 微博工具签名档设置页
 * @author dimu@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/mod_login.js");
$import("jobs/plugins/signature.js");
$import("jobs/inputHandler.js");
$import("jobs.langSelect");
function main(){
	var jobs = new Jobs();
	jobs.add("set_signature");
	jobs.add('init_input');
	jobs.add("initSearch");
	jobs.start();
	
}