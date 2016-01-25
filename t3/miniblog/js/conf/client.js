/**
 * @author chibin
 * 
 * 手机客户端页面
 * 
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/mod_login.js");
$import("jobs/publisher3.js");
$import("jobs/inputHandler.js");
$import("jobs/pulley.js");
$import("jobs/client.js");

function main(){
    var jobs = new Jobs();
    jobs.add('client');
    jobs.start();
}