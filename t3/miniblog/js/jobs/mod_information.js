/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("jobs/base.js");
$import("diy/mb_dialog.js");
$import('diy/htmltojson.js');
$import('diy/provinceandcity.js');
$import('diy/querytojson.js');
$import('diy/check.js');
$import('diy/enter.js');


App.finishInformation = function(){
	window.location.href = '/person/full_info.php';
};