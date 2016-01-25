$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/core/events/addEvent.js");
$import("diy/animation.js");
$import("diy/timer.js");
/*
 * 单双击以及用mousedown和mouseup模拟单击
 *
 */

App.dblclick=function(el,cfg){

	var dcTime =cfg["dcTime"]||300; // 单击间隔
    var dcAt =cfg["dcAt"]||0; // time of doubleclick  
	var savEvent=null; // save Event for handling doClick().  
	var savEvtTime = 0; // save time of click event. 
	var savTO = null; // handle of click setTimeOut    
	var clickevt = cfg["clickevt"]||function(){};
	var dbclickevt = cfg["dbclickevt"]||function(){};
	var mousedwevt=cfg["mousedwevt"]||function(){};
	var mouseupevt=cfg["mouseupevt"]||function(){};
	function handleWisely(which){
		switch (which) {
			case "click":
				savEvent = which;
				d = new Date();
				savEvtTime = d.getTime();
				savTO = setTimeout(function(){doClick(savEvent);}, dcTime);
				break;
			case "dblclick":
				doDoubleClick(which);
				break;
			case "mousedown":
				savEvent = which;
				d = new Date();
				savEvtTime = d.getTime();
				savTO = setTimeout(function(){doMousedown(savEvent);}, dcTime);
				break;
			case "mouseup":
				savEvent = which;
				d = new Date();
				savEvtTime = d.getTime();
				savTO = setTimeout(function(){doMouseup(savEvent);}, dcTime);
				break;
			default:
		}
	}
	function doClick(which){
		if (savEvtTime - dcAt <= 0) {
			return false;
		}
		clickevt();
	}
	function doMousedown(which){
		if (savEvtTime - dcAt <= 0) {
			return false;
		}
		mousedwevt();
	}
	function doMouseup(which){
		if (savEvtTime - dcAt <= 0) {
			return false;
		}
		mouseupevt();
	}
	function doDoubleClick(which){
		var d = new Date();
		dcAt = d.getTime();
		if (savTO != null) {
			savTO = null;
		}
		dbclickevt();
	}
	
	Core.Events.addEvent(el, function(){
		
        handleWisely(Core.Events.getEvent().type);
    }, "click");
	
	Core.Events.addEvent(el, function(){
				
        handleWisely(Core.Events.getEvent().type);
    }, "dblclick");
	Core.Events.addEvent(el, function(){	
        handleWisely(Core.Events.getEvent().type);
    }, "mousedown");
	Core.Events.addEvent(el, function(){	
        handleWisely(Core.Events.getEvent().type);
    }, "mouseup");
};


