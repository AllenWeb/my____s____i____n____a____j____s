/**
 * @fileoverview
 *	根据指定的列表获取 UIC
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */
$import("sina/utils/utils.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/array/uniq.js");
Utils.Uic = {
	_interface : "http://uic.sinajs.cn/uic?type=nick",
	/**
	 * 缓存已经请求过的 UID 昵称
	 */
	cacheNickName : {},
	/**
	 * 根据指定的 UID 列表数组，从 UIC 接口获取昵称，成功后执行回调函数
	 * 
	 * @param {Array} arrUidLists	需要查询的 UID 列表，UID 中重复的会被过滤为一个
	 * @param {Function} fCallBack	回调函数
	 * @return {Object}		返回以 UID 为 KEY，昵称为 Value 的 JSON 对象
	 * @example
		Utils.Uic.getNickName(["1406758883", "1312273654"], function(oResult){
			for(var key in oResult){
				$Debug(key + " 的昵称是：" + oResult[key]);
			}
		});
	 */ 
	getNickName : function (arrUidLists, fCallBack,requestNo){
		arrUidLists = Core.Array.uniq(arrUidLists) || [];
		requestNo = requestNo || 10;
		// 先检查缓存，如果有缓存的数据不再重复请求
		var _cache = this.cacheNickName, _uidWithNoCache = [];
		var _data = {};
		for(var i = 0, len = arrUidLists.length; i < len; i ++ ){
			// 如果缓存里没有指定 UID 或者缓存里的昵称是 null，就存入待请求列表；
			// 如果缓存有该 UID，就存入临时连连 _data 中
			if(typeof _cache[arrUidLists[i]] == "undefined" && _cache[arrUidLists[i]] == null){
				_uidWithNoCache.push(arrUidLists[i]);
			}
			else{
				_data[arrUidLists[i]] = _cache[arrUidLists[i]] || arrUidLists[i];
			}
		}
		// 如果缓存中就拿到所有数据，则直接回调；否则读请求无缓存的UID再回调。
		if(_uidWithNoCache.length == 0){
			fCallBack(_data);
			_data = null;
		}
		else{
//			$Debug("有数据需要新读取，总数是 " + _uidWithNoCache.length);
			var urls = [];
			while (_uidWithNoCache.length > 0) {
				urls.push({"url" : this._interface + "&uids=" + _uidWithNoCache.splice(0, requestNo).join(",")});
			}
			// 请求数据
			var jsRequest = function(aUrl){
				Utils.Io.JsLoad.request(aUrl[0].url, {
					onComplete : function (data) {
						if(typeof data.length == "undefined"){
							for(var key in data){
								_data[key] = (data[key] || key);
							}
							fCallBack(_data);
						}
						else{
							for(var j = 0; j < data.length; j ++){
								for(var _item in data[j]){
									_data[_item] = (data[j][_item] || _item);
								}
							}
							fCallBack(_data);
						}
					}
				});
				
				if (urls.length > 0) {
					setTimeout(function(){
						jsRequest(urls.splice(0, 1));
					}, 10);
				}
			};
			if (urls.length > 0) {
				setTimeout(function(){
					jsRequest(urls.splice(0, 1));
				}, 10);
			}
		}
	}
};
