/**
 * @author haidong@staff.sina.com.cn
 * 邀请页
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/user_invite.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add("msn_invite");
	jobs.add("mail_invite");
	jobs.add("friend_invite");
	jobs.add("att_invite");	
	jobs.add("user_invite");
	jobs.add('init_input');
	jobs.add("start_suda");
	jobs.start();
}