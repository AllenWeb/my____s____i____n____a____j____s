/**
 * @author chibin chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/dialog.js");
$import("diy/check.js");
$import("diy/htmltojson.js");
$import("sina/core/string/trim.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/base/detect.js");
$registJob('backtop', function(){
	return;
	var _div = $C("DIV");
	_div.id = "backtop";
	_div.className = "backtop";
	_div.innerHTML = '<a href="javascript:void(0);" onclick="App.backTop();return false;">返回顶部</a>';
	_div.style.position = "absolute";
	_div.style.right = "30px";
	_div.style.display = "none";
	document.body.appendChild(_div);
	setInterval(function(){
		var _page = Core.System.pageSize();
		var _scroll = Core.System.getScrollPos();
		if (_scroll[0] < _page[3]) {
			_div.style.display = "none";
			return;
		}
		_div.style.top = (_scroll[0] + _page[3] - 80) + "px";
		_div.style.display = "";
		return;
	},1000);
});


App.backTop = function(){
	document.body.scrollTop = 0;
	if (document.documentElement) {
		document.documentElement.scrollTop = 0;
	}
	return true;
};
