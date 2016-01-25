/**
 * @desc 基础接口代码
 * @author stan | chaliang@staff.sina.com.cn
 */
$import("sina/utils/url.js");
$import("sina/core/string/j2o.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/io/ijax.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/class/create.js");
$import("sina/core/function/bind2.js");
$import("sina/module/processTip.js");

/**
 * 构造函数
 * @param {Object} url 接口地址
 * @param {Object} type 数据通讯类型
 * @param {Object} displayTip 是否显示processTip
 */
var Interface = function(url, type, displayTip){
	this.url = new Utils.Url(url);
	this.type = type.toLowerCase();
	this.displayTip = displayTip || false;
};
Interface.prototype = {
	url : null,
	type : "",
	/**
	 * 
	 * @param {Object} option
	 * - GET
	 * - PSOT
	 * - onSuccess
	 * - onError
	 * - onFail
	 */
	request : function(option){
		var err = option.onError;
		var suc = option.onSuccess;
		this.tip = this.displayTip ? new App.processTip() : null;
		var tip = this.tip;
		option.onComplete = option.onSuccess = function(result){
			try{
				// 过滤接口未提供 varname 时 JSON 对象最后的分号，避免 j2o 出错
				if(typeof result == "string"){
					result = result.replace(/;$/, "");
				}
				result = (typeof result == "string" && (/\s*{/.test(result))) ? Core.String.j2o(result) : result;
				// 如果接口返回对象没有 code 属性，视为接口异常
				if(result != null && typeof result.code == "undefined"){
					$Debug("接口数据异常：" + this.url, "#F00");
					return;
				}
				if(result != null){
					if(result.code == "A00006" || result.code == "S00001"){
						suc(result.data);
					}
					else{
						err(result);
					}
				}else{
					err(result);
				}
				if (tip) {
					tip.onComplete();
				}
			}catch(e){
				traceError(e);
			}
		}.bind2(this);
		option.onException = option.onError = option.onFail || function(){
			$Debug("接口失败：" + this.url, "#F00");
			if(arguments.length > 0){
				for(var i = 0, len = arguments.length; i < len ; i ++ ){
					if (arguments[i] && typeof arguments[i] != "undefined") {
						$Debug("错误信息：" + arguments[i].toString());
					}
				}
			}
		}.bind2(this);
		var requestURL = this.url.toString();
		if(this.tip){
			this.tip.onProgress();
		}
		switch(this.type){
			case "ijax":
				Utils.Io.Ijax.request(requestURL, option);
				break;
			case "ajax":
				Utils.Io.Ajax.request(requestURL, option);
				break;
			case "script":
			case "jsload":
				Utils.Io.JsLoad.request(requestURL, option);
				break;
			default:
				throw new Error("未指定有效的数据传输类型");
		}
	}
};
