/**
 * @author yaru@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/events/addEvent.js");
$import('jobs/group_manage.js');
$import('diy/comm/storage.js');
$import('diy/builder2.js');
$registJob('mbloghead', function() {

	var _addEvent = Core.Events.addEvent;

	var _newFilter = document.getElementById("MIB_newFilter");
	if(!_newFilter){
		return false;
	}
	var _nfTagB = Core.Dom.getChildrenByClass(_newFilter, "nfTagB")[0];
	var _nfBox = Core.Dom.getChildrenByClass(_newFilter, "nfBox")[0];
	var _nftagOpen = Core.Dom.getChildrenByClass(_nfTagB, "nftagOpen")[0];
	var _current = Core.Dom.getElementsByClass(_nfTagB, "li", "current")[0];
	var _current_ul = Core.Dom.getElementsByClass(_nfTagB, "ul", "sltmenu")[0];
	var _current_span = Core.Dom.getElementsByClass(_nfTagB, "a", "arrow")[0];
	var search_input = document.getElementById("filter_mkey_input");
	var search_button = document.getElementById("filter_mkey_btn");
	var search_current_a = Core.Dom.getElementsByClass(_nfBox, "a", "current")[0];

	var nfBoxStatusKey = "nfBoxStatus"+scope.$uid;
	//nfBoxStatus 为true时，表示展开，
	var getNfBoxStatus = function(){
		return App.storage.get( nfBoxStatusKey );
	};
	var setNfBoxStatus = function( isOpen ){
		App.storage.set( nfBoxStatusKey, isOpen );
	};
	
	var nfBoxHide = function(){
		setNfBoxStatus(false);
		_nftagOpen.title = "展开";
		_nftagOpen.innerHTML = "<em>&gt;</em>";
		_nfTagB.className = "nfTagB nfTagOff";
		_nfBox.style.display = "none";
	};
	
	var nfBoxShow = function(){
		setNfBoxStatus(true);
		_nftagOpen.title = "收起";
		_nftagOpen.innerHTML = "<em>&lt;</em>";
		_nfTagB.className = "nfTagB nfTagOn";
		_nfBox.style.display = "";
	};
	
	//检测_nfBox是否需要隐藏
	(function(){
		var nfBoxStatus = getNfBoxStatus();
		var nfBoxView = _nfBox.style.display;
		( nfBoxStatus !== "false" || nfBoxView!=="none" ) ? nfBoxShow() : nfBoxHide();
	})();
	
	_current.onclick = function() {
		window.location.href = _current.getElementsByTagName("span")[0].getAttribute("_link");
	};
	var _moreti = Core.Dom.getElementsByClass(_nfTagB, "a", "moreti")[0];       //更多
	var _sltmenu_m = Core.Dom.getElementsByClass(document.body, "div", "nfTaglay")[0];       //更多的内容
	var timer = null;
	var indexMainL = document.getElementById("indexMainL");
	if (_moreti) {
		var _moreti_pos = Core.Dom.getXY(_moreti);
		_sltmenu_m.style.cssText = "display:none;z-index:99;position:absolute;left:" + (_moreti_pos[0] - 14) + "px;top:" + (_moreti_pos[1] + _moreti.offsetHeight) + "px;";
		_moreti.onclick = function() {
			_sltmenu_m.style.display = "";
			return false;
		};
	}

	var _close = Core.Dom.getElementsByClass(indexMainL, "a", "close")[0];
	if (_close) {
		var _closefunc = _close.onclick;
		_close.onclick = function() {
			_closefunc.call(this);
			var _moreti_pos = Core.Dom.getXY(_moreti);
			_sltmenu_m.style.cssText = "display:none;z-index:99;position:absolute;left:" + (_moreti_pos[0] - 14) + "px;top:" + (_moreti_pos[1] + _moreti.offsetHeight) + "px;";
		};
	}
	var tflag = false; //当为true时，只有点击更多才显示ul，移动上去不显示
	//form top.js
	var _hover = function(spec) {
		var act = spec.act;
		var ext = spec.ext || [];
		var overKey = false;
		var timer = null;
		var showAct = function() {
			if (overKey) {
				spec.fun(overKey);
			}
		};
		var hiddAct = function() {
			if (!overKey) {
				spec.fun(overKey);
			}
		};
		var hoverAct = function() {
			if (tflag)return;
			overKey = true;
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(showAct, 200);
		};
		var msoutAct = function() {
			overKey = false;
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(hiddAct, 200);
		};
		_addEvent(act, hoverAct, 'mouseover');
		_addEvent(act, msoutAct, 'mouseout');
		for (var i = 0, len = ext.length; i < len; i += 1) {
			_addEvent(ext[i], hoverAct, 'mouseover');
			_addEvent(ext[i], msoutAct, 'mouseout');
		}

	};
	var getOnhover = function(act, layer) {
		return function(b) {
			if (b) {
				layer.style.display = '';
			} else {
				layer.style.display = 'none';
			}
		};
	};
	if (_moreti) {
		_hover({					   //更多
			'act' : _moreti,
			'ext' : [_sltmenu_m],
			'fun' : getOnhover(_moreti, _sltmenu_m)
		});
	}

	_nftagOpen.onclick = function() {
		var flag = /nfTagOff/.test(_nfTagB.className);
		flag ? nfBoxShow() : nfBoxHide();
		return false;
	};
	_nftagOpen.onfocus = function() {
		this.blur();
	};

	if (_current_span) {	 //“全部”标签没有可点击的三角
		_current_span.onclick = function(event) {
			_current_ul.style.display = "";
			tflag = true;
			event ? event.stopPropagation() : (window.event.cancelBubble = true);
			return false;
		};

		document.onclick = function(event) {
			if (_current_ul.style.display == "") {
				tflag = false;
				_current_ul.style.display = "none";
			}
		};
	}
	var searchFunc = function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		var searchv = search_input.value;
		if (searchv === search_input.getAttribute("def")) {
			searchv = "";
		}
		var hrefArr = search_current_a.href.split("&");
		window.location.href = hrefArr[0] + "&" + (hrefArr[1] || "") + (searchv ? "&filter_search=" + encodeURIComponent(searchv) : "");
	};
	
	_addEvent(search_input, function(e) {
		if (search_input.value === "") {
			search_input.value = search_input.getAttribute("def");
		}
	}, 'blur');
	
	_addEvent(search_input, function(e) {
		tflag = false;
		_current_ul && (_current_ul.style.display = "none");
		if (search_input.value === search_input.getAttribute("def")) {
			search_input.value = "";
		}
	}, 'focus');
	
	_addEvent(search_input, function(e) {
		if (e.keyCode === 13) {
			searchFunc(e);
		}
	}, 'keypress');

	_addEvent(search_button, searchFunc, 'click');

});
