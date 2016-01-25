/**
 * @author shaomin | shaomin@staff.sina.com.cn
 *@ desc 推荐插件
 */	
 
$import("sina/core/string/decodeHTML.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/dom/setXY.js");
 
var _ua = navigator.userAgent.toLowerCase();
/** IE */
var $ie = /msie/.test(_ua);
/** FireFox */
var $moz = /gecko/.test(_ua);
/** Safari */
var $safari = /webkit/.test(_ua);

var rndID = 1024; //parseInt(Math.random() * 10000);
/**
 * 是否已经初始化名片
 */
var isCreate = false;
/** 显示的窗口 */

var isParentInit = false;


SpaceCommend = {
	CRRENTUSERTYPE : 0,
	initialized : false,
//	Base = {}, //当前页面的事件
//	this.Dom = {}, //本模块对基本的dom 对象操作
//	this.Utils = {}, // js 共有事件的定义
	cssCode : '<div style="display: none;">&nbsp;'+
			'<style>'+
			'.layer_userlist select,input{vertical-align:middle;}'+
			'.layer_userlist a{text-decoration:none;}'+
			'.layer_userlist a:link{color:#43609C;}'+
			'.layer_userlist a:visited{color:#43609C;}'+
			'.layer_userlist a:hover{color:#cc0000; text-decoration:underline}'+
			'.layer_userlist em{ font-style:normal}'+
			'.layer_userlist .wordwrap {word-wrap:break-word;word-break:break-all; }'+
			'.layer_userlist .fleft{ float:left}'+
			'.layer_userlist .fright{ float:right}'+
			'.layer_userlist .clearit{clear:both;}'+
			'.layer_userlist .cblue{ color:#43609C}'+
			'.layer_userlist input[type="radio"]{ margin-top:-3px;}'+
			'.layer_userlist input[type="checkbox"]{ margin-top:-3px;}'+
			'.layer_userlist{ clear:both; width:510px; overflow:hidden;color:#666; text-align:left; font-family:"宋体"}'+
			'.layer_userlist .userTit{ height:25px; background:url(http://www.sinaimg.cn/pay/space/images2/img_interface/vote_userlist_01.gif) repeat-x left top; border-right:1px solid #E6E6E6;}'+
			'.layer_userlist .userTit li{float:left; }'+
			'.layer_userlist .userTit li em{ font-family:tahoma; font-size:10px;}'+
			'.layer_userlist .userTit li a em{ color:#43609C;}'+
			'.layer_userlist .userTit li a,'+
			'.layer_userlist .userTit li span{ height:25px; display:block; float:left; overflow:hidden; line-height:26px; text-decoration:none; font-family:"宋体" }'+
			'.layer_userlist .userTit li a{ background:url(http://www.sinaimg.cn/pay/space/images2/img_interface/vote_userlist_03.gif) no-repeat left top; padding:0 20px;}'+
			'.layer_userlist .userTit li span{ background:url(http://www.sinaimg.cn/pay/space/images2/img_interface/vote_userlist_02.gif) no-repeat left top; font-weight:600; color:#666; padding:0 15px;line-height:27px;}.layer_userlist .userTit li span{ background:url(http://www.sinaimg.cn/pay/space/images2/img_interface/vote_userlist_02.gif) no-repeat left top; font-weight:600; color:#666; padding:0 15px;line-height:27px;}'+
			'.layer_userlist .info{ height:150px; width:510px; border:1px solid #E6E6E6; border-top:0;overflow-x:hidden; overflow-y:scroll;background:#FFF;}'+
			'.layer_userlist .info li{ width:132px; height:30px; padding:12px 9px 6px 10px; float:left;}'+
			'.layer_userlist .info li img{ background:url(http://www.sinaimg.cn/pay/space/images2/img_interface/vote_userlist_04.gif) no-repeat; border:1px solid #999; width:28px; height:28px; float:left;}'+
			'.layer_userlist .info li div{ padding-left:5px; width:96px;text-overflow:ellipsis; overflow:hidden;white-space:nowrap; height:30px; line-height:15px; }'+
			'.layer_userlist .info li div span{  color:#43609C; display:block; margin-bottom:5px;*margin-bottom:0px;_margin-bottom:-3px;}'+
			'.layer_userlist .optionok { background:#F9F9F9; border:1px solid #E6E6E6; border-top:0; height:25px; padding-top:5px; _height:21px; _padding:2px 0 7px; text-align:center}'+
			'.layer_userlist .optionok input{vertical-align:-2px;*vertical-align:middle;_vertical-align:text-bottom;}'+
			'.btnchoose_jh0715{ height:21px; width:67px; background:url(http://www.sinaimg.cn/pay/space/images2/img_interface/vote_userlist_06.gif) no-repeat; overflow:hidden; display:block; text-decoration:none; padding-left:30px; line-height:21px;*line-height:24px; font-size:12px;}'+
			'.btnchoose_jh0715:link{ text-decoration:none;color:#43609C;}'+
			'.btnchoose_jh0715:visited{ text-decoration:none;color:#43609C;}'+
			'.btnchoose_jh0715:hover{ text-decoration:none;color:#cc0000;}'+
			'a.btn_inline_jh:link,a.btn_inline_jh:visited,a.btn_inline_jh:active{color:#43609c;text-decoration:none;background:url(http://www.sinaimg.cn/pay/space/images2/images/btn_inline.gif) no-repeat 0 0;font-family:"宋体"!important;padding:5px 0 4px 3px;*padding:0 0 0 3px}'+
			'a.btn_inline_jh span,a.btn_inline_jh cite {color:#43609c;text-decoration:none}'+
			'a.btn_inline_jh span {font-size:12px!important;line-height:21px;padding:5px 7px 4px 4px;background:url(http://www.sinaimg.cn/pay/space/images2/images/btn_inline.gif) no-repeat right -25px}'+
			'a.btn_inline_jh cite {font-style:normal}'+
			'a.btn_inline_jh .chat {background:url(http://www.sinaimg.cn/pay/space/images2/images/ico_chat_gren.gif) no-repeat 0 2px;padding-left:13px}'+
			'a.btn_inline_jh:hover span,a.btn_inline_jh:hover cite {text-decoration:none;color:#c00}'+
			'a.btn_inline_jh:active {background:url(http://www.sinaimg.cn/pay/space/images2/images/btn_inline.gif) no-repeat 0 -50px}'+
			'a.btn_inline_jh:active span {background:url(http://www.sinaimg.cn/pay/space/images2/images/btn_inline.gif) no-repeat right -75px}'+
			'body .fn_model{background:#fff;color:#666; text-align:left;}'+
			'.fn_model .tit{font-size:14px;font-weight:bold;height:30px;}'+
			'.fn_model select,input{vertical-align:middle;}'+
			'.fn_model a{text-decoration:none;}'+
			'.fn_model a:link{color:#43609C;}'+
			'.fn_model a:visited{color:#43609C;}'+
			'.fn_model a:hover{color:#cc0000; text-decoration:underline}'+
			'.layer_subm2 select,input{vertical-align:middle;}'+
			'.layer_subm2 a{text-decoration:none;}'+
			'.layer_subm2 a:link{color:#43609C;}'+
			'.layer_subm2 a:visited{color:#43609C;}'+
			'.layer_subm2 a:hover{color:#cc0000; text-decoration:underline}'+
			'.fn_clear{clear:both; overflow:hidden; height:0;}'+
			'.fn_model .input_bor{border:1px solid #ccc; background:#f9f9f9; color:#666;}'+
			'.fn_model .p_img img{vertical-align:-4px;}'+
			'.fn_model{width:550px; border:1px solid #999; background:#fff; overflow:hidden; margin:0 auto;}'+
			'.fn_model .top{height:25px; background:url(http://www.sinaimg.cn/pay/space/images2/images/fuen/layer_top_bg.png) repeat-x; line-height:25px; padding:0 12px;}'+
			'.fn_model .top strong{font-weight:bold;}'+
			'.fn_model .top span{float:right; font-size:18px;}'+
			'.fn_model .con{padding:15px 20px; padding-right:15px;}'+
			'.fn_model .top span{ font-family:Arial, Helvetica, sans-serif}'+
			'.reco_tab{width:100%; color:#333;}'+
			'.reco_tab th{width:65px; height:30px;color:#333; text-align:right; font-style:normal;font-weight:normal; vertical-align:top;}'+
			'.reco_tab td .input_w{width:440px;}'+
			'.reco_tab td .input_w2{width:406px;}'+
			'.reco_tab td p{color:#666;}'+
			'.fn_layer{ line-height:170%;}'+
			'.fn_layer .p_bold{font-weight:bold; font-size:14px; color:#333; margin-bottom:8px;}'+
			'.fn_layer .p_btn{margin-top:8px;}'+
			'.fn_layer .p_c{text-align:center;}'+
			'.fn_layer .layer_l{float:left; padding:0 0 0 10px; text-align:center;}'+
			'.fn_layer .layer_r{float:right;width:305px; margin-left:5px;*margin-left:10px;overflow:hidden; }'+
			'a.btn_inline:link,a.btn_inline:visited,a.btn_inline:active{color:#43609c;text-decoration:none;background:url(http://www.sinaimg.cn/pay/space/images2/images/btn_inline.gif) no-repeat 0 0;font-family:"宋体"!important;padding:5px 0 4px 3px;*padding:0 0 0 3px}'+
			'a.btn_inline span,a.btn_inline cite {color:#43609c;text-decoration:none}'+
			'a.btn_inline span {font-size:12px!important;line-height:21px;padding:5px 7px 4px 4px;background:url(http://www.sinaimg.cn/pay/space/images2/images/btn_inline.gif) no-repeat right -25px}'+
			'a.btn_inline cite {font-style:normal}'+
			'.layer_subm2 dl dd{width:62px;}'+
			'.layer_subm2{width:77px;border:1px solid #999;background-color:#fff; display:block;}'+
			'.layer_subm2 dl{margin:0 6px; padding:0px; }'+
			'.layer_subm2 dl dd{height:21px; border-bottom:1px solid #EBEBEB; line-height:21px; text-align:left; padding:0 0 0 6px; color:#333;width:65px; margin:0px;}'+ 
			'.layer_subm2 dl dd a:hover,.layer_subm2 dl dd a:active{color:#FF9900; text-decoration:none}'+
			'.posi{width:80px!important;}'+
			'</style></div>',
	commiframe : '<iframe name="iframe_data" style="border:0px;display:block;position:absolute;top:0px;left:0px;height:0px;width:0px;visibility:hidden;"></iframe><iframe id="menuiframe" style="border:0px;display:block;position:absolute;top:0px;left:0px;height:0px;width:0px;visibility:hidden;"></iframe><iframe id="commendiframe" style="border:0px;display:block;position:absolute;top:0px;left:0px;height:0px;width:0px;visibility:hidden;"></iframe>',
	commlist : '<div id="commlist" class="layer_subm2 posi" style="position:absolute;top:0px;left:0px;visibility:hidden;"><dl><dd><a href="javascript:;" onclick="SpaceCommend.Base.comm2fri();">推荐给好友</a></dd><dd><a href="javascript:;" onclick="SpaceCommend.Base.comm2mail();">邮件推荐</a></dd><dd><a href="javascript:;" onclick="SpaceCommend.Base.comm2copy();">复制链接</a></dd></dl></div>',
	commuserlist : '<div id="commuserlist" class="layer_userlist"><div class="userTit" id="usertype""><ul>'+
			'<li id="user_type_0"><span>全部好友<em>(<font id="user_type_num_0">0</font>)</em></span></li><li id="user_type_1"><a href="javascript:;" onclick="SpaceCommend.Base.__make_user_list(\'1\')">网友<em>(<font id="user_type_num_1">0</font>)</em></a></li><li id="user_type_2"><a href="javascript:;" onclick="SpaceCommend.Base.__make_user_list(\'2\')">同学<em>(<font id="user_type_num_2">0</font>)</em></a></li><li id="user_type_3"><a href="javascript:;" onclick="SpaceCommend.Base.__make_user_list(\'3\')">同事<em>(<font id="user_type_num_3">0</font>)</em></a></li><li id="user_type_4"><a href="javascript:;" onclick="SpaceCommend.Base.__make_user_list(\'4\')">朋友<em>(<font id="user_type_num_4">0</font>)</em></a></li>'+
			'<li id="user_type_5"><a href="javascript:;" onclick="SpaceCommend.Base.__make_user_list(\'5\')">家人<em>(<font id="user_type_num_5">0</font>)</em></a></li></ul></div>'+
			'<div class="info" id="user_type_list_0" style="display:"><ul></ul></div>'+
			'<div class="info" id="user_type_list_1" style="display:none"></div>'+
			'<div class="info" id="user_type_list_2" style="display:none"></div>'+
			'<div class="info" id="user_type_list_3" style="display:none"></div>'+
			'<div class="info" id="user_type_list_4" style="display:none"></div>'+
			'<div class="info" id="user_type_list_5" style="display:none"></div>'+
			'<div class="optionok"><a href="javascript:;" onclick="SpaceCommend.Base.__user_select_apply();" class="btn_inline_jh"><span>&nbsp;&nbsp;确定&nbsp;&nbsp;</span></a>&nbsp;&nbsp;<input name="" type="checkbox" id="allChecked" value="" onclick="SpaceCommend.Base.__user_select_all(this);" />全选</div></div>',
	comm2fri : '<div id="commend2friend" class="fn_model" style="position:absolute;top:0px;left:0px;visibility:hidden;">'+
			'<form method="post" target="iframe_data" id="comm2fri_form" action="http://v.space.sina.com.cn/recomment/add.php">'+
			'<div class="top"> <span><a href="javascript:SpaceCommend.Base.reset();">x</a></span> <strong id="title"></strong> </div>'+
			'<div class="con fn_layer"><table class="reco_tab"><tr><th>*标题：</th><td><input type="text" id="share_title_f" name="title" class="input_bor input_w" /></td></tr>'+
			'<tr><th>*推荐给：</th><td><input name="totype" type="radio" value="101"  onclick="SpaceCommend.Base.__chang_send_type(false);" checked="true"  />全部好友 <input name="totype" type="radio" value="102" onclick="SpaceCommend.Base.__chang_send_type(true);" />好友选择'+
			'</td></tr><tr><td colspan=2 style="height:40px;"><span id="share_friend_name_s" style="display:none;"><input type="text" id="share_friend_name" class="input_bor input_w2" readonly="true" /> <input type="image" src="http://widget.say-on.com/widgets/wgt_static/poke/skins/default/images/down_icon.gif" onclick="SpaceCommend.Base.showFriend(\'show\');return false;" /></span>'+
			'<span id="share_friend_text"><p>推荐给全部好友，您好友的好友也可能会通过好友动态看到此推荐内容</p></span></td></tr><tr><th>推荐理由：</th>'+
			'<td><textarea name="share_excuse" cols="" rows="" class="input_bor input_w" style="height:60px;" id="share_date_text_f"></textarea></td></tr>'+
			'<tr><td colspan=2 style=" background:#F9F9F9; padding:5px 8px;" id="share_date_f"></td></tr>'+
			'</table><p class="p_btn" style="text-align:center;"><a href="javascript:;" onclick="SpaceCommend.Base.__form_send(\'comm2fri_form\');" class="btn_inline"><span><cite>　推荐　</cite></span></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:SpaceCommend.Base.reset();" class="btn_inline"><span><cite>　取消　</cite></span></a></p>'+
			'</div><input name="des" type="hidden" id="desc"/><input name="share_to" type="hidden" id="totype"/><input name="uids" type="hidden" id="commendfriendslected" value="" /><input name="url" type="hidden" id="share_url_f" value="" /></form></div>',
	comm2mail : '<div id="commend2mail" class="fn_model" style="height:350px;position:absolute;top:0px;left:0px;visibility:hidden;">'+
			'<form method="post" target="iframe_data" id="comm2mail_form" action="http://share.space.sina.com.cn/app_share/share_new_post.php">'+
			'<div class="top"> <span><a href="javascript:SpaceCommend.Base.reset();">x</a></span> <strong>信息提示</strong> </div>'+
			'<div class="con fn_layer"><table class="reco_tab"><tr><td colspan="2" class="tit">邮件推荐</td></tr><tr><th>*标题：</th><td><input type="text" id="share_title_m" name="share_title" class="input_bor input_w" />'+
			'</td></tr><tr><th>*推荐给：</th><td><input id="comm_mail_list" type="text" name="share_to_mail" class="input_bor input_w" value="请输入邮箱地址，您最多可以同时推荐给5位朋友，邮箱地址间请用分号&quot;;&quot;隔开" onclick="this.value=\'\';this.onclick=null" onkeyup="if (this.value.split(\';\').length > 5){this.value = this.value.split(\';\').slice(0, 5).join(\';\');}" /></td></tr>'+
			'<tr><th>推荐理由：</th><td><textarea name="" cols="" rows="" class="input_bor input_w" style="height:100px;" id="share_date_text_m"></textarea></td></tr>'+
			'<tr><th></th><td style=" background:#F9F9F9; padding:5px 8px;" id="share_date_m"></td></tr></table>'+
			'<p class="p_btn" style="text-align:center;"><a href="javascript:;" onclick="if(SpaceCommend.Base.__form_mail_check())SpaceCommend.Base.__form_send(\'comm2mail_form\');" class="btn_inline"><span><cite>　推荐　</cite></span></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:SpaceCommend.Base.reset();" class="btn_inline"><span><cite>　取消　</cite></span></a></p>'+
			'</div><input name="share_url" type="hidden" id="share_url_m" value="" /></form></div>',
	commcopy : '<div id="commend2copy" class="fn_model" style="height:300px;position:absolute;top:0px;left:0px;visibility:hidden;"><div class="top"> <span><a href="javascript:SpaceCommend.Base.reset();">x</a></span> <strong>推荐</strong> </div>'+
			'<div class="con fn_layer"><table class="reco_tab"><tr><td colspan="2" class="tit">复制链接</td></tr><tr><td>复制以下链接直接用QQ/MSN发给好友，即使他们没有在本站注册也能看到您推荐的内容</td>'+
			'</tr><tr><td style="padding:8px 0;"><input type="text" class="input_bor" value="" style="width:355px;" id="share_date_text_c" /></td></tr>'+
			'<tr><td style=" background:#F9F9F9; padding:5px 8px;" id="share_date_c"></td></tr></table>'+
			'<p class="p_btn" style="text-align:center;"><a href="javascript:;" onclick="setCopy($E(\'share_date_text_c\').value);SpaceCommend.Base.reset();return false;" class="btn_inline"><span><cite>　推荐　</cite></span></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:SpaceCommend.Base.reset();" class="btn_inline"><span><cite>　取消　</cite></span></a></p>'+
			'</div></div>'
		
};



SpaceCommend.Base = {
	initPos : function(commendNode){
		var posHash = {};
		posHash.cardWidth = commendNode.offsetWidth;
		posHash.cardHeight = commendNode.offsetHeight;
		var pageSize = Core.System.pageSize();
		if (pageSize[1] > pageSize[3] && $moz) {
			posHash.bodyWidth = pageSize[0] - 18;
		}
		else {
			posHash.bodyWidth = pageSize[0];
		}
		posHash.bodyHeight = pageSize[1];
		posHash.viewWidth = pageSize[2];
		posHash.viewHeight = pageSize[3];
		return posHash;
	},
	
	showFriend : function(is_show, func){
		if (is_show == "hide") {
			//如果是点全部好友，或者是关闭好友选择列表
			Core.Dom.setStyle($E("commuserlist"), "display", "none");
			try {
				//防止用户选择列表没打开时候直接点关闭（或者点全部好友）
				this.__user_select_apply();
			} 
			catch (e) {
			}
			return;
		}
		if($E("commbacklayer")){
			Core.Dom.setStyle($E("commbacklayer"), "display", "block");
		}else{
			var commbacklayer = document.createElement('div');
			commbacklayer.id = "commbacklayer";
			commbacklayer.innerHTML = SpaceCommend.commuserlist;
			$E('share_friend_text').parentNode.insertBefore(commbacklayer,$E('share_friend_text'));

			
		}
		this.__make_user_list();
		if (typeof func == "function") {
			this.__select_user_call_back = func;
		}
		else {
			this.__select_user_call_back = function(){
				$E("commendfriendslected").value = arguments[0].split("|")[1];
				$E("share_friend_name").value = arguments[0].split("|")[0];
			};
		}
	},	
	__user_select_apply : function(){
		Core.Dom.setStyle($E("commbacklayer"), "display", "none");
		var checkbox = $E("user_type_list_" + SpaceCommend.CRRENTUSERTYPE).getElementsByTagName("input");
		var __tmp1 = Array();
		var __tmp2 = Array();
		for (var i = 0; i < checkbox.length; i++) {
			if (checkbox[i].name == "commenduser") {
				if (checkbox[i].checked) {
					__tmp1.push(checkbox[i].value.split("|")[0]);
					__tmp2.push(checkbox[i].value.split("|")[1]);
				}
			}
		}
		this.__select_user_call_back(__tmp1.join(";") + "|" + __tmp2.join(","));
		//Core.Dom.setStyle($E("commuserlist"), "visibility", "hidden");
		//好友列表是否是从浮动框上选择的还是页面中选择的
		var select_user_from = $E("commend2friend");
		if (Core.Dom.getStyle(select_user_from, "visibility") == "visible") {
			//推荐给好友的浮动框存在，说明是从浮动框上选择的好友列表
			//结束选择后，需要把用来遮挡的iframe移动到推荐给好友的浮动框下
			//否则,直接关闭iframe的显示
			setIframe({
				left: parseInt(select_user_from.style.left),
				top: parseInt(select_user_from.style.top),
				width: select_user_from.offsetWidth,
				height: select_user_from.offsetHeight
			});
		}
		else {
			setIframe();//默认隐藏iframe
		}
	},
	__make_user_list : function(_Type){
		if (!SpaceCommend.FRIENDLOADED) {
			new Interface("http://share.space.sina.com.cn/app_share/interface_share_get_friend.php", "jsload").request({
			
				onSuccess: function(res){
					if (res.data == null) 
						return;
					var len = res.data.length;
					var num_array = [0, 0, 0, 0, 0, 0];
					var user_array = ["", "", "", "", "", ""];
					num_array[0] = res.data.length;
					for (var i = 0; i < len; i++) {
						num_array[res.data[i]["group"] + 1]++;
						var __tmp = '<li><img src="' + res.data[i]["img"] + '" width="28" height="28" /><div><span>' + res.data[i]["nick"] + '</span><input name="commenduser" type="checkbox" value="' + res.data[i]["nick"] + '|' + res.data[i]["uid"] + '" /></div></li>';
						user_array[0] += __tmp;
						user_array[res.data[i]["group"] + 1] += __tmp;
					}
					for (var y = 0; y < 6; y++) {
						$E("user_type_num_" + y).innerHTML = num_array[y];
						$E("user_type_list_" + y).innerHTML = "<ul>" + user_array[y] + "</ul>";
					}
					SpaceCommend.FRIENDLOADED = true;
				},
				onError: function(res){
					switch (res.code) {
						case 'S00003':
							windowDialog.alert('未登陆');
						case 'S00606':
							windowDialog.alert('取全部好友失败');
						case 'S00607':
							windowDialog.alert('无好友');
						default:
							windowDialog.alert($SYSMSG[res.code]);
					}
				}
			});
		}
			
		if (_Type == null) {
			SpaceCommend.CRRENTUSERTYPE = 0;
			return;
		}
		if (_Type != SpaceCommend.CRRENTUSERTYPE) {
			SpaceCommend.CRRENTUSERTYPE = _Type;
			for (var y = 0; y < 6; y++) {
				var _obj = $E("user_type_" + y);
				var _v_obj = $E("user_type_list_" + y);
				if (_Type == y) {
					if(_obj.checkedAll){
						$E("allChecked").checked = true;
					}else{
						$E("allChecked").checked = false;
					}
					
					Core.Dom.setStyle(_v_obj, "display", "");
					_obj.innerHTML = _obj.innerHTML.replace(/<a[^>]+>(.+)?<em>\(<font id=['|"]?user_type_num_(\d{1})['|"]?>(\d+)<\/font>\)<\/em><\/a>/i, "<span>$1<em>(<font id=\"user_type_num_$2\">$3</font>)</em></span>");
				}
				else {
					Core.Dom.setStyle(_v_obj, "display", "none");
					_obj.innerHTML = _obj.innerHTML.replace(/<span>(.+)?<em>\(<font id=['|"]?user_type_num_(\d)['|"]?>(\d+)<\/font>\)<\/em><\/span>/i, '<a href="javascript:;" onclick="SpaceCommend.Base.__make_user_list(\'$2\')">$1<em>(<font id="user_type_num_$2">$3</font>)</em></a>');
				}
			}
		}
	
	},
	/**
	 * 确定推荐的好友选择,并回调的函数定义
 	 * @method
 	 */
	__select_user_call_back : function(){},
	
	/**
	 * 按照参数移动在ie6下用来遮挡下拉框以及flash的iframe
	 */
	
	comm2fri : function(cuid){
		
		this.reset();
		this.setPosition('commend2friend');
		var _tmp = function(){
			if (item_data != null) {
				$E("share_date_f").innerHTML = item_data.share_date;
				$E("share_url_f").value = item_data.data.share_url;
				$E("share_title_f").value = item_data.data.share_title;
				$E("share_date_text_f").value = item_data.share_date_text;
				$E("desc").value = item_data.share_date_desc;
			}
			else {
				setTimeout(arguments.callee, 1000);
			}
		};
		_tmp();
		
	},
	
	setPosition : function(id){
		var obj = $E(id);
		Core.Dom.setStyle(obj, "visibility", "visible");
		var scroll_top = document.documentElement.scrollTop;
		var pageSize = Core.System.pageSize();
		var rDialogH = obj.clientHeight;
		var posX = (pageSize[2] - 550) / 2; //550是当前窗口的宽度
		var posY = (pageSize[3] - rDialogH) / 2 + scroll_top;
		Core.Dom.setStyle(obj,'position', 'absolute');
		Core.Dom.setStyle(obj,'left', posX + 'px');
		Core.Dom.setStyle(obj,'top',posY +'px');
	},
	
	reset : function(){
		if($E("commbacklayer"))
			Core.Dom.setStyle($E("commbacklayer"), "display", "none");
		Core.Dom.setStyle($E("commend2friend"), "visibility", "hidden");
		Core.Dom.setStyle($E("commend2mail"), "visibility", "hidden");
		Core.Dom.setStyle($E("commend2copy"), "visibility", "hidden");
		Core.Dom.setStyle($E("commendiframe"), "visibility", "hidden");
	},
	
	show : function(clickObj, cuid, offset){
		item_data = null;
		if(typeof cuid == 'undefined' 
			&& typeof picInfo != 'undefined'){
			item_data = {data:{}};
			item_data.data.share_url = "http://photo.sina.com.cn/photo/ "+ picInfo.pic_id;
			item_data.data.share_title = Core.String.decodeHTML(picInfo.title);
			item_data.share_date = "<strong>" + item_data.data.share_title + "</strong><p> "+item_data.data.share_url+"</p>";
			item_data.share_date_text = '';
			item_data.share_date_desc = picInfo.memo;

		} else{
			/**
			 * 根据推荐的CUID获取到的数据
			 */
			
			new Interface("http://share.space.sina.com.cn/app_share/interface_share_item_data.php", "jsload").request({
				GET : {
					share_id : cuid
				},
				onSuccess : function(res){
					item_data = {};
					item_data.data = share_item_data;
					item_data.share_date = "<strong>" + share_item_data["share_title"] + "</strong><p>" + share_item_data["share_url"] + "</p>";
					item_data.share_date_text = share_item_data["share_excuse"];
				},
				onError : function(res){
					windowDialog.alert($SYSMSG[res.code]);
				}
	
		 	});
		}
		


		var clickObjPos = Core.Dom.getXY(clickObj);
				
		if (offset == null || typeof offset != "object" 
			|| offset.x == null || offset.y == null){
			offset = {};
			offset.x = 0;
			offset.y = 0;
		}
		var posX = offset.x + clickObjPos[0];
		var posY = offset.y + clickObjPos[1] + clickObj.offsetHeight;
		if(!SpaceCommend.initialized){
			var lastDiv = document.createElement('div');
			lastDiv.innerHTML = this.writeContent();
			document.body.appendChild(lastDiv);
			SpaceCommend.initialized = true;
			$E('title').innerHTML = '推荐' + this.__getProductInfo().title;
		}				
		
		var obj = $E("commlist");

		Core.Dom.setStyle(obj, "visibility", "visible");
		Core.Dom.setStyle(obj, "left", posX + "px");
		Core.Dom.setStyle(obj, "top", posY + "px");
		var sIframe = $E("commendiframe");
		setIframe({left:posX, top:posY,
			 	width:obj.offsetWidth, height:obj.offsetHeight}, 
			 sIframe);
		Core.Events.addEvent(document,
			function(){
				Core.Dom.setStyle(obj, "visibility", "hidden");
				Core.Dom.setStyle(sIframe, "visibility", "hidden");
			}, 
			"click"
		);
		Core.Events.stopEvent();
	},
	
	writeContent : function(){
		isCreate = true;
		return SpaceCommend.cssCode + SpaceCommend.commiframe 
		+ SpaceCommend.commlist + SpaceCommend.comm2fri 
		+ SpaceCommend.comm2mail + SpaceCommend.commcopy ;
	},
	
	__chang_send_type : function(sType){
		var _o = $E("share_friend_name_s");
		var _o2 = $E("share_friend_text");
		if (sType){
			Core.Dom.setStyle(_o, "display", "");
			Core.Dom.setStyle(_o2, "display", "none");
			$E('totype').value = 1;
		}
		else{
			Core.Dom.setStyle(_o, "display", "none");
			Core.Dom.setStyle(_o2, "display", "");
			$E('totype').value = 0;
		}
	},
	
	__user_select_all : function(_check_box_obj){
		var checkbox = $E("user_type_list_" + SpaceCommend.CRRENTUSERTYPE).getElementsByTagName("input");
		if(_check_box_obj.checked)
			$E("user_type_" + SpaceCommend.CRRENTUSERTYPE).checkedAll = true;
		else
			$E("user_type_" + SpaceCommend.CRRENTUSERTYPE).checkedAll = false;
		
		for (var i = 0; i < checkbox.length; i++){
			if (checkbox[i].name == "commenduser"){
				if (_check_box_obj.checked){
					checkbox[i].checked = true;
				}
				else{
					checkbox[i].checked = false;
				}
			}
		}
	},
	
	__form_send : function(form_id){
		try{
			new Interface("http://v.space.sina.com.cn/recomment/add.php", "jsload").request({
				GET : {
					pid : __getProductInfo().pid,
					url : $E("share_url_m").value,
					totype : $E(form_id).totype[0].checked ?"1" :"0",
					uids : $E('commendfriendslected').value,
					title : $E('share_title_f').value,
					des : $E('desc').value,
					reason : $E('share_date_text_f').value
				},
				onSuccess : function(res){
					this.reset();
					windowDialog.alert('成功推荐此'+this.__getProductInfo().title+'!');
				},
				onError : function(res){
					switch(res.code){
						case 'S00601' :
							windowDialog.alert("参数pid不正确");
						case 'S00602' :
							windowDialog.alert("参数url不正确");
						case 'S00603' :
						 	windowDialog.alert("参数uids不正确");
						case 'S00604' :
						 	windowDialog.alert("参数title不正确");
						case 'S00605' :
						 	windowDialog.alert("参数desc不正确");	
						default :
							windowDialog.alert($SYSMSG[res.code]);
					}
				}
		 	});
		}
		catch(e){}
		
	},
	
	__getProductInfo : function(){
		var pro_name =  $CONFIG.$product.toLowerCase();
		if(pro_name == 'blog')
			return {title:"博文",pid:"1"};
		else if(pro_name == 'photo')
			return  {title:"图片",pid:"5"};
		else if(pro_name == 'bbs')
			return {title:"帖子",pid:"2"};
	},
	/**
		 * 邮件推荐
		 */
	comm2mail : function(){
		this.reset();
		this.setPosition("commend2mail");
		var _tmp = function(){
			if (item_data != null) {
				$E("share_date_m").innerHTML = item_data.share_date;
				$E("share_url_m").value = item_data.data.share_url;
				$E("share_title_m").value = item_data.data.share_title;
				$E("share_date_text_m").value = item_data.share_date_text;
				$E("desc").value = item_data.share_date_desc;
			}
			else{
				setTimeout(arguments.callee, 1000);
			}
		};
		_tmp();
	},
		/**
		 * @param {String} sUrl 需要复制的连接地址
		 * 复制连接
		 */
	comm2copy : function(sUrl){
		this.reset();
		this.setPosition("commend2copy");
		var _tmp = function(){
			if (item_data != null) {
				$E("share_date_c").innerHTML = item_data.share_date;
				$E("share_date_text_c").value = item_data.data.share_url;
			}
			else{
				setTimeout(arguments.callee, 1000);
			}
		};
		_tmp();
	},
	__form_mail_check : function(){
		var m_intp = $E("comm_mail_list");
		if (m_intp.onclick != null || m_intp.value == ""){
			windowDialog.alert("请输入邮箱地址");
			return false;
		}
		var m_cont = m_intp.value.split(";");
		for (var i = 0; i < m_cont.length; i++){
			if (!/[a-z0-9\.\-_]+@[a-z0-9_\-]+\.[a-z0-9\.\-_]+/.test(m_cont[i])){
				windowDialog.alert("邮箱地址格式不正确。");
				return false;
			}
		}
		return true;
	}
	

};






