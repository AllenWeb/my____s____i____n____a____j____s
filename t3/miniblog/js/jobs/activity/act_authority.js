/**
 * @author wangliang3@staff.sina.com.cn
 */
//import API
$import("diy/dom.js");
//$import("diy/dialog.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/getEvent.js");

//ajax
$import("sina/utils/io/ajax.js");
//import comm function
$import("jobs/activity/validate.js");
$import("jobs/activity/widget.js");

$registJob('actAuthority', function(){
	var events = Core.Events, cdom = Core.Dom;
	
	var config = {
        appUrl: '/event/aj_approve.php',
		ignUrl: '/event/aj_ignore.php',
		appid : 'aid',//dom 依赖 存储单个btn点击的UID
		ignid : 'iid' //同appid
    };
	
	var items = {
		'checkall' : $E('activity_aut_checkall'),
		'panel' : $E('activity_aut_panel'),
		'lots' : $E('activity_aut_lots'),
		'limits' : $E('activity_aut_limits')
	};
	var checkItems = [];
//		joinBtns = [],
//		limitBtns = [];
	
	var handler = {
		init : function(){
			App.Dom.getBy(function(el){
				switch(el.tagName.toLowerCase()){
					case 'input':
						if(el.getAttribute('type') == 'checkbox'){
							checkItems.push(el);
						}
					break;
					case 'a':
						if(el.getAttribute(config.appid)){
							events.addEvent(el,handler.clickAppBtn);
						}
						if(el.getAttribute(config.ignid)){
							events.addEvent(el,handler.clickIgnBtn);
						}
					break;
				}
			},'',items['panel']);
			var selAll = [];
			selAll.push(items['checkall']);
			App.Widget.checkBoxLink(selAll,checkItems);
		},
		ajaxPost : function(url,json){
			Utils.Io.Ajax.request(url, {
                'POST': json,
                'onComplete': function(json){
					if (json.code == 'A00006') {
						window.location.reload(true);
					}else{
						App.alert($SYSMSG[json.code]);
					}
                },
                'onException': function(){
                    //callBack.error();
                },
                'returnType': 'json'
            });
		},
		buildItemsPars : function(){
			var pars = [];
			for(var i=0,len = checkItems.length;i<len;i++){
				if(checkItems[i].checked){
					pars.push(checkItems[i].value);
				}
			}
			return pars.join(',');
		},
		lotsOperate : function(json){
			var url = json.type == 1 ? config.appUrl : config.ignUrl ;
			json['eid'] = scope.$eid;
			handler.ajaxPost(url,json);
		},
		clickLotsAppBtn : function(){
			events.stopEvent();
			var items = handler.buildItemsPars();
			if(items == ''){
				return;
			}
			var json = {
				type : 1 ,
				items : items
			};
			handler.lotsOperate(json);
		},
		ckickLotsIgnBtn : function(){
			events.stopEvent();
			var json = {
				type : 0 ,
				items : handler.buildItemsPars()
			};
			handler.lotsOperate(json);
		},
		clickAppBtn : function(){
			events.stopEvent();
			var obj = events.getEventTarget();
			if(obj.tagName.toLowerCase()=='em'){
				obj = obj.parentNode;
				
			}
			var json = {
				type : 1 ,
				items : obj.getAttribute(config.appid)
			};
			handler.lotsOperate(json);
		},
		clickIgnBtn :function(){
			events.stopEvent();
			var obj = events.getEventTarget();
			if(obj.tagName.toLowerCase()=='em'){
				obj = obj.parentNode;
				
			}
			var json = {
				type : 0 ,
				items : obj.getAttribute(config.ignid)
			};
			handler.lotsOperate(json);
		}
		
	};
	
	//bind events  
	events.addEvent(items['lots'],handler.clickLotsAppBtn);
	events.addEvent(items['limits'],handler.ckickLotsIgnBtn);
	
	
	//page init
	handler.init();

});