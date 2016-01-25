/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/fireEvent.js');
$import("diy/animation.js");
$import("diy/opacity.js");
$import("sina/core/array/up.js");
$import("sina/core/array/down.js");
$registJob('pulley', function(){
    try {
        var _addEvent = Core.Events.addEvent;
        App.pulleyConfig = function(element, cfg){
            var that = {};
            var speed = 160;
            element.style.overflow = 'hidden';
            _orbit = function(distance){
                var ret = App.animation.speed(App.timer.delay, distance, speed);
                return ret;
            };
            that.left = function(distance, endFun, moveingFun){
                var orbit = _orbit(distance);
                var current = 0;
                var inscroll = element.scrollLeft;
                App.setOpacity(element, 80);
                var tk = App.timer.add(function(){
					if (current >= orbit.length) {
                        App.timer.remove(tk);
                        element.scrollLeft = inscroll + distance;
						App.setOpacity(element, 100);
                        endFun();
                        return false;
                    }
                    element.scrollLeft = inscroll + orbit[current];
                    moveingFun(orbit[current]);
                    current += 1;
                });
                return this;
            };
            that.right = function(distance, endFun, moveingFun){
                var orbit = _orbit(distance);
                var current = 0;
                var inscroll = element.scrollLeft;
                App.setOpacity(element, 80);
                var tk = App.timer.add(function(){
                    if (current >= orbit.length) {
                        App.timer.remove(tk);
                        element.scrollLeft = inscroll - distance;
                        App.setOpacity(element, 100);
                        endFun();
                        return false;
                    }
                    element.scrollLeft = inscroll - orbit[current];
                    moveingFun(orbit[current]);
                    current += 1;
                });
                return this;
            };
            that.up = function(){
            };
            that.down = function(){
            };
            return that;
        };
        /**
         * @param{HTMLElment}left
         * @param{HTMLElment}right
         * @param{HTMLElment}box : items的最外层容器(1 其overflow为hidden;2 其width要小于shell的width)
         * @param{HTMLElment Array}items　:滚动的元素的集合
         * @param{HTMLElment}shell :items的最内层父容器
         * @param{Number}num :决定移动步长
         * @param{Number}lens
         * 
         * @param{Object}cfg:{
         *                      notloop:是否循环。（如果不循环，则只提供向左向右方法）
         *                      endRFun:function(){}, 点向右的时候结束完滚动事件
         *                      endLFun:function(){},  点向左的时候结束完滚动事件
         *                      moveRFun:function(){}, 点向右的时候滚动中事件
         *                      moveLFun:function(){}, 点向左的时候滚动中事件
         *                      allnum : integer  总个数,
         *                      isArray: 默认false ,//items如果是数组则只改items[0]是有问题的
         *                      nomouseAction: false 如果设置true则鼠标mouseout和mouseover屏蔽
         *                    }
         * */
        App.pulley = function(left, right, box, items, shell, num, lens, cfg){
            var ant = App.pulleyConfig(box);
            var lens = lens || 157;
            var marg = 0;
            var cur = 0;
            var key = true;
            var arrItem;
            var lock = false;
            var loopsFunction = function(){
				if(items.length == 0 ){
					return false;
				}
                if (cfg && cfg['notloop']) {
                    return false;
                }
                if (lock) {
                    return false;
                }
                if (!key) {
                    return false;
                }
                key = false;
                ant.left(lens * num, function(){
                    for (var i = 0; i < num; i += 1) {
                        shell.appendChild(items[0]);
						if (cfg && cfg['isArray']) {
                            arrItem = items.shift();
                            items.push(arrItem);
                        }
                        box.scrollLeft = (box.scrollLeft - lens);
                    }
                    key = true;
                    if (cfg && typeof cfg['endRFun'] == 'function') {
                        cfg['endRFun'](items);
                    }
                }, function(len){
                    if (cfg && typeof cfg['moveRFun'] == 'function') {
                        cfg['moveRFun'](len);
                    }
                });
            };
            var loopsTime = (cfg&&cfg['loopsTime'])||5000;
            App._loops = setInterval(loopsFunction, loopsTime);
            var newLoops = function(){
                try {
                    clearInterval(App._loops);
                    App._loops = setInterval(loopsFunction, loopsTime);
                } 
                catch (es) {
                
                }
            };
            
            _addEvent(right, function(){
                if (!key) {
                    return false;
                }
                key = false;
                ant.left(lens * num, function(){
                    for (var i = 0; i < num; i += 1) {
						shell.appendChild(items[0]);
						if (cfg && cfg['isArray']) {
                            arrItem = items.shift();
							items.push(arrItem);
                        }
                        box.scrollLeft -= (lens);
                    }
                    key = true;
                    newLoops();
                    if (cfg && typeof cfg['endRFun'] == 'function') {
                        cfg['endRFun'](items);
                    }
                }, function(len){
                    if (cfg && typeof cfg['moveRFun'] == 'function') {
                        cfg['moveRFun'](len);
                    }
                });
                return false;
            }, 'click');
            
            _addEvent(left, function(){
                if (!key) {
                    return false;
                }
                key = false;
                ant.right(lens * num, function(){
                    for (var i = 0; i < num; i += 1) {
                        shell.insertBefore(items[items.length - 1], items[0]);
						if (cfg && cfg['isArray']) {
                            arrItem = items.pop();
                            items.unshift(arrItem);
                        }
                        box.scrollLeft += (lens);
                    }
                    key = true;
                    newLoops();
                    if (cfg && typeof cfg['endLFun'] == 'function') {
                        cfg['endLFun'](items);
                    }
                }, function(len){
                    if (cfg && typeof cfg['moveLFun'] == 'function') {
                        cfg['moveLFun'](len);
                    }
                });
                return false;
            }, 'click');
            if (!(cfg && cfg['nomouseAction'])) {
				_addEvent(box, function(){
					lock = true;
				}, 'mouseover');
			}
			if (!(cfg && cfg['nomouseAction'])) {
				_addEvent(box, function(){
					lock = false;
				}, 'mouseout');
			}
//            for (var i = 0; i < num + 1; i += 1) {
            for (var i = 0; i < num; i += 1) {  //chibin modify
                shell.insertBefore(items[items.length - 1], items[0]);
				if (cfg && cfg['isArray']) {
                    arrItem = items.pop();
                    items.unshift(arrItem);
                }
                box.scrollLeft += (lens);
            }
            box.scrollLeft -= marg;
        };
        /**
         * 清除定时器
         * */
        App.clearPulley = function(){
            clearInterval(App._loops);
        };
    } 
    catch (exp) {
    }
});
