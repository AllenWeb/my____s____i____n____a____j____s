var $Debug = (function(){
	var Lib = {};
	(function () {
	    Lib.regist = function (sNameSpace) {
	        var currentPart;
	        var rootObject = Lib;
	        var namespaceParts = sNameSpace.split('.');
	        for (var i = 0; i < namespaceParts.length; i++) {
	            currentPart = namespaceParts[i];
				if(currentPart != 'Lib'){
					if (rootObject[currentPart] == null) {
		                rootObject[currentPart] = {};
		            }
		            rootObject = rootObject[currentPart];
				}
	        }
	        return rootObject;
	    };
	    Lib.$E = function (sID) {
	        if ((typeof sID).toLowerCase() == 'string') {
	            sID = document.getElementById(sID);
	        }
	        if (sID) {
	            return sID;
	        }
	        return null;
	    };
	    Lib.$C = function (sTagName) {
	        return document.createElement(sTagName);
	    };
	    Lib.$T = function (sTagName, oNode) {
	        return (oNode || document).getElementsByClassName(sTagName);
	    };
	    (function () {
	        var ua = navigator.userAgent.toLowerCase();
	        Lib.$IE = /msie/.test(ua);
	        Lib.$IE6 = /msie 6/.test(ua);
	        Lib.$IE7 = /msie 7/.test(ua);
	        Lib.$IE8 = /msie 8/.test(ua);
	        Lib.$OPERA = /opera/.test(ua);
	        Lib.$MOZ = /gecko/.test(ua);
	        Lib.$SAFARI = /safari/.test(ua);
	        Lib.$winXP = /windows nt 5.1/.test(ua);
	        Lib.$winVista = /windows nt 6.0/.test(ua);
	        Lib.$winVista = /windows nt 6.1/.test(ua);
	    })();
	    if (Lib.$IE) {
	        document.execCommand("BackgroundImageCache", false, true);
	    }
	})();
	Lib.regist("Lib.Dom");
	Lib.regist("Lib.Array");
	Lib.regist("Lib.Function");
	Lib.Function.getType = function (oObject) {
	    var _t;
	    return ((_t = typeof(oObject)) == "object" ? oObject == null && "null" || Object.prototype.toString.call(oObject).slice(8, -1) : _t).toLowerCase();
	};
	Lib.Array.foreach = function (oArray, oCallBack) {
	    if (oArray == null || Lib.Function.getType(oCallBack) != 'function') {
	        $Debug('Lib.Array.foreach: 参数错误!');
	        return;
	    }
	    if (Lib.Function.getType(oArray) != 'array') {
	        oArray = [oArray];
	    }
	    var val, result;
	    for (var i = 0, len = oArray.length; i < len; i++) {
	        val = oCallBack(oArray[i], i);
	        if (val != null) {
	            result.push(val);
	        }
	    }
	    return result;
	};
	(function () {
	    function inserHTMLIE(sNode, sHTML, sWhere) {
	        var oElement = Lib.$E(sNode);
	        if (oElement == null) {
	            $Debug.error('inserHTML: [' + sNode + '] 未找到');
	            return;
	        }
	        sWhere = sWhere ? sWhere.toLowerCase() : 'beforeend';
	        switch (sWhere) {
	        case "beforebegin":
	            oElement.insertAdjacentHTML('BeforeBegin', sHTML);
	            return oElement.previousSibling;
	        case "afterbegin":
	            oElement.insertAdjacentHTML('AfterBegin', sHTML);
	            return oElement.firstChild;
	        case "beforeend":
	            oElement.insertAdjacentHTML('BeforeEnd', sHTML);
	            return oElement.lastChild;
	        case "afterend":
	            oElement.insertAdjacentHTML('AfterEnd', sHTML);
	            return oElement.nextSibling;
	        }
	    }

	    function inserHTMLMOZ(sNode, sHTML, sWhere) {
	        var oRange, oFrag;
	        var oElement = Lib.$E(sNode);
	        if (oElement == null) {
	            $Debug.error('inserHTML: [' + sNode + '] 未找到');
	            return;
	        }
	        sWhere = sWhere ? sWhere.toLowerCase() : 'beforeend';oRange = oElement.ownerDocument.createRange();
	        switch (sWhere) {
	        case "beforebegin":
	            oRange.setStartBefore(oElement);
	            oFrag = oRange.createContextualFragment(sHTML);
	            oElement.parentNode.insertBefore(oFrag, oElement);
	            return oElement.previousSibling;
	        case "afterbegin":
	            if (oElement.firstChild) {
	                oRange.setStartBefore(oElement.firstChild);
	                oFrag = oRange.createContextualFragment(sHTML);
	                oElement.insertBefore(oFrag, oElement.firstChild);
	                return oElement.firstChild;
	            }
	            else {
	                oElement.innerHTML = sHTML;
	                return oElement.firstChild;
	            }
	            break;
	        case "beforeend":
	            if (oElement.lastChild) {
	                oRange.setStartAfter(oElement.lastChild);
	                oFrag = oRange.createContextualFragment(sHTML);
	                oElement.appendChild(oFrag);
	                return oElement.lastChild;
	            }
	            else {
	                oElement.innerHTML = sHTML;
	                return oElement.lastChild;
	            }
	            break;
	        case "afterend":
	            oRange.setStartAfter(oElement);
	            oFrag = oRange.createContextualFragment(sHTML);
	            oElement.parentNode.insertBefore(oFrag, oElement.nextSibling);
	            return oElement.nextSibling;
	        }
	    }
	    var inserHTMLOne = Lib.$IE ? inserHTMLIE : inserHTMLMOZ;Lib.Dom.insertHTML = function (oNodes, sHTML, sWhere) {
	        if (oNodes == null) {
	            $Debug.error('insertHTML: [' + oNodes + '] 未找到');
	            return;
	        }
	        if (Lib.Function.getType(oNodes) != 'array') {
	            oNodes = [oNodes];
	        }
	        Lib.Array.foreach(oNodes, function (oNode, nIndex) {
	            inserHTMLOne(oNode, sHTML, sWhere);
	        });
	    };
	})();
	Lib.Dom.getStyle = function (sNode, sProperty) {
	    var oElement = Lib.$E(sNode);
	    if (oElement == null) {
	        $Debug.error('getStyle: [' + sNode + '] 未找到');
	        return;
	    }
	    if (Lib.$IE) {
	        switch (sProperty) {
	        case "opacity":
	            return ((oElement.filters['DXImageTransform.Microsoft.Alpha'] || oElement.filters['alpha'] || {}).opacity || 100);
	        case "float":
	            sProperty = "styleFloat";
	        }
	        return oElement.style[sProperty] || oElement.currentStyle ? oElement.currentStyle[sProperty] : 0;
	    }
	    else {
	        if (sProperty == "float") {
	            sProperty = "cssFloat";
	        }
	        return oElement.style[sProperty] || (document.defaultView.getComputedStyle(oElement, "") ? document.defaultView.getComputedStyle(oElement, "")[sProperty] : null) || 0;
	    }
	};
	(function () {
	    function setStyleOne(sNode, sProperty, sValue) {
	        var oElement = Lib.$E(sNode);
	        if (oElement == null) {
	            $Debug.error('setStyleOne: [' + sNode + '] 未找到');
	            return;
	        }
	        if (Lib.$IE) {
	            switch (sProperty) {
	            case "opacity":
	                oElement.style.filter = "alpha(opacity=" + (sValue * 100) + ")";
	                if (!oElement.currentStyle || !oElement.currentStyle.hasLayout) {
	                    oElement.style.zoom = 1;
	                }
	                break;
	            case "float":
	                sProperty = "styleFloat";
	            }
	        }
	        else {
	            if (sProperty == "float") {
	                sProperty = "cssFloat";
	            }
	        }
	        oElement.style[sProperty] = sValue;
	    }

	    function setStyle(oNodes, sProperty, sValue) {
	        if (oNodes == null) {
	            $Debug.error('setStyle: [' + oNodes + '] 未找到');
	            return;
	        }
	        if (Lib.Function.getType(oNodes) != 'array') {
	            oNodes = [oNodes];
	        }
	        Lib.Array.foreach(oNodes, function (oNode, nIndex) {
	            setStyleOne(oNode, sProperty, sValue);
	        });
	    }
	    Lib.Dom.setStyle = setStyle;
	})();
	Lib.regist("Lib.Event");
	Lib.Event.addEvent = function (sNode, sEventType, oFunc) {
	    var oElement = Lib.$E(sNode);
	    if (oElement == null) {
	        $Debug.error('addEvent: [' + sNode + '] 未找到');
	        return;
	    }
	    sEventType = sEventType || 'click';
	    if ((typeof oFunc).toLowerCase() != "function") {
	        return;
	    }
	    if (oElement.attachEvent) {
	        oElement.attachEvent('on' + sEventType, oFunc);
	    }
	    else if (oElement.addEventListener) {
	        oElement.addEventListener(sEventType, oFunc, false);
	    }
	    else {
	        oElement['on' + sEventType] = oFunc;
	    }
	};
	Lib.Event.getEvent = (function () {
	    if (Lib.$IE) {
	        return function () {
	            return window.event;
	        };
	    }
	    else {
	        return function () {
	            if (window.event) return window.event;
	            var e, n = 0,
	                o = arguments.callee.caller;
	            while (o != null && n < 40) {
	                e = o.arguments[0];
	                if (e && (e.constructor == Event || e.constructor == MouseEvent)) {
	                    return e;
	                }
	                n++;
	                o = o.caller;
	            }
	            return e;
	        };
	    }
	})();
	Lib.Event.stopEvent = function (oEvent) {
	    oEvent = oEvent || Lib.Event.getEvent();
	    try {
	        if (Lib.$IE) {
	            oEvent.cancelBubble = true;
	            oEvent.returnValue = false;
	        }
	        else {
	            oEvent.preventDefault();
	            oEvent.stopPropagation();
	        }
	    }
	    catch (e) {}
	};
	(function () {
	    if (Lib.Event.addDOMLoadEvent != null) {
	        return;
	    }
	    var funcList = [];
	    var inited = false;
	    var exec_func_list = function () {
	        if (inited == true) {
	            return;
	        }
	        inited = true;
	        for (var i = 0, len = funcList.length; i < len; i++) {
	            if ((typeof funcList[i]).toLowerCase() == 'function') {
	                funcList[i].call();
	            }
	        }
	        funcList = [];
	    };
	    if (document.attachEvent) {
	        (function () {
	            try {
	                document.documentElement.doScroll("left");
	            }
	            catch (e) {
	                setTimeout(arguments.callee, 0);
	                return;
	            }
	            exec_func_list();
	        })();
	    }
	    else if (document.addEventListener) {
	        Lib.Event.addEvent(document, 'DOMContentLoaded', exec_func_list);
	    }
	    else if (/WebKit/i.test(navigator.userAgent)) {
	        (function () {
	            if (/loaded|complete/.test(document.readyState.toLowerCase())) {
	                exec_func_list();
	                return;
	            }
	            setTimeout(arguments.callee, 0);
	        })();
	    }
	    Lib.Event.addEvent(window, 'load', exec_func_list);
	    Lib.Event.addDOMLoadEvent = function (oFunc) {
	        if (inited == false) {
	            funcList.push(oFunc);
	        }
	        else {
	            if ((typeof oFunc).toLowerCase() == 'function') {
	                oFunc.call();
	            }
	        }
	    };
	})();
	Lib.Event.getActiveElement = function () {
	    try {
	        var evt = Lib.Event.getEvent();
	        return document.activeElement ? document.activeElement : evt.explicitOriginalTarget;
	    }
	    catch (e) {
	        return document.body;
	    }
	};
	Lib.regist("Lib.System");
	(function () {
	    var parseParam = function (oSource, oParams) {
	        var key;
	        try {
	            if (typeof oParams != "undefined") {
	                for (key in oSource) {
	                    if (oParams[key] != null) {
	                        oSource[key] = oParams[key];
	                    }
	                }
	            }
	        }
	        finally {
	            key = null;
	            return oSource;
	        }
	    };
	    Lib.System.parseParam = parseParam;
	})();
	Lib.regist("Lib.String");
	Lib.String.templatePath = function (sTemplate, oData) {
	    oData = oData || [];
	    return sTemplate.replace(/(#\{(.*?)\}#)/g, function () {
	        return oData[arguments[2]] || arguments[0];
	    });
	};
	
	
	
	
	
	
	var contentList = $Debug && $Debug.contentList || [];
	var rnd_id = parseInt(Math.random() * 10000, 10);
	var trace_html = '' +
	'<div style="display:none;">&nbsp;<style>' +
	'##{content}#.trace * {' +
	'  font-family: Arial, Helvetica, sans-serif;' +
	'}' +
	'##{content}#.trace {' +
	'  width: 400px;' +
	'  position: fixed;' +
	'  right: 6px;' +
	'  top: 6px;' +
	'  font-size: 12px;' +
	'  color: #000;' +
	'  display: none;' +
	'  border: 1px solid #ccc;' +
	'  z-index: 102400000;' +
	'  -moz-border-radius: 3px;' +
	'  -webkit-border-radius: 3px;' +
	'}' +
	'##{content}# .trace_top {' +
	'  height: 26px;' +
	'  line-height: 26px;' +
	'  text-indent: 6px;' +
	'  -moz-user-select: none;' +
	'  -webkit-user-select: none;' +
	'  border-bottom: 1px solid #efefef;' +
	'  background: #e6e6e6;' +
	'  cursor: default;' +
	'  color: #666;' +
	'}' +
	'##{content}# .trace_middle {' +
	'  height: 400px;' +
	'  border: 1px solid #ccc;' +
	'  border-width: 1px 0;' +
	'  background: rgba(239, 239, 239, 0.9);' +
	'  overflow-y: scroll;' +
	'  padding: 4px;' +
	'  text-align: left;' +
	'}' +
	'##{content}# .trace_middle ul {' +
	//'list-style-type: decimal;'+
	'  list-style-type: none;' +
	'  margin: 0;' +
	'  padding: 0;' +
	//'  padding-left: 30px;' +
	'}' +
	'##{content}# .trace_middle ul li {' +
	'  padding: 4px;' +
	//'  padding-left: 0px;' +
	'  border-bottom: 1px solid #ccc;' +
	'  line-height: 1.5;' +
	'}' +
	'##{content}# .trace_middle ul li.cmd {' +
	'  background: rgba(200, 200, 200, 0.6);' +
	'}' +
	'##{content}# .trace_middle ul li.fatal {' +
	'  background: #BD0404;' +
	'  background: rgba(189, 4, 4, 0.6);' +
	'  color: #fff;' +
	'}' +
	'##{content}# .trace_middle ul li.error {' +
	'  color: #BD0404;' +
	'}' +
	'##{content}# .trace_middle ul li.warning {' +
	'  color: #FF9C00;' +
	'}' +
	'##{content}# .trace_middle ul li.info {' +
	'  color: #3A934D;' +
	'}' +
	'##{content}# .trace_foot {' +
	'  border-top: 1px solid #efefef;' +
	'  background: #e6e6e6;' +
	'  background: rgba(230, 230, 230, 0.9);' +
	'  overflow: hidden;' +
	'  padding: 4px;' +
	'}' +
	'##{content}# .trace_foot input {' +
	'  border: 0;' +
	'  background: #e6e6e6;' +
	'  background: rgba(230, 230, 230, 0);' +
	'  height: 22px;' +
	'  padding-top: 2px;' +
	'  font-size: 18px;' +
	'  width: 100%;' +
	'  letter-spacing: 1px;' +
	'}' +
	(Lib.$IE6 ? '##{content}#.trace {' +
	'  position: absolute;' +
	'}' : '') +
	'##{content}# .trace_middle {' +
	'  background: #efefef;' +
	'}' +
	'##{content}# .trace_middle ul li.fatal {' +
	'  background: #BD0404;' +
	'}' +
	'##{content}# .trace_foot {' +
	'  background: #e6e6e6;' +
	'}' +
	'##{content}# .trace_foot input {' +
	'  background: #e6e6e6;' +
	'}' +
	'</style></div>' +
	'<div class="trace" id="#{content}#">' +
	'  <div class="trace_top">$Debug Box 0.2</div>' +
	'  <div class="trace_middle" id="#{cmd_content_box}#"><ul id="#{cmd_content}#"></ul></div>' +
	'  <div class="trace_foot"><input id="#{cmd_input}#" /></div>' +
	'</div>';
	var node_hash = {};
	var export_timer;
	// 批量执行
	function export_batch(){
		clearTimeout(export_timer);
		export_timer = setTimeout(export_content, 100);
	}
	// 分批输出,分散运算
	function export_content(){
		var i;
		if (contentList.length > 0) {
			content_to_ui(contentList.splice(0, 100));
			if (contentList.length > 0) {
				setTimeout(export_content, 25);
			}
		}
	}
	// 添加一条信息
	function add_to_content(sText, oOpts, sCMD){
		var text = sText != null ? sText : '';
		var opts = {
			color: null,
			bgcolor: null,
			html: null
		};
		var cmd = sCMD != null ? sCMD : 'log';
		Lib.System.parseParam(opts, oOpts);
		contentList.push({
			label: text,
			cmd: cmd,
			opts: opts,
			time: new Date()
		});
		if (inited == true) {
			export_batch();
		}
	}
	// 输出到页面中
	function content_to_ui(aList){
		var i, html = [];
		var style;
		for (i = 0; i < aList.length; i++) {
			style = '';
			if (aList[i].opts.color) {
				style += 'color:' + aList[i].opts.color + ';';
			}
			if (aList[i].opts.bgcolor) {
				style += 'background:' + aList[i].opts.bgcolor + ';';
			}
			html.push('<li class="' + aList[i].cmd + '" style="' + style + '"><span style="font-size:9px;color:#666;">' + parseTime(aList[i].time) + '&nbsp;</span>' +
			parseContent(aList[i].label, aList[i].opts.html) +
			'</li>');
		}
		Lib.Dom.insertHTML(node_hash.cmd_content, html.join(''));
		content_scroll_bottom();
	}
	function parseContent(sContent, bHTML){
		if (bHTML == true) {
			return sContent;
		}
		return sContent.toString().replace(/[<]/gi, '&lt;');
	}
	function parseZero(nNumber){
		return nNumber < 10 ? '0' + nNumber : nNumber;
	}
	// 解析时间
	function parseTime(oDate){
		return '<span style="display:none;">' +
		parseZero((oDate.getMonth() + 1)) +
		'/' +
		parseZero(oDate.getDate()) +
		' ' +
		parseZero(oDate.getHours()) +
		':' +
		'</span>' +
		parseZero(oDate.getMinutes()) +
		':' +
		parseZero(oDate.getSeconds());
	}
	// 滚动到底部
	function content_scroll_bottom(){
		node_hash.cmd_content_box.scrollTop = node_hash.cmd_content_box.scrollHeight;
	}
	// 初始化界面以及方法
	var domloaded = false;
	var inited = false;
	function init(){
		if (inited != false && domloaded != false) {
			return;
		}
		inited = true;
		init_dom();
		// 初始化方法
		init_event();
		// 输出命令结果
		export_batch();
	}
	function ascii(str){
		return str.replace(/.*/g, function($0){
			return escape($0).replace(/(%u)(\w{4})/gi, "\\u$2");
		});
	}
	function init_dom(){
		var node_config = {
			content: 'content_' + rnd_id,
			cmd_input: 'cmd_input_' + rnd_id,
			cmd_content: 'cmd_content_' + rnd_id,
			cmd_content_box: 'cmd_content_box_' + rnd_id
		};
		// 写入$Debug节点
		Lib.Dom.insertHTML(document.body, Lib.String.templatePath(trace_html, node_config));
		for (var key in node_config) {
			node_hash[key] = Lib.$E(node_config[key]);
		}
	}
	// 初始化方法
	function init_event(){
		var cmdHistry = [];
		var selectHistryIndex = -1;
		Lib.Event.addEvent(node_hash.cmd_input, 'keydown', function(){
			var evt = Lib.Event.getEvent();
			if (evt.keyCode == 9) {
				Lib.Event.stopEvent();
			}
			if (evt.keyCode == 13) {
				execCMD();
				cmdHistry.push(node_hash.cmd_input.value);
				selectHistryIndex = cmdHistry.length;
				node_hash.cmd_input.value = '';
			}
			if (evt.keyCode == 38) {
				if (selectHistryIndex > 0) {
					selectHistryIndex--;
					node_hash.cmd_input.value = cmdHistry[selectHistryIndex];
				}
			}
			if (evt.keyCode == 40) {
				if (selectHistryIndex < cmdHistry.length - 1) {
					selectHistryIndex++;
					node_hash.cmd_input.value = cmdHistry[selectHistryIndex];
				}
			}
		});
	}
	function execCMD(){
		var oEval;
		var key, len = 0;
		var sCMD = node_hash.cmd_input.value;
		if (sCMD == '') {
			return;
		}
		if (sCMD == 'cls' || sCMD == 'clear') {
			clearConsole();
			return;
		}
		add_to_content('&raquo;&nbsp;' + sCMD, {
			'bgcolor': '#000',
			'color': '#fff'
		});
		try {
			oEval = window.eval(sCMD);
		}
		catch (e) {
			add_to_content(e, {
				'bgcolor': '#ccc',
				'color': '#f00'
			});
			return;
		}
		var sType = Lib.Function.getType(oEval);
		if (sType == 'string' || sType == 'number' || sType == 'array') {
			add_to_content(oEval, {
				'bgcolor': '#666',
				'color': '#fff'
			});
		}
		else {
			for (key in oEval) {
				len++;
			}
			if (len > 0) {
				add_to_content(sType + '&nbsp;[' + len + ']', {
					'bgcolor': '#666',
					'color': '#fff'
				});
			}
			add_to_content(oEval, {
				'bgcolor': '#666',
				'color': '#fff'
			});
		}
	}
	function clearConsole(){
		contentList = [];
		node_hash.cmd_content.innerHTML = '';
	}
	function swapView(bView){
		if (node_hash.content == null) {
			return;
		}
		if (bView != null) {
			Lib.Dom.setStyle(node_hash.content, 'display', bView ? 'block' : 'none');
		}
		else {
			Lib.Dom.setStyle(node_hash.content, 'display', Lib.Dom.getStyle(node_hash.content, 'display') == 'none' ? 'block' : 'none');
		}
	}
	// 自动激活input框
	var activeTimer = new Date();
	function autoActiveCMD(){
		var activeTagName = Lib.Event.getActiveElement().tagName.toString().toLowerCase();
		if (activeTagName != 'input' && activeTagName != 'textarea') {
			var n_date = new Date();
			if (n_date - activeTimer > 1000) {
				activeTimer = n_date;
				if (inited == true) {
					node_hash.cmd_input.select();
				}
			}
		}
	}
	// 全局键盘监听
	Lib.Event.addEvent(document, 'keydown', function(){
		var evt = Lib.Event.getEvent();
		var key = evt.keyCode || evt.which;
		var ctrlKey = evt.ctrlKey;
		var altKey = evt.altKey;
		// Alt+~ Ctrl + 4
		// mac下是F10
		if ((key == 192 && altKey) || (key == 52 && ctrlKey) || key == 121) {
			init();
			swapView();
		}
		// a-z以及:字符
		if ((key > 64 && key < 91 || key == 59) && ctrlKey != true && altKey != true) {
			autoActiveCMD();
		}
	});
	Lib.Event.addDOMLoadEvent(function(){
		domloaded = true;
	});
	// 对外的方法
	function debug_proto(sText, oOpts){
		add_to_content(sText, oOpts, 'log');
	}
	debug_proto.fatal = function(sText, oOpts){
		add_to_content(sText, oOpts, 'fatal');
	};
	debug_proto.error = function(sText, oOpts){
		add_to_content(sText, oOpts, 'error');
	};
	debug_proto.warning = function(sText, oOpts){
		add_to_content(sText, oOpts, 'warning');
	};
	debug_proto.info = function(sText, oOpts){
		add_to_content(sText, oOpts, 'info');
	};
	debug_proto.log = function(sText, oOpts){
		add_to_content(sText, oOpts, 'log');
	};
	debug_proto.clear = function(){
		clearConsole();
	};
	debug_proto.contentList = contentList;
	return debug_proto;
})();
