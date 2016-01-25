var WBTopTray = (function(){

var STK = (function() {
    var spec = {
        'dependCacheList': {},
        'importCacheStore': {},
        'importCacheList': [],
        'jobsCacheList': []
    };
    var that = {};
    var lastPoint = 1;
    var baseURL = '';
    var errorInfo = [];
    /**
	 * @id STK.register
	 * @alias STK.register
	 * @param {String} String
	 * @param {Function} Function
	 * @return {Void}
	 */
    var register = function(ns, maker) {
        var path = ns.split('.');
        var curr = that;
        for (var i = 0, len = path.length; i < len; i += 1) {
            if (i == len - 1) {
                if (curr[path[i]] !== undefined) {
                    throw ns + 'has been register!!!';
                }
                curr[path[i]] = maker(that);
                return true;
            }
            if (curr[path[i]] === undefined) {
                curr[path[i]] = {};
            }
            curr = curr[path[i]];
        }
    };

    var checkPath = function(ns) {
        var list = ns.split('.');
        var curr = that;
        for (var i = 0, len = list.length; i < len; i += 1) {
            if (curr[list[i]] === undefined) {
                return false;
            }
            curr = curr[list[i]];
        }
        return true;
    };

    var checkDepend = function() {
        for (var k in spec.dependCacheList) {
            var loaded = true;
            for (var i = 0, len = spec.dependCacheList[k]['depend'].length; i < len; i += 1) {
                if (!checkPath(spec.dependCacheList[k]['depend'][i])) {
                    loaded = false;
                    break;
                }
            }
            if (loaded) {
                register.apply(that, spec.dependCacheList[k]['args']);
                delete spec.dependCacheList[k];
                setTimeout(function() {
                    checkDepend();
                },
                25);
            }
        }
    };
    var E = function(id) {
        if (typeof id === 'string') {
            return document.getElementById(id);
        }
        else {
            return id;
        }
    };
    var addEvent = function(sNode, sEventType, oFunc) {
        var oElement = E(sNode);
        if (oElement == null) {
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

    that.inc = function(ns, undepended) {
        if (!spec.importCacheList) {
            spec.importCacheList = [];
        }
        for (var i = 0, len = spec.importCacheList.length; i < len; i += 1) {
            if (spec.importCacheList[i] === ns) {
                if (!undepended) {
                    spec.importCacheList.push(ns);
                }
                return false;
            }
        }
        if (!undepended) {
            spec.importCacheList.push(ns);
        }
        spec.importCacheStore[ns] = false;
        var js = document.createElement('SCRIPT');
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', baseURL + ns.replace(/\./ig, '\/') + '.js');
        js.setAttribute('charset', 'utf-8');
        js[that.IE ? 'onreadystatechange': 'onload'] = function() {
            if (!that.IE || this.readyState.toLowerCase() == 'complete' || this.readyState.toLowerCase() == 'loaded') {
                lastPoint = spec.importCacheList.length;
                spec.importCacheStore[ns] = true;
                checkDepend();
            }
        };
        document.getElementsByTagName('HEAD')[0].appendChild(js);
    };

    that.register = function(ns, maker, shortName) {
        spec.dependCacheList[ns] = {
            'args': arguments,
            'depend': spec.importCacheList.slice(lastPoint, spec.importCacheList.length),
            'short': shortName
        };
        lastPoint = spec.importCacheList.length;
        checkDepend();
    };

    that.regShort = function(sname, sfun) {
        if (that[sname] !== undefined) {
            throw sname + ':show has been register';
        }
        that[sname] = sfun;
    };
	
    that.setBaseURL = function(url) {
        baseURL = url;
    };
    that.getErrorInfo = function() {
        return errorInfo;
    };

    //get ie
    that.IE = /msie/i.test(navigator.userAgent);

    //document.getElementById
    that.E = E;

    //document.createElement
    that.C = function(tagName) {
        var dom;
        tagName = tagName.toUpperCase();
        if (tagName == 'TEXT') {
            dom = document.createTextNode('');
        }
        else
        if (tagName == 'BUFFER') {
            dom = document.createDocumentFragment();
        }
        else {
            dom = document.createElement(tagName);
        }
        return dom;
    };



    //document.DOMContentLoaded
    that.Ready = (function() {
        var funcList = [];
        var inited = false;
        // 执行数组里的函数列表
        var exec_func_list = function() {
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
        // for IE
        if (document.attachEvent && window == window.top) {
            (function() {
                try {
                    document.documentElement.doScroll("left");
                }
                catch(e) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                exec_func_list();
            })();
        }

        // FireFox and Opera
        else if (document.addEventListener) {
            addEvent(document, 'DOMContentLoaded', exec_func_list);
        }
        // for Other
        else if (/WebKit/i.test(navigator.userAgent)) {
            (function() {
                if (/loaded|complete/.test(document.readyState.toLowerCase())) {
                    exec_func_list();
                    return;
                }
                setTimeout(arguments.callee, 25);
            })();
        }
        addEvent(window, 'load', exec_func_list);

        return function(oFunc) {
            // 如果已经DOMLoad了, 则直接调用
            if (inited == true || (/loaded|complete/).test(document.readyState.toLowerCase())) {
                if ((typeof oFunc).toLowerCase() == 'function') {
                    oFunc.call();
                }
            }
			// 如果还没有DOMLoad, 则把方法传入数组
			else {
				funcList.push(oFunc);
			}
        };
    })();
    return that;
})();
$Import = STK.inc;
/**
 * get element's position
 * @id STK.core.dom.position
 * @alias STK.core.dom.position
 * @param {Element} node
 * @return {Object} {l:number,t:number}
 * @author Robin Young | yonglin@staff.sina.com.cn
 *         FlashSoft | fangchao@staff.sina.com.cn
 * @modify
 * 使用getXY替代,原因是考虑safari跟opera的元素,以及对于inline的处理
 * @example
 * STK.core.dom.position($.E('test')) == {l:100,t:100};
 */
/**
 * browser test
 * @id STK.core.util.bLength
 * @alias STK.core.util.bLength
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.browser.IE = true;
 * STK.core.util.browser.MOZ = true;
 */
STK.register('core.util.browser', function($){
	var ua = navigator.userAgent.toLowerCase();
	var ret = {
		'IE': /msie/.test(ua),
		'OPERA': /opera/.test(ua),
		'MOZ': /gecko/.test(ua),
		'IE5': /msie 5 /.test(ua),
		'IE55': /msie 5.5/.test(ua),
		'IE6': /msie 6/.test(ua),
		'IE7': /msie 7/.test(ua),
		'SAFARI': /safari/.test(ua)
	}
	return ret;
});

STK.register('core.dom.position', function($){
	return function(oElement){
		if (oElement == document.body) {
			return false;
		}
		if (oElement.parentNode == null) {
			return false;
		}
		if (oElement.offsetParent == null) {
			return false;
		}
		if (oElement.style.display == 'none') {
			return false;
		}
		
		var parent = null, pos = [], box;
		var scrollTop, scrollLeft, borderLeft, borderTop;
	
		if (oElement.getBoundingClientRect) // IE  
		{
			box = oElement.getBoundingClientRect();
			scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
			scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
			return {
				l: parseInt(box.left + scrollLeft, 10) || 0,
				t: parseInt(box.top + scrollTop, 10) || 0
			};
		}
		else if (document.getBoxObjectFor) // gecko  
		{
			box = document.getBoxObjectFor(oElement);
			borderLeft = (oElement.style.borderLeftWidth) ? parseInt(oElement.style.borderLeftWidth, 10) : 0;
			borderTop = (oElement.style.borderTopWidth) ? parseInt(oElement.style.borderTopWidth, 10) : 0;
			pos = [box.x - borderLeft, box.y - borderTop];
		}
		else // safari & opera  
		{
			pos = [oElement.offsetLeft, oElement.offsetTop];
			parent = oElement.offsetParent;
			if (parent != oElement) {
				while (parent) {
					pos[0] += parent.offsetLeft;
					pos[1] += parent.offsetTop;
					parent = parent.offsetParent;
				}
			}
			if ($.core.util.browser.OPERA != -1 ||
			($.core.util.browser.SAFARI != -1 &&
			oElement.style.position == 'absolute')) {
				pos[0] -= document.body.offsetLeft;
				pos[1] -= document.body.offsetTop;
			}
		}
		if (oElement.parentNode) {
			parent = oElement.parentNode;
		}
		else {
			parent = null;
		}
		while (parent && !/^body|html$/i.test(parent.tagName)) { // account for any scrolled ancestors
			if (parent.style.display.search(/^inline|table-row.*$/i)) {
				pos[0] -= parent.scrollLeft;
				pos[1] -= parent.scrollTop;
			}
			parent = parent.parentNode;
		}
		return {
			l: parseInt(pos[0], 10),
			t: parseInt(pos[1], 10)
		};
	};
});

/**
 * Add event for a node
 * @id STK.core.evt.addEvent
 * @alias STK.core.evt.addEvent
 * @param {Node} sNode
 * @param {String} sEventType
 * @param {Function} oFunc
 * @return {Boolean} TRUE/FALSE
 * @author Robin Young | yonglin@staff.sina.com.cn
 *         FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.evt.addEvent($.E('id'),'click',function(e){
 * 	console.log(e);
 * });
 */
STK.register('core.evt.addEvent', function($) {
    return function(sNode, sEventType, oFunc) {
        var oElement = $.E(sNode);
        if (oElement == null) {
            return false;
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
        return true;
    };
});

/**
 * 合并参数
 * @method
 * @id STK.core.obj.parseParam
 * @alias STK.core.obj.parseParam
 * @param {Object} oSource 需要被赋值参数的对象
 * @param {Object} oParams 传入的参数对象
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * var cfg = {
 * 	name: '123'
 * };
 * STK.core.obj.parseParam(cfg, oOpts);
 */
STK.register('core.obj.parseParam', function($){
	return function(oSource, oParams, isown){
		var key;
		if (typeof oParams != "undefined") {
			for (key in oSource) {
				if (oParams[key] != null) {
					if (isown) {
						if (oSource.hasOwnProperty[key]) {
							oSource[key] = oParams[key];
						}
					}
					else {
						oSource[key] = oParams[key];
					}
				}
			}
		}
		return oSource;
	};
});

/**
 * 返回指定ID或者DOM的节点句柄
 * @param {String | Element} node 节点ID或者节点的DOM
 * @example
 * var node = STK.E('input');
 * STK.core.dom.removeNode(node);
 */
STK.register('core.dom.removeNode', function($){
	return function(node){
		node = $.E(node) || node;
		try {
			node.parentNode.removeChild(node);
		} 
		catch (e) {
		}
	};
});

/**
 * Get unique key
 * @id STK.core.util.getUniqueKey
 * @alias STK.core.util.getUniqueKey
 * @return {Number} n
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.getUniqueKey('') === '141281425000671';
 */
STK.register('core.util.getUniqueKey', function($){
	return function(){
		return Math.floor(Math.random() * 1000) + new Date().getTime().toString();
	};
});
/**
 * parse URL
 * @id STK.core.str.parseURL
 * @alias STK.core.str.parseURL
 * @param {String} str
 * @return {Object} that
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.str.parseURL('http://t.sina.com.cn/profile?beijing=huanyingni') === 
	{
		hash : ''
		host : 't.sina.com.cn'
		path : 'profile'
		port : ''
		query : 'beijing=huanyingni'
		scheme : http
		slash : '//'
		url : 'http://t.sina.com.cn/profile?beijing=huanyingni'
	}
 */
STK.register('core.str.parseURL', function($){
	return function(url){
		var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
		var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
		var results = parse_url.exec(url);
		var that = {};
		for (var i = 0, len = names.length; i < len; i += 1) {
			that[names[i]] = results[i] || '';
		}
		return that;
	};
});

/**
 * query to json
 * @id STK.core.json.queryToJson
 * @alias STK.core.json.queryToJson
 * @param {Json} JSON
 * @param {Boolean} isEncode
 * @return {String} querystring
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var q1 = 'a=1&b=2&c=3';
 * STK.core.json.queryToJson(q1) === {'a':1,'b':2,'c':3};
 */
/**
 * Check Array
 * @id STK.core.arr.isArray
 * @alias STK.core.arr.isArray
 * @param {Array} o
 * @return {Boolean} TRUE/FALSE
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = [1,2,3]
 * var bl2 = STK.core.arr.isArray(li1);
 * bl2 == TRUE
 */
STK.register('core.arr.isArray', function($){
	return function(o){
		return Object.prototype.toString.call(o) === '[object Array]';
	};
});

/**
 * trim
 * @id STK.core.str.trim
 * @alias STK.core.str.trim
 * @param {String} str
 * @return {String} str
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.str.trim(' stk ') === 'stk';
 */
STK.register('core.str.trim', function($){
	return function(str){
		if(typeof str !== 'string'){
			throw 'trim need a string as parameter';
		}
		if(typeof str.trim === 'function'){
			return str.trim();
		}else{
			return str.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, '');
		}
		
	};
});

STK.register('core.json.queryToJson',function($){
	return function(QS, isDecode){
		var _Qlist = $.core.str.trim(QS).split("&");
		var _json  = {};
		var _fData = function(data){
			if(isDecode){
				return decodeURIComponent(data);
			}else{
				return data;
			}
		};
		for(var i = 0, len = _Qlist.length; i < len; i++){
			if(_Qlist[i]){
				_hsh = _Qlist[i].split("=");
				_key = _hsh[0];
				_value = _hsh[1];
				
				// 如果只有key没有value, 那么将全部丢入一个$nullName数组中
				if(_hsh.length < 2){
					_value = _key;
					_key = '$nullName';
				}
				// 如果缓存堆栈中没有这个数据
				if(!_json[_key]) {
					_json[_key] = _fData(_value);
				}
				// 如果堆栈中已经存在这个数据，则转换成数组存储
				else {
					if($.core.arr.isArray(_json[_key]) != true) {
						_json[_key] = [_json[_key]];
					}
					_json[_key].push(_fData(_value));
				}
			}
		}
		return _json;
	};
});
/**
 * json to query
 * @id STK.core.json.jsonToquery
 * @alias STK.core.json.jsonToquery
 * @param {Json} JSON
 * @param {Boolean} isEncode
 * @return {String} querystring
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var j1 = {'a':1,'b':2,'c':3};
 * STK.core.json.jsonToquery(j1) === 'a=1&b=2&c=3';
 */
STK.register('core.json.jsonToQuery',function($){
	return function(JSON,isEncode){
		var _Qstring = [];
		var _fdata   = function(data){
			data = data == null? '': data;
			data = $.core.str.trim(data.toString());
			if(isEncode){
				return encodeURIComponent(data);
			}else{
				return data;
			}
		};
		if(typeof JSON == "object"){
			for(var k in JSON){
				if(JSON[k] instanceof Array){
					for(var i = 0, len = JSON[k].length; i < len; i++){
						_Qstring.push(k + "=" + _fdata(JSON[k][i]));
					}
				}else{
					if(typeof JSON[k] != 'function'){
						_Qstring.push(k + "=" +_fdata(JSON[k]));
					}
				}
			}
		}
		if(_Qstring.length){
			return _Qstring.join("&");
		}else{
			return "";
		}
	};
});
STK.register('core.util.URL', function($){
	/**
	 * @example
	 *	alert(
	 *		STK.core.util.URL('http://abc.com/a/b/c.php?a=1&b=2#a=1').
	 *		setParam('a', 'abc').
	 *		setHash('a', 67889).
	 *		setHash('a1', 444444)
	 *	);
	 *	// http://abc.com/a/b/c.php?a=abc&b=2#a=67889&a1=444444
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 */
	return function(sURL){
		var that = {};
		var url_json = $.core.str.parseURL(sURL);
		
		
		var query_json = $.core.json.queryToJson(url_json.query);
		
		var hash_json = $.core.json.queryToJson(url_json.hash);
		
		
		
		that.setParam = function(sKey, sValue){
			query_json[sKey] = sValue;
			return this;
		};
		that.getParam = function(sKey){
			return query_json[sKey];
		};
		that.setParams = function(oJson){
			for (var key in oJson) {
				that.setParam(key, oJson[key]);
			}
			return this;
		};
		that.setHash = function(sKey, sValue){
			hash_json[sKey] = sValue;
			return this;
		};
		that.getHash = function(sKey){
			return hash_json[sKey];
		};
		that.valueOf = that.toString = function(){
			var url = [];
			var query = $.core.json.jsonToQuery(query_json);
			var hash = $.core.json.jsonToQuery(hash_json);
			if (url_json.scheme != '') {
				url.push(url_json.scheme + ':');
				url.push(url_json.slash);
			}
			if (url_json.host != '') {
				url.push(url_json.host);
				url.push(url_json.port);
			}
			url.push('/');
			url.push(url_json.path);
			if (query != '') {
				url.push('?' + query);
			}
			if (hash != '') {
				url.push('#' + hash);
			}
			return url.join('');
		};
		
		return that;
	};
});

/**
 * 加载js并监听结果
 * @id STK.core.io.scriptLoader
 * @alias STK.core.io.scriptLoader
 * @param {Object} oOpts 附加参数
 * @return {Element} scriptLoader的句柄对象
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.io.scriptLoader('http://js.wcdn.cn/t3/platform/_html/json.js', {
 * 'onComplete': function(oData, sVarName){
 * console.dir(oData);
 * },
 * 'varname': 'json'
 * });
 */
STK.register('core.io.scriptLoader', function($){
	var entityList = {};
	
	return function(oOpts){
		var js, requestTimeout;
		var opts = {
			'url': '',
			'charset': 'UTF-8',
			'timeout': 30 * 1000,
			'args': {},
			'onComplete': null,
			'onTimeout': null,
			'uniqueID': null
		};
		$.core.obj.parseParam(opts, oOpts);
		
		if(opts.url == '') {
			throw 'scriptLoader: url is null';
		}
		
		
		var uniqueID = opts.uniqueID || $.core.util.getUniqueKey();
		
		
		js = entityList[uniqueID];
		if(js != null && $.IE != true) {
			$.core.dom.removeNode(js);
			js = null;
		}
		if (js == null) {
			js = entityList[uniqueID] = $.C('script');
		}
		
		js.charset = opts.charset;
		js.id = 'scriptRequest_script_' + uniqueID;
		js.type = 'text/javascript';
		if (opts.onComplete != null) {
			if ($.IE) {
				js['onreadystatechange'] = function(){
					if (js.readyState.toLowerCase() == 'loaded' || js.readyState.toLowerCase() == 'complete') {
						clearTimeout(requestTimeout);
						opts.onComplete();
					}
				};
			}
			else {
				js['onload'] = function(){
					clearTimeout(requestTimeout);
					opts.onComplete();
				};
				
			}
			
		}
		
		js.src = STK.core.util.URL(opts.url).setParams(opts.args);
		
		document.getElementsByTagName("head")[0].appendChild(js);
		
		if (opts.timeout > 0 && opts.onTimeout != null) {
			requestTimeout = setTimeout(function(){
				opts.onTimeout();
			}, opts.timeout);
		}
		return js;
	};
});

/**
 * make an jsonp request
 * @id STK.core.io.jsonp
 * @alias STK.core.io.jsonp
 * @param {Object} 	{
		'url': '',
		'charset': 'UTF-8',
		'timeout': 30 * 1000,
		'args': {},
		'onComplete': null,
		'onTimeout': null,
		'responseName': null,
		'varkey':null
		'onFail': null
		
	};
 * @return {Void} 
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.io.jsonp({
	'url':'/jsonp.php',
	'args':{'id':123,'test':'true'},
	});
 */
STK.register('core.io.jsonp', function($){
	
	return function(oOpts){
		var opts = {
			'url': '',
			'charset': 'UTF-8',
			'timeout': 30 * 1000,
			'args': {},
			'onComplete': null,
			'onTimeout': null,
			'responseName': null,
			
			
			'varkey': 'callback'
		};
		// -1为默认, 1为完成, 2为超时
		var funcStatus = -1;
		
		$.core.obj.parseParam(opts, oOpts);
		
		var uniqueID = opts.responseName || ('STK_' + $.core.util.getUniqueKey());
		
		opts.args[opts.varkey] = uniqueID;
		
		var completeFunc = opts.onComplete;
		var timeoutFunc = opts.onTimeout;
		
		
		window[uniqueID] = function(oResult) {
			if(funcStatus != 2 && completeFunc != null) {
				funcStatus = 1;
				completeFunc(oResult);
			}
		};
		opts.onComplete = null;
		opts.onTimeout = function() {
			if(funcStatus != 1 && timeoutFunc != null) {
				funcStatus = 2;
				timeoutFunc();
			};
		};
		
		return $.core.io.scriptLoader(opts);
	};
});

/**
 * 合并参数
 * @method
 * @id STK.core.obj.isEmpty
 * @alias STK.core.obj.isEmpty
 * @param {Object} o
 * @param {Object} isprototype
 * @return {Boolean} ret
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.obj.isEmpty({}) === true;
 * STK.core.obj.isEmpty({'test':'test'}) === false;
 */
STK.register('core.obj.isEmpty',function($){
	return function(o,isprototype){
		var ret = true;
		for(var k in o){
			if(isprototype){
				ret = false;
				break;
			}else{
				if(o.hasOwnProperty(k)){
					ret = false;
					break;
				}
			}
		}
		return ret;
	};
});
/**
 * encode HTML
 * @id STK.core.str.encodeHTML
 * @alias STK.core.str.encodeHTML
 * @param {String} str
 * @return {String} str
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.str.encodeHTML('&<>" ') === '&amp;&lt;&gt;&quot;$nbsp;';
 */
STK.register('core.str.encodeHTML', function($){
	return function(str){
		// var div = document.createElement('div');
		// 		div.appendChild(document.createTextNode(str));
		// 		return div.innerHTML.replace(/\s/g, '&nbsp;').replace(/"/g, "&quot;");
		//	modify by Robin Young | yonglin@staff.sina.com.cn
		if(typeof str !== 'string'){
			throw 'encodeHTML need a string as parameter';
		}
		return str.replace(/\&/g,'&amp;').
			replace(/"/g,'&quot;').
			replace(/\</g,'&lt;').
			replace(/\>/g,'&gt;').
			replace(/\'/g,'&#39').
			replace(/\u00A0/g,'&nbsp;').
			replace(/(\u0020|\u000B|\u2028|\u2029|\f)/g,'&#32');
	};
});

/**
 * 模板引擎
 * @id STK.core.util.templet
 * @alias STK.core.util.templet
 * @param {String} template
 * @param {Object} data
 * @return {String} ret
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.templet('#{city||default:天津}欢迎你',{'city':'北京'}) === '北京欢迎你';
 */
STK.register('core.util.templet', function($){
	return function(template, data){
		return template.replace(/#\{(.+?)\}/ig, function(){
			var key = arguments[1].replace(/\s/ig, '');
			var ret = arguments[0];
			var list = key.split('||');
			for (var i = 0, len = list.length; i < len; i += 1) {
				if (/^default:.*$/.test(list[i])) {
					ret = list[i].replace(/^default:/, '');
					break;
				}
				else 
					if (data[list[i]] !== undefined) {
						ret = data[list[i]];
						break;
					}
			}
			return ret;
		});
	};
});

/**
 * cookie manager [static]
 * @id STK.core.util.cookie
 * @alias STK.core.util.cookie
 * @method {void} set(sKey,sValue,oOpts)
 * @method {String} get(sKey)
 * @method {void} remove(sKey,oOpts)
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.cookie.set('id','test');
 * STK.core.util.cookie.get('id') === 'test';
 */
STK.register('core.util.cookie', function($){
	var that = {
		set: function(sKey, sValue, oOpts){
			var arr = [];
			var d, t;
			var cfg = {
				'expire': null,
				'path': null,
				'domain': null,
				'secure': null,
				'encode': true
			};
			$.core.obj.parseParam(cfg, oOpts);
			
			if (cfg.encode == true) {
				sValue = escape(sValue);
			}
			arr.push(sKey + '=' + sValue);

			if (cfg.path != null) {
				arr.push('path=' + cfg.path);
			}
			if (cfg.domain != null) {
				arr.push('domain=' + cfg.domain);
			}
			if (cfg.secure != null) {
				arr.push(cfg.secure);
			}
			if (cfg.expire != null) {
				d = new Date();
				t = d.getTime() + cfg.expire * 3600000;
				d.setTime(t);
				arr.push('expires=' + d.toGMTString());
			}
			document.cookie = arr.join(';');
		},
		get: function(sKey){
			sKey = sKey.replace(/([\.\[\]\$])/g, '\\\$1');
			var rep = new RegExp(sKey + '=([^;]*)?;', 'i');
			var co = document.cookie + ';';
			var res = co.match(rep);
			if (res) {
				return res[1] || "";
			}
			else {
				return '';
			}
		},
		remove: function(sKey, oOpts){
			oOpts = oOpts || {};
			oOpts.expire = -10;
			that.set(sKey, '', oOpts);
		}
	};
	return that;
});


	var BOX_TEMPLATE = '<style type="text/css">\
@media screen and (-webkit-min-device-pixel-ratio:0){\
.tsina_gnb{top:8px;}\
.tsina_gnb ul li.on a{margin-bottom:-1px; padding:2px 5px 10px 7px;}\
.tsina_gnb ul.sltmenu{top:26px;}\
.tsina_gnb ul.sltmenu li a{margin:0 2px; padding:4px 13px 3px;}\
.tsina_gnb ul li em.nmTxt,\
.tsina_gnb ul li a{font-family:inherit;}\
}\
</style>\
<div class="tsina_gnbarea" id="#{box}"></div>\
<div class="small_Yellow_div">\
<div style="display:none" class="small_Yellow" id="#{unread_layer}">\
<table class="CP_w">\
<thead>\
<tr>\
<th class="tLeft"><span></span></th>\
<th class="tMid"><span></span></th>\
<th class="tRight"><span></span></th>\
</tr>\
</thead>\
<tbody>\
<tr>\
<td class="tLeft"><span></span></td>\
<td class="tMid">\
<div class="yInfo">\
<!--<span id="#{unread_title}"></span>-->\
<p id="#{unread_comm}"></p>\
<p id="#{unread_fans}"></p>\
<p id="#{unread_msg}"></p>\
<p id="#{unread_atme}"></p>\
</div>\
</td>\
<td class="tRight"><span></span></td>\
</tr>\
</tbody>\
<tfoot>\
<tr>\
<td class="tLeft"><span></span></td>\
<td class="tMid"><span></span></td>\
<td class="tRight"><span></span></td>\
</tr>\
</tfoot>\
</table>\
<div class="close"><a href="javascript:void(0)" id="#{unread_layer_close}">&nbsp;</a></div>\
</div>\
</div>';

	var TOP_TEMPLATE = '<div class="bg_gnbarea">&nbsp;</div>\
<div class="tsina_gnb">\
<ul class="gnb_l">\
<li><a href="http://t.sina.com.cn/?source=toptray">${微博}</a> </li>\
<li>\
<a href="http://t.sina.com.cn/pub/?source=toptray" id="#{square}" class="nohover">${广场}<span class="arr_d"><em class="b1">&nbsp;</em><em class="b2">&nbsp;</em><em class="b3">&nbsp;</em></span></a> \
<ul class="sltmenu" id="#{square_layer}" style="display:none">#{square_list}</ul>\
</li>\
<li><a href="http://event.t.sina.com.cn">${活动}</a> </li>\
<li><a href="http://t.sina.com.cn/mobile/wap?source=toptray">${手机}</a> </li>\
<li>\
<a href="http://t.sina.com.cn/app" id="#{application}">${应用}<!--span class="arr_d"><em class="b1">&nbsp;</em><em class="b2">&nbsp;</em><em class="b3">&nbsp;</em></span--></a> \
<ul class="sltmenu" id="#{application_layer}" style="display:none">#{application_list}</ul>\
</li>\
<li><a href="http://t.sina.com.cn/findfriends">${找人}</a> </li>\
#{operation}\
</ul>\
<ul class="gnb_r">\
<li><a href="http://t.sina.com.cn/#{uid}/profile/" id="#{name_span}">#{name}</a> </li>\
<li><a href="http://t.sina.com.cn/plugins/imbot/myim.php?source=toptray">${工具}</a> </li>\
<li><a href="http://t.sina.com.cn/messages?source=toptray">${私信}</a> </li>\
<li>\
<a href="http://t.sina.com.cn/setting/user?source=toptray">${帐号设置}</a> \
</li>\
<li class="line">|</li>\
<li><a href="http://t.sina.com.cn/logout.php?backurl=/">${退出}</a> </li>\
</ul>\
</div>';

	var UNLOGIN_TEMPLATE = 	'<div class="bg_gnbarea">&nbsp;</div>\
<div class="tsina_gnb">\
<ul class="gnb_l">\
<li><a href="http://t.sina.com.cn/?source=toptray">${微博}</a> </li>\
<li>\
<a href="http://t.sina.com.cn/pub/?source=toptray" id="#{square}" class="nohover">${广场}<span class="arr_d"><em class="b1">&nbsp;</em><em class="b2">&nbsp;</em><em class="b3">&nbsp;</em></span></a> \
<ul class="sltmenu" id="#{square_layer}" style="display:none">#{square_list}</ul>\
</li>\
<li><a href="http://event.t.sina.com.cn">${活动}</a> </li>\
<li><a href="http://t.sina.com.cn/mobile/wap?source=toptray">${手机}</a> </li>\
<li>\
<a href="http://t.sina.com.cn/app" id="#{application}">${应用}<!--span class="arr_d"><em class="b1">&nbsp;</em><em class="b2">&nbsp;</em><em class="b3">&nbsp;</em></span--></a> \
<ul class="sltmenu" id="#{application_layer}" style="display:none">#{application_list}</ul>\
</li>\
#{operation}\
</ul>\
<ul class="gnb_r">\
<li><em class="nmTxt">${还没有微博帐号}？</em> </li>\
<li><a href="http://t.sina.com.cn/reg.php?ps=u3&lang=zh&inviteCode=#{inviteCode||default:}" target="_blank" class="reg"><span>${注册}</span></a> </li>\
<li class="line">|</li>\
<li><a href="http://t.sina.com.cn/login.php" target="_blank"><strong>${登录}</strong></a> </li>\
</ul>\
</div>';


	var SQUARE_TEMPLATE = '\
    <li><a href="http://t.sina.com.cn/pub/top?source=toptray">${人气榜}</a></li>\
    <li><a href="http://t.sina.com.cn/pub/star?source=toptray">${名人堂}</a></li>\
	<li><a href="http://t.sina.com.cn/pub/hottopic?source=toptray">${话题榜}</a></li>\
	<li><a href="http://talk.t.sina.com.cn">${微访谈}</a></li>\
    <li><a href="http://t.sina.com.cn/pub/i/fun?source=toptray">${有趣的人}</a></li>\
    <li><a href="http://t.sina.com.cn/pub/hottags?source=toptray">${标签找人}</a></li>\
    <li><a href="http://t.sina.com.cn/pub/topmblog?type=re&act=day&source=toptray">${热门转发}</a></li>\
    <li><a href="http://t.sina.com.cn/pub/news?source=toptray">${随便看看}</a></li>\
    <li><a href="http://t.sina.com.cn/pub/city?source=toptray">${同城微博}</a></li>\
    <li><a href="http://t.sina.com.cn/pub/sofa?source=toptray">${抢个沙发}</a></li>';

	var APP_TEMPLATE = '';

	var $ = STK;
	var that = {};
	var random = (new Date()).getTime();
	var language = {};
	var evts = {
		'unreadChange' : null,
		'breath' : null
	};
	var store = {

	};
	var setId = function(id) {
		return ('WB_' + id + '_' + random);
	};

	var getEl = function(id) {
		return $.E('WB_' + id + '_' + random);
	};

	var getLang = function(key,lang){
		if (lang[key]) {
			return lang[key];
		}
		return key;
	};

	var rendLanguage = function(temp,lang){
		if(!lang){
			lang = {};
		}
		return temp.replace(/\$\{([^\}]+)\}/ig, function(){
			var key = arguments[1].replace(/\s/ig, '');
				return getLang(key,lang);
		});
	};


	var hover = function(spec) {
		var act = spec.act;
		var ext = spec.ext || [];
		var overKey = false;
		var timer = null;
		var showAct = function() {
			if(overKey) {
				spec.fun(overKey);
			}
		};
		var hiddAct = function() {
			if(!overKey) {
				spec.fun(overKey);
			}
		};
		var hoverAct = function() {
			overKey = true;
			if(timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(showAct,100);
		};
		var msoutAct = function() {
			overKey = false;
			if(timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(hiddAct,100);
		};
		$.core.evt.addEvent(act, 'mouseover', hoverAct);
		$.core.evt.addEvent(act, 'mouseout', msoutAct);
		for(var i = 0, len = ext.length; i < len; i += 1) {
			$.core.evt.addEvent(ext[i], 'mouseover', hoverAct);
			$.core.evt.addEvent(ext[i], 'mouseout', msoutAct);
		};
	};

	var getOnhover = function(act,layer){
		return function(b){
			if(b){
				//var pos = $.core.dom.position(act);
				//layer.style.left = pos['l'] + 'px';
				//layer.style.top  = pos['t'] + act.offsetHeight + 'px';
				act.parentNode.className = 'on';
				layer.style.display = '';
			}else{
				layer.style.display = 'none';
				act.parentNode.className = '';
			}
		};
	};

	var showPop = true;
	var globalUID = null;
//	var _documentTitle=document.title;
	var _hasExecuted=false;
	var unreadPop = function(cache){
		/*
		cache = {
			'comment'	:4,
			'attention'	:2,
			'msg'		:4,
			'atme'		:4
		};
		*/
		if(!showPop){
			return false;
		}
		var total = false,num=0,timer = null;
		try{
			var layer = getEl('unread_layer');
			// var act = getEl('name_span');
			// var pos = $.core.dom.position(act);
			// layer.style.left = pos['l'] + 'px';
			// layer.style.top  = pos['t'] + act.offsetHeight + 'px';
			
			if(cache['comment'] > 0){
				//getEl('unread_comm').innerHTML = rendLanguage('<a href="http://t.sina.com.cn/comments">${评论}',language) + '(' + cache['comment'] + ')</a>';
				getEl('unread_comm').innerHTML = rendLanguage(cache['comment'] + '${条新评论}，<a href="http://t.sina.com.cn/comments">${查看评论}</a>',language);
				total = true;
				num+=cache['comment'];
				getEl('unread_comm').style.display = '';
			}else{
				getEl('unread_comm').style.display = 'none';
			}

			if(cache['attention'] > 0){
				getEl('unread_fans').innerHTML = rendLanguage(cache['attention'] + '${位新粉丝}，<a href="http://t.sina.com.cn/' + globalUID + '/fans">${查看我的粉丝}</a>',language);//rendLanguage('<a href="http://t.sina.com.cn/' + globalUID + '/fans">${粉丝}',language) + '(' + cache['attention'] + ')</a>';
				total = true;
				num+=cache['attention'];
				getEl('unread_fans').style.display = '';
			}else{
				getEl('unread_fans').style.display = 'none';
			}

			if(cache['msg'] > 0){
				getEl('unread_msg').innerHTML = rendLanguage(cache['msg'] + '${条新私信}，<a href="http://t.sina.com.cn/messages">${查看私信}</a>',language);//rendLanguage('<a href="http://t.sina.com.cn/messages">${私信}',language) + '(' + cache['msg'] + ')</a>';
				total = true;
				num+=cache['msg'];
				getEl('unread_msg').style.display = '';
			}else{
				getEl('unread_msg').style.display = 'none';
			}

			if(cache['atme'] > 0){
				getEl('unread_atme').innerHTML = rendLanguage(cache['atme'] + '${条微博提到我}，<a href="http://t.sina.com.cn/atme">${查看}<em>@</em>${我}</a>',language);//rendLanguage('<a href="http://t.sina.com.cn/atme"><em>@</em>${提到我的}',language) + '(' + cache['atme'] + ')</a>';
				total = true;
				num+=cache['atme'];
				getEl('unread_atme').style.display = '';
			}else{
				getEl('unread_atme').style.display = 'none';
			}
			//getEl('unread_title').innerHTML = rendLanguage('${新消息}：',language);
		   
			if(total){
				//改变标题
//				document.title = "(" + num + ")" + _documentTitle;
				if (_hasExecuted === false) {	  //由于有心跳，设置_hasExecuted，最多只执行一次
					var top,
							box = getEl("box"),
							box_top = box.offsetTop + box.clientHeight,
							checkShow=function(){} ,
							ie6 = /msie 6/.test(navigator.userAgent.toLowerCase());
					_hasExecuted = true;

					if (ie6 || document.compatMode === "BackCompat") {
						checkShow = function() {
							if (showPop && total && layer.style.display == "none") {
								clearTimeout(timer);
								timer = null;
								box_top = box.offsetTop + box.clientHeight;
								top = document.documentElement.scrollTop || document.body.scrollTop;
								layer.style.top = (top < box_top ? 0 : top - box_top) + 'px';
								layer.style.display = "";
							}
						};

						window.onscroll = function() {
							if (top != (document.documentElement.scrollTop || document.body.scrollTop)) {
								layer.style.display = "none";
//								timer = setTimeout(checkShow, 500);
								if (timer == null) {
									timer = setTimeout(checkShow, 500);
								}
							}
						};
					} else {
						var box_child = box.getElementsByTagName("div")[1],
								right = box.offsetWidth - box_child.offsetLeft - box_child.offsetWidth;
						top = document.documentElement.scrollTop || document.body.scrollTop;
						checkShow = function() {
							if (showPop && total && layer.style.display == "none") {
							 	layer.style.display = "";
							}
						};
						layer.style.cssText = "position:fixed;top:" + (top < box_top ? box_top - top : 0) + "px;right:" + right + "px";
						window.onresize = function() {
							right = box.offsetWidth - box_child.offsetLeft - box_child.offsetWidth;
							layer.style.right = right + "px";
							top = document.documentElement.scrollTop || document.body.scrollTop;
							layer.style.top = (top < box_top ? box_top - top : 0) + 'px';
						};
						window.onscroll = function() {
							top = document.documentElement.scrollTop || document.body.scrollTop;
							layer.style.right = (right + document.documentElement.scrollLeft || document.body.scrollLeft) + "px";
							layer.style.top = (top < box_top ? box_top - top : 0) + 'px';
						}
					}
				}
				_hasExecuted&&checkShow();
				layer.style.display = '';
			}else{
//				document.title=_documentTitle;
				clearTimeout(timer);
				window.onscroll=null;
				_hasExecuted = false;
				layer.style.display = 'none';
			}
		}catch(exp){
		}


	};
	var loopNumber = 0;
	var startBreath = function(uid){
			$.core.io.jsonp({
				'url' : 'http://t.sina.com.cn/public/aj_count_new.php?uid=' + uid + '&count=' + loopNumber,
				'onComplete' : function(data){
					var cache = {};
					data = data['data'];
					unreadPop(data);
					if(evts['breath']){
						try{
							evts['breath'](data);
						}catch(exp){

						}
					}
					for(var k in data){
						if(data[k] !== store[k]){
							cache[k] = data[k];
						}
					}
					if(!$.core.obj.isEmpty(cache)){
						try{
							if(evts['unreadChange']){
								evts['unreadChange'](cache);
							}
						}catch(exp){

						}
					}

					store = data;
				}
			});
			loopNumber += 1;
	};
	document.write($.core.util.templet(BOX_TEMPLATE,{
		'box' : setId('box'),
		'unread_title' : setId('unread_title'),
		'unread_layer' : setId('unread_layer'),
		'unread_fans' : setId('unread_fans'),
		'unread_comm' : setId('unread_comm'),
		'unread_atme' : setId('unread_atme'),
		'unread_msg' : setId('unread_msg'),
		'unread_layer_close' : setId('unread_layer_close')
//		'once_layer' : setId('once_layer'),
//		'once_close' : setId('once_close'),
//		'once_txt':setId('once_txt')
	}));

	/**
	 *	config = {
			uid : '',
			name : '',
			operation : {'link':'','text':''},
			apps : '',
			square : '',
			isLogin : true/false,
			language : {}
		}
	 */
	that.init = function(config){
		var data = {
			'square' : setId('square'),
			'application' : setId('application'),
			'square_layer' : setId('square_layer'),
			'application_layer' : setId('application_layer'),
			'operation' : '',
			'name_span' : setId('name_span'),

			'square_list' : rendLanguage(config['square'] || SQUARE_TEMPLATE,config['language']),
			'application_list' : rendLanguage(config['apps'] || APP_TEMPLATE,config['language']),
			'account' : decodeURIComponent(config['account']),
			'uid' : config['uid'] || '',
			'name' : $.core.str.encodeHTML(decodeURIComponent(config['name']))

		};
		globalUID = config['uid'];
		//data['inviteCode'] = '';
		if(window.location.search){
			var queryString = window.location.search.slice(1);
			var queryJson = $.core.json.queryToJson(queryString);
			if(queryJson['inviteCode']){
				data['inviteCode'] = queryJson['inviteCode'];
			}
		}
		if(config['operation']){
			//<a href="#{oper_link}" class="gnb_hot">#{oper_text}</a></li>
			data['operation'] = '<li class="line">|</li>' + config['operation'];
		}
		if(config.isLogin){
			getEl('box').innerHTML = $.core.util.templet(rendLanguage(TOP_TEMPLATE,config['language']),data);
//			getEl('once_txt').innerHTML = rendLanguage('${微博里可以办“活动”啦！}',config['language']);
//            if (!$.core.util.cookie.get("topTrayTip")) {
//                var once_layer = getEl('once_layer');
//                once_layer.style.display = '';
//                $.core.util.cookie.set("topTrayTip", 1, {expire:(new Date((parseInt(scope.$severtime / 60 / 60 / 24) + 1) * 60 * 60 * 24) - scope.$severtime) / 3600});
//            }
//			else {
				startBreath(config['uid']);
				setInterval(function(){
					startBreath(config['uid']);
				}, 30 * 1000);
//			}
			$.core.evt.addEvent(getEl('unread_layer_close'),'click',function(){
				getEl('unread_layer').style.display = 'none';
				showPop = false;
				$.core.io.scriptLoader({'url':'http://t.sina.com.cn/public/del_unread_new.php'});
//				document.title=_documentTitle;
				return false;
			});
//			$.core.evt.addEvent(getEl('once_close'),'click',function(){
//				$.core.util.cookie.set("topTrayTip",1,{expire:365*24});
//				getEl('once_layer').style.display='none';
//				startBreath(config['uid']);
//				setInterval(function(){
//					startBreath(config['uid']);
//				},30*1000);
//			});
		}else{
			getEl('box').innerHTML = $.core.util.templet(rendLanguage(UNLOGIN_TEMPLATE,config['language']),data);
		}
		hover({
			'act' : getEl('square'),
			'ext' : [getEl('square_layer')],
			'fun' : getOnhover(getEl('square'),getEl('square_layer'))
		});
		// hover({
		// 	'act' : getEl('application'),
		// 	'ext' : [getEl('application_layer')],
		// 	'fun' : getOnhover(getEl('application'),getEl('application_layer'))
		// });
		language = config['language'];
	};

	that.addListener = function(type,func){
		if(typeof func !== 'function'){
			throw 'listener need a function as the second parameter';
		}
		evts[type] = func;
	};
	return that;
})();