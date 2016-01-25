$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("diy/getTextAreaHeight.js");
$import("diy/flyDialog.js");
$import("diy/loginAction.js");
//$import("msg/clientmsg.js");
$import("sina/core/class/extend.js");
$import("diy/mb_dialog.js");
$import("sina/core/dom/insertHTML.js");
$import("diy/BindAtToTextarea.js");
$import("diy/TextareaUtils.js");

/**
 * @fileoverview
 * 评论基础方法
 * 	App.Comment.loadData	数据加载方法，用于数据获取
 *  App.Comment.post		数据提交方法，用于有库操作的上行数据提交
 *  App.Comment.add         添加一条评论或回复
 *  App.Comment.delete		删除一条评论，此操作会事先提示用户是否要删除该评论
 *  App.Comment.login		用户登陆方法，如果当前用户未登陆则需要打开弹层先进行登陆操作
 *  App.Comment.changeArrow	评论按钮箭头改变方法，当箭头为↑则表示当前为展开状态，当箭头为↓则表示当前为已收起状态
 * @author Liusong liusong@staff.sina.com.cn
 */

App.Comment = {
	
	/**
	 * 数据加载方法,使用GET方法
	 * @param {Object}   oNode       回写节点
	 * @param {Object}   sUrl        接口地址
	 * @param {Object}   oGet        接口参数
	 * @param {Function} fCallBack  成功回调函数
	 * @param {Function} fFail      失败回调函数
	 */
	
	"loadData":function(sUrl,oNode,oGet,fCallBack,fFail){
		Core.Class.extend(oGet,scope.commentConfig.params);	
		Utils.Io.Ajax.request(sUrl,
		{
			"onComplete"  : function (oResult){
				//如果成功回写节点并回调成功函数
				if(oResult.code=="A00006" && oNode != null){
					//将请求数据回写到oNode节点中
					oNode.innerHTML = oResult.data;
					//调用回调函数
					fCallBack(oResult);
				}
				//如果用户未登陆，则先让用户登陆
				else if(oResult.code == "A00003"){}
				else{
					fFail(oResult);
				}
			}.bind2(this),
			"onException" : function(e){},
			"returnType"  : "json",
			"GET"         : oGet
		});
	},
	
	/**
	 * 数据提交方法,使用POST方法
	 * @param {Object}   sUrl        接口地址
	 * @param {Object}   oNode       上行数据
	 * @param {Function} fCallBack   成功回调函数
	 * @param {Function} fFail       失败回调函数
	 */
	
	"post":function(sUrl,oPost,fCallBack,fFail){
		Core.Class.extend(oPost,scope.commentConfig.params);
		//唉产品说要把中文的＠转为英文的@
		oPost.content && (oPost.content = oPost.content.replace(/\uff20/ig,"@"));	
		Utils.Io.Ajax.request(sUrl,{
			"POST"        : oPost,
			"onComplete"  : function (oResult){
				scope.commentConfig.params["retcode"] = "";
				//如果用户未登陆，则先让用户登陆
				if(oResult.code == "A00006"){
					fCallBack(oResult);
				}
				//失败回调
				else if(oResult.code == "M00008"){
					window.location.href = oResult.data;
				}
				else{
					fFail(oResult);
				}
			}.bind2(this),
			"onException" : function(){
				scope.commentConfig.params["retcode"] = "";
			},
			returnType : "json"
		});	
	},
	
	/**
	 * 添加评论
	 * @param {String}      sUrl      接口地址
	 * @param {HTMLElement} oNode     发送按钮
	 * @param {Function}    fCallBack 成功回调函数
	 * @param {Function}    fFail     失败回调函数
	 */
	
	"addComment":function(sUrl,oNode,fCallBack,fFail){
		var loginFlag = false;
		var postComment = function(){
			//锁定评论按钮
			if(oNode.locked){return};
			oNode.locked = true;
			oNode.className = "btn_notclick";
			var oPost = oNode.oParam;
			if( oPost ){
				var sContent = $E("_comment_content_" + oPost.productId + "_" + oPost.resourceId + ((oPost.cid&&oPost.listInDiv!=1)?"_" + oPost.cid:"")).value;
				var exContent = Core.String.trim(sContent);
				//chibin modify
				var oReq = new RegExp('^'+$CLTMSG['CC0501']+'[^:]*:');
				var oReq1 = new RegExp('^'+$CLTMSG['CC0501']+'[^:]*:$');
				if(exContent=="" || (oReq.test(exContent)&&(oReq1.test(exContent)))){
				//if(exContent=="" || (/^\u56de\u590d[^:]*:/.test(exContent)&&(/^\u56de\u590d[^:]*:$/.test(exContent)))){
					fFail.bind2(oNode)({'code':'SCM008'});
					return;
				}
				oPost["content"] = sContent;
				
				//评论进转发功能的接收程序地址,加上GET参数(f=1)
				if(oPost.forward){
					sUrl+= "?f=1";
				}
			}
			this.post(sUrl,oPost,(function(oNode,fCallBack){
				return function(oResult){
					if(oNode.$loginDiv && oNode.$loginuser && oNode.$loginpassword){
						setTimeout(function(){
							window.location.reload();
						},10);
						return;
					}
					//成功添加评论,刷新评论列表
					//scope.loadCommentByPage();
					//发表评论按钮解锁
					oNode.locked = false;
					oNode.className = "btn_normal";
					//获取评论数显示容器
					var countPanel = $E("_comment_count_" + oNode.oParam.productId + "_" + oNode.oParam.resourceId);
					//对当前评论数作加操作
					try{
						App.Comment.count(countPanel, "+");
					}catch(e){}
					fCallBack(oNode,oResult);
				};
			})(oNode,fCallBack),fFail||function(){});
		};
		if(oNode.$loginDiv && oNode.$loginuser && oNode.$loginpassword){
			if( !oNode.$loginuser.value || oNode.$loginuser.value == $SYSMSG["R01008"] ){
				App.alert($SYSMSG["M00901"]);
				return;
			}
			if(oNode.$loginpassword.value == ""){
				App.alert($SYSMSG["M00902"]);
				return;
			}
			loginFlag = true;
			var cfg = {
				 name :	oNode.$loginuser.value,
				 pwd  :	oNode.$loginpassword.value,
				 remb :	true,
				 succ :	postComment.bind2(this),
				 error:	function(err,errno){
				 	if( errno=="4010" ){
						var msg = App.getMsg("R01010", {mail:oNode.$loginuser.value});
						//msg = msg.replace(/&user=/i,'&user='+oNode.$loginuser.value);
						App.alert(msg);	
					}else{
						App.alert(err);
					}
				 }
			};
			App.LoginAction(cfg);
		}else{
			postComment.bind2(this)();
		}
	},
	
	/**
	 * 删除评论
	 * @param {String}   sUrl       接口地址
	 * @param {Object}   oPost      接口参数
	 * @param {Function} fCallBack  回调函数
	 * @param {Function} fFail      失败回调函数
	 */
	
	"deleteComment":function(sUrl,oPost,fCallBack,fFail){
		this.post(sUrl,oPost,function(oResult){
			//成功删除评论,刷新评论列表
			//scope.loadCommentByPage();
			//获取评论数显示容器
			var countPanel = $E("_comment_count_" + oPost.productId + "_" + oPost.resId);
			//对当前评论数作减操作
			try{
				this.count(countPanel, "-");
			}catch(e){}
			fCallBack();
		}.bind2(this),fFail||function(){});
	},
	
	/**
	 * 评论数获取
	 * @param {Object} oNode   当前计数的节点
	 * @param {Object} sMethod 如果是显示数增加则传入"+"如果显示数减少而传入"-"
	 */
	
	"count":function(oNode,sMethod){
		//获取当前评论数
		var s = oNode.getElementsByTagName("strong");
		if(s && (s = s[1])){
			var count = s.innerHTML;
			count = parseInt(count.match(/(\d+)/));
			count = ((count+"")=="NaN"?0:count)
			count = Math.max(eval(count + sMethod + 1),0);
			s.innerHTML = "";
			count && (s.innerHTML = ["(", count, ")"].join(""));
		}
	},
	/**
	 * 为小评论中所有涉及评论数的span进行评论数假写，如果评论数为0则该评论数容器会被干掉
	 * @param {Object} oNode
	 * @param {Object} sMethod
	 * @param {Function} fRef 
	 */
	"superCount":function(oNode,sMethod,fRef){
//		var countPanel = Core.Dom.getElementsByClass(oNode,"div","list_head");
//		var len = countPanel.length;
//		if(countPanel[0]){
//			var countSpan,count=0;
//			countSpan = countPanel[0].getElementsByTagName("span")[0];
//			if (countSpan) {
//				count = window.parseInt(countSpan.innerHTML);
//				count = window.eval(count + sMethod + 1);
//				countSpan.innerHTML = Math.max(count,0);
//			}
//		}
//		var commentItems = oNode.getElementsByTagName("li");
//		var commentLen = commentItems.length;
//		if(commentLen==0){
//			if(countPanel[0]){
//				countPanel[0].parentNode.removeChild(countPanel[0]);
//			}
//			if(countPanel[1]){
//				countPanel[1].parentNode.removeChild(countPanel[1]);
//			}
//			if(fRef){fRef()};
//		}else if(commentLen<10){
//			if(countPanel[1]){
//				countPanel[1].parentNode.removeChild(countPanel[1]);
//			}
//		}
	},
	"setCount":function(oNode,value){
		if(value > 0){
			oNode.innerHTML = $CLTMSG['CC0502']+"<strong>(" + value + ")</strong>";
		}
		//如果无评论只显示评论
		else{
			oNode.innerHTML = $CLTMSG['CC0502'];
		}
	},
	
	/**
	 * 如果用户未登陆，则需要打开统一登陆弹层进行登陆
	 */
	
	"login":function(){
		//		$import("diy/loginAction.js");
		//		App.LoginAction({
		//			name:login_name,
		//			pwd:login_pwd,
		//			remb:login_remb,
		//			succ:doForward,
		//			error:showError
		//		});
	},
	
	/**
	 * 监听用户输入的内容，如果超过限制长度则进行截取
	 * 如果输入内容高于当前TextArea的高度则自动拓充至当前文本高度
	 * @param {HTMLElement} oNode    当前用户使用的TextArea对像
	 * @param {Number}      sLength 限制输入的字符数,中文算两个字符
	 */
	
	"listenerUserInput" : function (oNode, sLength) {
		oNode = $E( oNode );
		if( oNode == null ){	return;	}
		//根据传入的长度截取输入的文本
		var limit = function(sLength){
			var snapLength = Core.String.byteLength(this.value);
			if( snapLength > sLength ){
				this.value = Core.String.leftB(this.value, sLength);
			}
		}
		//自动拓充TextArea的高度
		App.BindAtToTextarea(oNode, {"borderWidth":"1px","fontSize":"12px"});
		App.autoHeightTextArea( oNode, Core.Function.bind3( limit, oNode, [sLength] ))
	},
	
	/**
	 * 重置评论按钮箭头方向
	 * @param {HTMLElement} oNode     箭头节点对像
	 * @param {String}      direction 箭头方向
	 */
	
	 "changeArrow" : function (oNode, direction) {
		if(oNode != null){
			switch(direction){
				case "up":
					oNode.className = "off";
					break;
				case "down":
					oNode.className = "on";
					break;
			}
		}
	 },
	 /**
	  * 
	  * @param {Object} oTarget
	  * @param {Object} sText
	  * @param {Object} fCallBack
	  */
	 "alert" : function( oTarget, sText, iIcon, fCallBack, fCancel){
	 	return App.flyDialog(sText, (!fCancel)?"alert":"confirm", oTarget, {icon:iIcon,ok:fCallBack});
	 },
	 "tip" : function( oTarget, sText, iIcon, fCallBack, fCancel){
	 	return App.flyDialog(sText, (!fCancel)?"alert":"confirm", oTarget, {icon:iIcon,ok:fCallBack,hasBtn:false});
	 },
	 "getTarget" : function(){
	 	try{
			var oEvent = Core.Events.getEvent();
			var oTarget = oEvent? (oEvent.srcElement || oEvent.target): null;
		}catch(e){
			return null;
		}
	 	return oTarget;
	 },
	 
	 /**
	  * 曾哥绝爷们儿精神，输入框交点后一定要让光标爆菊。
	  * @update 曾哥永生后第五天第一次修改代码
	  * @param {HTMLElement} oNode 必选参数，修正交点对像
	  */
	 
	 "focus":function( oNode, step ){
	 	if(!oNode){
	 		return;
	 	}
	 	try{
			App.TextareaUtils.setCursor(oNode);
	 	}catch(e){
//	 		if(window.console){
//	 			console.log(e);
//	 		}
	 	}
	 	
		if(step){
			setTimeout(function(){
				window.scrollTo(0,step);
			},20)
		}
	 }
};
