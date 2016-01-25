/**
 * @id Core.Math.getRandomNumber
 * @fileoverview
 *	在指定范围内产生随机正整数
 * @param {Number} _start	起始数值
 * @param {Number} _end		结束数值
 * 参数需要是数字格式，参数前后位置可以不管
 * @return 指定范围内的随机整数
 * @example
	// 返回 0-3 之间的随机正整数
	Core.Math.getRandomNumber(0, 3);

	// 返回 1-10 之间的随机正整数
	Core.Math.getRandomNumber(10, 0.05);

	// 返回 null
	Core.Math.getRandomNumber(-10, -0.05);

 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-20
 */
$import("sina/core/math/_math.js");
Core.Math.getRandomNumber = function (_start, _end){
	if(isNaN(_start) || isNaN(_end) || _start <0 && _end < 0){
		return null;
	}
	var _s = Math.ceil(Math.min(_start, _end));
	var _e = Math.floor(Math.max(_start, _end));
	_s = _s > 0 ? _s : 0; 
	return Math.round(_s + Math.random()*(_e - _s));
};
