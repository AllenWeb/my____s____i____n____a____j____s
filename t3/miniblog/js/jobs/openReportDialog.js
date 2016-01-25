/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("diy/dom.js");
$import("diy/builder3.js");
$import("diy/getTextAreaHeight.js");
$import("diy/widget/poplayer.js");
(function(ns){
	/**
	 * 举报相应微博、评论或用户
	 * @param {Number}  uid			必选参数，举报者 UID
	 * @param {Number}  cid			必选参数，资源的ID
	 * @param {Number}  cType		必选参数，信息的类型(0: 举报用户; 1: 举报微博; 2: 举报评论)
	 * @param {String}  cNick		必选参数，被举报人昵称
	 * @param {String}  cHeadURL	必选参数，被举报人头像URL
	 * @param {String}  content		可选参数，被举报内容
	 * @param {String}  cHeadURL	可选参数，图片URL
	 * @param {String}  wURL		可选参数，微博URL
	 */
	ns.openReportDialog = function(uid, cid, cType, cNick, cHeadURL, content, cImgURL, wURL/*可选*/){
		var _id = "reportDialog", num = cType - 1;//只是为了适配数组
		if ($E(_id)) {
			return;
		}
		//根据cType类型来选择文案类型(这里需要cType来确定的文案种类过多，所以采用数组列表盛放文案)
		var reportMsg = [['JQ0009', 'JQ0008', 'JQ0001'],['JQ0011', 'JQ0011', 'JQ0012'], ['JQ0010', 'JQ0010', 'JQ0013']];
		//更具cType类型确定最终文案
		var rts = [reportMsg[0][num] || 'JQ0001', reportMsg[1][num] || 'JQ0011'];
		//水印文字
		var watermark = $CLTMSG[reportMsg[2][num] || 'JQ0010'];
		var _content = decodeURIComponent(content || '');
		var imgHtml = cImgURL ? '<img alt="" class="popreport_inforimg" src="'+cImgURL+'">':'';
		
		var getFeedHtml = function(){
			var fHtml = [];
			fHtml.push(cNick);
			if (_content) {
				fHtml.push('：');
				fHtml.push(_content);
			}
			return fHtml.join('');
		}
		
		var _html = 
		'<div class="reportLayer">\
			<div class="popreport_tip"><img title="" alt="" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" class="tipicon tip5">'+$CLTMSG['JQ0002']+'</div>\
			<div class="MIB_linedot1"></div>\
			<div class="popreport_title" >'+$CLTMSG[rts[0]].replace(/#\{name\}/g, cNick||'')+'</div>\
			<div id="reportArea" class="popreport_info">\
				<div class="popreport_infol"><img alt="" src="'+cHeadURL+'"></div>\
				<div class="popreport_infor">\
					<p>'+ getFeedHtml() +'</p>'+imgHtml+'\
				</div>\
			</div>\
			<div class="popreport_say">\
				<div class="popreport_title">'+$CLTMSG[rts[1]]+'</div>\
				<textarea id="moreReport">'+watermark+'</textarea>\
			</div>\
			<div class="MIB_linedot1"></div>\
			<div class="popreport_btn">'+$CLTMSG['JQ0004']+'\
	           	<a class="btn_normal" href="javascript:;" id="reportCancel"><em>'+$CLTMSG['JQ0005']+'</em></a>\
				<a class="btn_normal" href="javascript:;" id="reportSubmit"><em>'+$CLTMSG['JQ0006']+'</em></a>\
			</div>\
	        <div class="clearit"></div>\
			</div>\
		</div>';
		var panel = App.CommLayer(_id, {ismask: true,index: 801,width: '540px',title: $CLTMSG['JQ0007'],isFire: true});
		var build = App.builder3(_html, panel.bd, {dd: 'id'});
		App.autoHeightTextArea(build.domList["moreReport"], null, 75);
		panel.bd = build.domList;
		
		//设置扩展举报内容输入区样式
		var setTextAreaView = function(aValue, aColor){
			build.domList["moreReport"].value = aValue;
			build.domList["moreReport"].style.color = aColor;
		}
		//获取更多举报内容
		var getTextAreaValue = function(){
			var _val = Core.String.trim(build.domList["moreReport"].value);
			//如果内容为水印文字，则返回空字串
			if(_val === watermark){
				return "";
			}
			return _val;
		}
		Core.Events.addEvent(build.domList["moreReport"], function(){
			getTextAreaValue() || setTextAreaView("", "#717171");
		}, "focus");
		
		Core.Events.addEvent(build.domList["moreReport"], function(){
			getTextAreaValue() || setTextAreaView(watermark, "#999");
		}, "blur");
		
		Core.Events.addEvent(build.domList["reportCancel"], function(){
			panel.fire();
			return false;
		}, "click");

		Core.Events.addEvent(build.domList["reportSubmit"], (function(json){
			Core.Events.stopEvent();
			//用于锁定提交按钮，防止多次点击提交
			var limit = false;
			var lockSubBtn = function(isLock){
				Core.Dom.setStyle(build.domList["reportSubmit"].firstChild, "color", isLock?"#8F8F8F":"#000");
				limit = isLock;
			}
			return function(){
				if(limit) return;
				lockSubBtn(true);
				Utils.Io.Ajax.request("/complaint/do_send.php", {
					"POST": {
						'uid': uid,
						'cid': cid,
						'cType': cType,
						'content_nick': cNick,
						'content_image': cHeadURL,
						'content': getTextAreaValue(),
						'source': wURL ? 'http://t.sina.com.cn/'+wURL : window.location.href
			        },
			        "onComplete": function(rs){
						var _code = "M00004";
						switch(rs.code){
							case "M00009":
								_code = "MJ0002";
								break;
							case "A00006":
								_code = "MJ0001";
								break;
							default:
								_code = "M00004";
								break;
						}
						if (_code === "MJ0001") {
							var tipMsg = App.alert($SYSMSG[_code], {icon: 3,hasBtn: false});
							panel.fire();
							setTimeout(function(){tipMsg.close();}, 1000);
						}
						else{
							lockSubBtn(false);
							App.alert($SYSMSG[_code]);
						}
					},
			        "onException": function(rs){
						lockSubBtn(false);
						App.alert($CLTMSG["CD0036"]);
					},
			        returnType: "json"
				});
				return false;
			}
		})(), "click");
		panel.show();
	}
	//如果mouseover时离开的节点也是handler节点的子节点，则返回false
	//如果mouseout时，进入的节点也是handler节点的子节点，则返回false
	//返回值为true：证明事件的发生已经离开绑定的节点
//	var isMouseLeaveOrEnter = function(e, handler) {
//	    if (e.type != 'mouseout' && e.type != 'mouseover') {
//			return false;
//		}
//	    var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
//	    while (reltg && reltg != handler) {
//			reltg = reltg.parentNode;
//		}
//	    return (reltg != handler);
//	}
	
//	var setCloseBtnStyle = function(node, property, val){
//		if(!node.closeBtn){
//			node.closeBtn = Core.Dom.byClz(node, "div", "icon_closel")[0];
//		}
//		Core.Dom.setStyle(node.closeBtn, property, val);
//	}
	var setExtendBtnStyle = function(node, property, val){
		node.reportBtn || (node.reportBtn = Core.Dom.byClz(node, "a", "reportBtn")[0] || "no");
		node.lineBtn || (node.lineBtn = Core.Dom.byClz(node, "span", "MIB_line_l")[0] || "no");
		node.closeBtn || (node.closeBtn = Core.Dom.byClz(node, "div", "icon_closel")[0] || "no");
		node.reportBtn && (node.reportBtn!="no") && Core.Dom.setStyle(node.reportBtn, property, val);
		node.lineBtn && (node.lineBtn!="no") && Core.Dom.setStyle(node.lineBtn, property, val);
		node.closeBtn && (node.closeBtn!="no") && Core.Dom.setStyle(node.closeBtn, property, val);
	}
	ns.showExtendBtn = function(node){
		setExtendBtnStyle(node, "visibility", "visible");
	}
	ns.hideExtendBtn = function(node){
		//if(!isMouseLeaveOrEnter(Core.Events.getEvent(), node)) return;
		setExtendBtnStyle(node, "visibility", "hidden");
	}
})(App);
 