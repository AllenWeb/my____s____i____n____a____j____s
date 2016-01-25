/**
 * @fileoverview 私信发布器
 */
$import('diy/publisher4msg.js');
$import('diy/publisher_face.js');
$import('sina/core/events/fireEvent.js');

$registJob('publisher4msg', function(){
	var pub = App.miniblogPublisher4msg({
		'editor'	: $E('msg_editor'),
		'submit'	: $E('msg_submit'),
		'info'		: $E('msg_info'),
		'nick'      : $E('msg_nick'),
		'faces'     : $E("msg_faces")
	},{
		'init' : function(pub){
			return false;
		},
		'onDisable'	: function(){
			
		},
		'onEnable'	: function(){
			
		},
		'onLimit'	: function(len){
			if (len >= 0 && len <= 300) {//私信长度限制为300
			    $E('msg_info').className = 'leaveWord';
				$E('msg_info').innerHTML = $CLTMSG['CD0181'].replace(/#\{len\}/,300 - len);
            } else {
				$E('msg_info').className = 'leaveWord leaveError';
				var _src = 'src="'+ scope.$BASECSS + 'style/images/common/transparent.gif" ';
				$E('msg_info').innerHTML = $CLTMSG['CD0182'].replace(/#\{img\}/,'<img '+_src+' title="" alt="" class="tipicon tip2"/>').
				replace(/#\{len\}/,(300 - len) * (-1));
            }
		},
		'onSuccess'	: function(json,params){
		    if(json.addcontent){
		        var msgList = $E("msg_list");
		        var msgBox = document.createElement('ul');
    			msgBox.style.display = 'none';
    			document.body.appendChild(msgBox);
    			msgBox.innerHTML = json.addcontent;
    			var newMsg = msgBox.getElementsByTagName('li')[0];
    			var tagetMsg = msgList.getElementsByTagName('li')[0];
    			msgList.insertBefore(newMsg, tagetMsg);
    			
    			var oDel = Core.Dom.getElementsByClass(newMsg, "a", "msg_close")[0];
    			Core.Events.addEvent(newMsg, function(){
					if (scope.$currentMsgItem && !Core.Dom.contains(newMsg, scope.$currentMsgItem)) {
						scope.$currentMsgDel.style.display = "none";
					}
					oDel.style["display"] = "";
					scope.$currentMsgItem = newMsg;
					scope.$currentMsgDel = oDel ;
					Core.Events.stopEvent();
				}, "mouseover");
		    }
		},
		'onError'	: function(){},
		'limitNum'	: 300,
		'emptyStr'	: [''],
		'topic'		: ''
	}).plugin(App.miniblogPublisherFace({
		'button'	: $E("msg_faces")
	}));
	
	if($E('msg_editor')){
	   App.reMsg = function(){
	       setTimeout(function(){
	           $E('msg_editor').focus();
	           $E('msg_editor').scrollIntoView(false);
	       },10);
	   }; 
	}
});