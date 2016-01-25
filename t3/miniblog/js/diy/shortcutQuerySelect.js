$import("sina/app.js");
$import("sina/core/events/addEvent.js");
(function(proxy){
	
	var _addevent = Core.Events.addEvent;
	var _fireEvent = Core.Events.fireEvent;
	//获取按键值所对应的小写字母
	var getCharCode = function(kCode){
		return String.fromCharCode(kCode).toLowerCase();
	}
	
	var createQueryList = function(data){
		if( !data ){ return ""; }
		var list = [];
		var key = data["key"];
		var value = data["value"];
		for(var i=0; i<key.length; i++){
			list.push("|"+key[i].toLowerCase()+":"+value[i]+"|");
		}
		var str = list.join("");
		return str;
	}
	
	var getValue = function(k){
		var val;
		if (k) {
			k = k.replace(/\|/g, "");
			val = k.split(":")[1];
		}
		return val;
	};
	
	//查询器
	var ShortcutQuery = function(data){
		var _cacheRes = [];
		var _currentTag = "";
		var _index = 0;
		var _data = createQueryList(data);
		this.setData = function(d){
			_data = createQueryList(d);
		};
		this.query = function(kName){
			var value = "";
			var index = 0;
			var res = _data.match(new RegExp('\\|'+kName+'(.*?)\\|', 'gi'));
			//var res = [];
			(_currentTag == kName) && (index = _index + 1);
//			if(_currentTag == kName){
//				index = _index + 1;
//			} else{
//				_cacheRes = _data.match(new RegExp('\\|'+kName+'(.*?)\\|', 'gi'));
//			}
//			res = _cacheRes
			if(res && res.length){
				value = getValue(res[index]);
				if(isNaN(value)){
					value = getValue(res[0]);
					!isNaN(value) && (_index = 0);
				} else{
					_index = index;
					_currentTag = kName;
				}
			}
			return value;
		}
	}
	
	//给select元素绑定快捷键操作
	proxy.bindShortcutOnSelect = function(selectNode, data){//createQueryList(data)
		//一個select元素目前隻支持綁定一個查詢器
		if (selectNode.shortcut) {
			selectNode.shortcut.setData(data);
		}
		else {
			selectNode.shortcut = new ShortcutQuery(data);
			var onkeyupHandler = (function(){
				var clTimer = "";
				var quTimer = "";
				var kName = "";
				return function(e){
					if (e.keyCode > 91 || e.keyCode < 64) { return; }
					quTimer && clearTimeout(quTimer);
					clTimer && clearTimeout(clTimer);
					kName += getCharCode(e.keyCode);
					quTimer = setTimeout(function(){
						var val = selectNode.shortcut.query(kName);
						if (!isNaN(val)) {
							selectNode.value = val;
							_fireEvent(selectNode, "change");
						}
						clTimer = setTimeout(function(){ kName = ""; }, 500);
					}, 100);
				}
			})();
			_addevent(selectNode, onkeyupHandler, "keyup");
		}
		return selectNode.shortcut;
	}
})(App);