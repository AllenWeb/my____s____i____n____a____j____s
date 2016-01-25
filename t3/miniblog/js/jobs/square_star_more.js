/**
 * @fileoverview 微博广场-名人堂- 更多明星
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import('sina/core/events/stopEvent.js');
$import('sina/core/dom/getXY.js');

$registJob('square_star_more',function(){
	var ul1 = $E('hot_list1'),ul2 = $E('hot_list2');
	var _addEvent = Core.Events.addEvent;
	ul1.style.marginTop = ul2.style.marginTop =  "6px";
	
	Core.Events.addEvent(ul1.parentNode,function(e){
		ul1.style.display = "";
	},'mouseover');
	Core.Events.addEvent(ul1.parentNode,function(e){
		ul1.style.display = "none";
	},'mouseout');
	
	Core.Events.addEvent(ul2.parentNode ,function(e){
		ul2.style.display = "";
	},'mouseover');
	Core.Events.addEvent(ul2.parentNode,function(e){
		ul2.style.display = "none";
	},'mouseout');
	
	//-------------------------------------------------------------------
	var toggle1 = $E("toggle_list1"), toggle2 =  $E("toggle_list2");
	Core.Events.addEvent(toggle1 ,function(e){
		ul1.style.display = (ul1.style.display === "none") ? "":"none";
	},'click');
	Core.Events.addEvent(toggle2 ,function(e){
		ul2.style.display = (ul2.style.display === "none") ? "":"none";
	},'click');
	
	//------增加搜索
	var oInput = $E("search_user"), oUserBtn = $E("search_btn");
    oInput.title = oUserBtn.title = $CLTMSG['CX0011'];
    function search(event){
        var value = Core.String.leftB(Core.String.trim(oInput.value), 30);
        if (value) {
            location.href = "/search/user.php?search=" + encodeURIComponent(value);
        }
        else {
            oInput.focus();
        }
        Core.Events.stopEvent(event);
    }
    _addEvent(oUserBtn, search, "click");
});