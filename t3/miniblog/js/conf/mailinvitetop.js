/**
 * @author sinadmin
 */
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/invitetop.js");
$import("jobs/suda.js");
function main(){
    var jobs = new Jobs();
    jobs.add('invitetop');
    jobs.add("start_suda");
    jobs.start();
}
