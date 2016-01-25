$import("sina/sina.js");
$import("jobs/base.js");
$import("sina/core/dom/contains.js");
/**
 * 鼠标效果
 * @param {Object} event
 * @param {Object} el
 */
App.changeBackColor = function(event,el){
	event = event|| window.event;
	var id  = el.id;
	var cancel = $E("cancel_"+id);
	var message = $E("message_"+id);		
	var remark = $E("remark_"+id);
	var fire = $E("fire_"+id);
	
	if(event.type == "mouseover"){
		var relatedTarget = event.relatedTarget || event.fromElement;
		if(el != relatedTarget && relatedTarget && !Core.Dom.contains(el,relatedTarget)){
			//el.className = 'MIB_linedot_l cur';		
			if(cancel){
				cancel.style.display = "";
			}	
			if(message){
				message.style.display = "";
			}	
			if(remark){
				remark.style.display = "";
			}
			if(fire){
				fire.style.display = "";
			}	
		}	
	}
	
	if(event.type == "mouseout" ){
		var relatedTarget = event.relatedTarget || event.toElement;
		if(el != relatedTarget && relatedTarget && !Core.Dom.contains(el,relatedTarget)){
			//el.className = "MIB_linedot_l";		
			if(cancel){
				cancel.style.display = "none";
			}
			if(message){
				message.style.display = "none";
			}
			if(remark){
				remark.style.display = "none";
			}
			if(fire){
				fire.style.display = "none";
			}			
		}
	}
};