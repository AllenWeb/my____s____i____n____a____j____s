/**
 * @author chibin | chibin@staff.sina.com.cn
 * 注： 此类并没有继承sina下的dialog，无需引入sina包中的dialog
 *
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/opacity.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/getElementsByClass.js");
$import("diy/animation.js");
$import("sina/utils/template.js");
$import("sina/core/system/winSize.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/system/getScrollPos.js");

App.MediaDialog = {};
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
App.MediaDialog.BasicDialog = function(content, cfg, title){
    this._node = $C("div");
    document.getElementsByTagName("BODY")[0].appendChild(this._node);
    var tpl = {
        title: title ? title : "",
        content: content ? content : "......"
    };
    var tt = this._node.style;
    tt["position"] = "absolute";
    tt["visibility"] = "hidden";
    if (!cfg) {
        cfg = {};
    }
    if (cfg.zIndex) 
        tt['zIndex'] = cfg.zIndex;
    
    if (cfg.beforeClose) {
        this._beforeClose = cfg.beforeClose;
    }
    var str = '<table class="mBlogLayer"><tbody><tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr><tr><td class="mid_l"></td><td class="mid_c"><div class="layerBox"><div class="layerBoxCon1"><div class="layerMedia"><div class="layerArrow"></div><div class="layerMedia_close"><strong>#{title}</strong><a class="close" href="#" title="'+$CLTMSG['CD0018']+'"></a></div>\
							#{content}</div></div></div></td><td class="mid_r"></td></tr>\
			    	<tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr>\
			    </tbody></table>';
    var tmp = new Utils.Template(str);
    this._node.innerHTML = tmp.evaluate(tpl);
    
    this._node_body = Core.Dom.getElementsByClass(this._node, 'DIV', 'layerBoxCon1')[0];
    this._layerarrow = Core.Dom.getElementsByClass(this._node, 'DIV', 'layerArrow')[0];
    this.setSize(cfg.width, cfg.height);
    //获取关闭按钮
    this._btn_close = this._node.firstChild // table
.firstChild //tbody
.childNodes[1] //tr 2
.childNodes[1] //td 2  class=mid_c
.firstChild // div	class=layerBox
.firstChild // div	class=layerBoxTop 	// div class=topCon
.firstChild // div  class=layerMedia
.childNodes[1] // div class=layerMedia_close
.childNodes[1]; //a class=close
    // 获取标题容器
    this._node_title = this._btn_close.previousSibling;
    this._btn_close.parent = this;
    this._btn_close.onclick = function(){
        Core.Events.stopEvent();
        //modify by yonglin for hidd window;
        if (cfg.hiddClose) {
            this.parent.hidd();
        }
        else {
            this.parent.close();
        }
    //end modify
    };
    this._btn_close.onmousedown = function(){
    //Core.Events.stopEvent();
    };
    this.initinput();
    
    //fly
    this._flytimer = cfg['timer'] || 0;
    this._flydistance = cfg['distance'] || 0;
    
    // 获取移动
    //		this._btn_move = this._btn_close.parentNode // cite
    //						.parentNode;	//th
    //		this._btn_move.parent = this;
    //		
    //		this._btn_move.onmousedown = function(){
    //			var evt = Core.Events.fixEvent(Core.Events.getEvent());
    //			this.parent._ondrag = true;
    //			this.offsetx = evt.layerX;
    //			this.offsety = evt.layerY;
    //		};
    //		this._btn_move.style["cursor"] = "pointer";
    //		var self = this;
    //		this._btn_move.mousemoveHandler = function(){
    //			self._mousemoveHandler();
    //		};
    //		this._btn_move.mouseupHandler = function(){
    //			self._mouserupHandler();
    //		};
    //		// resize 方法，只是借一个宿主而已，方法还是调用 dialog的resize，主要调整对话框的位置
    //		this._btn_move.resize = function(){
    //			self.resize();
    //		};
    //		this._btn_move.scroll = function(){
    //			self.scroll();
    //		};
    //		
    //		this.setMiddle();
    if (cfg.hidden) {
        tt["visibility"] = "hidden";
        this.focusTarget = this._btn_close;
    }
    else {
        tt["visibility"] = "visible";
        this._btn_close.focus();
        this._btn_close.blur();
    }
    
//var scroll_pos = Core.System.getScrollPos();
//var win_s = Core.System.winSize();

//comment by chibin 
//this.setMask(this._node.style["zIndex"],cfg.hidden);

//		Core.Events.addEvent(document,this._btn_move.mousemoveHandler,"mousemove");
//		Core.Events.addEvent(document,this._btn_move.mouseupHandler,"mouseup");
//		Core.Events.addEvent(window,this._btn_move.resize,"resize");
//		Core.Events.addEvent(window,this._btn_move.scroll,"scroll");
};



App.MediaDialog.BasicDialog.prototype = {
    /**
 * 关闭事件处理句柄
 */
    onClose: function(){
    },
    /**
 * 在使用对话框的时候，由于结构可能非常复杂，造成严重内存泄漏。为了防止这种情况，在初始化之后，重写gc方法
 */
    gc: function(){
    },
    distory: function(){
        if (this._distory) 
            return;
        this.gc();
        //event 
        //		Core.Events.removeEvent(document,this._btn_move.mousemoveHandler,"mousemove");
        //		Core.Events.removeEvent(document,this._btn_move.mouseupHandler,"mouseup");
        //		Core.Events.removeEvent(window,this._btn_move.resize,"resize");
        //		Core.Events.removeEvent(window,this._btn_move.scroll,"scroll");
        //  close_btn
        this._btn_close.onmousedown = null;
        this._btn_close.onclick = null;
        this._btn_close.parent = null;
        this._btn_close = null;
        //node
        this._node.parentNode.removeChild(this._node);
        
        //this._mask.parentNode.removeChild(this._mask);
        //this._mask1.parentNode.removeChild(this._mask1);
        
        // fix IE6 memery leak
        if (scope.$IE) {
            this._node.outerHTML = null;
        //this._mask.outerHTML = null;
        //this._mask1.outerHTML = null;
        }
        
        this._node = null;
        // move_btn
        //		this._btn_move.mousemoveHandler = null;
        //		this._btn_move.mouseupHandler = null;
        //		this._btn_move.resize = null;
        //		this._btn_move.scroll = null;
        //		this._btn_move.onmousedown = null;
        //		this._btn_move.parent = null;
        //		this._btn_move = null;
        // mask
        //this._mask = null;
        this._distory = true;
    //delete this;
    },
    close: function(){
        if (this._beforeClose) {
            this._beforeClose();
        }
        if (this.onClose) 
            this.onClose();
        this.distory();
    },
    // modify by yonglin to add a fun
    show: function(){
        if (this._flytimer == 0 && this._flydistance == 0) {
            this._node.style.visibility = "visible";
        }
        else {
//            this._node.style.filter = "alpha(opacity=0)";
//            this._node.style.opacity = 0;
            this._node.style.visibility = "visible";
           // this.fly(); 咱们又不飞了。。。
        }
        //this._mask.style.visibility = "visible";
        //this._mask1.style.visibility = "visible";
        if (this.focusTarget) {
            this.focusTarget.focus();
        }
        
        
    //		this.resize();
    //		this.setMiddle();
    },
    fly: function(){
        var v = Core.Base.detect.$IE ? this._flydistance / 3 : this._flydistance / 5;
        var dropOrbit = App.animation.speed(App.timer.delay, this._flydistance, v);
        var dialognode = this.node;
        var current = 0;
//        App.opacity(this._node, {
//            first: 0,
//            last: 100,
//            time: Core.Base.detect.$IE ? (this._flytimer) * 0.6 : this._flytimer
//        });

        var tk = (function(flytimer, flydistance, node){
			
            var starttop = (node.style.top) + "px";
            App.timer.add(function(){
                if (current >= dropOrbit.length) {
                    App.timer.remove(tk);
                    return false;
                };
                node.style.top = (parseInt(starttop) - dropOrbit[current]) + 'px';
                current++;
            })
        })(this._flytimer, this._flydistance, this._node);
        
    },
    hidd: function(){
        this._node.style.visibility = "hidden";
    //this._mask.style.visibility = "hidden";
    //this._mask1.style.visibility = "hidden";
    },
    // end modify
    //	setMask:function(z,hidden){
    //		/*
    //		if (scope.$IE) {
    //			this._mask = document.getElementsByTagName("BODY")[0].appendChild($C("div"));
    //			var tmp = this._mask.appendChild($C("iframe"));
    //			tmp.style.zIndex = z-1;
    //			//Core.Dom.opacity(tmp,0);
    //		}else {
    //			this._mask = document.getElementsByTagName("BODY")[0].appendChild($C("iframe"));
    //		}
    //		*/
    //		this._mask = document.getElementsByTagName("BODY")[0].appendChild($C("iframe"));
    //		this._mask1 = document.getElementsByTagName("BODY")[0].appendChild($C("div"));
    //		if(hidden){
    //			this._mask.style["visibility"] = this._mask1.style["visibility"]  = "hidden";
    //		}
    //		with(this._mask.style){
    //			//visibility = "hidden";
    //			position = "absolute";
    //			width = "100%";
    //			//backgroundColor = "#555";
    //			zIndex = parseInt(z) - 2;
    //			top = "0px";
    //			left = "0px";
    //			border = "0";
    //		}
    //		with(this._mask1.style){
    //			position = "absolute";
    //			backgroundColor = "#000";
    //			width = "100%";
    //			zIndex = parseInt(z) - 1;
    //			top = "0px";
    //			left = "0px";
    //		}
    //
    //		Core.Dom.opacity(this._mask,0);
    //		Core.Dom.opacity(this._mask1,15);
    //		this.resize();
    //	},
    setPosition: function(x, y){
        //alert(y + (this._flydistance>0?this._flydistance:0));
		this._node.style["left"] = (x - Core.Dom.getLeft(this._layerarrow)) + "px";
        //this._node.style["top"] = parseInt(y + (this._flydistance>0?this._flydistance:0)) + "px";
		this._node.style["top"] = y + "px";
    },
    //	resize:function(){
    //		if (this._mask) {
    //			//this._mask.style["width"] = "100%";
    //			//修改resize haidong		
    //			var scroll_pos = Core.System.getScrollPos();
    // 		    	var win_s = Core.System.winSize();
    //			//this._mask1.style["width"]  = this._mask.style["width"] = scroll_pos[2] + "px";
    //			//this._mask1.style["height"] = this._mask.style["height"] = (win_s.height ? scroll_pos[3] : win_s.height) + "px";
    //			//this._mask1.style["width"]  = this._mask.style["width"] = win_s.width + "px";
    //			this._mask1.style["height"] = this._mask.style["height"] = (win_s.height + 160) +"px";
    //			this._mask1.style["top"] = this._mask.style["top"] = (scroll_pos[0] - 80) + "px";
    //			/*
    //			if(scope.$IE){
    //				this._mask.firstChild.style["width"] =  this._mask.offsetWidth + "px";
    //				this._mask.firstChild.style["height"] = this._mask.offsetHeight + "px";
    //			}
    //			*/
    //			this.setMiddle();
    //		}
    //	},
    //	scroll:function(){
    //		var scroll_pos = Core.System.getScrollPos();
    //		var h = this._mask.offsetHeight;
    //		if( (scroll_pos[0] + h) <= scroll_pos[3]){
    //			this._mask.style["top"] = this._mask1.style["top"] = (scroll_pos[0] - 80) + "px";
    //		}else{
    //			this._mask.style["top"] =  this._mask1.style["top"] = (scroll_pos[3] - h) + "px";
    //		}
    //	},
    setTitle: function(str){
        this._node_title.innerHTML = str;
    },
    setMiddle: function(){
        var ow = this._node.offsetWidth;
        var oh = this._node.offsetHeight;
        
        var win_s = Core.System.winSize();
        var scroll_pos = Core.System.getScrollPos();
        var tx = (win_s.width - ow) / 2;
        var ty = scroll_pos[0] + (win_s.height - oh) / 2;
        this._node.style["left"] = tx + 'px';
        this._node.style["top"] = (ty < 20 ? 20 : ty) + 'px';
    },
    setSize: function(w, h){
        w = w ? w + "px" : 'auto';
        h = h ? h + "px" : 'auto';
        var ts = this._node_body.style;
        ts['width'] = w;
        ts['height'] = h;
    },
    initinput: function(){
        var inputs = this._node.getElementsByTagName("input");
        var length = inputs.length;
        var i = 0;
        for (i; i < length; i++) {
            var oInput = inputs[i];
            var sType = oInput.getAttribute("type");
            if (sType == "text" || sType == "password") {
                oInput.style.color = "#999999";
                Core.Events.addEvent(oInput, (function(el){
                    return function(){
                        el.style.color = "#333333";
                    };
                })(oInput), "focus");
                Core.Events.addEvent(oInput, (function(el){
                    return function(){
                        el.style.color = "#999999";
                    };
                })(oInput), "blur");
            }
        } 
    },
    
    _mousemoveHandler: function(){
        //document.body.blur();
        if (this._ondrag) {
            var evt = Core.Events.fixEvent(Core.Events.getEvent());
            if (evt.target == this._btn_close) {
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
    }
//	_mouserupHandler:function(){
//		this._ondrag = false;
//		if(this._btn_move.offsetx)this._btn_move.offsetx = null;
//		if(this._btn_move.offsety)this._btn_move.offsety = null;
//	}
};
