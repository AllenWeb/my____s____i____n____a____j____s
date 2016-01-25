/**
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");

/**
 * 简单ajax 主要用于请求数据, 如果请求过慢或过于频繁可以调用abort进行中断
 * @param {Object} url     必选参数，接口地址，如果有参数自行拼接
 * @param {Object} success 非必选参数，成功回调
 * @param {Object} fail    非必选参数，失败回调
 */
App.simpleAjax = function( url, success, error, fail){
	var req, res, error;
	//创建组件
	req = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
	if(!req){return}
	//请求状态管理
	req.onreadystatechange = function(){try {
		if (req.readyState == 4) {
			res = eval("(" + req.responseText + ")");
			if(res && res.code=="A00006"){
				success && success(res);
				return
			}
			error && error(res)
		}
	}catch(e){ fail && fail(e.message); return false }}
	//发起请求
	try {
		req.open("GET", url, true);
		req.send(null)
	}catch(e){ fail && fail(e.message); return false }
	//返回可控abort对像
	return {
		//中断当前请求
		abort: function(){ req.abort(); return false }
	}
};