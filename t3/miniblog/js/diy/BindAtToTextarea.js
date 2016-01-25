/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle.js");
$import("diy/TextareaUtils.js");
$import("diy/PopUpCombo.js");
$import("diy/EncodeUtils.js");
$import("sina/utils/io/ajax.js");


App.BindAtToTextarea = (function(){
	//短命名初始化
	var d = document, format=App.EncodeUtils.html, select=App.PopUpCombo, cd=Core.Dom, getStyle=cd.getStyle, selectionStart, setStyle=cd.setStyle, getXY = cd.getXY, ce=Core.Events, addEvent = ce.addEvent, removeEvent=ce.removeEvent, stopEvent = ce.stopEvent, ajax=Utils.Io.Ajax, clock;
	//镜像样式初始化
	var cssg = ["overflowY","height","width","paddingTop","paddingLeft","paddingRight","paddingBottom","marginTop","marginLeft","marginRight","marginBottom"];
	//固定样式初始化
	var font = "Tahoma,宋体", cssc = {"fontFamily" : font, "borderStyle": "solid", "borderWidth": "0px", "wordWrap"   : "break-word", "fontSize"   : "14px", 	"lineHeight" : "18px", "overflowX"  : "hidden" };
	//选项框头部代码
	var selectHead = '<div style="height:20px;color:#999999;padding-left:8px;padding-top:2px;line-height:18px;font-size:12px;Tahoma,宋体;">' + $CLTMSG['CL0827'] + '</div>';
	//是否仅支持css1
	var isCss1 = false, ua = navigator.userAgent, r = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(ua);
		if(r && (r=parseFloat(RegExp.$1)) && r<8){isCss1 = true};
	var hash = {"<":"&lt;",">":"&gt;","\"":"&quot;","\\":"&#92;","&":"&amp;","'":"&#039;","\r":"","\n":"<br>"," ":!isCss1?"<span style='white-space:pre-wrap;font-size:14px;font-family:" + font + ";'> </span>":"<pre style='overflow:hidden;display:inline;font-size:'+fontSize+';font-family:" + font + ";word-wrap:break-word;'> </pre>"}, fReg = /<|>|\'|\"|&|\\|\r\n|\n| /gi;
	//带有abort方法的简单ajax请求
	var AjaxHasAbort = function( url, success, error){
		var req, res, error;
		req = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		if(!req){return}
		req.onreadystatechange = function(){
		try {
			if (req.readyState == 4) {
				res = eval("(" + req.responseText + ")");
				success(res)
			}
		}catch(e){return false}}
		try {
			req.open("GET", url, true);
			req.send(null);
		}catch(e){return false}
		return req;
	};
	//单一请求，前一发出请求如果没有及时反馈，则会被后一请求干掉
	var doRequest = (function(){
		var req;
		return function( url, success, error ){
			if(req){req.abort();req}
			req = AjaxHasAbort( url, success, error );
		}
	})();
	
	//at的主要逻辑
	var at = (function(){
		//at的短命名
		var it = {}, current, panel, cache, lastCache, flag, content, nbody, reg, tu=App.TextareaUtils, clock, reqed={}, validate=false, currentKey, keyChange=0, items;
		//过滤当前选中的key
		reg = /@[^@\s]{1,20}$/g;
		/**
		 * 关闭动态提示层
		 */
		it.onClose = function(){
			cache = null;
			lastCache = null;
			currentKey = null;
			setTimeout(function(){try{current.focus()}catch(e){}},0)
		};
		/**
		 * 对单条选择
		 * @param {Object} value
		 */
		it.onSelect = function(value){
			var st = current.scrollTop;
			current.focus();
			tu.insertText(current, value+" ", selectionStart, currentKey.length);
			current.scrollTop = st;
		}
		/**
		 * 设置镜象的内容
		 * @param {String} value 必选参数
		 */
		it.setContent = function( value, last ){
			panel.style.height = current.clientHeight + "px";
			if(cache!=value){cache=value;content.innerHTML = format(value, hash)};
			if(lastCache!=last){lastCache=last;nbody.innerHTML = format(last, hash)};
			if(scope.$SAFARI){panel.style.overflowY = getStyle(current,"overflowY")=="hidden"?"hidden":"scroll"}
			else{panel.style.overflowY = (current.scrollHeight>current.clientHeight)?"auto":"hidden"}
			//=================================debugger=========================================
			//panel.style.zIndex = "2000";
			//panel.style.backgroundColor = "#ffffff";
			//setStyle(panel,"opacity",1);
			//==================================================================================
		};
		/**
		 * 联想数据弹出层
		 * @param {Object} json
		 */
		it.initTip = function(json){
			var data, len, i=0, list=[], name, tmp = 'background-color:#ebebeb;', point;
			//=================================debugger=================================================
			//json.data=["abcdefg","adsfasdfasdf","qasdfasdfasdf","asdfasdfadsfads","asdfadf","asdfasdf"];
			//json.code="A00006";
			//==========================================================================================
			if(json.code=="A00006" && (data = json.data||[])){
				point = getXY(flag);
				select.position(point[0],point[1],0,-(current.scrollTop-20));
				select.bind(current, data, currentKey, it.onSelect, it.onClose, selectHead);
				reqed[currentKey] = json;
				return;
			}
			select.hidden();
		};
		/**
		 * 用户输入分析
		 */
		it.check = function(){
			var snap, snap=value=current.value.replace(/\r/g,""), key, len, html, param, last;
			selectionStart=tu.selectionStart(current);
			value = value.slice(0,selectionStart);
			if((key=value.match(reg)) && (key = key[0]) && /^@[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(key)){
				key=key.slice(1);
				if(currentKey==key){return}
				currentKey = key;
				last = snap.slice(selectionStart-currentKey.length,snap.length);
				value = value.slice(0,-currentKey.length-1);
				it.setContent(value, last);
				if (reqed[key]) {it.initTip(reqed[key]);return}
				doRequest("/mblog/aj_searchat.php?atkey="+encodeURIComponent(key), function(json){it.initTip(json,key)}, select.hidden);
				return;
			}
			select.hidden();
		};
		/**
		 * 对影响社会和谐的行为进行扼制
		 */
		it.sleep = function(event){
			var keyCode = event.keyCode;
			if(keyCode=="27"){return}
			clearTimeout(clock);
			clock = setTimeout(it.check,100);
		};
		/**
		 * 为Textarea进行用户行为绑定或移除
		 */
		it.bindEvent = function(oElement, b){
			var act = b?addEvent:removeEvent;
			act(oElement, it.sleep, "keypress");
			act(oElement, it.sleep, "keyup");
			act(oElement, it.sleep, "mouseup");
		};
		it.rePosition = (function(){
			var clock,stop = function(){clearInterval(clock)};
			var flush = function(){
				try{
					if(!current){return}
					point = getXY(current);
					with(panel.style){left= point[0]+"px"; top= point[1]+"px"}
					//debugger
					//with(panel.style){left= point[0]+"px"; top= (point[1]+100)+"px"}
				}catch(e){stop()}
			};
			return function(){
				stop();
				clock = setInterval(flush,100);
				//debugger
				//flush();
			}
		})();
		/**
		 * 重置镜像属性
		 */
		it.mirror = function( oStyleFix ){
			var i=0, p, len=cssg.length, point, fix=0, size="14px", w;
			if($MOZ){fix=-2}
			if(scope.$SAFARI){fix=-6}
			for(i; i<len; i++){panel.style[cssg[i]]= getStyle(current,cssg[i])}
			for(p in cssc){panel.style[p] = current.style[p] = cssc[p]}
			for(p in oStyleFix){panel.style[p] = current.style[p] = oStyleFix[p]}
			if (oStyleFix && oStyleFix.fontSize) { size = oStyleFix.fontSize }
			hash[" "] = !isCss1?"<span style='white-space:pre-wrap;font-size:" + size + ";font-family:" + font + ";'> </span>":"<pre style='overflow:hidden;display:inline;font-size:" + size + ";font-family:" + font + ";word-wrap:break-word;'> </pre>";
			panel.style.width = ((parseInt(current.style.width)||current.offsetWidth) + fix) + "px";
			it.bindEvent(current,true);
			it.rePosition();
			return false;
		};
		/**
		 * 绑定一个一样的镜像到Textarea对象
		 * @param {HTMLElement} oElement
		 */
		it.to = function( oElement, oStyleFix ){
			//如果对像没有改变则只重置镜像的坐标，仅为适应在层中出现的Textarea
			if(current==oElement){return}
			//在没有镜像容器时创建容器
			if(!it.panel){
				d.body.appendChild(it.panel    = panel   = $C("div"));
				panel.appendChild (it.content  = content = $C("span"));
				panel.appendChild (it.flag     = flag    = $C("span"));
				panel.appendChild (it.nbody    = nbody   = $C("span"));
				with(panel.style){zIndex = -1000; position = "absolute"}
				flag.innerHTML = "@";
				setStyle(panel,"opacity",0);
			}
			//对当前的Textarea对象进行行为移除
			current && it.bindEvent(current,false);
			//在镜像对像改对时，重置镜像属性
			(current = oElement) && it.mirror(oStyleFix)
		};
		
		return it
	})();
	/**
	 * 为对象邦定@功能
	 * @param {HTMLElement} oElement 必选参数,绑定一个Textarea对，使该对像具有at联想功能
	 * @param {Object}      oStyleFix 非必选参数,对于镜像和原对像的双方修正样式 例如: { border:"1px solid" }
	 */
	return function( oElement, oStyleFix ){
		oElement.style.fontFamily = font;
		addEvent(oElement, function(){at.to(oElement, oStyleFix)}, "focus");
	}
	
})();

