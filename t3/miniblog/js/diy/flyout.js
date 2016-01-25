$import("sina/sina.js");
$import("sina/app.js");
$import("diy/timer.js");
$import("diy/animation.js");
$import("sina/core/dom/getXY.js");

/*
 * @authr Robin Young | yonglin@staff.sina.com.cn
 * @param {Object} st 飞出效果的起始element对象
 * @param {Object} tg 飞出效果的结束element对象
 * @param {Object} config {'resFun':飞出结束的回调函数，'style' : 飞出层的样式，可以直接写css，'time' : 持续的时间，以100毫秒为单位}
 */

(function(proxy){
	var movingKey = false;
	proxy.doFlyOut = function(st,tg,config){
		if(movingKey){
			return false;
		}
		movingKey = true;
		var getAbsolute = function(ele){
			var aPoint = Core.Dom.getXY(ele);
			var res = {'x' : aPoint[0], 'y' : aPoint[1]};
			return res;
		};
		var params_st = {
			'w' : st.offsetWidth,
			'h' : st.offsetHeight,
			'l' : (getAbsolute(st))['x'],
			't' : (getAbsolute(st))['y']
		};
		var visible = tg.style.visibility;
		var display = tg.style.display;
		if(tg.style.display == 'none'){
			tg.style.visibility = 'hidden';
			tg.style.display = 'block';
		}
		var params_tg = {
			'w' : tg.offsetWidth,
			'h' : tg.offsetHeight,
			'l' : (getAbsolute(tg))['x'],
			't' : (getAbsolute(tg))['y']
		
		};
		
		
		var oo = document.createElement('DIV');
		oo.style.cssText = config['style'];
		oo.style.width = params_st['w'] + 'px';
		oo.style.height = params_st['h'] + 'px';
		oo.style.top = params_st['t'] + 'px';
		oo.style.left = params_st['l'] + 'px';
		oo.style.position = 'absolute';
		
		document.body.appendChild(oo);
		var ct = {
			'w' : proxy.animation.taccelerate(
				proxy.timer.delay,
				params_tg['w'] - params_st['w'],
				config['time']
			),
			'h' : proxy.animation.taccelerate(
				proxy.timer.delay,
				params_tg['h'] - params_st['h'],
				config['time']
			),
			'l' : proxy.animation.taccelerate(
				proxy.timer.delay,
				params_tg['l'] - params_st['l'],
				config['time']
			),
			't' : proxy.animation.taccelerate(
				proxy.timer.delay,
				params_tg['t'] - params_st['t']
				,config['time']
			)
		}
		var c = 0;
		var tk = proxy.timer.add(
			function(){
				if(c >= ct['w'].length){
					proxy.timer.remove(tk);
					oo.style.display = 'none';
					config.resFun();
					//tg.style.visibility = 'visible';
					movingKey = false;
					return false;
				}
				oo.style.width = params_st['w'] + ct['w'][c] + 'px';
				oo.style.height = params_st['h'] + ct['h'][c] + 'px';
				oo.style.top = params_st['t'] + ct['t'][c] + 'px';
				oo.style.left = params_st['l'] + ct['l'][c] + 'px';
				c ++;
			}
		);
		tg.style.visibility = visible;
		tg.style.display = display;
	};
})(App);
