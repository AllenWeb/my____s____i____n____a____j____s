/**
 * @overview
 * 自定义事件收发
 * 	App.CustomEvent.has	     检测是否已有事件注册
 *  App.CustomEvent.add		 添加自定义事件
 *  App.CustomEvent.fire     触发自定义事件
 *  App.CustomEvent.remove   移除自定义事件
 * @author liusong@staff.sina.com.cn
 * @example
    App.CustomEvent.add(document.body, "hello", function(){console.log(arguments)});
    App.CustomEvent.add("window", "hello", function(){console.log(arguments)});
    App.CustomEvent.has(document.body, "hello");
    App.CustomEvent.has("window", "hello");
    App.CustomEvent.fire(document.body, "hello");
    App.CustomEvent.fire("window", "hello");
    App.CustomEvent.fire("window", "hello", 1, 2, 3, 4);
 */
App.CustomEvent = (function(){
	var it = {}, snap = {}, rid = 0, opt = Object.prototype.toString, wo = {},
	/**
	 * 检测对象是否为空
	 * @param {Object} o
	 */
	isEmpty = function(o){
		var c;
		for (c in o) {break}
		return !c;
	},
	/**
	 * 生成一个独一的标识
	 * @param {Object} oObject
	 */
	gid = function(oObject){
		oObject = oObject === window? wo: oObject;
		if(!/^\[object (Number|String)\]$/.test(opt.call(oObject))){
			oObject = oObject['rid'] || (oObject['rid'] = ++rid);
		}
		return oObject
	};
	
	/**
	 * 检测是否已有事件注册
	 * @param {Object} sRegistKey 必选参数,注册关键字或对象
	 * @param {Object} sEventType 必选参数,事件类型
	 */
	it.has = function(sRegistKey, sEventType){
		var d;
		if(!(d = snap[gid(sRegistKey)])){return false}
		if(!(d = d[sEventType])){return false}
		return !isEmpty(d);
	};
	/**
	 * 移除自定义事件
	 * @param {Object} sRegistKey 必选参数,注册关键字或对象
	 * @param {Object} sEventType 必选参数,移除事件类型
	 * @param {Object} fAction    非必选参数,移除动作
	 */
	it.remove = function(sRegistKey, sEventType, fAction){
		sRegistKey = gid(sRegistKey);
		if(!(d = snap[sRegistKey])){return}
		if(fAction){
			d = d[sEventType];
			if(fAction.rid == null || !d){return}
			delete d[fAction.rid];
			isEmpty(d) && it.remove(sRegistKey, sEventType);
			return;
		}
		if(sEventType){
			delete d[sEventType];
			isEmpty(d) && it.remove(sRegistKey)
			return;
		}
		delete snap[sRegistKey];
	}
	/**
	 * 添加自定义事件
	 * @param {Object} sRegistKey 必选参数,注册关键字或对象
	 * @param {Object} sEventType 必选参数,事件类型
	 * @param {Object} fAction    必选参数,触发事件后的执行动作
	 * @author liusong@staff.sina.com.cn
	 */
	it.add = function( sRegistKey, sEventType, fAction){
		if (typeof fAction !== "function") { return }
		sRegistKey = gid(sRegistKey);
		var r = gid(fAction);
		c = snap[sRegistKey]  = snap[sRegistKey]||{};
		c = c[sEventType] = c[sEventType]||{};
		c[r] = c[r] || fAction;
	};
	/**
	 * 触发自定义事件
	 * @param {Object} sRegistKey 必选参数,注册关键字或对象
	 * @param {Object} sEventType 必选参数,事件类型
	 * @param ...arg              非必选参数,回调参数
	 */
	it.fire = function(sRegistKey, sEventType){
		var key = gid(sRegistKey);
		if(it.has(key, sEventType)){
			var c = snap[key][sEventType], args = [];
			Array.prototype.push.apply(args, arguments);
			args.splice(0,2);
			args.length === 0 && (args = [sRegistKey, sEventType]);
			for(var k in c){
				c[k].apply(null, args);
			}
		}
	};
	return it;
})();