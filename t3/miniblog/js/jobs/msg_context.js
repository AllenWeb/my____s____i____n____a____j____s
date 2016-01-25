/**
 * @fileoverview 私信上下文
 * @author yuwei
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/core/events/addEvent.js");
$import("diy/check_login.js");
$import("sina/utils/io/ajax.js");
$import("jobs/mod_login.js");
$import("diy/curtain.js");
$import("sina/core/array/each.js");

$registJob('msg_context', function(){
    return {
        addEvent:Core.Events.addEvent,
        each:Core.Array.each,
        elements:{
            'pre':$E('pre_msg'),
            'next':$E('next_msg')
        },
        oList:$E("msg_list"),
        
        //焦点定位到匹配msgid的私信上
        focusTargetMsg:function(){
            var msgid = window.location.href.split("msgid=")[1].split("&")[0], list  = this.oList.getElementsByTagName("li");
            this.each(list,function(item){
                if(item.getAttribute("msgid") === msgid){
                    item.focus();
                }
            });
            
            return this;
        },
        bindEvent:function(){
            var me = this;
            for(var el in this.elements){
                (function(dom){
                    me.addEvent(dom,function(){
                        if(!scope.loginKit().isLogin){
                            return App.ModLogin({"func": function(){}});
                        }
                        var timeline  = dom.getAttribute('timeline');
                        Utils.Io.Ajax.request('/message/getcontext.php', {
                            'GET': {
                                'otheruid':dom.getAttribute('otheruid')||"",
                                'timeline':timeline,
                                'msgid':dom.getAttribute('msgid')||"",
                                'ctime':dom.getAttribute('ctime')||"",
                                'prenum':dom.getAttribute('prenum')||"",
                                'nextnum':dom.getAttribute('nextnum')||""
                            },
                            'onComplete': function(json){
                                if (json.code == 'A00006') {
                                    if(json.data){
                                        me.slideOut(timeline,json.data);
                                    }else{
                                        me.elements[timeline].style.display = "none";
                                    }
                                }else if(json.code){
                                    App.alert($SYSMSG[json.code],{icon:2});
                                }
                            },
                            'onException': function(){
                                
                            },
                            'returnType': 'json'
                        });
                    },"click",false);
                })(this.elements[el]);
            }
        },
        /**
         * 动画效果
         * @param{String}timeline="pre"||"next"
         * @param{String}html
         * */
        slideOut:function(timeline,html){
            var me = this, msgList = this.oList, oTaget = msgList.children[0],msgBox = document.createElement('ul');
        	msgBox.style.display = 'none';
        	msgBox.innerHTML = html;
        	if(timeline === "next"){
        	    msgList.appendChild(msgBox);
        	}else{
        	    msgList.insertBefore(msgBox, oTaget);
        	}
        	
        	if(msgBox.children.length === 0){
    	        return this.elements[timeline].style.display = "none";
    	    }
    	    
        	App.curtain.droop(msgBox);
        	
        	this._onMouseOver(msgBox);
        },
        //悬浮时显示删除功能项
        _onMouseOver:function(oDom){
            var me = this, nodeList  = oDom.getElementsByTagName("li"), len = nodeList.length;
        	for(var i=0;i<len;i++){
        	    (function(oLi){
        	        var oDel = Core.Dom.getElementsByClass(oLi, "a", "msg_close")[0];
        			me.addEvent(oLi, function(){
    					if (scope.$currentMsgItem && !Core.Dom.contains(oLi, scope.$currentMsgItem)) {
    						scope.$currentMsgDel.style.display = "none";
    					}
    					oDel.style["display"] = "";
    					scope.$currentMsgItem = oLi;
    					scope.$currentMsgDel = oDel ;
    					Core.Events.stopEvent();
    				}, "mouseover");
        	    })(nodeList[i]);
        	}
        },
        run:function(){
            this.focusTargetMsg().bindEvent();
        }
    }.run();
});