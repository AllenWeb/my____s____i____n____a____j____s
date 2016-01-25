/**
 * @author Shin
 * 邀请页js
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/miniblog_search.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/mailinvite.js");
$import("jobs/user_invite.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add("msn_invite");
    jobs.add("mail_invite");
    jobs.add("initSearch");
    jobs.add('init_input');
    jobs.add('mailboxfocus');
    jobs.add("start_suda");
    jobs.start();
}
