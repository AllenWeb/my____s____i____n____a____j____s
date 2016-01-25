/**
 * @author wangliang3@staff.sina.com.cn
 */
$import("diy/dialog.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/removeNode.js"); 
 
 /**
 * 删除活动成员
 * @param {string} uid 用户id
 * @param {string} eid 活动id
 */
App.fireMember = function(uid, eid){
	var url = '/event/aj_deletemember.php';
	var submit = function(){
		Core.Events.stopEvent();
	    Utils.Io.Ajax.request(url, {
	        'POST': {eid: eid,uid: uid},
	        'onComplete': function(json){
				popWin.distory();
	            if (json.code == 'A00006') {
					var tip = App.alert($SYSMSG[json.code],{icon:3,hasBtn:false});
					setTimeout(function(){
						//还得包含自己嘛，所以为1就得刷了
						Core.Dom.removeNode($E(uid));
						if ($E('att_wrap').getElementsByTagName('LI').length == 1) {
							location.reload(true);
						}
						tip.close();
			        }, 1000);
	            }
	            else {
	                App.alert($SYSMSG[json.code]);
	            }
	        },
	        'onException': function(){
	            //callBack.error();
	        },
	        'returnType': 'json'
	    });
	};
	
	var popWin = App.confirm('确认将此用户开除出活动？',{ok:submit});

};

 /**
 * 删除活动
 * @param {string} eid 活动id
 */
 App.fireActivity = function(eid){
	var url = '/event/aj_delete.php';
	var submit = function(){
		Core.Events.stopEvent();
	    Utils.Io.Ajax.request(url, {
	        'POST': {eid: eid},
	        'onComplete': function(json){
				popWin.distory();
	            if (json.code == 'A00006') {
					var tip = App.alert($SYSMSG[json.code],{icon:3,hasBtn:false});
					setTimeout(function(){
			            tip.close();
						window.location.href=json.url;
			        }, 1000);
	            }
	            else {
	                App.alert($SYSMSG[json.code]);
	            }
	        },
	        'onException': function(){
	            //callBack.error();
	        },
	        'returnType': 'json'
	    });
	};
	var popWin = App.confirm('确认删除此活动？',{ok:submit});

};