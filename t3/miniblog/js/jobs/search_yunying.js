/**
 * @author haidong
 * 通用鼠标焦点事件
 */

$import("sina/sina.js");
/**
 * 鼠标失去或获得焦点
 * @param {Object} event
 * @param {Object} el
 * @param {Object} txt
 */
App.focusblur = function(event,el,txt){
	el = $E(el);
	txt = txt || $CLTMSG['CD0008'];
	event = event || window.event;
	if(event.type == "focus"){
		if(el.value == txt){
			el.value = "";
		}
	}
	if(event.type == "blur"){
		if(el.value == ""){
			el.value = txt;
		}
	}	
};

$registJob("hotsearch",function(){
	$E('y_submit').onclick = function(){
		var value = Core.String.trim($E('y_keyword').value);
		if(value.length === 0){
			return false;
		}
		location.href = "/k/" + encodeURIComponent(value);
	};
	$E('z_submit').onclick = function(){
		var value = Core.String.trim($E('y_keyword').value);
		if(value.length === 0){
			return false;
		}
		location.href = "/search/user.php?search=" + encodeURIComponent(value);
	};
});
