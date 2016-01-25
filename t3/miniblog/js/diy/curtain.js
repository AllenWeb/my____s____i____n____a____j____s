$import("sina/sina.js");
$import("sina/app.js");
$import("diy/timer.js");
$import("diy/animation.js");


 
(function(proxy){
	var movingKey = false;
	
	var g = 10;//重力加速度
	var m = 20;//质量
	var k = 10;//胡克系数
	var s = 0;//精度
	var u = 0;//阻尼系数
	var l = 0;//加速后的剩余能量比
	var v = 0;//初速度
	var p = 0.4//速度比率
	
	proxy.curtain = {
		/**
		 * @authr Robin Young | yonglin@staff.sina.com.cn
		 * @XX.curtain 垂幕下降的函数，加速运动带抖动
		 * @param {Object} element 所操作显示的element元素
		 * @param {Object} isHorizontal 是否是横向的（暂不支持）
		 */
		'droop' : function(element,callBack,isHorizontal){
			if(movingKey){
				return false;
			}
			movingKey = true;
			var elementOverflow = element.style.overflow;
			element.style.visibility	= 'hidden';
			element.style.display		= 'block';
			element.style.overflow		= 'hidden';
			
			var h = parseInt(element.offsetHeight);
			var dropOrbit = proxy.animation.curtain(
				proxy.timer.delay,
				h,
				p
			);
			var current = 0;
			var tk = proxy.timer.add(
				function(){
					if(current >= dropOrbit.length){
						proxy.timer.remove(tk);
						element.style.height = h + 'px';
						element.style.overflow = elementOverflow;
						movingKey = false;
						if(typeof callBack == 'function'){
							callBack();
						}
						return false;
					}
					element.style.height = dropOrbit[current] + 'px';
					element.scrollTop = (h - dropOrbit[current]);
					current ++;
				}
			);
			element.style.height = '0px';
			element.style.visibility = 'visible';
			return true;
		},
		/**
		 * @authr Robin Young | yonglin@staff.sina.com.cn
		 * @XX.curtain.raise 垂幕上升的函数，加速运动带拉伸
		 * @param {Object} element 所操作显示的element元素
		 * @param {Object} isHorizontal 是否是横向的（暂不支持）
		 */
		'raise' : function(element,isHorizontal){
			if(movingKey){
				return false;
			}
			movingKey = true;
			var elementOverflow = element.style.overflow;
			element.style.overflow = 'hidden';
	
			var h = parseInt(element.offsetHeight);
			var orbit = [];
			if (u !== 0) {
				var lis = proxy.animation.speed(
					proxy.timer.delay,
					h*l,
					g/l
				);
				for(var i = 0, len = lis.length; i < len; i ++){
					orbit.push(h+lis[i]);
				}
			}
			var li2 = proxy.animation.speed(
				proxy.timer.delay, 
				h * (1 + l), 
				g * 10
			);
			for (var i = 0, len = li2.length; i < len; i++) {
				orbit.push(li2[len - i - 1]);
			}
			var current = 0;
			var tk = proxy.timer.add(
				function(){
					if(current >= orbit.length){
						proxy.timer.remove(tk);
						element.style.display = 'none';
						element.style.height = h + 'px';
						element.style.overflow = elementOverflow;
						movingKey = false;
						return false;
					}
					element.style.height = orbit[current] + 'px';
					element.scrollTop = (h - orbit[current]);
					current ++;
				}
			);
		},
		/**
		 * 
		 * @param {Object} config
		 * @ g : 加速度
		 * @ m : 质量
		 * @ k : 胡克系数
		 * @ s : 精度
		 * @ u : 阻尼系数
		 * @ l : 加速后的剩余能量比
		 */
		'setting' : function(config){
			g = config['g'] || g;//重力加速度
			m = config['m'] || m;//质量
			k = config['k'] || k;//胡克系数
			s = config['s'] || s;//精度
			u = config['u'] || u;//阻尼系数
			l = config['l'] || l;//加速后的剩余能量比
		}
	};
})(App);
