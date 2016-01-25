/**
 * @author wangliang3@staff.sina.com.cn
 */
$import("jobs/pulley.js");

$registJob('actPicGliding', function(){
	var shell = $E('act_pic_gliding');
    var box = shell.parentNode;
	var width = 152;
    box.style.width = width*3 + "px";
    var items = shell.getElementsByTagName('li');
	var len = items.length;
	if (len > 3 && len < 9) {
		App.pulley($E('turn_left'), $E('turn_right'), box, items, shell, 1, width);
	}else if(len>=9){
		App.pulley($E('turn_left'), $E('turn_right'), box, items, shell, 3, width);
	}
});