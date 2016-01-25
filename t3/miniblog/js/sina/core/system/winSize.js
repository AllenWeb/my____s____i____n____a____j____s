$import('sina/core/system/_system.js');
/**
 * @id Core.System.winSize
 * 获取浏览器实际内容的大小
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Object}	_target 需要获得的窗口引用，默认为本窗口
 * @return {Object} 存储页面大小的对象
 * @example
 * 		var win = Core.System.winSize();
 * 		alert(win.width);	//800
 * 		alert(win.height);	//600
 */
Core.System.winSize = function(_target) {
	var w, h;
	if (_target) {
		target = _target.document;
	}
	else {
		target = document;
	}
	if (self.innerHeight) { // all except Explorer
		if (_target) {
			target = _target.self;
		}
		else {
			target = self;
		}
		w = target.innerWidth;
		h = target.innerHeight;
	}
	else if (target.documentElement && target.documentElement.clientHeight) { // Explorer 6 Strict Mode
		w = target.documentElement.clientWidth;
		h = target.documentElement.clientHeight;
	}
	else if (target.body) { // other Explorers
		w = target.body.clientWidth;
		h = target.body.clientHeight;
	}
	return 	{
				width : w,
				height : h
			};
};