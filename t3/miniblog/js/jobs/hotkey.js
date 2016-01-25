/**
 * @author peijian@staff.sina.com.cn
 * 热键
 */
$import("sina.core.events.addEvent");
$import("sina.core.events.fireEvent");
$import("sina.core.events.getEventTarget");
$import("sina.core.events.stopEvent");

$registJob('hotkey', (function(){
	/*
		计算显示位置
	*/
	var $w = window, $d = $w["document"], $e = $d["documentElement"]||{};
	var $t = function(){
		if(arguments.length > 0){
			$e.scrollTop = arguments[0];
			$d["body"].scrollTop = arguments[0];
			return;
		}
		return ($w.pageYOffset||Math.max($e.scrollTop, $d["body"].scrollTop));
	};
	var $s = $w["innerHeight"] || ($e && $e["clientHeight"]) ? $e["clientHeight"] : $d["body"]["clientHeight"];
	var $xy = Core.Dom.getXY;
	/**
	 * 获取对象y坐标
	 * @param {Object} el
	 */
	var $y = function(el){
		var et,pn;
		if ('getBoundingClientRect' in el) {
				et = el.getBoundingClientRect().top;
				return et + $t();
		}
		if(!(pn = el.offsetParent)){return 0}
		et = pn.offsetTop;
		while (pn && pn!=$d["body"]) {
			et += pn.offsetTop;
			pn = pn.offsetParent;
		}
		return et||0;
	};
	//获取对象距离浏览器窗口的高度
	var $sl = function(d, t){
		if(t){ //下面距离
			return $s - ($xy(d)[1] - $t());
		}else{//上面距离
			return $xy(d)[1] - $t();
		}
	};
	
	
	
	return function(){
		var list = [];
		if($E("feed_list")){
			list = $E("feed_list").getElementsByTagName("LI");
		}
		//监控j|k方向键，逐条阅读微博
		var _prevAndNext = (function(){
			// 寻找距离顶端最近的一条微博
			var _length = list.length;
			var listindex = -1;
			return function(t, o){
				var _h = $s;
				var _t = $t();
				var _dom;
				if(t){ // 向下
					for(var i = (_length - 1); i >= 0; i = i - 1){
						if($sl(list[i]) <= _h ){
							_dom = i;
							break;
						}
					}
				} else { //向上
					for(var i = 0; i < _length; i = i + 1){
						if($sl(list[i]) > 0 ){
							_dom = i;
							break;
						}
					}
				}
				
				listindex = _dom;
				
				if(t){ //向下
					if(listindex <= _length){
						listindex = listindex + 1;
					}
				}else{ // 向上
					if(listindex >= -1){
						listindex = listindex - 1;
					}
				}
				
				if(listindex > -1 && listindex < _length){ //如果是最后或者最顶一条，则不监控键盘
					setTimeout(function(){
						var _po = 0;
						var _l = $s;
						if(t){// 向下
							if(list[listindex].offsetHeight > _l && o){
								_po = Math.round($t() + _l);
							}else{
								_po = Math.round($t() + (list[listindex].offsetHeight - $sl(list[listindex], 1)));
							}
						}else{// 向上
							if(( - $sl(list[listindex])) > _l && o){
								_po = Math.round($t() - _l);
							}else{
								_po = Math.round($t() - ( - $sl(list[listindex]))) - 15;
							}
						}
						$t(_po);
					}, 10);
				}
				if(listindex === -1){
					$t(0);
				}
				if(listindex === _length){
					$t(_t + 270);
				}
			};			
		})();
		
		//回到顶部
		var _backtop = function(){
			$t(0);
		};
		
		//监控r键，刷新页面
		//在有新微博提示下刷新页面
		var _refresh = function(){
			if($E("feed_msg_new") && $E('feed_msg_new').style.display === ''){
				window.location.reload();
			}
		};
		
		//监控p|f进入发布器
		var _focusPublish = function(){
			if($E('publish_editor')){
				_backtop();
				setTimeout(function(){
					var __edit = $E('publish_editor');
					__edit.focus();
					var __times = 0;
					var __shake = function(){
						if(__times%2 === 1){
							__edit.style.backgroundColor = '#fff';
							__times = __times + 1;
						}else{
							__edit.style.backgroundColor = '#B0FAA9';
							__times = __times + 1;
						}
						if(__times === 6){
							__times = 0;
							return;
						}
						setTimeout(arguments.callee, 100);
					};
					__shake();
				}, 10);
			}
		};
		
		Core.Events.addEvent(document, function(e){
			if(e.ctrlKey || e.metaKey){
				return;
			}
			var _key = e.keyCode;
			var _target = Core.Events.getEventTarget(e);
			if(_target.nodeName.toLowerCase() === 'textarea'
				|| _target.nodeName.toLowerCase() === 'input'){
				return;
			}
			
			switch(_key){
				case 82:
					_refresh();
					break;
				case 80:
					_focusPublish();
					break;
				case 70:
					_focusPublish();
					break;
				case 38:
					_prevAndNext(0, 1);
					break;
				case 75:
					_prevAndNext(0);
					break;
				case 40:
					_prevAndNext(1, 1);
					break;
				case 74:
					_prevAndNext(1);
					break;
				case 84:
					_backtop();
					break;
				default:
					return;
			}
			//浏览器本身的监控废除
			Core.Events.stopEvent();
		},'keydown');
		
		//抛向外部
		App.hotKey = {};
		App.hotKey.backTop = _backtop;
		App.hotKey.focusPublish = _focusPublish;
	}
})());
