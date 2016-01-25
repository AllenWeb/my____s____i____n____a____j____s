/**
 * @ haidong | haidong@staff.sina.com.cn
 * @ 用户引导第二步
 */

$import("jobs/base.js");
$import("sina/core/function/bind2.js");

$registJob("guide3",function(){
	var btn = $E("intoblog");
	btn.onclick = function(){
		$E("open3rd").submit();
		return false;
	}
});
