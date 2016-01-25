/**
 * @fileoverview
 *	在指定窗口动态载入 CSS
 * 分外部 CSS 文件和页面内 Style 两种情况
 * @param oCss		CSS 对象{
 		id : "",	对象ID
 		url : "",	CSS文件URL，以 LINK 标签形式插入外部 CSS 文件，url 和 text 设置任意一个即可
 		text : ""	CSS文件内容，以 STYLE 标签形式插入页面内 CSS
 * }
 * @param oTarget	可选参数，需要插入 CSS 的窗口对象
 * @example

	// 外部 CSS 文件
	Utils.loadCss({
			url : "http://sjs.sinajs.cn/test.css"
		}, parent);
		
	// 页面内 CSS	
	Utils.loadCss({
		text : "body{background:#F00;}"
	});

 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-16
 */
$import("sina/utils/utils.js");
$import("sina/sina.js");
Utils.loadCss = function (oCss, oTarget) {
	if(oCss == null){
		return false;
	}
	oTarget = oTarget || window;
	var _target = oTarget.document;
	oCss.id = oCss.id || "";
	var _css;
	if (oCss.url){
		_css = _target.createElement("link");
		_css.setAttribute("rel", "stylesheet");
		_css.setAttribute("type", "text/css");
		_css.setAttribute("href", oCss.url);
	}
	else if (oCss.text){
		_css = _target.createElement("style");
		_css.setAttribute("type", "text/css");
		if ($IE) {
			_css.styleSheet.cssText = oCss.text;
		}
		else{
			_css.innerHTML = oCss.text;
		}
	}
	_css.setAttribute("id", oCss.id);
	_target.getElementsByTagName("head")[0].appendChild(_css);
};
