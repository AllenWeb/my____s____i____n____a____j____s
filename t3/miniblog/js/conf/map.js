/**
 * @author yuwei
 * @fileoverview 地图
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import("diy/mb_dialog.js");
$import("jobs/mod_login.js");

$import("diy/map.js");
$import("jobs/map.js");

function main(){
    var jobs = new Jobs();
    jobs.add("map");
    jobs.start();
}