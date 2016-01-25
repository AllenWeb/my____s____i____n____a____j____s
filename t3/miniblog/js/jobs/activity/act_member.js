/**
 * @author Administrator
 */
//import API
$import("diy/dom.js");
$import("diy/dialog.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/getEvent.js");
//ajax
$import("sina/utils/io/ajax.js");
//import comm function
$import("jobs/activity/validate.js");
$import("jobs/activity/widget.js");
$import("diy/TextareaUtils.js");

$registJob('actMember', function(){
    var events = Core.Events, adom = App.Dom;
    var config = {
        postUrl : '/event/aj_setting.php',
		module : $E('att_wrap')
    };
    
	var handler = {
		init : function(){
			adom.getBy(function(el){
				events.addEvent(el,handler.menuAtion,'mouseover');
				events.addEvent(el,handler.menuAtion,'mouseout');
			},'li',config.module);
		},
		menuAtion : function(){
			events.stopEvent();
			var e = events.getEvent();
			var obj = events.getEventTarget();
			if (e.type == 'mouseover') {
				handler.showMenu(obj,true);
			}else if(e.type == 'mouseout'){
				handler.showMenu(obj,false);
			}
		},
		showMenu : function(obj,isShow){
			var display = isShow ? '' : 'none';
			adom.getBy(function(el){
				var attMenu = el.getAttribute('menu');
				if(attMenu && attMenu != 'add'){
					adom.setStyle(el,'display',display);
				}
			},'p',obj);
		}
	};
	//page init
//    handler.init();
});
