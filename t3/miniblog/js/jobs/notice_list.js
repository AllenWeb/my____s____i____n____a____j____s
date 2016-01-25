/**
 * @fileoverview 我的通知列表
 * @author zhaobo@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/request.js");
$import("diy/comm/storage.js");


$registJob('noticeList', function(){
	//列表容器。
	var container = $E("notice_list");
	//容器的所有子节点
	var children = container.children;
	//容器所有子节点数组长度
	var len = children.length;
	//全部展开按钮数组。
	var openBtnArr = [];
	//全部收起按钮数组。
	var closeBtnArr = [];
	//通知列表数组。
	var list = [];
	
	/**
	 * 绑定工具栏
	 * @param bOpen boolean 为true时需要展开，否则收起。
	 */
	var bindTool = function(bOpen){
		operationAll(bOpen);
	};
	/**
	 * 绑定每条通知
	 * @param index children 数组下标。
	 */
	var bindNotice = function(index){
		//需要绑定的单条通知。
		var item = children[index];
		Core.Events.addEvent(item, function(event){
			var className = item.className;
			if (className.indexOf("ntc_hover") == -1) item.className = className + " ntc_hover";
		}, "mouseover");
		Core.Events.addEvent(item, function(event){
			var className = item.className;
			item.className = className.replace(" ntc_hover", "");
		}, "mouseout");
		
		//取当前通知右侧的展开收起按钮。
		var btn = Core.Dom.getElementsByClass(item, "div", "time_col")[0].getElementsByTagName("a")[0];
		//绑定按钮click事件。
		var title = item.children[0];
		Core.Events.addEvent(title, function(event){
			var target = Core.Events.getEventTarget(event);
			var img = btn.getElementsByTagName("img")[0];
			if ((target && target.tagName && target.tagName.toLowerCase() === "div") || target === img) {
				var bOpen = (img.className === "tmPTicon_Up");
				//调用具体操作函数。
				operation(item, bOpen);
			}
		}, "click");
	};
	/**
	 * 展开（收起）所有通知。
	 * @param bOpen boolean 为true时展开，否则收起。
	 */
	var operationAll = function(bOpen){
		bOpen = typeof bOpen == "undefined" ? false : bOpen;
		if(!bOpen && openBtnArr[0].className=="current_sel"){return false;}
		openBtnArr[0].className = openBtnArr[1].className = bOpen ? "" : "current_sel";
		closeBtnArr[0].className = closeBtnArr[1].className = bOpen ? "current_sel" : "";
		//点击全展开/全收起按钮记录状态。
		App.storage.set("weibo_job_mynoticelist", bOpen);
		//遍历所有通知。
		for (var i = 0, len = list.length; i < len; i++) {
			var _item = list[i];
			//操作每条通知
			operation(_item, bOpen);
		}
	};
	/**
	 * 展开(收起)当前通知。
	 * @param item 单条通知，div元素。
	 * @param bOpen boolean 为true时展开，否则收起。
	 */
	var operation = function(item, bOpen){
		if (!item) return;
		var className = item.className.replace("ntc_unread", "");
		if (bOpen) {
			if (className.indexOf("ntc_expand") == -1) {
				item.className = className + " ntc_expand";
			}
		}
		else {
			item.className = className.replace(" ntc_expand", "");
		}
		var btn = Core.Dom.getElementsByClass(item, "div", "time_col")[0].getElementsByTagName("a")[0];
		var img = btn ? btn.getElementsByTagName("img")[0] : null;
		if (btn) btn.title = bOpen ? $CLTMSG['ZB0024'] : $CLTMSG['ZB0023'];
		if (img) {
			img.setAttribute("alt", bOpen ? $CLTMSG['ZB0024'] : $CLTMSG['ZB0023']);
			img.setAttribute("title", bOpen ? $CLTMSG['ZB0024'] : $CLTMSG['ZB0023']);
			img.className = bOpen ? "tmPTicon_Down" : "tmPTicon_Up";
		}
		var content = Core.Dom.getElementsByClass(item, "div", "info_ntcf")[0];
		if (content) content.style.display = bOpen ? "" : "none";
	};
	//遍历容器下的每个子节点。当下标为第一个和最后一个时说明是工具栏，其他的是每条通知。
	for (var i = 0; i < len; i++) {
		if (i == 0 || i == len - 1) {
			(function(index){
				var btns = children[index].getElementsByTagName("div")[0].getElementsByTagName("a");
				openBtnArr.push(btns[0]);
				Core.Events.addEvent(btns[0], function(){
					bindTool(false);
				}, "click");
				closeBtnArr.push(btns[1]);
				Core.Events.addEvent(btns[1], function(){
					bindTool(true);
				}, "click");
			})(i);
		}
		else {
			list.push(children[i]);
			bindNotice(i);
		}
	}
	//如果记录过状态，且状态未打开（"true")的话则直接全部展开。
	if (App.storage.get("weibo_job_mynoticelist") == "true") {
		operationAll(true);
		setTimeout(function(){$E("notice_list").style.display="";},20);
	}else{
		openBtnArr[0].className = openBtnArr[1].className = "current_sel";
		closeBtnArr[0].className = closeBtnArr[1].className = "";
		setTimeout(function(){$E("notice_list").style.display="";},20);
	}
});
