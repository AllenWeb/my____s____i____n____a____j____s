/**
 * @author wangliang3@staff.sina.com.cn
 * @desc 空浮层
 */
/*common poplayer*/
$import("diy/dom.js");
$import("sina/core/events/addEvent.js");
$import("diy/widget/dragdrop.js");
$import("diy/builder3.js");

(function(){
	/**
     * @method App.Panel
     * @param panel{String or Object} 浮层id or obj
     * @param config{Json} 
     * @param config.isroll{Boolean} 跟随scroll，默认 false 不跟随scroll
     * @param config.ismask{Boolean} 是否显示蒙板，默认 false 不显示蒙板
     * @param config.isdrag{Boolean} 是否拖拽，默认 false 不拖拽
     * @param config.index{Int} 设定浮动的z-index值
     * @param config.width{String} 设定宽度
     * @param config.height{String} 设定高度
     * 
     * 例：对obj绑定沿X轴拖拽事件
     * var dd = App.Panel(config.win_id,{ismask:true,index:300,width:'648px'});
     */
    App.Panel = function(panel, config){
        /*config*/
        /*config drag*/
        /*config mask*/
		panel = (typeof panel === 'string') ? $E(panel) : panel;
		config = config || {};
		config.isroll = config.isroll || false;
		config.ismask = config.ismask || false;
		config.isdrag = config.isdrag || false;
		config.index = config.index || 0;
		config.width = config.width||'';
		config.height = config.height||'';
		config.isFire = config.isFire||false;
		
        var event = Core.Events,
            dom = App.Dom;
        var $w = window, $d = $w["document"], $e = $d["documentElement"]||{};
		
        if (panel == null) {
            return;
        }
		
		//声明外部方法
		var _show = function(){};
		var _hide = function(){};
		var _fire = function(){};
        
        var mask = null,frame = null,
			mask_style = 'display:none;position:absolute;top:0;left:0;background-color:#000;filter:alpha(opacity=15);-moz-opacity: 0.15;opacity:0.15;';
        
		//绑定扩展函数
		var that = this;
		var bind = function(fFunc, object, args) { 
			args = args == null? []: args;
			var __method = fFunc; 
			return function() { 
			 return __method.apply(object, args); 
			};
		};
		
        var handler = {
			init: function(){
				//add mask
		        if (config.ismask && mask == null) {
		            mask = document.createElement('div');
		            mask.style.cssText = mask_style;
					mask.style.zIndex = config.index;
					if($IE){
						frame = document.createElement('iframe');
			            frame.style.cssText = mask_style;
						frame.style.zIndex = config.index;
						document.body.insertBefore(frame, document.body.childNodes[0]);
					}
		            document.body.insertBefore(mask, document.body.childNodes[0]);
		        }
				//bind css style				
				dom.setStyle(panel, 'width', config.width);
				dom.setStyle(panel, 'height', config.height);
				//set panel position
				var size = handler.getPanelPos();
				dom.setStyle(panel, 'top', size.t + 'px');
                dom.setStyle(panel, 'left', size.l + 'px');
				
				if(config.isdrag){
					var dd = App.DragDrop(panel,null,config);
				}
				
				//bind event
				config.isroll && event.addEvent(window, handler.resize, 'scroll');
        		config.isroll && event.addEvent(window, handler.resize, 'resize');
			},
			getPanelPos : function(){
				var scroll = dom.getScroll();
                var winSize = dom.getScreen();
				
				var pHeight = Math.max(panel.clientHeight,panel.offsetHeight,dom.getStyle(panel, 'height').replace('px', ''));
				var pWidth = Math.max(panel.clientWidth,panel.offsetWidth,dom.getStyle(panel, 'width').replace('px', ''));
				
                return {					
					w: Math.max($e.clientWidth,$e.scrollWidth,$e.offsetWidth,$d.body.scrollWidth,$d.body.offsetWidth),
					h: Math.max($e.clientHeight,$e.scrollHeight,$e.offsetHeight,$d.body.scrollHeight,$d.body.offsetHeight),
                    t: Math.round(pHeight>winSize.h?(winSize.h/5 + scroll.t):((winSize.h-pHeight)/2+scroll.t)),
                    l: Math.round(pWidth>winSize.w?(winSize.w/5 + scroll.l):((winSize.w-pWidth)/2+scroll.l))
                };
			},
            resize: function(){
				var pos = handler.getPanelPos();
				
                dom.setStyle(panel, 'top', pos.t + 'px');
                dom.setStyle(panel, 'left', pos.l + 'px');
				
                mask && dom.setStyle(mask, 'width', pos.w + 'px');
                mask && dom.setStyle(mask, 'height', pos.h + 'px');
                frame && dom.setStyle(frame, 'width', pos.w + 'px');
                frame && dom.setStyle(frame, 'height', pos.h + 'px');
            },
            setPos: function(){
                dom.setStyle(panel, 'position', 'absolute');
                handler.resize();
            },
            hide: function(){
                dom.setStyle(panel, 'display', 'none');
                mask && dom.setStyle(mask, 'display', 'none');
				frame && dom.setStyle(frame, 'display', 'none');
				
				bind(_hide, that)();
            },
            show: function(){
				handler.setPos();
                dom.setStyle(panel, 'display', 'block');
                panel.style.cssText = panel.style.cssText;
				panel.style.zIndex = config.index + 1;
                mask && dom.setStyle(mask, 'display', '');
				frame && dom.setStyle(frame, 'display', '');
				
				bind(_show, that)();
            },
			fire: function(){
				mask && document.body.removeChild(mask);
				frame && document.body.removeChild(frame);
				panel && panel.parentNode.removeChild(panel);
				
				bind(_fire, that)();
			}
        };
        
        dom.getBy(function(el){
            if (dom.hasClass(el, 'panel_close')) {
                event.addEvent(el, handler.hide);
            }
        }, '', panel);
        
       	//init
		handler.init();
		
		//out interface
        return {
            hide: function(fun){
				config.isFire ? (handler.fire()) : (handler.hide());
				
				typeof(fun)=='function'&&(_hide=fun);
            },
            show: function(fun){
                handler.show();
				
				typeof(fun)=='function'&&(_show=fun);
            },
			fire: function(fun){
				handler.fire();
				
				typeof(fun)=='function'&&(_fire=fun);
			}
        }
    };
	/**
     * @method App.PopLayer 无任何内容的浮层
     * @param panel{String or Object} 浮层 id or obj
     * @param config{Json} 设定浮层配置（同App.Panel）
     * @param config.container{obj} 扩展参数，设定浮层在dom树中的容器，默认为document.body
     * 例：对obj绑定沿X轴拖拽事件
     * var dd = App.PopLayer(config.win_id,{ismask:true,index:300,width:'648px'});
     */
	App.PopLayer = function(id,config){
		config = config || {};
		config.container = config.container || document.body;
		
		var popHtml = [];
		popHtml.push('<table class="mBlogLayer" style="width:100%;"><tbody><tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr><tr><td class="mid_l"></td><td class="mid_c">');
		popHtml.push('<div id="root" class="layerBox">');
		popHtml.push('<div id="hd" class="layerBoxTopb"></div>');
		popHtml.push('<div id="bd" class="layerBoxCon" style="width:100%;">');
		popHtml.push('</div></div>');
		popHtml.push('</td><td class="mid_r"></td></tr><tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr></tbody></table>');
		
		var panel = $C('div');
		panel.setAttribute('id',id);
		document.body.appendChild(panel);

		var build = App.builder3(popHtml.join(''),panel,{dd:'id'});
		panel = App.Panel(panel,config);
		
		panel.domList = build.domList;
		panel.root = build.domList['root'];
		panel.hd = build.domList['hd'];
		panel.bd = build.domList['bd'];
		return panel;
	};
	/**
     * @method App.CommLayer 带有通用title的浮层
     * @param panel{String or Object} 浮层 id or obj
     * @param config{Json} 设定浮层配置（同App.Panel）
     * @param config.title{obj} 扩展参数，复层title
     * @param config.html{obj} 扩展参数，设定复层内的内容
     * @param config.close{function} 扩展参数，关闭层执行的动作
     * 例：对obj绑定沿X轴拖拽事件
     * var dd = App.PopLayer(config.win_id,{});
     */
	App.CommLayer = function(id,config){
		config = config || {};
		config.container = config.container || document.body;
		config.close = config.close || function(){return false;};
		
		var popHtml = [];
		popHtml.push('<table class="mBlogLayer" style="width:100%;"><tbody><tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr><tr><td class="mid_l"></td><td class="mid_c">');
		popHtml.push('<div id="root" class="layerBox">');
		popHtml.push('<div class="layerBoxTop"><div class="topCon"><strong>');
		popHtml.push(config.title||'');
		popHtml.push('</strong><a id="close" title="'+$CLTMSG['CD0018']+'" class="close" href="javascript:;"></a><div class="clear"></div></div></div>');
		popHtml.push('<div id="bd" class="layerBoxCon">');
		popHtml.push(config.html||'');
		popHtml.push('</div></div>');
		popHtml.push('</td><td class="mid_r"></td></tr><tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr></tbody></table>');
		
		var panel = $E(id);
		if(!panel){
			panel = $C('div');
			panel.setAttribute('id',id);
			document.body.appendChild(panel);
		}

		var build = App.builder3(popHtml.join(''),panel,{dd:'id'});
		
		panel = App.Panel(panel,config);
		//绑定panel的build.domList
		panel.domList = build.domList;
		panel.root = build.domList['root'];
		panel.bd = build.domList['bd'];
		//设定关闭按钮事件
		Core.Events.addEvent(build.domList['close'], function(){
			if(!config.close(panel)){
				panel.hide();
			};
		});
		return panel;
	};
	/**
     * @method App.CommLayer 带有通用title的浮层
     * @param panel{String or Object} 浮层 id or obj
     * @param config{Json} 设定浮层配置（同App.Panel）
     * @param config.title{obj} 扩展参数，复层title
     * @param config.html{obj} 扩展参数，设定复层内的内容
     * @param config.close{function} 扩展参数，关闭层执行的动作
     * @param config.submit{function} 扩展参数，提交是执行的动作
     * @param config.cancel{function} 扩展参数，取消是执行的动作
     * 例：对obj绑定沿X轴拖拽事件
     * var dd = App.PopLayer(config.win_id,{});
     */
	App.Confirm = function(id,config){
		config = config || {};
		config.container = config.container || document.body;
		
		config.submit = config.submit || function(){return false;};
		config.cancel = config.cancel || function(){return false;};
		config.close = config.close || function(){return false;};
		
		var popHtml = [];
		popHtml.push('<table class="mBlogLayer" style="width:100%;"><tbody><tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr><tr><td class="mid_l"></td><td class="mid_c">');
		popHtml.push('<div id="root" class="layerBox">');
		popHtml.push('<div class="layerBoxTop"><div class="topCon"><strong>');
		popHtml.push(config.title||'');
		popHtml.push('</strong><a id="close" title="'+$CLTMSG['CD0018']+'" class="close" href="javascript:;"></a><div class="clear"></div></div></div>');
		popHtml.push('<div id="bd" class="layerBoxCon">');
		popHtml.push(config.html||'');
		popHtml.push('</div>');
		//add btn start
		popHtml.push('<div class="MIB_btn" style="padding:5px 0;"><a id="submit" class="btn_normal" href="javascript:;"><em>'+$CLTMSG['WL0003']+'</em></a><a id="cancel" class="btn_notclick" href="javascript:;"><em>'+$CLTMSG['WL0004']+'</em></a></div>');
		//end
		popHtml.push('</div></td><td class="mid_r"></td></tr><tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr></tbody></table>');
		
		var panel = $E(id);
		if(!panel){
			panel = $C('div');
			panel.setAttribute('id',id);
			document.body.appendChild(panel);
		}

		var build = App.builder3(popHtml.join(''),panel,{dd:'id'});
		
		panel = App.Panel(panel,config);
		//绑定panel的build.domList
		panel.domList = build.domList;
		panel.root = build.domList['root'];
		panel.bd = build.domList['bd'];
		//设定关闭按钮事件
		Core.Events.addEvent(build.domList['close'], function(){
			if(!config.close(panel)){
				panel.hide();
			};
		});
		Core.Events.addEvent(build.domList['submit'], function(){
			if(!config.submit(panel)){
				panel.hide();
			};
		});
		Core.Events.addEvent(build.domList['cancel'], function(){
			if(!config.cancel(panel)){
				panel.hide();
			};
		});
		return panel;
	};
})();
