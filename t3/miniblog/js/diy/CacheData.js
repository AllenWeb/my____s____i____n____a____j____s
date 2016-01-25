$import("sina/sina.js");
$import("sina/app.js");

/**
 * 缓存对像使用的数据
 * @author liusong@staff.sina.com.cn
 */
(function(proxy){
	var sceid = 1, c={}, u = undefined, w = window, wd = {};
	/**
	 * 对象的过滤，如果对象为window则为window创建缓存容器
	 * @param {Object} oElement
	 */
	var ge = function( oElement ){
		return  oElement == window? wd : oElement;
	};
	/**
	 * 根据对像缓存数据或对象
	 * @param {Object} oElement 必选参数  ，缓存对象
	 * @param {Object} sKey     非必选参数，存入的键值
	 * @param {Object} oValue   非必选参数，预存储的数据
	 */
	proxy.CacheData = function( oElement, sKey, oValue ){
		var e  = ge( oElement ), id = e.sceid || (e.sceid = sceid++);
		//如果传入键值，但没有没有缓存过数据则创建该对象的缓存对象
		sKey && !c[id] && (c[id] = {});
		//如果oValue存在则视为存储数据
		oValue !== u && (c[id][sKey] = oValue);
		//如果sKey存在则视为取值操作，否则视为取对象缓存id
		return sKey? c[id][sKey] : id;
	};
	/**
	 * 根据对像移除缓存数据或对象
	 * @param {Object} oElement 必选参数，已缓存的对象
	 * @param {Object} sKey     非必选参数，需移除的键值
	 */
	proxy.RemoveCacheData = function( oElement, sKey ){
		var e  = ge( oElement ), id = e["sceid"], key;
		//没有缓存，无而处理
		if(!c[id]){return}
		//如果是移除键值
		if(sKey){
			delete c[id][sKey];
			sKey = "";
			//如果该对象已无任何缓存，则清除对象缓存
			for(sKey in c[id]){ break }
			!sKey && proxy.RemoveCacheData( oElement )
			return;
		}
		//否则移除缓存对象
		try{
			delete oElement.sceid
		}catch(e){
			oElement.removeAttribute && oElement.removeAttribute("sceid")
		}
		delete c[id];
	};
})(App);
