/**
 * 新结构的dialog
 * 自适应
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/utils/drag2.js");
$import("sina/utils/resize.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/setXY.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind2.js");


/**
 *
 */
Sina.Utils.dialog = function(oInitCFG, oInitFUNC, fixId){
	this._dialogCFG = {
		ad: true,
		title: "未标题",
		drag: true,
		zindex: 1024,
		shadow: 1,
		fixed: false,
		css: "Dialog",
		content: "",
		middle: true,
		width: 300,
		height: 300,
		// 是否有关闭按钮
		close: true,
		// 是否允许关闭
		closed: true,
		resizable : true
	};
	this._dialogFUNC = {
		onDragStart: function(){
		},
		onDrag: function(){
		},
		onDragEnd: function(){
		},
		onContentUpdate: function(){
		},
		onPosUpdate: function(){
		},
		onShow: function(){
		},
		onHidden: function(){
		}
	};
	for (var key in this._dialogCFG) {
		if (oInitCFG[key] != null) {
			this._dialogCFG[key] = oInitCFG[key];
		}
	}
	for (key in this._dialogFUNC) {
		if (oInitFUNC[key] != null) {
			this._dialogFUNC[key] = oInitFUNC[key];
		}
	}
	if (!$E("dialogParent")) {//加样式控制以防对话框设置了position,背景会跟着跑下去
		Core.Dom.addHTML(document.body, '<div id="dialogParent" style="z-index:' + this._dialogCFG["zindex"] + '"></div>');
	}
	var ran = parseInt(Math.random() * 10000);
	if(fixId){
		ran = fixId;
	}
	this.id = "dialog_" + ran;
	if($E(this.id) == null){
	var struc = '\
		<span  id="' + this.id + '">\
			<div class="shadow">\
				<iframe class="base" style="position:absolute;"></iframe>\
				<div class="base"></div>\
			</div>\
			<table class="CP_w">\
				<thead>\
					<tr>\
						<th><strong></strong><cite><a href="javascript:;" class="CP_w_help" target="_blank">帮助</a><a href="javascript:;" class="CP_w_shut" title="关闭">关闭</a></cite></th>\
					</tr>\
				</thead>\
				<tbody>\
					<tr>\
						<td style="vertical-align:top;"></td>\
					</tr>\
				</tbody>\
			</table>\
		</span>\
	';
	Core.Dom.addHTML($E("dialogParent"), struc);
	this.initDom();
	this.__help.style.display = "none";
	this.__body.style.position = "absolute";
	this.setTitle(this._dialogCFG["title"]);
	this.setContent(this._dialogCFG["content"]);
	if (this._dialogCFG["middle"]) {
		this.setMiddle();
	}

	if (this._dialogCFG["drag"]) {
		Utils.Drag2.init(this.__body, this.__move);
		this.__move.style.cursor = "move";
	}
	if (this._dialogCFG["close"]) {
		this.__close.style.display = "block";
		Core.Events.addEvent(this.__close, function(){
			this.hidden();
		}.bind2(this));
	}
	this.setShadow();
	}

	if(this._dialogCFG["resizable"])
		Utils.Resize.apply(this);
};
Sina.Utils.dialog.prototype = {
	setIframe: function(oCFG){
		this.__content.style.background = "url(http://blogimg.sinajs.cn/v5images/icon/loading.gif) center center no-repeat";
		var sURL = oCFG.url ? oCFG.url : "http://control.blog.sina.com.cn/admin/ria/blank.html";
		sURL = sURL.split("//").length < 2 ? ("http://" + window.location.host + "/" + sURL) : sURL;
		
		var nWidth = oCFG.width ? oCFG.width : 300;
		var nHeight = oCFG.height ? oCFG.height : 300;
		var bHost = sURL.split("//")[1].split("/")[0] == window.location.host;
		setTimeout(function(){
			this.setContent("<iframe id='DataIframe_" + this.id + "' frameborder='0' scrolling='no' style='width: " + nWidth + "px; height: " + nHeight + "px; " + (bHost ? "display: none;" : "") + "' src='" + sURL + "'></iframe>");
			Core.Events.addEvent($E("DataIframe_" + this.id), function(){
				$E("DataIframe_" + this.id).style.display = "";
				this.__content.style.backgroundImage = "url()";
			}.bind2(this), "load");
		}.bind2(this), 1);
	},
	getCloseBtn: function(){
		return this.__close;
	},
	setCloseBtn: function(oView){
		Core.Dom.setStyle(this.__close, "display", (oView == true ? "" : "none"));
	},
	show: function(){
		Core.Dom.setStyle(this.__dialog, "display", "");
		Core.Dom.setStyle(this.__dialog, "visibility", "visible");
		//this.setShadow();
		//this.setMiddle();
		//        $Debug("是否采用优化规则: " + fixShadowTimeBoolean, "green");
		//        
		//        if (fixShadowTimeBoolean == true) {
		//            clearInterval(fixShadowTimer);
		//            fixShadowTimer = setInterval(_viewShadow, 100);
		//        }
		this._dialogFUNC.onShow();
		//Core.Dom.setStyle(this.__shadow, "display", "block");
		if (this._dialogCFG["fixed"] == true) {
			this.setFixed();
		}
	},
	hidden: function(){
		if (this._dialogCFG.closed == false) {
			this._dialogFUNC.onHidden();
			return;
		}
		Core.Dom.setStyle(this.__dialog, "visibility", "hidden");
		Core.Dom.setStyle(this.__dialog, "display", "none");
		//        if (fixShadowTimeBoolean == true) {
		//            clearInterval(fixShadowTimer);
		//        }
		//Core.Dom.setStyle(this.__shadow, "display", "none");
		if (this._dialogCFG["fixed"] == true) {
			this.clearFixed();
		}
		this._dialogFUNC.onHidden();
	},
	setWidth: function(w){
		try {
			this.__content.style.width = w + "px";
			if($E("DataIframe_" + this.id)){
				$E("DataIframe_" + this.id).style.width = w + "px";
			}
		} 
		catch (e) {
			traceError(e);
		}
	},
	getWidth: function(){
		try {
			//$Debug("this.width : "+this.__content.offsetWidth);
			return parseInt(this.__content.offsetWidth);
		} 
		catch (e) {
			//alert(e);
			return null;
		}
	},
	setHeight: function(h){
		// L.Ming 20080416 解决 IE 6 下对话框底部多1空白像素的问题
		if ($IE6) {
			h += h % 2;
		}
		this.__content.style.height = h + "px";
		if($E("DataIframe_" + this.id)){
			$E("DataIframe_" + this.id).style.height = h + "px";
		}
	},
	setSize: function(w, h){
		this.setWidth(w);
		this.setHeight(h);
		this._content_size = [w, h];
	},
	setContent: function(html){
		if (typeof html == "string") {
			this.__content.innerHTML = html;
		}
		else {
			if (typeof html == "object") {
				this.__content.appendChild(html);
			}
		}
		this._dialogFUNC.onContentUpdate();
	},
	setPosition: function(nLeft, nTop){
		if (nLeft != null) {
			Core.Dom.setStyle(this.__body, "left", nLeft + "px");
		}
		if (nTop != null) {
			Core.Dom.setStyle(this.__body, "top", nTop + "px");
		}
		this._dialogFUNC.onPosUpdate();
	},
	setHelp: function(href,name){
		this.__help.style.display = "block";
		if(arguments.length>1){
			this.__help.innerHTML=name;
		}
		this.__help.href = href;
	},
	setMiddle: function(){
		var thisw = this._dialogCFG.width;
		var thish = this._dialogCFG.height;
		var pageSize = Core.System.pageSize();
		var dialogTop = (pageSize[3] - thish) / 2 + Core.System.getScrollPos()[0];
		this._dialogInfo.left = (pageSize[2] - thisw) / 2;
		this._dialogInfo.top = dialogTop < 0 ? 0 : dialogTop;
		this.setPosition(this._dialogInfo.left, this._dialogInfo.top);
	},
	_dialogInfo: {},
	initDom: function(){
		this.__dialog = $E(this.id);
		this.__shadow = Core.Dom.getElementsByClass(this.__dialog, "div", "shadow")[0];
		this.__body = Core.Dom.getElementsByClass(this.__dialog, "table", "CP_w")[0];
		this.__title = Core.Dom.getElementsByClass(this.__body, "strong", "")[0];
		this.__help = Core.Dom.getElementsByClass(this.__body, "a", "CP_w_help")[0];
		this.__close = Core.Dom.getElementsByClass(this.__body, "a", "CP_w_shut")[0];
		this.__content = Core.Dom.getElementsByClass(this.__body, "td", "")[0];
		this.__move = Core.Dom.getElementsByClass(this.__body, "thead", "")[0];
	},
	setTitle: function(title){
		this.__title.innerHTML = title || "";
	},
	setCloseEvent: function(bClose){
		this._dialogCFG.closed = bClose;
	},
	getDialogNodes: function(){
		return this.__close;
	},
	getDialogBody:function(){
		return this.__body;
	},
	setShadow: function(){
		
		if (this._dialogCFG["shadow"] == 0) {
			return;
		}
		var this_shadow = this.__shadow;
		var pageSize = Core.System.pageSize();
		if (typeof(this._dialogCFG["top"]) != 'undefined') {
			pageSize[1] -= this._dialogCFG["top"];
		}
		var shdowHeight = pageSize[3];
		Core.Dom.setStyle(this_shadow, "display", "block");
		//alert("页面大小: " + pageSize);
		if (pageSize[1] > pageSize[3] && scope.$MOZ) {
			Core.Dom.setStyle(this_shadow, "width", (pageSize[0] - 18) + "px");
			//Core.Dom.setStyle(this_shadow, "height", pageSize[1] + "px");
		}
		else {
			if (scope.$IE6) {
				if (pageSize[1] > pageSize[3]) {
					Core.Dom.setStyle(this_shadow, "width", pageSize[0] + "px");
					//Core.Dom.setStyle(this_shadow, "height", pageSize[1] + "px");
				}
				else {
					Core.Dom.setStyle(this_shadow, "width", pageSize[0] - 22 + "px");
					//Core.Dom.setStyle(this_shadow, "height", pageSize[3] + "px");
				}
			}
			else {
				Core.Dom.setStyle(this_shadow, "width", pageSize[0] + "px");
				//Core.Dom.setStyle(this_shadow, "height", pageSize[1] + "px");
			}
		}
		if(scope.$IE){
			Core.Dom.setStyle(this_shadow, "height", pageSize[3] + 60 + "px");
		}else{
			Core.Dom.setStyle(this_shadow, "height", pageSize[1] + "px");
		}
		//
		//this_shadow.innerHTML = '<iframe class="base" style="position:absolute;"></iframe><div class="base"></div>';
		if(scope.$IE6){
			this_shadow.style.position = "absolute";
			this_shadow.style.left = "0px";
			var scrollTop = Core.System.getScrollPos()[0];
			this_shadow.style.top = scrollTop - 30 + "px";
			Core.Events.addEvent(window, function(){
				var scrollTop = Core.System.getScrollPos()[0];
				this_shadow.style.top = scrollTop - 30 + "px";
			}, "scroll");
		}else{
			this_shadow.style.position = "fixed";
		}
	},
	setFixed: function(){
		this.fix = window.setInterval(Core.Function.bind2(this.setMiddle, this), 500);
	},
	clearFixed: function(){
		window.clearInterval(this.fix);
	}
};

Sina.Utils.dialog.prototype.onresize = function(){
    var self = this;
    var pageSize = Core.System.pageSize();
      var pageW = pageSize[0];
    var pageH = pageSize[1];
    Core.Dom.setStyle2(self.__shadow,{width:pageW+"px",height:pageH+"px"});
    self.setMiddle();
};