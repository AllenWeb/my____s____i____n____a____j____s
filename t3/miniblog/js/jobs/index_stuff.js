/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/fireEvent.js');
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getXY.js");
$import("diy/animation.js");
$import("diy/opacity.js");
$import("diy/marquee.js");
$import("jobs/miniblog_follow.js");
$import("jobs/mod_forward.js");

$registJob('recommend',function(){
	try {
		var _addEvent = Core.Events.addEvent;
		var pulley = function(element, cfg){
			var that = {};
			var speed = 160;
			element.style.overflow = 'hidden';
			_orbit = function(distance){
				var ret = App.animation.speed(App.timer.delay, distance, speed);
//				var eff = App.animation.speed(App.timer.delay, 100,speed/2);
//				var eff2 = App.animation.speed(App.timer.delay, 100,speed/2).reverse();
//				eff = eff.concat(eff2);
//				for(var i = 0, len = eff.length; i < len; i += 1){
//					eff[i] = (-1)*eff[i];
//				}
//				var effEnd = App.animation.vibrate(App.timer.delay,speed,1,2,1,4);
//				for(var i = 0, len = effEnd.length; i < len; i++){
//					effEnd[i] = (ret[ret.length - 1] + effEnd[i]);
//				}
//				ret = eff.concat(ret).concat(effEnd);
				return ret;
			};
			that.left = function(distance, endFun, moveingFun){
				var orbit = _orbit(distance);
				var current = 0;
				var inscroll = element.scrollLeft;
				App.setOpacity(element,80);
				var tk = App.timer.add(function(){
					if (current >= orbit.length) {
						App.timer.remove(tk);
						element.scrollLeft = inscroll + distance;
						App.setOpacity(element,100);
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
				App.setOpacity(element,80);
				var tk = App.timer.add(function(){
					if (current >= orbit.length) {
						App.timer.remove(tk);
						element.scrollLeft = inscroll - distance;
						App.setOpacity(element,100);
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
		
		try {
			var recommend = (function(left, right, box,num){
				var ant = pulley(box);
				var lens = 160;
				var cur = 0;
				var key = true;
				var items = box.getElementsByTagName('LI');
				var shell = box.getElementsByTagName('UL')[0];
				
				var lock = false;
				var loopsFunction = function(){
					if(lock){
						return false;
					}
					if (!key) {
						return false;
					}
					key = false;
					ant.left(lens*num,
					function(){
						for(var i = 0; i < num; i += 1){
							shell.appendChild(items[0]);
							box.scrollLeft -= lens;
						}
						key = true;
					},
					function(len){});
				};
				var loopsTime = 5000;
				var loops = setInterval(loopsFunction,loopsTime);
				var newLoops = function(){
					try{
						clearInterval(loops);
						loops = setInterval(loopsFunction,loopsTime);
					}catch(es){
						
					}
				};
				
				_addEvent(right, function(){
					if (!key) {
						return false;
					}
					key = false;
					ant.left(lens*num,
					function(){
						for(var i = 0; i < num; i += 1){
							shell.appendChild(items[0]);
							box.scrollLeft -= lens;
						}
						key = true;
						newLoops();
					},
					function(len){});
					return false;
				}, 'click');
				
				_addEvent(left, function(){
					if (!key) {
						return false;
					}
					key = false;
					ant.right(lens*num,
					function(){
						for(var i = 0; i < num; i += 1){
							shell.insertBefore(items[items.length - 1],items[0]);
							box.scrollLeft += lens;
						}
						key = true;
						newLoops();
					},
					function(len){});
					return false;
				}, 'click');
				
				_addEvent(box,function(){lock = true;},'mouseover');
				_addEvent(box,function(){lock = false;},'mouseout');
				
				for(var i = 0; i < num+1; i += 1){
					shell.insertBefore(items[items.length - 1],items[0]);
					box.scrollLeft += lens;
				}

				var itemsList = [];

				for (var i = 0, len = items.length; i < len; i++) {
					itemsList[i] = items[i];
					(function(k){
						_addEvent(itemsList[k], function(){
							var item = itemsList[k].getElementsByTagName('A')[2] || itemsList[k].getElementsByTagName('SPAN')[0];
							item.style.display = '';
							itemsList[k].className = 'selected';
						}, 'mouseover');
						_addEvent(itemsList[k], function(){
							var item = itemsList[k].getElementsByTagName('A')[2] || itemsList[k].getElementsByTagName('SPAN')[0];
							item.style.display = 'none';
							itemsList[k].className = '';
						}, 'mouseout');
					})(i);
				}
			})($E('pulley_left'), $E('pulley_right'), $E('pulley_box'),4);
			
		}catch(ex){}
		
		try {
			var tweet = (function(){
				var data = $E('tweet_loop_box').getElementsByTagName('LI');
				var curr = 0;
				var that = {};
				that.loops = function(){
					App.opacity(data[curr], {
						'first': 100,
						'last': 0,
						'time': 10
					});
					setTimeout(function(){
						data[curr].style.display = 'none';
						curr += 1;
						if (curr >= data.length) {
							curr = 0;
						}
						data[curr].style.display = '';
						App.opacity(data[curr], {
							'first': 0,
							'last': 100,
							'time': 10
						});
					}, 1000);
				};
				return that;
			})();
			
			setInterval(function(){
				tweet.loops()
			}, 10000);
		}catch(ex){}
		
		
		try{
			var marqueeBox = $E('marqueeNotice');
			var domList = marqueeBox.getElementsByTagName('TD');
			var items = [];
			for(var i = 0, len = domList.length;i < len; i += 1){
				items[i] = domList[i];
			}
			var doMarquee = App.marquee(marqueeBox,items);
			Core.Events.addEvent(marqueeBox,function(){doMarquee.pause()},'mouseover');
			Core.Events.addEvent(marqueeBox,function(){doMarquee.restart()},'mouseout');
			doMarquee.start();
			
			var introduction = [
				[$E('affect1'),$E('position1'),$E('dialog1')],
				[$E('affect2'),$E('position2'),$E('dialog2')],
				[$E('affect3'),$E('mblog_daily'),$E('dialog3')],
				[$E('affect4'),$E('position4'),$E('dialog4')]
			];
			for(var i = 0, len = introduction.length; i < len; i += 1){
				(function(k){
					Core.Events.addEvent(introduction[k][0],function(){
						var xy = Core.Dom.getXY(introduction[k][1]);
						introduction[k][2].style.top = xy[1] + 'px';
						introduction[k][2].style.left = xy[0] + 'px';
						setTimeout(function(){
							introduction[k][2].style.display = '';
						},100);
					},'click');
					Core.Events.addEvent(document.body,function(){
						introduction[k][2].style.display = 'none';
					},'click');
				})(i);
			}
		}catch(exp2){}
		
		
		
		var shiftShow = function(list){
			var that = {};
			var current = 0;
			var movingkey = true;
			for(var i = 0, len = list.length; i < len; i += 1){
				(function(k){
					_addEvent(list[k]['title'],function(){
						if(k == current){
							return false;
						}
						App.opacity(list[current]['content'], {
							'first': 100,
							'last': 0,
							'time': 2
						});
						setTimeout(function(){
							list[current]['content'].style.display = 'none';
							current = k;
							list[current]['content'].style.display = '';
							App.opacity(list[current]['content'], {
								'first': 0,
								'last': 100,
								'time': 2
							});
						},200);
						list[k]['title'].className = list[k]['title'].className.replace('selected','');
						list[current]['title'].className += ' selected';
					},'click');
				})(i);
			}
		};
		var listBuffer = [];
		if($E('tag_daily')){
			listBuffer.push({'title' : $E('tag_daily'),'content' : $E('mblog_daily')});
		}
		if($E('tag_total')){
			listBuffer.push({'title' : $E('tag_total'),'content' : $E('mblog_total')});
		}
		if($E('tag_daily_cmt')){
			listBuffer.push({'title' : $E('tag_daily_cmt'),'content' : $E('mblog_daily_cmt')});
		}
		if($E('tag_week_cmt')){
			listBuffer.push({'title' : $E('tag_week_cmt'),'content' : $E('mblog_week_cmt')});
		}
		shiftShow(listBuffer);
		if(App.hotFirstShow){
			Core.Events.fireEvent(listBuffer[App.hotFirstShow]['title'],'click');
		}
		App.followIndex = function(uid,el,url){
			url =  "/attention/aj_addfollow.php";
			function cb(){
				var newDom = document.createElement("SPAN");
				newDom.innerHTML = $CLTMSG['CC1701'];
				Core.Dom.insertAfter(newDom,el);
				Core.Dom.removeNode(el);
			}
			App.followOperation({uid:uid,fromuid:scope.$uid},url,cb);
		}
	}catch(exp){}
});
