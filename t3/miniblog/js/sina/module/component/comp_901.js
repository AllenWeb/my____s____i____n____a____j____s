/**
 * @fileoverview
 *	定义个人信息组件类
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-08
 */
$import("sina/module/component/registComp.js");
// 引入接口
$import("sina/interface.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/template.js");
$import("sina/utils/windowDialog.js");
$import("sina/module/setNick.js");
$import("sina/module/v6SendLog.js");
$import("sina/module/SeeStateAdd.js");
$import("sina/module/SeeStateHot.js");
/**
 * 定义个人信息组件类
 */
$registComp("901", {
	load : function () {
		$Debug("load has been overwrote.");
		checkAuthor();
		// 加好友、发纸条布码
		if(!$isAdmin){
			var url = "http://sjs.sinajs.cn/common/js/new_all.js?" + Math.random();
			Utils.Io.JsLoad.request(url, {
				onComplete : function(){
					if(window.SpaceUserFriend != null) {
						Core.Dom.insertHTML(document.body, window.SpaceUserFriend.createContent(), "BeforeEnd");
						window.SpaceUserFriend.init();
					}
					else{
						var SpaceUserFriend = {};
						SpaceUserFriend.show = function () {};
					}
					if(window.SpaceUserSendMsg != null) {
						Core.Dom.insertHTML(document.body, window.SpaceUserSendMsg.createContent(), "BeforeEnd");
						window.SpaceUserSendMsg.init();
					}
					else{
						var SpaceUserSendMsg = {};
						SpaceUserSendMsg.show = function () {};
					}
				},
				noreturn : true
			});
		}

		if($isAdmin || !$isLogin){
			this.isFriend = false;
			this.checkOnline();
		}		
		else if ($isLogin && $isAdmin == false) {
			var _isFriend = new Interface("http://icp.cws.api.sina.com.cn/friend/IsFriend.php", "jsload");
			_isFriend.request({
				GET: {
					"friend_uids": scope.$uid
				},
				//接口传输正常，且状态码为A00006,(可选)
				onSuccess: (function(result){
					for(var i = 0; i < result.length; i ++ ){
						if(result[i].uid == scope.$uid){
							this.isFriend = (result[i].status == 1) ? true : false;
						}
					}
					this.isFriend = (this.isFriend != null) ? this.isFriend : false;
					this.checkOnline();
				}).bind2(this),
				//接口传输正常，且状态码不是A00006,(可选)
				onError: (function(result){
					//				alert("no: " + result);
					this.isFriend = false;
					Module.setNick.get(function(){
						this.parse();
					}.bind2(this));
				}).bind2(this),
				//接口传输异常,(可选)
				onFail: (function(){
					$Debug("个人信息组件接口读取失败");
					this.isFriend = false;
					Module.setNick.get(function(){
						this.parse();
					}.bind2(this));
				}).bind2(this)
			});
		}
	},
	checkOnline : function () {
		var _isOnline = Utils.Io.JsLoad.request("http://online.sso.sina.com.cn/status/MutiqueryVProduct.php", {
			GET : {
				"UIDS" : '[' + scope.$uid + ']',
				"Check" : scope.$key,
				"ProductType" : "1000",
				"Verbose" : "0",
				"noencode" : true
			},
			//接口传输正常，且状态码为A00006,(可选)
			onComplete : (function(result){
				try {
					var _status = result.Status;
					this.isOnline = (_status[0] == 1) ? true : false;
				}
				catch(e){
					this.isOnline = $isAdmin ? true : false;
				}
				Module.setNick.get(function(){
					this.parse();
				}.bind2(this));
			}).bind2(this),
			//接口传输异常,(可选)
			onException : (function(){
				$Debug("个人信息组件接口读取失败");
				this.isOnline = false;
				Module.setNick.get(function(){
					this.parse();
				}.bind2(this));
			}).bind2(this)
		});		
	},
	parse : function (result) {
		var productKey = {
			"blog" : "blog",
			"vblog" : "video",
			"photo" : "photo",
			"music" : "music",
			"icp" : "profile"
		};
		window.friendNotOnline = function () {
			windowDialog.alert("你的好友不在线，暂无法聊天", {"icon" : "03"});
			v6SendLog(productKey[scope.$domain || $CONFIG.$product], "profile", "chat");
		};
		checkAuthor();
		var _template = '<div class="CP_pf_hd">'
				+ '<p class="CP_avt"><a class="CP_avt_a"' + ($isAdmin ? 'href="http://icp.api.sina.com.cn/person/update_base.php?productid=' + scope.pid_map[$CONFIG.$product]+ '"' : '') + '>'
				+ ($isAdmin ? ('<img id="blogInfoPhoto" src="#{head}" class="CP_brd" alt="#{nickInImage}" title="#{nickInImage}" '
				+ 'onerror="this.src=\'http://www.sinaimg.cn/pay/space/images/head180.gif\';this.onerror=null;"/>') : '<img alt="#{nick}" title="#{nick}" class="CP_brd" src="#{head}"/>') 
				+ '</a></p>'
				+ '<p class="CP_pf_nm">#{online}<span>#{nickWithWBR}</span></p>'
				+ '#{button}'
			+ '</div>'
			+'<div class="CP_pfli CP_j_linedot1">'
				+'<ul class="CP_pfli CP_j_linedot1s">'
					+'<li class="Attr_Num"><em class="CP_txtc"><a href="http://blog.sina.com.cn/lm/help/2009/profile.html?id=58" target="_blank">关注人气</a>：</em><cite><span id="attention_hot">读取中</span><a href="http://blog.sina.com.cn/lm/help/2009/profile.html?id=58" target="_blank"><img src="http://simg.sinajs.cn/common/images/icon20/CP_attract_new.gif" class="AttR_iconNew"/></a></cite></li>'
				+'</ul>'
			+'</div>';
//		$Debug("是否在线：" + this.isOnline + "，是否好友：" + this.isFriend);
		var _info = {};
		_info.uid = $uid;
		_info.nick = (scope.nick[$uid] == null || scope.nick[$uid] == "") ? $uid.toString() : scope.nick[$uid];
		_info.nickInImage = ($isAdmin) ? "点击上传头像" : _info.nick;
		_info.nickWithWBR = _info.nick.replace(/^(.{14})/, "$1<wbr/>");
		_info.head =  "http://portrait" + ($uid%8 +1) +".sinaimg.cn/" + $uid + "/blog/180";
		$Debug("this.isOnline ="+this.isOnline );
		if(this.isOnline && this.isOnline == true){
			_info.online = '<img align="absmiddle" title="在线中" alt="" src="http://simg.sinajs.cn/common/images/CP_i.gif" class="CP_i CP_i_on"/>';
		}
		
		if(!$isAdmin){
			_info.button = '<p class="CP_pf_btns"><a class="CP_a_btn CP_a_btn12 ' 
//							由于 webIM 上线后出现故障，临时关闭在线聊天功能 @modified by L.Ming | 2009.03.11
							+ (this.isFriend && (this.isOnline == false) ? "SG_aBtn_dis" : "") 
							+ '" href="#" onclick="return false;"><cite onclick="' +(this.isFriend ? (this.isOnline ? 'webIM.msg(\'' + scope.$uid + '\');v6SendLog(\'' + productKey[scope.$domain || $CONFIG.$product] + '\',\'profile\',\'chat-online\');' : 'friendNotOnline();') : 'SpaceUserFriend.show(' + scope.$uid + ');') + '">' 
							+ (this.isFriend ? '&nbsp;在线聊天&nbsp;' : '&nbsp;&nbsp;加好友&nbsp;&nbsp;') + '</cite></a><a class="CP_a_btn" href="#" onclick="return false;"><cite onclick="SpaceUserSendMsg.show(' + scope.$uid + ');">&nbsp;&nbsp;发纸条&nbsp;&nbsp;</cite></a></p>'
							+ '<p class="CP_pf_btns"><a class="CP_a_btn" href="http://profile.blog.sina.com.cn/wall.php?uid='+scope.$uid+'#write"><cite>&nbsp;&nbsp;写留言&nbsp;&nbsp;</cite></a>'
							+ '<a href="#" onclick="return false;" class="CP_a_btn"><cite class="info_addAttrBtn" onclick="Module.SeeState.add()">&nbsp;&nbsp;<strong>加关注</strong>&nbsp;&nbsp;</cite></a>';
		}
		this.show(new Utils.Template(_template).evaluate(_info));
		Module.SeeState.setHotNumber();
	},
	show : function (sResult) {
		$Debug("show has been overwrote.");
		this.getContent().innerHTML = '<div class="CP_pf">' + sResult + '</div>';
		this.finalize();
	}
}); 