/**
 * @fileoverview 翻页弹出层
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("sina/core/dom/getXY.js");

$registJob('paging',function(){
	var oPopup = $E("page_div");
	if(oPopup){
		document.body.appendChild(oPopup);//key point 把其从复杂的dom中解脱干净，以备定位
		var oButton = $E("paging_popup");
		var displayKey = false;
		var DELAY = 300;
		var show = function(){
			if(oPopup.style.display == 'none' && displayKey){
				var position = Core.Dom.getXY(oButton);
				position[1] -= (oButton).offsetHeight;
				oPopup.style.left = position[0] + ('v' == '\v' ? -2 : 0)+ 'px';
				oPopup.style.top = position[1] + 23 + 'px';
				oPopup.style.display = '';
				oPopup.style.top = parseInt(oPopup.style.top) - oPopup.offsetHeight + "px";
			}
		}
		var hidd = function(){
			if(oPopup.style.display == '' && !displayKey){
				oPopup.style.display = 'none';
			}
		}
		
		Core.Events.addEvent(oButton,function(e){
			Core.Events.stopEvent(e);
			if(!displayKey){
				setTimeout(show,DELAY);
				displayKey = true;
			}
		},'mouseover');
		Core.Events.addEvent(oButton,function(e){
			Core.Events.stopEvent(e);
			if(displayKey){
				setTimeout(hidd,DELAY);
				displayKey = false;
			}
		},'mouseout');
		
		Core.Events.addEvent(oPopup,function(e){
			Core.Events.stopEvent(e);
			if(!displayKey){
				setTimeout(show,DELAY);
				displayKey = true;
			}
		},'mouseover');
		Core.Events.addEvent(oPopup,function(e){
			Core.Events.stopEvent(e);
			if(displayKey){
				setTimeout(hidd,DELAY);
				displayKey = false;
			}
		},'mouseout');
	}
});