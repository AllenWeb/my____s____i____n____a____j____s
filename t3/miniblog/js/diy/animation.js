$import("sina/sina.js");
$import("sina/app.js");

App.animation = {
	/*
	 * @阻尼振动的函数
	 * d : 延时的时间
	 * v : 初始的速度
	 * m : 物体的质量
	 * k : 弹性系数
	 * s : 要求的精度
	 * u : 阻尼参数
	 */
	 
	'vibrate' : function(d, v, m, k, s, u){

		//计算周期
		var T = 2*Math.PI*Math.sqrt(m/k);
		//计算最大的振幅
		var A = v*Math.sqrt(m/k);
		//计算一个周期内的取点次数
		var n = Math.ceil(T*100/d);
		//当前在周期内的份数
		var c = 0;
		//输出的轨道函数
		var orbit = [];
		while(A > s){
			orbit.push(A*Math.sin((c/n)*2*Math.PI));//距离与时间的函数
			c ++;
			c = c%n;
			A = A - u;
		}
		return orbit;
		
	},
	
	/*
	 * @匀加速运动函数
	 * d : 每贞的间隔时间
	 * h : 持续的距离
	 * g : 加速度
	 */
	'accelerate' : function(d, h, g, v){
		var orbit = [];
		var l = 0;
		
		while(true){
			var v1 = v;
			v = v1 + d*g/10;
			l = l + d*(v + v1)/20;
			if (l < h) {
				orbit.push(l);
			}else{
				break;
			}
		}
		return orbit;
	},
	/*
	 * @垂幕的算法
	 * d : 每贞的时间
	 * h ： 距离
	 * p : 高度比率
	 */
	'curtain' : function(d,h,p){
		var orbit = [h];
		var l = h;
		while(l > 1){
			l = l * p;
			orbit.unshift(l);
		}
		return orbit;
	},
	
	/*
	 * @ 匀速直线运动函数
	 * d : 每贞间隔时间
	 * h : 持续的距离
	 * v : 速度
	 */
	'speed' : function(d, h, v){
		//总时间
		var t = Math.ceil(h/v);
		//总贞数
		var n = Math.ceil(t*100/d);
		//输出的轨道函数
		var orbit = [];
		for(var i = 0; i < n; i ++){
			orbit.push((i+1)*h/n);
		}
		return orbit;
	},
	
	/*
	 * @ 匀速圆周运动
	 * d : 每贞间隔时间
	 * l : 半径
	 * v : 速度
	 */
	'circle' : function(d, l, v){
		//一个周期的总时间
		var t = 2*Math.PI*l/v;
		//总贞数
		var n = Math.ceil(t*100/d);
		//输出一个周期的轨道
		var orbit = [];
		for(var i = 0; i < n; i ++){
			orbit.push({
				'x' : l*Math.sin(((i+1)/n)*2*Math.PI),
				'y' : l*Math.cos(((i+1)/n)*2*Math.PI)
			});
		}
		return orbit;
	},
	
	/*
	 * @ 按时间求加速运动
	 * d : 每贞的间隔时间
	 * h : 持续的距离
	 * t : 持续的时间
	 */
	'taccelerate' : function(d,h,t){
		//总贞数
		var n = Math.ceil(t*100/d);
		//输出的轨道函数
		var orbit = [];
		for(var i = 0; i < n; i ++){
			orbit.push(Math.pow((i + 1)/n,2)*h);//距离与时间的函数
		}
		return orbit;
	}
};
