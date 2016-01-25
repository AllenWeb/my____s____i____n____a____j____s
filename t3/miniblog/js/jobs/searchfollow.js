/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/fansfind.js");
$import("jobs/base.js");
$import("sina/core/events/addEvent.js");
$import("diy/enter.js");
$import("diy/concern/yesIknow.js");
/*
 *  此功能应用于搜索关注
 */
$registJob("follow_search", function(){
    var addEvent = Core.Events.addEvent;
    var o_input = $E("fans_and_follow_filter_input");    
    var o_btnSearch = $E("fans_and_follow_filter_submit");
    var url = window.location.href;
	var i_width=o_input.clientWidth;
    var s_listStyle = "width:"+i_width+"px;position:absolute;z-Index:1200;";
    var msg = o_input.value;
	var o_spec = {
        input: o_input,
        style: s_listStyle,
        searchtype: scope.personType,
		select: function(value,text){
			//window.location.href = "/"+value; //modify by chibin 2009-11-24
			window.location.href = "/attention/att_list.php?action=" + scope.personType + "&uid="+scope.$oid+"&search="+encodeURIComponent(text);
		}	
    }
	if(o_input){
		o_input.value = msg;
	}
    App.fansfind(o_spec);
	addEvent(o_input,function(){
		if (o_input.value == msg) {
			o_input.value = "";
		}
	},'focus');
	addEvent(o_input,function(){
		if(o_input.value == ""){
			o_input.value=msg;	
		}
	},'blur');
	
    addEvent(o_btnSearch, function(){
		if (o_input.value != null && o_input.value != '' && o_input.value != msg) {
			window.location.href = "/attention/att_list.php?action=" + scope.personType + "&uid=" + scope.$oid + "&search=" + encodeURIComponent(o_input.value);
		}
    }, "click");
	App.enterSubmit({
		parent : $E('fans_and_follow_filter_form'),
		action : function(){
			Core.Events.fireEvent(o_btnSearch, 'click');
		}
	});
	var p = App.concern.init();
});
