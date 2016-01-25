$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * @id Core.Dom.superClass
 * @module superCls
 * @param {Object} superCls 父类
 * @param {Object} exCls 子类
 * @param {Object} slefIndicator 子类的this指针
 * @return {Void}
 * @author FlashSoft | fangchao
 */
Core.Dom.superClass = function (superCls, exCls, slefIndicator) {
	for(var key in superCls.prototype){
		if(!exCls.prototype.hasOwnProperty(key)){
			slefIndicator[key] = superCls.prototype[key];
		}
	}	
	arr = [];
	if(arguments.length > 3) {
		for(var i = 3; i < arguments.length; i ++) {
			arr[arr.length] = "arguments[" + i + "]";
		}
		eval("superCls.call(slefIndicator, " + arr.join(",") + ");");
	}
	else {
		superCls.call(slefIndicator);
	}
	for (var mykey in exCls.prototype) {
		slefIndicator[key] = exCls.prototype[mykey];
	}
};
if(!$IE){
	HTMLElement.prototype.__defineGetter__("innerText",function(){return this.textContent;});
	HTMLElement.prototype.__defineSetter__("innerText",function(v){this.textContent = v;});
}