/**
 * @author yuwei
 * @fileoverview 老虎机游戏
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/slot_machine.js");
$import("jobs/suda.js");

function main(){
    var jobs = new Jobs();
    jobs.add("slot_machine");
	jobs.add("start_suda");
    jobs.start();
}