/**
 * @fileoverview
 * 统一的小黄条
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2009
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/system/winSize.js");

App.miniTips = Core.Class.create();
App.miniTips.prototype = {
	/**
	 * 创建节点
	 * @param {String} sHTML	必选参数，黄条中显示的 HTML
	 * @param {Object} oOption	必选参数，黄条的位置和宽度配置
	 * {
	 * 		left : 111,			必选参数，指定小黄条的绝对定位left坐标
	 * 		top : 111,			必选参数，指定小黄条距绝对定位top坐标
	 * 		width : 111,		可选参数，内容区域宽度，不包括padding，不设置就用样式中的默认设置 237px
	 * 		offX :	111,		可选参数，设置横向偏移
	 * 		offY : 111			可选参数，设置纵向偏移
	 * }
	 */
	initialize : function (sHTML, oOption) {
		var tipsNode = $C("div");
		var tipsId = this.randomId();
		this.nodePos = oOption;
		this.nodeId = tipsId;
		tipsNode.id = this.nodeId;
		tipsNode.style.position = "absolute";
		tipsNode.style.left = "-1000px";
		tipsNode.style.top = "-1000px";
		$Debug(oOption.width);
		if(oOption.width != null){
			tipsNode.style.width = oOption.width + "px";
		}
		tipsNode.className = "J_Gerl_Layer_4";
		tipsNode.innerHTML = '<div id="content_' + this.nodeId + '" class="peopleNum2" ' + (oOption.width != null ? 'style="width: ' + oOption.width + 'px;"' : "")
				+ '>' + sHTML + '</div>'
//				+ '<div class="shadow" ' + (oOption.width != null ? 'style="width: ' + (oOption.width + 33) + 'px;"' : "")
//				+ '></div>'
			 + '<iframe id="iframe_' + this.nodeId + '" style="position:absolute;left:0;top:-7px;filter:alpha(opacity=0);-moz-opacity:0;" frameborder="0" scrolling="no"></iframe>'
			+ '<div class="yello_arrow" style="z-index:1025;"></div>';
		document.body.appendChild(tipsNode);
		return this;
	},
	// 生成随机 ID
	randomId : function () {
		var rndId;
		do {
			rndId = Math.ceil(Math.random() * 10000);
		}
		while($E("space_tip_" + rndId) != null);
		return "space_tip_" + rndId;
	},
	// 显示小黄条
	show : function () {
		$E(this.nodeId).style.left = (this.nodePos.left + (this.nodePos.offX || 0)) + "px";
		$E(this.nodeId).style.top = (this.nodePos.top + (this.nodePos.offY || 0))  + "px";
		$E("iframe_" + this.nodeId).style.width = (this.nodePos.width + 20) + "px";
		$E("iframe_" + this.nodeId).style.height = ($E("content_" + this.nodeId).scrollHeight + 7) + "px";
	},
	// 隐藏小黄条
	hide : function () {
		$E(this.nodeId).style.left = "-1000px";
		$E(this.nodeId).style.top = "-1000px";
	}
};

/**
 * 个人资料修改页——给节点『无法同步你的博客链接』绑定鼠标滑过小黄条
 * @param {HTMLElement} oNode	需要绑定鼠标事件的节点
 * @param {String} sHTML		小黄条显示的HTML
 * @param {Object} oOption		可选参数，指定小黄条的 left、top、width、offX、offY 等
 * {
 * 		left : 111,			可选参数，指定小黄条的绝对定位left坐标
 * 		top : 111,			可选参数，指定小黄条距绝对定位top坐标
 * 		width : 111,		可选参数，内容区域宽度，不包括padding，不设置就用样式中的默认设置 237px
 * 		offX :	111,		可选参数，设置横向偏移
 * 		offY : 111			可选参数，设置纵向偏移
 * }
 * @example
	App.showTips($E("demoNode"), "我将被显示在小黄条中。。。");
	App.showTips($E("demoNode"), "我将被显示在小黄条中。。。", {width : 185, offX : 0, offY : 0});
 */
App.showTips = function(oNode, sHTML, oOption, flag){
	oNode = $E(oNode);
	var xy;
	var winSize = Core.System.winSize();
	if (oOption == null || oOption.left == null || oOption.top == null || oOption.width == null) {
		xy = Core.Dom.getXY(oNode);
		xy[1] = xy[1] + oNode.scrollHeight;
		oOption = oOption ||
		{};
	}
	else {
		xy = [oOption.left, oOption.top];
	}
	var tipswidth = oOption.width || 237;
	//	边界判断尚未完善
	//	$Debug((xy[0] + tipswidth + 35) + " : " + winSize.width);
	//	if (xy[0] + tipswidth + 37 >= winSize.width) {
	//		xy[0] = xy[0] - Math.abs(winSize.width - (xy[0] + tipswidth + 37));
	//	}
	//	iframe 遮挡背后的 select 尚未完善
	var oConfig = {
		"left": xy[0],
		"top": xy[1],
		"width": tipswidth,
		"offX": oOption.offX || 0,
		"offY": oOption.offY || 0
	};
	var flag = flag||1;
	$Debug("flag="+flag);
	if(flag==1)
		scope.notOpen = new App.miniTips(sHTML, oConfig);
	else{
		Core.Events.removeEvent(oNode,scope.notOpen.show.bind2(scope.notOpen),'mouseover');
		Core.Events.removeEvent(oNode,scope.notOpen.hide.bind2(scope.notOpen),'mouseout');
	}
	Core.Events.addEvent(oNode, scope.notOpen.show.bind2(scope.notOpen), "mouseover");
	Core.Events.addEvent(oNode, scope.notOpen.hide.bind2(scope.notOpen), "mouseout");
};