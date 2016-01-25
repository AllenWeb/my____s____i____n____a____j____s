
/**
 * @author xinlin | xinlin@staff.sina.com.cn
 * 注： 此类并没有继承sina下的dialog，无需引入sina包中的dialog
 * 
 */
$import("sina/sina.js");
$import("sina/app.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/getElementsByClass.js");

$import("sina/utils/template.js");
$import("sina/core/system/winSize.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/system/getScrollPos.js");

App.Dialog = {};
/**
 * 基础弹出层
 * @param {HTML String} title
 * @param {HTML String} content
 * @param {Object} cfg
 * cfg{
 * 		width: 	int !
 * 		height: int ?
 * 		zIndex:	int ?
 * 		hidden:  bool ?	
 * }
 * 
 * 注意cfg中的配置都是必须的，如需默认值，请基于此之上进行封装。此处不加封装是为了减少不必要的消耗。
 * 
 *  ==========
 *  
 *  当需要收集垃圾的时候，override  dialog.gc
 * @example
 * 
 * // create new popup Dialog
 * 	var popDialog = new App.Dialog.BasicDialog("test","this is a test",{width:100,height:100,zIndex:100});
 * 	
 * // close handler
 * 	popDialog.close();
 */
App.Dialog.BasicDialog = function(title,content,cfg){
		cfg = cfg || {};
		cfg.noDrag = cfg.noDrag || true;
		
		this._node = $C("div");
		document.getElementsByTagName("BODY")[0].appendChild(this._node);
		var tpl = {
			title:title ? title : "BasicDialog",
			content:content ? content : "......",
			closeTip:$CLTMSG['CD0018']
		};
		var tt = this._node.style;
		tt["position"] = "absolute";
		tt["visibility"] = "hidden";
		
		if(cfg.zIndex)
			tt['zIndex'] = cfg.zIndex;
		if(cfg.hidden)
			tt['visibility'] = "hidden";
		var str = '<table class="mBlogLayer"><tbody><tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr><tr><td class="mid_l"></td><td class="mid_c"><div class="layerBox"><div class="layerBoxTop"><div class="topCon"><strong>#{title}</strong><a href="javascript:;" class="close" title="#{closeTip}"></a><div class="clear"></div></div></div><div class="layerBoxCon">#{content}</div></div></td><td class="mid_r"></td></tr>\
			    	<tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr>\
			    </tbody></table>';
		var tmp = new Utils.Template(str);
		this._node.innerHTML = tmp.evaluate(tpl);
		
		this._node_body = Core.Dom.getElementsByClass(this._node,'DIV','layerBoxCon')[0];
		//console.log(this._node_body);
		this.setSize(cfg.width,cfg.height);
		//获取关闭按钮
		this._btn_close = this._node.firstChild // table
						.firstChild	//tbody
						.childNodes[1] //tr 2
						.childNodes[1] //td 2  class=mid_c
						.firstChild // div	class=layerBox
						.firstChild // div	class=layerBoxTop
						.firstChild	// div class=topCon
						.childNodes[1]; //a class=close
		// 获取标题容器
		this._node_title = this._btn_close.previousSibling;
		this._btn_close.parent = this;
		this._btn_close.onclick = function(){
			Core.Events.stopEvent();
			//modify by yonglin for hidd window;
			if(cfg.hiddClose){
				this.parent.hidd();
			}else{
				this.parent.close();
			}
			//end modify
		};
		this._btn_close.onmousedown =function(){
			//Core.Events.stopEvent();
		};
		// 获取移动
		this._btn_move = this._btn_close.parentNode // cite
						.parentNode;	//th
		this._btn_move.parent = this;
		this._btn_move.onmousedown = function(){
			
			
			var evt = Core.Events.fixEvent(Core.Events.getEvent());
			this.parent._ondrag = true;
			this.offsetx = evt.layerX;
			this.offsety = evt.layerY;
		};
		if(!cfg.noDrag){
			this._btn_move.style["cursor"] = "pointer";
		}
		
		var self = this;
		this._btn_move.mousemoveHandler = function(){
			self._mousemoveHandler();
		};
		this._btn_move.mouseupHandler = function(){
			self._mouserupHandler();
		};
		// resize 方法，只是借一个宿主而已，方法还是调用 dialog的resize，主要调整对话框的位置
		this._btn_move.resize = function(){
			self.resize();
		};
		this._btn_move.scroll = function(){
			self.scroll();
		};
		
		//监控esc键，关闭浮层
		this._btn_move.close = function(e){
			if(cfg.esc){
				return;
			}
			var _key = e.keyCode;
			if(_key === 27){
				self.close();
			}
		};
		
		this.setMiddle();
		if(cfg.hidden){
			tt["visibility"] = "hidden";
			this.focusTarget = this._btn_close;
		}else{
			tt["visibility"] = "visible";
			this._btn_close.focus();
			this._btn_close.blur();	
		}
		//var scroll_pos = Core.System.getScrollPos();
		//var win_s = Core.System.winSize();
		this.setMask(this._node.style["zIndex"],cfg.hidden);
		
		if(!cfg.noDrag){
			Core.Events.addEvent(document,this._btn_move.mousemoveHandler,"mousemove");
			Core.Events.addEvent(document,this._btn_move.mouseupHandler,"mouseup");
		}
		Core.Events.addEvent(window,this._btn_move.resize,"resize");
		Core.Events.addEvent(window,this._btn_move.scroll,"scroll");
		Core.Events.addEvent(document,this._btn_move.close,"keydown");
		
};
App.Dialog.BasicDialog.prototype = {
	/**
	 * 关闭事件处理句柄
	 */
	onClose:function(){},
	/**
	 * 在使用对话框的时候，由于结构可能非常复杂，造成严重内存泄漏。为了防止这种情况，在初始化之后，重写gc方法
	 */
	gc:function(){},
	distory:function(){
		if(this._distory)return;
		this.gc();
		//event 
		Core.Events.removeEvent(document,this._btn_move.mousemoveHandler,"mousemove");
		Core.Events.removeEvent(document,this._btn_move.mouseupHandler,"mouseup");
		Core.Events.removeEvent(window,this._btn_move.resize,"resize");
		Core.Events.removeEvent(window,this._btn_move.scroll,"scroll");
		//  close_btn
		this._btn_close.onmousedown = null;
		this._btn_close.onclick = null;
		this._btn_close.parent = null;
		this._btn_close = null;
		//node
		this._node.parentNode.removeChild(this._node);
		this._mask && this._mask.parentNode.removeChild(this._mask);
		this._mask1.parentNode.removeChild(this._mask1);
		
		// fix IE6 memery leak
		if(scope.$IE){
			this._node.outerHTML = null;
			this._mask && (this._mask.outerHTML = null);
			this._mask1.outerHTML = null;
		}
		
		this._node = null;
		// move_btn
		this._btn_move.mousemoveHandler = null;
		this._btn_move.mouseupHandler = null;
		this._btn_move.resize = null;
		this._btn_move.scroll = null;
		this._btn_move.onmousedown = null;
		this._btn_move.parent = null;
		this._btn_move = null;
		// mask
		this._mask && (this._mask = null);
		this._distory =  true;
		//delete this;
	},
	close:function(){
		if(this.onClose)this.onClose();
		this.distory();
	},
	// modify by yonglin to add a fun
	show : function(){
		this._node.style.visibility = "visible";
		this._mask && (this._mask.style.visibility = "visible");
		this._mask1.style.visibility = "visible";
		if(this.focusTarget){
			this.focusTarget.focus();
		}
		this.resize();
		this.setMiddle();
	},
	hidd : function(){
		this._node.style.visibility = "hidden";
		this._mask && (this._mask.style.visibility = "hidden");
		this._mask1.style.visibility = "hidden";
	},
	// end modify
	setMask:function(z,hidden){
		$IE && (this._mask = document.getElementsByTagName("BODY")[0].appendChild($C("iframe")));
		this._mask1 = document.getElementsByTagName("BODY")[0].appendChild($C("div"));
		if(hidden){
			this._mask && (this._mask.style["visibility"] = "hidden")
			this._mask1.style["visibility"]  = "hidden";
		}
		if(this._mask){
			with(this._mask.style){
				position = "absolute";
				width = "100%";
				zIndex = parseInt(z) - 2;
				top = "0px";
				left = "0px";
				border = "0";
			}
		}
		
		with(this._mask1.style){
			position = "absolute";
			backgroundColor = "#000";
			width = "100%";
			zIndex = parseInt(z) - 1;
			top = "0px";
			left = "0px";
		}

		this._mask && Core.Dom.opacity(this._mask,0);
		Core.Dom.opacity(this._mask1,15);
		this.resize();
	},
	setPosition:function(x,y){
		this._node.style["left"] = x + "px";
		this._node.style["top"] = y + "px";
	},
	resize:function(){
		if (this._mask1) {
			//修改resize haidong		
			var scroll_pos = Core.System.getScrollPos(), win_s = Core.System.winSize(), snap;
			snap = (win_s.height + 160) +"px";
			this._mask1.style["height"] = snap;
			this._mask && (this._mask.style["height"] = snap);
			snap = (scroll_pos[0] - 80) + "px";
			this._mask1.style["top"] = snap
			this._mask && (this._mask.style["top"] = snap);
			this.setMiddle();
		}
	},
	scroll:function(){
		var scroll_pos = Core.System.getScrollPos(), h = this._mask1.offsetHeight, snap;
		if( (scroll_pos[0] + h) <= scroll_pos[3]){
			snap = (scroll_pos[0] - 80) + "px"
			this._mask && (this._mask.style["top"] = snap);
			this._mask1.style["top"] = snap;
		}else{
			snap = (scroll_pos[3] - h) + "px";
			this._mask && (this._mask.style["top"] = snap);
			this._mask1.style["top"] = snap;
		}
	},
	setTitle:function(str){
		this._node_title.innerHTML = str;
	},
	setMiddle:function(){
		var ow = this._node.offsetWidth;
		var oh = this._node.offsetHeight;
		
		var win_s = Core.System.winSize();
		var scroll_pos = Core.System.getScrollPos();
		var tx = (win_s.width - ow)/2;
		var ty = scroll_pos[0] + (win_s.height - oh)/2;
		this._node.style["left"] = tx + 'px';
		this._node.style["top"] = (ty < 20 ? 20 : ty) + 'px';
	},
	setSize:function(w,h){
		w = w?w+"px" : 'auto';
		h = h?h+"px" :'auto';
		var ts = this._node_body.style;
		ts['width'] = w;
		ts['height'] = h;
	},
	_mousemoveHandler:function(){
		//document.body.blur();
		if(this._ondrag){
			var evt = Core.Events.fixEvent(Core.Events.getEvent());
			if(evt.target == this._btn_close){
				return;
			}
			if ($IE) {
				var ss = Core.System.getScrollPos();
				this._node.style["left"] = evt.pageX - this._btn_move.offsetx + ss[1] + "px";
				this._node.style["top"] = evt.pageY - this._btn_move.offsety + ss[0] + "px";
			}
			else {
				this._node.style["left"] = evt.pageX - this._btn_move.offsetx + "px";
				this._node.style["top"] = evt.pageY - this._btn_move.offsety + "px";
			}
		}
	},
	_mouserupHandler:function(){
		this._ondrag = false;
		if(this._btn_move.offsetx)this._btn_move.offsetx = null;
		if(this._btn_move.offsety)this._btn_move.offsety = null;
	}
};
/**
 * 弹出警告层 App.alert 
 * @param {Object} msg {code:"",replace:{}} 此参数考虑code的内容可能需要替换，所以带了replace 
 * @param {Object} config 
 * {
 		ok:		Function ?
 		ok_label: string  按钮的文字显示
		title: 	String ?
		icon:  	int ?// 可选值：1[!] 2[X] 3[√] 4[?] 5[●]  默认 1
		width:	int  ?//对话框宽度，默认 300
		height:	int  ?//对话框高度，默认自适应
		zIndex: int  ?
		focus: bool 是否聚焦到按钮
 * }
 * example:
 *  //简单的错误代码
 * 	App.alert({code:"S00009"},{ok:function(){}});
 * 	//复杂的错误代码，其错误信息需要模板替换的 ,传入的replace对象与Template中的传入的替换对象一致
 * 	App.alert({code:"S00009"，replace:{name}},{ok:function(){}});
 * 	// 需要调整大小的情况
 * 	App.alert({code:"S00009"},{ok:function(){},width:200,height:200});
 */
App.alert = function(msg, config){
	config = config ? config : {};
	config.hasBtn = config.hasBtn == null ? true : config.hasBtn;
	var title = config.title ? config.title:$CLTMSG['CL0601'];
	var ok_label = config.ok_label ? config.ok_label : $CLTMSG['CL0602'];
	if(typeof msg == 'object'){
		msg = App.getMsg(msg.code, msg.replace);
	}
	var callback = config.ok?config.ok:null;
	var basic_conf = {};
	basic_conf["width"] = config.width ? config.width : 360;
	basic_conf["height"] = config.height;
	basic_conf["zIndex"] = config.zIndex ? config.zIndex : 1000;
	basic_conf["hidden"] = config["hidden"];
	
	var htmls = [];
	htmls.push('<div class="commonLayer2">');
    htmls.push('<div class="layerL"><img class="PY_ib PY_ib_#{icon}" src="'+scope.$BASEIMG+'style/images/common/PY_ib.gif" alt="" title="" align="absmiddle"/></div>');
    htmls.push('<div class="layerR">');
	htmls.push('	<strong>#{cnt}</strong>');
    htmls.push('</div>');
    htmls.push('<div class="clear"></div>');
	if (config.hasBtn) {
		htmls.push('	<div class="MIB_btn">');
	}else{
		//此代码为后期调整，该方法被大量复用，防止display:none后引起ie6异常
		htmls.push('	<div class="MIB_btn" style="height:0;">');
	}
	htmls.push('	<a href="javascript:;" id="#{btn_id}" class="btn_normal"><em>'+ok_label+'</em></a>');
	htmls.push('</div></div>');
	var tmp = new Utils.Template(htmls.join(''));
	var t = 'btn_'+ (new Date()).getTime();
	var icon = config.icon ? config.icon : 1;
	msg = tmp.evaluate({cnt:msg,icon:icon,btn_id:t});
	var dialog = new App.Dialog.BasicDialog(title,msg,basic_conf);
	
	var btn_ok = $E(t);
	
	var okCallback = function(){
		if (callback)try{callback();}catch(e){};
		callback = null;
		btn_ok.onclick = null;
		btn_ok = null;
		dialog.close();
		Core.Events.removeEvent(document,hotkey,'keyup');
		return false;
	};
	var hotkey = function(e){
		var ev = window.event || e;
		var element;
		if(ev.target){
			element=e.target;
		}else if(ev.srcElement){
			element=e.srcElement;
		}
		if(element.nodeType==3){
			element=element.parentNode;
		}
		if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA'){
			return;
		}
		switch(ev.keyCode){
			case 27 ://esc 
				okCallback();
				break;
		}
	};
	btn_ok.onclick = okCallback;
	Core.Events.addEvent(document,hotkey,'keyup');
	
	if(basic_conf["hidden"]){
		this.focusTarget = btn_ok;
	}else{
		btn_ok.focus();
	}
	return dialog; 
};

/**
 * 弹出确认层 App.confirm
 * @param {Object} msg {code?:"",replace?:{},des?:string,html?:string}  新增描述信息
 * @param {Object} config 
 * {
 		ok: function
		cancel: function
		title: string
		icon:  int  //可选值：1[!] 2[X] 3[√] 4[?] 5[●]  默认 1
		width:  int//对话框宽度，默认 300px
		height: int//对话框高度，默认自适应
		ok_label: string 确定按钮的文本
		cancel_label: string 取消按钮
		ok_focus:bool
		cancel_focus:bool
 * }
 * example:
 *  //简单的错误代码
 * 	App.confirm({code:"S00009"},{ok:function(){},cancel:function(){}});
 * 	//复杂的错误代码，其错误信息需要模板替换的 ,传入的replace对象与Template中的传入的替换对象一致
 * 	App.confirm({code:"S00009"，replace:{name}},{ok:function(){},cancel:function(){}});
 * 	//直接输入html代码样式的情况，不使用code
 * 	App.confirm({html:"adfadfad",des:"adsfadfadsfs"},{ok:function(){},cancel:function(){}});
 * 	// 需要调整大小的情况
 * 	App.confirm({code:"S00009"},{ok:function(){},cancel:function(){},width:200,height:200});
 */
App.confirm = function(msg,config){
	config = config ? config : {};
	var title = config.title ? config.title:$CLTMSG['CL0601'];
	var ok_label = config.ok_label ? config.ok_label : $CLTMSG['CL0602'];
	var cancel_label = config.cancel_label ? config.cancel_label  :$CLTMSG['CL0603'];
	var des = "";
	if(typeof msg == 'object'){
		des = msg.des;
		if(msg.code)
			msg = App.getMsg(msg.code, msg.replace);
		else
			msg = msg.html;
	}
	if(msg){
		msg = '<strong>'+msg+'</strong>';
	}
	if(des){
		des = '<div class="txt">'+des+'</div>';
	}
	
	var callback_ok = config.ok?config.ok:null;
	var callback_cancel = config.cancel ? config.cancel : null;
	var basic_conf = {};
	basic_conf["width"] = config.width ? config.width : 390;
	basic_conf["height"] = config.height;
	basic_conf["zIndex"] = config.zIndex ? config.zIndex : 1000;
	basic_conf["hidden"] = config["hidden"];
	var tpl = '<div class="commonLayer2">\
                        	<div class="layerL"><img class="PY_ib PY_ib_#{icon}" src="'+scope.$BASEIMG+'style/images/common/PY_ib.gif" alt="" title="" align="absmiddle"/></div>\
                        	<div class="layerR">\
					#{cnt}\
			        	#{des}\
                                	<div class="MIB_btn">\
						<a href="javascript:;" id="ok_#{t}" class="btn_normal"><em>'+ok_label+'</em></a>\
						<a href="javascrpt:;" id="cancel_#{t}" class="btn_notclick"><em>'+cancel_label+'</em></a>\
					</div>\
                            	</div>\
                            <div class="clear"></div>\
                        </div>';
	var tmp = new Utils.Template(tpl);
	var t = (new Date()).getTime();
	var icon = config.icon ? config.icon : 4;
	msg = tmp.evaluate({cnt:msg,des:des,icon:icon,t:t});
	var dialog = new App.Dialog.BasicDialog(title,msg,basic_conf);
	
	var btn_ok = $E("ok_"+t);
	var btn_cancel = $E("cancel_"+t);
	var hotkey = function(e){
		var ev = window.event || e;
		var element;
		if(ev.target){
			element=e.target;
		}else if(ev.srcElement){
			element=e.srcElement;
		}
		if(element.nodeType==3){
			element=element.parentNode;
		}
		if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA'){
			return;
		}
		switch(ev.keyCode){
			case 27 ://esc 
				cancel_function();
				break;
		}
	};
	var cancel_function = function(){
		if(callback_cancel) try{callback_cancel();}catch(e){}
		callback_cancel = null;
		btn_ok.onclick = null;
		btn_cancel.onclick = null;
		btn_cancel = null;
		btn_ok = null;
		dialog.distory();
		dialog = null;
		Core.Events.removeEvent(document,hotkey,'keyup');
		return false;
	};
	btn_ok.onclick = function(){
		if(callback_ok) try{callback_ok();}catch(e){}
		callback_ok = null;
		btn_ok.onclick = null;
		btn_cancel.onclick = null;
		btn_cancel = null;
		btn_ok = null;
		dialog.distory();
		dialog = null;
		Core.Events.removeEvent(document,hotkey,'keyup');
		return false;
	};
	btn_cancel.onclick = cancel_function;
	if (config.ok_focus) {
		if(config["hidden"]){
			this.focusTarget = btn_ok;
		}else{
			btn_ok.focus();
		}
	}else if (config.cancel_focus){
		//btn_ok.className = "SG_aBtn SG_aBtnb";
		//btn_cancel.className = "SG_aBtn SG_aBtnb SG_aBtn_alt";
		if(config["hidden"]){
			this.focusTarget = btn_cancel;
		}else{
			btn_cancel.focus();
		}
	}
	Core.Events.addEvent(document,hotkey,'keyup');
	return dialog;
};

/**
 * 自定义Dialog
 * @param {String} content Dialog的显示内容 
 * @param {Object} config 
 * {
 * 	title: string 提示
 * 	width:int 350
 * 	height:int 200
 * 	zIndex:int 1000
 * 	btns:[
 * 			{text:string,func:function,nohide:bool,select:bool},
 * 			{text:string,func:function,nohide:bool,select:bool},
 * 		]
 * }
 */
App.customDialog = function(content, config){
	config = config ? config : {};
	var title = config.title ? config.title : $CLTMSG['CL0601'];

	var basic_conf = {};
	basic_conf["width"] = config.width ? config.width : 360;
	basic_conf["height"] = config.height ;
	basic_conf["zIndex"] = config.zIndex ? config.zIndex : 1000;
	basic_conf["hidden"] = config["hidden"];
	var tpl = '#{cnt} <div class="layerBtn" id="btn_#{t}"></div>';
	var tmp = new Utils.Template(tpl);
	var t = (new Date()).getTime();
	
	var msg = tmp.evaluate({cnt:content,t:t});
	var dialog = new App.Dialog.BasicDialog(title,msg,basic_conf);
	var btn_node = $E("btn_"+t);
	
	var btns = config.btns;
	for(var i = 0; i<btns.length ; i++){
		var btn = btn_node.appendChild($C("a"));
		btn.className = "mBlogBtn";
		btn.href="javascript:;";
		
		if (btns[i].select) {
			//btn.className = "SG_aBtn SG_aBtnb SG_aBtn_alt";
			if(config["hidden"]){
				this.focusTarget = btn;
			}else{
				btn.focus();
			}
		}
		//else {
		//	btn.className = "SG_aBtn SG_aBtnb";	
		//}
		//var node = btn.appendChild($C("cite"));
		//node.innerHTML = btns[i].text;
		
		btn.innerHTML = '<em>'+btns[i].text+'</em>';
		
		btn.nohide = config.btns[i].nohide;
		btn.func = config.btns[i].func;
		btn.onclick = function(){
			var nohide = this.nohide;
			if(this.func){
				try {this.func();}catch(e){}
			}
			if (!nohide) {
				dialog.close();
			}
			return false;
		};
	}
	function _distory(){
		var nodes = btn_node.getElementsByTagName("A");
		for(var i in nodes){
			nodes[i].nohide = null;
			nodes[i].func = null;
			nodes[i].onclick = null;
		}
		btn_node = null;
	}
	dialog.close = function(){
		dialog.onClose();
		_distory();
		dialog.distory();
		
	};
	return dialog;
};
/**
 * Interface App.getMsg(code,replace); 
 * 
 * Example:
 * 	
App.getMsg = function(msgCode, replace){
	if (msgCode === undefined) {
		return "";
	}
	var msg = $SYSMSG[msgCode] || ("Error[" + msgCode + "]");
	if (replace) {
		var tmp = new Utils.Template(msg);
		return tmp.evaluate(replace);
	}
	else {
		return msg;
	}
};
 */
if(!App.getMsg){
	App.getMsg = function(code,replace){alert("you should override this function! get more help from dialog.js ");return code};
}
