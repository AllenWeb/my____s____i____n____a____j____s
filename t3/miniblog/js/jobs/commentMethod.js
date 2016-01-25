$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/string/trim.js");
$import("diy/mb_dialog.js");
$import("jobs/mod_login.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/class/extend.js");
$import("diy/admin_uid_list.js");
$import("sina/core/array/findit.js");
$import("sina/core/dom/insertHTML.js");
$import('jobs/mod_information.js');
$import("diy/forbidrefresh_dialog.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("diy/check_login.js");

/**
 * @fileoverview
 * 评论插件,---------->>>>>>>>信春哥，原地满状态复活
 * 此文件定义了在链接中 PHP 直接输出的四个函数(所有用户交互的入口)及加载大评论列表的 JOB
 * 	scope.loadCommentByRid			按照资源ID加载评论，根据参数来区分是大评论还是小评论
 * 	scope.deleteCommentByRid		按照资源ID删除指定评论
 * 	scope.loadCommentByPage			按照指定页码加载评论列表，仅用于APP资源详情页
 * 	scope.replyByCid				回短消息函数，调用现有的 App.sendMsg 方法，不过是由佩剑在使用到评论功能的地方部署 diy/sendmsg.js
 * 
 * 评论功能描述
 * 		大评论——展示在页面中的评论列表，主要用于资源详情页，详细页每页显示10条，可以翻页，点击回复在该条评论下方显示回复框
 * 		小评论——展示在资源下方，每个小评论限制最多显示3条，点击回复在发评论框中显示“回复XX：”点击更多进入资源详细页
 * 		注：此版评论以
 * 
 * @author Liusong liusong@staff.sina.com.cn
 */

scope.commentConfig = {
	iInputLimitSize : 280,
	defaultPage     : "0",
	sPostUrl        : "/comment/addcomment.php",
	sDeleteAPI      : "/comment/delcomment.php",
	sDataUrl        : "/comment/commentlist.php",
	params          : {},
	ListNode		: null
} 

/**
 * 初始化登陆对像
 * @param {HTMLElement} oUserInput 必选参数，
 */

scope.initCommentLoginInput = function( oUserInput ,oUserPassword ){
	if( oUserInput ){
		(function( sText, oInput, oPassword, sValue ){
			oInput.style.color = "#999999";
			oInput.alt = oInput.title = sText;
			if( sValue=="" ){ oInput.value = sText }
			if( !oInput.binded ){
				Core.Events.addEvent( oInput, function(){
					passcardOBJ.init(
					oInput,
					{
						overfcolor: "#999",
						overbgcolor: "#e8f4fc",
						outfcolor: "#000000",
						outbgcolor: ""
					},
					oPassword,
					parent);
					oInput.style.color = "#333333";
					if(oInput.value==sText){ oInput.value = "" }
				}, "focus" );
				Core.Events.addEvent( oInput, function(){
					oInput.style.color = "#999999";
					if(oInput.value==""){ oInput.value = sText }
				}, "blur" );
				oUserInput.binded = true;
			}
		})("电子邮箱/UC号/会员帐号/手机号", oUserInput, oUserPassword, oUserInput.value);
	}
};

/**
 * 收起小评论
 * @param {String} sProductId	必选参数，产品 ID，例如：record - 微博客
 * @param {String} iResourceId	必选参数，资源 ID，被评论的资源
 */
scope.closeCommentByRid = function(sProductId, iResourceId){
	var oListNode = $E( "_comment_list_" + sProductId + "_" + iResourceId );
	oListNode.innerHTML = "";
	oListNode.loaded = false;
};

/**
 * 根据参数加载评论列表
 * @param {Number} iOwnerUid	必选参数，资源所属者 UID
 * @param {String} sProductId	必选参数，产品 ID，例如：record - 微博客
 * @param {String} sProductName	必选参数，产品名称，例如：微博客
 * @param {String} iResourceId	必选参数，资源 ID，被评论的资源
 * @param {String} sResTitle	必选参数，资源标题
 * @param {String} sResInfo		必选参数，资源其他信息
 * @param {String} sNodeId		可选参数，评论列表写入的节点ID，如果不指定，就写到ID为 "_comment_list_appID_资源ID" 的节点中
 * @param {Boolean} bListInDiv	可选参数，评论列表是显示在页面还是浮层中，默认是1表示显示在DIV里，链接里不用部署它
 * @param {Boolean} bRefresh	可选参数，指定当前是刷新还是展开，默认是表示展开，链接里不用部署它
 */

scope.loadCommentByRid = function (iOwnerUid, sProductId, sProductName, iResourceId, sResTitle, sResInfo, sNodeId, bListInDiv, bRefresh, iFocus,callback) {
	if(scope.$cuser_status === 'nofull' && scope.$uid !== '' && bListInDiv == 1){
		App.finishInformation();
		return false;
	}
	var oTarget = App.Comment.getTarget();
	var oListNode = $E( "_comment_list_" + sProductId + "_" + iResourceId );
	scope.commentConfig.ListNode = oListNode;
	if( oListNode != null ){
		if( !oListNode.loaded || bRefresh==1){
			//App.Comment.changeArrow("up");
			if(!oListNode.loaded){
				oListNode.innerHTML = '<div style="padding:30px 0;text-align:center"><img src="'+scope.$BASEIMG+'style/images/common/loading.gif" /></div>';
				oListNode.style["diplay"] = '';
			}
			oListNode.loaded = false;
		}else{
			//App.Comment.changeArrow("down");
			oListNode.innerHTML = "";
			oListNode.loaded = false;
			return;
		}
		App.Comment.loadData( scope.commentConfig.sDataUrl, oListNode,
		//请求评论数据使用的参数
		{
			"act"         : bListInDiv,
			"from"        : scope.currentCommentPage || scope.commentConfig.defaultPage,
			"ownerUid"    : iOwnerUid,
			"productId"   : sProductId,
			"resId"       : iResourceId,
			"resInfo"     : sResInfo,
			"type"        : bListInDiv
		},
		//请求评论数据成功时回调
		function(oResult){
			//标记内容已经加载
			oListNode.loaded = true;
			//为TextArea绑定自适应高度，并限定输入字数
			oListNode.removeAttribute("cacheid");
			try { App.bindMedia(oListNode) }catch(e){};
			var oContentNode = $E( "_comment_content_" + sProductId + "_" + iResourceId );
				App.Comment.listenerUserInput(oContentNode, scope.commentConfig.iInputLimitSize);
			//绑定发送按钮
			var oPostNode = $E( "_comment_post_" + sProductId + "_" + iResourceId );
			var oLoginDiv = $E( "_comment_logindiv_" + sProductId + "_" + iResourceId );
			var oLoginuser = $E( "_comment_loginuser_" + sProductId + "_" + iResourceId );
			var oLoginpassword = $E( "_comment_loginpassword_" + sProductId + "_" + iResourceId );
			var i=0, inputs = oListNode.getElementsByTagName("input"), len = inputs.length;

			var oForward = $E("agree_"+iResourceId);
			var oIsRoot = $E("isroot_"+iResourceId);

			//xingmin modified
			//由于php更改了input的id，所以label的for属性可以自动匹配input，所以以下代码可以取消
			/*
			if(len){
				for(i; i<len; i++){
					if(inputs[i].id === "agree"){
						var n = inputs[i].nextSibling;
						while(n && n.tagName!="LABEL"){
							n = n.nextSibling;
						}
						if(n){
							n["for"] = "";
							n.removeAttribute && n.removeAttribute("for");
							n.onclick = (function(inp){
								return function(){
										inp.checked = !inp.checked;
										Core.Events.stopEvent();
								}
							})(inputs[i]);
						}
					}
					else if(inputs[i].id === "isroot"){
						n = inputs[i].nextSibling;
						while(n && n.tagName!="LABEL"){
							n = n.nextSibling;
						}
						if(n){
							n["for"] = "";
							n.removeAttribute && n.removeAttribute("for");
							n.onclick = (function(inp){
								return function(){
										inp.checked = !inp.checked;
										Core.Events.stopEvent();
								}
							})(inputs[i]);
						}
					}
				}
			}
			*/
				scope.initCommentLoginInput(oLoginuser, oLoginpassword);
				oPostNode.oParam = {
					"uid"         : scope.$uid,
					"ownerUid"    : iOwnerUid,
					"resourceId"  : iResourceId,
					"productId"   : sProductId,
					"productName" : sProductName,
					"resTitle"    : sResTitle,
					"resInfo"     : sResInfo,
					"listInDiv"   : bListInDiv
				};
				if( !oPostNode.binded ){
					Core.Events.addEvent( oPostNode,
						function(){
							//
							/*
							var inputs = oContentNode.parentNode.parentNode.getElementsByTagName("input");
							var len = inputs.length;
							
							for(var i = 0;i < len;i++){
								if(/^agree/.test(inputs[i].id)){
									oPostNode.oParam.forward = (inputs[i].checked)?"1":"0";//指明需要转发
								}
								else if(/^isroot/.test(inputs[i].id)){
									oPostNode.oParam.isroot = (inputs[i].checked)?"1":"0";//指明需要评论给原作者
								}
							}
							*/
							//
							oForward && (oPostNode.oParam.forward = (oForward.checked)?"1":"0");//指明需要转发
							oIsRoot && (oPostNode.oParam.isroot = (oIsRoot.checked)?"1":"0");	//指明需要评论给原作者

							var func = Core.Function.bind3( App.Comment.addComment, App.Comment, [ scope.commentConfig.sPostUrl, oPostNode, 
								function(oResult,oData){
									var callback = null;																		
									if(scope.commentConfig.params.role !== undefined && scope.commentConfig.params.role != -1){
										callback = function(){	
											var tip = App.alert({code:"M02007"},{icon:3,hasBtn:false});
											setTimeout(function(){
									            tip.close();
									        }, 1000);
										}
									}
									if(oData.data){
										var oInnerNode;
										if (bListInDiv==1) {
											oInnerNode = Core.Dom.getElementsByClass(oListNode,"ul","PL_list")[0];
										}else{
											oInnerNode = Core.Dom.getElementsByClass(oListNode,"ul","commentsList")[0];
										}
										Core.Dom.insertHTML(oInnerNode,oData.data,"afterbegin");
										//小评论评论数处理
										try {
											App.bindMedia(oInnerNode.getElementsByTagName("li")[0])
										}catch(e){}
										try{
											App.Comment.superCount(oListNode,"+");
										}catch(e){}
										oContentNode.value = "";
										App.Comment.focus(oContentNode);
									}else{
										scope.loadCommentByPage.bind2(oPostNode)(0,1,callback);
									}
								}, 
								function(oResult){
									if(oResult.code=="A00003"){
										oPostNode.$loginDiv = oLoginDiv;
										oPostNode.$loginuser = oLoginuser;
										oPostNode.$loginpassword = oLoginpassword;
										oLoginDiv.style["display"] = "block";
										oPostNode.className = "btn_normal";
										oPostNode.locked = false;
									}else if(oResult.code == 'M01155'){
										App.Comment.alert(oPostNode,App.getMsg(oResult.code), 1, function(){});
										oContentNode.value = '';
										oPostNode.className = "btn_normal";
										oPostNode.locked = false;
									}
									//防刷弹层
									else if(oResult.code == "MR0050"){
										oPostNode.className = "btn_normal";
										oPostNode.locked = false;
										App.forbidrefresh(function(){
											scope.commentConfig.params["retcode"] = scope.doorretcode || "";
											scope.doorretcode = "";
											Core.Events.fireEvent(oPostNode,"click");
										}, scope.commentConfig.sPostUrl);
									}
									else{
										oPostNode.className = "btn_normal";
										oPostNode.locked = false;
										App.Comment.alert(oPostNode,App.getMsg(oResult.code), 1, function(){});
									}
								} 
							]);
							func();
						},
					"click" );
					Core.Events.addEvent(oContentNode,function(event){
						if((event.ctrlKey==true && event.keyCode=="13")||(event.altKey==true && event.keyCode=="83")){
							oContentNode.blur();
							Core.Events.fireEvent(oPostNode,"click");
						}
					},"keyup");
					//标记按钮已绑定
					oPostNode.binded = true;
				}
			if( iFocus==1 ){
				if(bListInDiv==2){
					var _w = window, _d = _w["document"], _e = _d["documentElement"]||{};
					var fixHeight = Core.Dom.getTop(oContentNode);
					var st = (_w.pageYOffset||Math.max(_e.scrollTop, _d["body"].scrollTop));
					fixHeight = (st>fixHeight)?fixHeight-150:null;
					App.Comment.focus(oContentNode, fixHeight);
				}else{
					App.Comment.focus(oContentNode);
				}
			}
			if(!scope.loginKit().isLogin){
				oPostNode.$loginDiv = oLoginDiv;
				oPostNode.$loginuser = oLoginuser;
				oPostNode.$loginpassword = oLoginpassword;
				oLoginDiv.style["display"] = "block";
			}
			if(typeof(callback) == "function"){
					setTimeout(callback,200);
			}
		},
		//失败处理
		function(oResult){
			App.Comment.alert(oTarget, App.getMsg(oResult.code));
		}.bind2(this));
	}
};

/**
 * 根据参数删除评论
 * @param {Number}  iCommentUid	必选参数，发评论者 UID
 * @param {Number}  iOwnerId	必选参数，资源所属者 UID
 * @param {Number}  iResourceId	必选参数，资源 ID，被评论的资源
 * @param {Number}  iCid		必选参数，评论 ID
 * @param {String}  sProductId	必选参数，产品 ID，例如：record - 微博客
 * @param {Number}  bRefresh	可选参数，删除完是否刷新当前列表
 */

scope.deleteCommentByRid = function(iCommentUid, iOwnerId, iResourceId, iCid, sProductId, bListInDiv, bRefresh){
	var oTarget = App.Comment.getTarget();
	var oPostNode = $E( "_comment_post_" + sProductId + "_" + iResourceId );
	var oLoginDiv = $E( "_comment_logindiv_" + sProductId + "_" + iResourceId );
	var oLoginuser = $E( "_comment_loginuser_" + sProductId + "_" + iResourceId );
	var oLoginpassword = $E( "_comment_loginpassword_" + sProductId + "_" + iResourceId );
	var deleteAction = function(oIsLogin){
		var sText = App.getMsg("SCM001");
		if(iCommentUid != iOwnerId && iCommentUid!= scope.$uid && (Core.Array.findit(App.admin_uid_list,iCommentUid)===-1)){
			sText += "<div style='margin-top:10px;font-size:14px;'>" +
					"<input style='vertical-align:-1px;margin-right:3px;' type='checkbox' " +
					"id='block_user' name='block_user'><label for='block_user'>"+$CLTMSG['CC0601']+"</label></div>";
		}
		App.Comment.alert( oTarget, sText, 4, function(){
			var oPost = {
				"act"        : "delComment",
				"resUid"     : iOwnerId,
				"resId"      : iResourceId,
				"id"         : iCid,
				"productId"  : sProductId,
				"commentId"  : iCommentUid
			};
			if($E("block_user") && $E("block_user").checked){
				oPost.isblack = "OK";
			}
			App.Comment.deleteComment( scope.commentConfig.sDeleteAPI,
				oPost,
				//删除成功后回调
				function(oResult){
					if(oIsLogin){
						setTimeout(function(){
							window.location.reload(true);
						},10);
						return;
					}
					if(bRefresh==1){
						if(!scope.$resourceId && bListInDiv == 2){
							setTimeout(function(){
								window.location.reload(true);
							},10);
						}else{
							var clz = "commentsCell",oWaper = oTarget;
							if(bListInDiv==1){
								clz = "MIB_linedot3";
							}
							while(true){
								if(([" ",oWaper.className," "].join("").indexOf(clz)!=-1) || !(oWaper = oWaper.parentNode)){break}
							}
							var oParentNode = oWaper.parentNode;
							oParentNode.removeChild(oWaper);
							try{
								App.Comment.superCount(oParentNode.parentNode,"-",function(){
									scope.loadCommentByPage.bind2(oPostNode)(scope.currentCommentPage)
								});
							}catch(e){}
						}
					}
					if(bRefresh === false){//评论搜索结果页面删除不刷新
					    var oItem = oTarget.parentNode.parentNode;
					    if(oItem && oItem.className.indexOf("commentsCell") !== -1){
					        oItem.parentNode.removeChild(oItem);
					    }
					}
				},
				//删除失败后回调
				function(oResult){
					if(!oResult.code){return}
					if(oResult.code=="A00003"){
						App.ModLogin(function(){});
					}else{
						App.Comment.alert(oTarget, App.getMsg(oResult.code),1,function(){window.location.reload(true);});
					}
				}
			);
		},function(){});
	};
	if(!scope.loginKit().isLogin){
		App.ModLogin({
			"func": function(){
				deleteAction(true);
			}
		});
	}else{
		deleteAction();
	}
};

/**
 * App中载入指定页码的评论列表
 * @param {Number} nPage	可选参数，页码
 */

scope.loadCommentByPage = function (nPage,iFocus,callback){
	// 将当前要加载的页码保存到变量 scope.currentCommentPage 中
	iFocus = iFocus || 0;
	scope.currentCommentPage = nPage || scope.commentConfig.defaultPage;
	if(this.oParam){
		var oParam = this.oParam;
		scope.loadCommentByRid(oParam.ownerUid, oParam.productId, oParam.productName, oParam.resourceId, oParam.resTitle, oParam.resInfo, '', oParam.listInDiv, 1, iFocus,callback);
	}else{
		scope.loadCommentByRid(scope.$oid||"", $CONFIG.$product||"", scope.$appName||"", scope.$resourceId||"",  scope.$resTitle||"", scope.$resInfo||"", '', "2", 1, iFocus,callback);
	}
	
	
	var e = Core.Events.getEvent();	
	if(e.type != 'click'){return;}
	var listNode = scope.commentConfig.ListNode;
	if(listNode){
		var top = Core.Dom.getTop(listNode);
		
		var ua = navigator.userAgent.toLowerCase(),ue = {};
		var de = document.documentElement;
		
		
		ue.chrome = /chrome/i.test(ua);
        var de = document.documentElement;
		if(ue.chrome){
			de = document.body;
		}
		de.scrollTop = top+40;
	}
	
};

/**
 * 回复某人的评论
 * @param {Number}  iCommentUid 必选参数，发评论者 UID
 * @param {Number}  iOwnerUid   必选参数，资源所属者 UID
 * @param {Number}  iResourceId 必选参数，资源 ID，被评论的资源
 * @param {Number}  iCid        评论 ID
 * @param {String}  sCname      评论者昵称
 * @param {String}  sProductId  必选参数，产品 ID，例如：miniblog - 微博客
 * @param {Number}  bListInDiv  可选参数，评论列表是显示在页面还是浮层中，默认是1表示显示在DIV里，链接里不用部署它
 * @param {Number}  bRefresh    可选参数，删除完是否刷新当前列表
 * @param {String}  sResTitle   必选参数，资源标题只有在评论管理中才会出现
 */

scope.replyByCid = function(iCommentUid, iOwnerUId, iResourceId, iCid, sCname, sReplyContent, sProductId, bListInDiv, bRefresh ,sResTitle){
	bListInDiv = bListInDiv==1?1:2;
	var oContentNode;
	var sCurrentValue;
	var oPostNode = $E("_comment_post_" + sProductId + "_" + iResourceId );
	var oLoginDiv = $E( "_comment_logindiv_" + sProductId + "_" + iResourceId  + ( bListInDiv==2? "_" + iCid: "" ));
	var oLoginuser = $E( "_comment_loginuser_" + sProductId + "_" + iResourceId  + ( bListInDiv==2? "_" + iCid: "" ));
	var oLoginpassword = $E( "_comment_loginpassword_" + sProductId + "_" + iResourceId  + ( bListInDiv==2? "_" + iCid: "" ));
		scope.initCommentLoginInput(oLoginuser, oLoginpassword);
	//小评论将回复内容初始化到唯一的发布框中
	if( bListInDiv == 1 ){
		oContentNode = $E( "_comment_content_" + sProductId + "_" + iResourceId );
		if(oPostNode && oPostNode.oParam){
			//拓展回复参数，回复者的uid
			oPostNode.oParam["replyUid"] = iCommentUid;
			//拓展回复参数，回复内容
			oPostNode.oParam["ccontent"] = sReplyContent;
			//拓展回复参数，回复评论的id
			oPostNode.oParam["cid"] = iCid;
		}
	}
	//如果是大评论初始化回复内容到评论下方的输入框中
	else{
		oContentNode = $E( "_comment_content_" + sProductId + "_" + iResourceId + "_" + iCid );
		var oReplyPanel = $E( "_comment_reply_" + sProductId + "_" + iResourceId + "_" + iCid );
			if(oReplyPanel.isOpen){
				oReplyPanel.style["display"] = "none";
				oReplyPanel.isOpen = false;
				return;
			}else{
				oReplyPanel.style["display"] = "block";
				oReplyPanel.isOpen = true;
			}
		//
		var inputs = oReplyPanel.getElementsByTagName("input");
		var len = inputs.length;
		var oForward = $E("agree_"+iCid);
		var	oIsRoot = $E("isroot_"+iCid);
		//xingmin modified
		//由于php更改了input的id，所以label的for属性可以自动匹配input，所以以下代码可以取消
		/*
		for(var i = 0;i < len;i++){
			if(/^agree/.test(inputs[i].id)){
				oForward = inputs[i];
				var n = oForward.nextSibling;
				while(n && n.tagName!="LABEL"){
					n = n.nextSibling;
				}
				if(n){
					n["for"] = "";
					n.removeAttribute && n.removeAttribute("for");
					n.onclick = (function(inp){
						return function(){
								inp.checked = !inp.checked;
								Core.Events.stopEvent();
						}
					})(oForward);
				}
				
			}
		}
		*/
		if(oForward && oForward.parentNode){
			oForward.parentNode.style.display = "block";
		}
		//
		//回复按钮效继承唯评论按钮的基础属性
		var oReplyButton = $E("_comment_post_" + sProductId + "_" + iResourceId + "_" + iCid );
			oReplyButton.oParam = ( !oPostNode )?{
				"uid"         : scope.$uid,
				"ownerUid"    : iOwnerUId,
				"resourceId"  : iResourceId,
				"productId"   : sProductId,
				"resTitle"    : sResTitle,
				"listInDiv"   : bListInDiv
			}:(function(){
				//克隆主键属性，应用给回复按钮
				var obj = {};
				for(var p in oPostNode.oParam){
					obj[p] = oPostNode.oParam[p];
				}
				return obj;
			})();
			//拓展回复参数，回复者的uid
			oReplyButton.oParam["replyUid"] = iCommentUid;
			//拓展回复参数，回复内容
			oReplyButton.oParam["ccontent"] = sReplyContent;
			//拓展回复参数，回复评论的id
			oReplyButton.oParam["cid"] = iCid;
		if(!oReplyButton.binded){
			//绑定点击事件，到评论下方的发布按钮
			
			Core.Events.addEvent( oReplyButton,function(){
//				if(oForward.checked){
//					oReplyButton.oParam.forward = "1";//指明需要转发
//				}
				oForward && (oReplyButton.oParam.forward = (oForward.checked)?"1":"0");	//指明需要转发
				oIsRoot && (oReplyButton.oParam.isroot = (oIsRoot.checked)?"1":"0");	//指明需要评论给原作者
				var func = Core.Function.bind3( App.Comment.addComment, App.Comment, [ scope.commentConfig.sPostUrl, oReplyButton, 
						function(oResult){						
							if(bRefresh==1){
								var cb ;
								if(scope.commentConfig.params.role !== undefined && scope.commentConfig.params.role != -1){
									cb = function(){
										return App.alert({code:"M02008"},{icon:3});
									}	
								}								
								//刷新评论列表
								scope.loadCommentByPage.bind2(oReplyButton)(0,1,cb);
							}else{
								//如果不需要刷新，则显示回复成功提示
								var oParam = oReplyButton.oParam;
								var oReplyPanel = $E( "_comment_reply_" + oParam.productId + "_" + oParam.resourceId + "_" + oParam.cid );
									oContentNode.value = "";
									oReplyButton.isOpen = false;
									oReplyButton.className = "btn_normal";
									if(scope.$pageid == "commentHandler"){
										//var oReplayContent = $E( "_comment_panel_" + oParam.productId + "_" + oParam.resourceId + "_" + oParam.cid );
										var oReplayTip     = $E( "_comment_paneltip_" + oParam.productId + "_" + oParam.resourceId + "_" + oParam.cid );						
										if(oReplyPanel && oReplayTip){
											//oReplayTip.style.display  = "";
											//oReplyPanel.style.display = "none";
											//if(oForward && oForward.parentNode){
											//	oForward.parentNode.style.display = "none";
											//}
											var _successDialog = App.Comment.tip(oReplyButton, App.getMsg("SCM007"), 3, function(){});
											_successDialog.onClose = function(){
												window.clearTimeout(_successDialog["clock"]);
												oReplayTip.style.display  = "none";
												oReplyPanel.style.display = "none";
											};
											_successDialog["clock"] = window.setTimeout(function(){
												_successDialog.close();
											},1000);
										}
									}else{
										App.Comment.alert(oReplyButton, App.getMsg("SCM007"), 3, function(){});
										oReplyPanel.style.display = "none";	
									}									
									oReplyPanel.isOpen = false;
							}
						}, 
						function(oResult){
							if(oResult.code=="A00003"){
								oReplyButton.$loginDiv = oLoginDiv;
								oReplyButton.$loginuser = oLoginuser;
								oReplyButton.$loginpassword = oLoginpassword;
								oLoginDiv.style["display"] = "block";
								oReplyButton.className = "btn_normal";
								oReplyButton.locked = false;
							}else if(oResult.code == 'M01155'){ //如果重复提交
								oReplyButton.className = "btn_normal";
								oReplyButton.locked = false;
								App.Comment.alert(oReplyButton, App.getMsg(oResult.code), 1, function(){});
								oContentNode.value = "";
							}
							//防刷弹层
							else if(oResult.code == "MR0050"){
								App.forbidrefresh(function(){
									oReplyButton.className = "btn_normal";
									oReplyButton.locked = false;
									scope.commentConfig.params["retcode"] = scope.doorretcode||"";
									scope.doorretcode = "";
									Core.Events.fireEvent(oReplyButton,"click");
								},scope.commentConfig.sPostUrl);
							}
							else{
								oReplyButton.className = "btn_normal";
								oReplyButton.locked = false;
								App.Comment.alert(oReplyButton, App.getMsg(oResult.code), 1, function(){});
							}
						} 
					]);
				func();
			},
			"click" );
			Core.Events.addEvent(oContentNode,function(event){
				if((event.ctrlKey==true && event.keyCode=="13")||(event.altKey==true && event.keyCode=="83")){
					oContentNode.blur();
					Core.Events.fireEvent(oReplyButton,"click");
				}
			},"keyup");
			oReplyButton.binded = true;
		}
		if(!scope.loginKit().isLogin){
			oReplyButton.$loginDiv = oLoginDiv;
			oReplyButton.$loginuser = oLoginuser;
			oReplyButton.$loginpassword = oLoginpassword;
			oLoginDiv.style.display = "block";
		}
	}
	App.Comment.listenerUserInput(oContentNode, scope.commentConfig.iInputLimitSize);
	sCurrentValue = Core.String.trim( oContentNode.value );
	//chibin modify for language
	//var reg = /^\u56de\u590d[^:]*:/;
	var reg = new RegExp('^'+$CLTMSG['CC0501']+'[^:]*:');
		if(reg.test(sCurrentValue)){
			oContentNode.value = sCurrentValue.replace(reg,$CLTMSG['CC0602']+sCname+":");
		}else{
			oContentNode.value = $CLTMSG['CC0602'] + sCname + ":" + sCurrentValue;
		}
	//给评论输入框重置交点
	var _w = window, _d = _w["document"], _e = _d["documentElement"]||{};
	var fixHeight = Core.Dom.getTop(oContentNode);
	var st = (_w.pageYOffset||Math.max(_e.scrollTop, _d["body"].scrollTop));
	fixHeight = (st>fixHeight)?fixHeight-150:null;
	App.Comment.focus(oContentNode, fixHeight);
};

/**
 * 请求当前页中评论数，并更新评论数显示
 */

scope.getCommentCount = function(oData){
	var oGet = oData || scope.$commentdata;
	var aProductIds  = [];
	var aOwnerUids   = [];
	var aResourceIds = [];
	if( oGet && oGet.length > 0 ){
		var i = 0;
		for( i; i<oGet.length; i++ ){
			aProductIds.push(oGet[i].pid);
			aOwnerUids.push(oGet[i].oid);
			aResourceIds.push(oGet[i].rid);
		}
		Utils.Io.Ajax.request("/comment/commentnum.php",{
			"POST" : {
				"resourceids" : aResourceIds.join(","),
				"productids"  : aProductIds.join(","),
				"ownerUids"   : aOwnerUids.join(",")
			},
			"onComplete" : function (oResult){
				if(oResult.code=="A00006"){
					var oData = oResult.data;
					if( oData ){
						var i;
						var hashList = {};
						//处理feed评论数，如果没有评论数则显示0
						for( i in oData ){
							hashList[oData[i]["resourceid"]] = oData[i].count;
							var oCountNode = $E("_comment_count_" + oData[i].productid + "_" + oData[i].resourceid );
							if(oCountNode){
								App.Comment.setCount(oCountNode,oData[i].count||0);
							}
						}
						//处理转发的评论数，如果没有评论数则显示0
						
						var fwList = document.getElementsByName("_comment_count_" + oData[i].productid);

						var len = fwList.length;
						if( len > 0 ){
							var i = 0;
							for( i; i<len; i++){
								var fwA = fwList[i];
								if( !fwA.changed ){
									var value = fwA.getAttribute("resid");
									var snapValue = hashList[value];
									if( hashList[value] ){
										fwA.innerHTML = $CLTMSG["CC0603"]+"<string>(" + (hashList[value]||0) + ")</string>";
									}else{
										fwA.innerHTML = $CLTMSG["CC0603"]+"<string>(0)</string>";
									}
									fwA.changed = true;
								}
							}
						}
					}
				}
			},
			returnType : "json"
		});	
	}
};

/**
 * 为大评论链接提供的内容焦点方法
 * @param {Object} sProductId   必选参数，产品ID
 * @param {Object} iResourceId  必选参数，资源ID
 */
scope.focusCommentContent = function(sProductId, iResourceId ){
	//TODO V3切换域名调整临时写死，后期需要php配合大小评论在将该处移除
	sProductId = 'miniblog';
	
	var oContentNode = $E("_comment_content_" + sProductId + "_" + iResourceId);
	App.Comment.focus(oContentNode);
}
/**
 * 加载不同的参数
 */
scope.loadComment = function(role){
	if(role !== undefined){		
		Core.Class.extend(scope.commentConfig.params,{role:role.toString()});		
	}	
	//如果是大评论，则直接请求评论内容
	if(scope.$resourceId){
		scope.loadCommentByPage(1);
	}
	//请求当前页评论数
	//scope.getCommentCount();
}
/**
 * JOB：初始化 App 中的评论列表（即大评论）
 */

$registJob("loadComment", function () {
	scope.loadComment(scope.$pageid =="mblog"?"-1":undefined);
});
