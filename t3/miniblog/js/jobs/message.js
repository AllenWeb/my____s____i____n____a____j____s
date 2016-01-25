$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/contains.js");
$import("sina/core/array/findit.js");
$import("diy/dom.js");
$import("diy/delDialog.js");
$import("diy/admin_uid_list.js");
$import("jobs/mod_login.js");
$import("jobs/msg_publisher.js");
$import("jobs/msgDialog.js");
/**
 * 私信功能
 * @author Liusong liusong@staff.sina.com.cn
 */



$registJob("contactlist",function(){
	var n = {
		"msgList": $E("msg_list"),
		"talkList": $E("talk_list")
	};
	try {
		var c = {
			"delApi": "/message/delonemsg.php",
			"delAllApi": "/message/delallmsg.php"
		};
		
		var getTarget = function(){
			var oEvent = Core.Events.getEvent();
			var oTarget = oEvent.srcElement || oEvent.target;
			while (oTarget.nodeType != 1) {
				oTarget = oTarget.parentNode;
			}
			return oTarget;
		};
		
		App.reMsg = function(nick,key){
			App.msgDialog(nick,key);
		};
		
		/**
	 * 删除单条信息
	 * @param {String} uid
	 * @param {String} rid
	 */
		App.delMsg = function(uid, rid){
			var oFormElement = getTarget();
			var oPost = {
				"uid": uid,
				"rid": rid
			};
			App.delDialog($SYSMSG["M08002"], c.delApi, oPost, function(){
				window.location.reload(true);
			}, function(){
			}, oFormElement, $CLTMSG['CC1904']);
		};
		
		/**
	 * 删除与某人的所有对话记录
	 * @param {String} uid
	 */
		App.delMsgGroup = function(uid, name){
			var oFormElement = getTarget();
			var oPost = {
				"uid": uid
			};
			var sText = $SYSMSG["M08001"].replace(/#{name}/, name);
			if(Core.Array.findit(App.admin_uid_list,uid)===-1){
				//同时将用户加入黑名单，updated by yuwei 2009-11-27
				sText += "<div style='margin-top:10px;font-size: 14px;'>" +
					"<input style='vertical-align:-1px;margin-right:3px;' type='checkbox' " +
					"id='block_user'>"+$CLTMSG['CC2701']+"</div>";
			}
			
			App.delDialog(sText, c.delAllApi, oPost, function(){
				window.location.reload(true);
			}, function(result){
				if(result && result.code){
					App.alert($SYSMSG[result.code],{icon:result.code=='M13004'?1:2,ok:function(){if(result.code=='M13004'){location.reload(true);}}});
					if(result.code=='M13004'){setTimeout(function(){location.reload(true);},1500)}
				}else{
					App.alert($CLTMSG['CC2702'],{icon:2,width:370,height:120});
				}
			}, oFormElement, $CLTMSG['CC2703']);
		};
		
		var oElement = {
			submit: $E("msg_publisher_submit"),
			editor: $E("msg_publisher_editor"),
			info: $E("msg_publisher_error"),
			nick: $E("msg_publisher_nick")
		};
		
		//App.msgPublisher(oElement, null, true);
		if (n.msgList || n.talkList) {
			var oNodes;
			var upClass;
			var overClass;
			if (n.msgList) {
				//modify by chibin 2009-12-2
//				upClass = "mBlog_linedot1";
//				overClass = "mBlog_linedot1 bg"
//				oNodes = Core.Dom.getElementsByClass(n.msgList, "li", upClass);
				upClass = "up";//隐去delete
				overClass = "over"//显示delete
				oNodes = n.msgList.getElementsByTagName("li");
			}
			if (n.talkList) {
				upClass = null;
				overClass = null;
				oNodes = n.talkList.getElementsByTagName("li");
			}
			
			var iLen = oNodes.length;
			if (iLen > 0) {
				var i = 0;
				//浮动
				for (i; i < iLen; i++) {
					(function(oNode, oDel){
						if (oNode && oDel) {
							Core.Events.addEvent(oNode, function(){
								if (scope.$currentMsgItem && !Core.Dom.contains(oNode, scope.$currentMsgItem)) {
									if (upClass) {
										//modify by chibin 2009-12-2
										//scope.$currentMsgItem.className = upClass
									}
									scope.$currentMsgDel.style.display = "none";
								}
								if (overClass) {
									//modify by chibin 2009-12-2
									//oNode.className = overClass
								}
								oDel.style["display"] = "";
								scope.$currentMsgItem = oNode;
								scope.$currentMsgDel = oDel;
								Core.Events.stopEvent();
							}, "mouseover");
						}
					})(oNodes[i], Core.Dom.getElementsByClass(oNodes[i], "span", "close")[0]);
				}
				Core.Events.addEvent(document.body, function(){
					if (scope.$currentMsgItem && scope.$currentMsgDel) {
						if (upClass) {
							//modify by chibin 2009-12-2
							//scope.$currentMsgItem.className = upClass
						}
						scope.$currentMsgDel.style["display"] = "none";
						scope.$currentMsgDel = null;
						scope.$currentMsgItem = null;
					}
				}, "mouseover");
			}
		}
	}catch(exp){console.log(exp)}
	
	
	/**
	 * 私信T3改造添加，私信内容区hover显示产出btn动作
	 * @author wangliang3@staff.sina.com.cn
	 * @time 2010-07-28
	 */
	 var showBtn =function(el,css){
	 	 var css = css || 'msg_close';
	 	var e = Core.Events.getEvent();
	 	var btn = App.Dom.getByClass(css,'a',el)[0];
		if(!btn){return false;}
	 	switch(e.type){
	 		case 'mouseover' : 
	 			btn.style.display='';
	 			break;
	 		case 'mouseout' : 
	 			btn.style.display='none';
	 			break;
	 	};
	 };
	 
	 App.Dom.getBy(function(el){
	 	 //私信对话
	 	 if(App.Dom.hasClass(el,'MIB_msg_c')){
	 	 	Core.Events.addEvent(el,function(){
	 	 		showBtn(el);
	 	 	},'mouseover');
	 	 	Core.Events.addEvent(el,function(){
	 	 		showBtn(el);
	 	 	},'mouseout');
	 	 }
		 //私信列表
		 if(App.Dom.hasClass(el,'MIB_feed_c')){
	 	 	Core.Events.addEvent(el,function(){
	 	 		showBtn(el,'close');
	 	 	},'mouseover');
	 	 	Core.Events.addEvent(el,function(){
	 	 		showBtn(el,'close');
	 	 	},'mouseout','close');
	 	 }
	 },'div',n['msgList']);
});
