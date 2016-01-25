$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");

/**
 * 分屏加载
 * @author liusong@staff.sina.com.cn
 */

(function(proxy){
	/**
	 * 基本参数配置
	 * @private const
	 */
	var $w = window, $d = $w["document"], $e = $d["documentElement"]||{}, $pl = 2, count = 1, cacheid = 1;
	/**
	 * 简易命名空间
	 * @private static
	 */
	var $a = Core.Events.addEvent;
	var $r = Core.Events.removeEvent;
	var $t = function(){
		return ($w.pageYOffset||Math.max($e.scrollTop, $d["body"].scrollTop));
	}
	/**
	 * 获取对象y坐标
	 * @param {Object} el
	 */
	var $y = function(el){
		var et,pn;
		if ('getBoundingClientRect' in el) {
				et = el.getBoundingClientRect().top;
				return et + $t();
		}
		if(!(pn = el.offsetParent)){return 0}
		et = pn.offsetTop;
		while (pn && pn!=$d["body"]) {
			et += pn.offsetTop;
			pn = pn.offsetParent;
		}
		return et||0;
	};
	var $sh = function(){
		return Math.max($e.clientHeight,$e.scrollHeight,$e.offsetHeight,$d.body.scrollHeight,$d.body.offsetHeight);
	};
	var $wh = function(){
		return $w["innerHeight"] || ($e && $e["clientHeight"]) ? $e["clientHeight"] : $d["body"]["clientHeight"];
	};
	var isRemoved = function( element ){
		var e, p, n;
		return !(e = element) || !(p = e.parentNode) || ((n = p.nodeName) && n=="#document-fragment");
	};
	/**
	 * 队列管理
	 */
	var model = (function(){
		var oInstance = {}, _aQueue = [];
		//添加
		oInstance.add = function(init, fFlush, fExtract){
			try{_aQueue.push({"queue": init() || [], "flush": fFlush, "extract": fExtract||null})}catch(e){$Debug(e)}
		};
		oInstance.flush = function(tStep, step){
			var _i=0, _len=_aQueue.length, delay = 0;
			for(_i; _i<_len; _i++){
				var i=0, current=_aQueue[_i], queue=current.queue, len = queue.length, returns=[];
				for(i; i<len; i++){
					var item = queue[i], y;
					if(isRemoved(item)){queue.splice(i,1);len--;i--;continue}
					if((y = $y(item)) > step || y < tStep){continue}
					try{current.extract && current.extract(item)}catch(e){$Debug(e)};
					returns.push(queue.splice(i,1)[0]);
					len--,i--;
				}
				try{returns.length && (function(cf,rts){setTimeout(function(){cf(rts)},0)})(current["flush"],returns)}catch(e){$Debug(e)};
				if (!queue.length) {
					_aQueue.splice(_i, 1);
					_len--;_i--;
				}
			}
			return !_aQueue.length?false:true;
		};
		return oInstance;
	})();
	/**
	 * 屏幕管理
	 */
	var screen = (function(){
		var clock, sleep, oInstance = {}, _enabled = false, _step, flush = model.flush, _delay=100, _mode="Timeout", validate = true;
		oInstance.validate = function(){
			validate = false;
			clearTimeout(sleep);
			sleep = setTimeout(function(){
				validate = true;
			},200)
		}
		//对有dom添加删除的页面进行轮循
		oInstance.loop = (function(){
			var step = 0, tStep = 0, snap, snapSH, sh, t;
			return function(){
				sh = $sh();
				if(sh < (snapSH||0)){step -= (snapSH - sh)}{ snapSH = sh }
				t = $t();
				snap = t + _step;
				if(((count%200==0 && (count=1)) || snap > step || t < tStep) && validate){
					tStep = t - 100;
					step = snap + _step;
					if(!flush(tStep, step)){oInstance.enabled(false)};
				}
				count++;
			}
		})();
		//是否失效
		oInstance.enabled = function(b){
			if(b===undefined){return _enabled}
			if(b===_enabled) {return}
			_enabled = b;
			clearInterval(clock);
			(b ? $a: $r)(window, oInstance.validate, "scroll");
			b && (clock = setInterval(oInstance.loop, 30));
		};
		//重置预载步长
		oInstance.step = function(){
			_step = $wh()*$pl;
		};
		//窗口大小重置
		oInstance.resize = function(){
			oInstance.step();
		};
		return oInstance;
	})();
	/**
	 * 用于hash对像的唯一id
	 * @param {Object} oElement 必选参数
	 */
	var getRid = function( oElement ){
		var attr = oElement.getAttribute("cacheid");
		if(attr){return attr}
		oElement.setAttribute("cacheid", cacheid++);
		return attr;
	};
	/**
	 * 根据已给定的对象,筛选指定对象类型的属性及属性值
	 * @param {Object} oElement   必选参数，选择范围的顶级对象，默认为document.body
	 * @param {Object} oTagName   必选参数，节点类型，例: A，DIV，默认为*
	 * @param {Object} sAtribute  必选参数，节点上的属性，例: href, abc
	 * @param {Object} sValue     非必选能数，属性值默认为空
	 */
	proxy.getElementsByAttribute = (function(){
		var cache = {}, key = function(){return Array.prototype.slice.call(arguments,0).join("_")};
		return function( oElement, sTagName, sAttribute, sValue ){
			oElement=$E(oElement)||$d["body"];sTagName=sTagName||"*";
			var valueKey, attrKey, tagKey;
				valueKey = key(attrKey = key(tagKey = key(getRid(oElement),sTagName),sAttribute),sValue);
			var attrs = cache[attrKey]||null, values = cache[valueKey]||null, tags = cache[tagKey]||null;
			if(!sValue && attrs ){return attrs}
			if( sValue && values){return values}
			var elements = attrs || tags || (cache[tagKey] = oElement.getElementsByTagName(sTagName));
			var i=0,len=elements.length,retAttrib=[],retValue=[],current,attrib,returns;
			var reg = sValue? new RegExp("(^|\\s)" + sValue + "(\\s|$)") : null;
			for(i; i<len; i++){
				if((current = elements[i]).nodeType!=1){continue}
				if(!(attrib = current.getAttribute(sAttribute))){continue}
				if(!attrs){retAttrib.push(current)}
				if(reg && reg.test(attrib)){retValue.push(current)}
			}
			if(retAttrib.length){returns = cache[attrKey] = retAttrib}
			if(retValue.length) {returns = cache[valueKey] = retValue}
			return returns||[];
		};
	})();
	/**
	 * 单个plugin调用
	 */
	var bindProxy = function( oProxy, extract, flush, fGetData ){
		var i=0,ns=App,len=(p=((oProxy||"").split("."))).length;
		for(i = (p[0] == "App")?1:0; i<len; i++){
			ns = ns[p[i]] = ns[p[i]] || {};
		}
		ns.flush = function( doms ){
			var i=0,len=(doms=(doms||[])).length;
			if(!len){return}
			for(i; i<len; i++){
				try{extract && extract(doms[i])}catch(e){ $Debug(e) }
			}
			try{flush && flush(doms)}catch(e){ $Debug(e) }
		};
		ns.fire = function(){
			var dom = fGetData();
			ns.flush(dom)
		};
		return ns;
	};
	/**
	 * 分屏管理
	 */
	proxy.splitLoader = (function(){
		var oInstance = {};
		oInstance.model  = model;
		oInstance.screen = screen;
		oInstance.loop = screen.loop;
		oInstance.plugin = function(oPlug, sProxy){
			if(oPlug && oPlug.init && (oPlug.flush = oPlug.flush||function(){})){
				sProxy && (sProxy = bindProxy(sProxy, oPlug.extract, oPlug.flush, oPlug.init));
				if(/\((iPhone|iPad|iPod)/i.test(navigator.userAgent) && sProxy){
					sProxy.fire();
					return oInstance;
				}
				oInstance.model.add(oPlug.init, oPlug.flush, oPlug.extract);
				screen.resize();
				screen.enabled(true);
			}else{ $Debug("invalid plugin") }
			return oInstance;
		};
		return oInstance;
	})();
})(App);


