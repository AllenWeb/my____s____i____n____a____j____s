/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/stopEvent.js');
$import('sina/core/events/fireEvent.js');
$import('sina/core/array/foreach.js');
$import('sina/core/array/isArray.js');
$import('sina/core/array/findit.js');
$import('sina/core/string/trim.js');
$import('sina/core/dom/getElementsByAttr.js');
$import('sina/core/dom/setStyle2.js');
$import('sina/core/dom/getTop.js');
//$import("sina/utils/sinput/sinput.js");
$import("diy/enter.js");
$import("diy/htmltojson.js");
$import("diy/insMarquee.js");
$import('diy/publisher2.js');
$import('diy/FormatViewTime.js');
$import('diy/splitLoader.js');
(function(proxy){
	/*
	 * spec{
	 *     start_btn : 启动按钮
	 * }
	 */
    proxy.live = function(spec){
        var that = {};
        var _addEvent = Core.Events.addEvent;
        var _trim = Core.String.trim;
        var _each = Core.Array.foreach;
        var _isArray = Core.Array.isArray;
        var _hoop = null;
        var _delay = 30000;//30s request once
        var parentUL = null;
        var index = 'lastindex';
		var _spec = spec||{}
		var _launch = false;
		var _reload = null;
		var oFrag;
		var _ctn_hoop;
		var marqueeBox = $E('feed_list');
		var ie6 = false;
		var st_pos = null;
		(function(){
        var ua = navigator.userAgent, r = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(ua);
        if (r && (r = parseFloat(RegExp.$1)) && r <= 6) {
            ie6 = true;
        };
        })();
	    var launch = function(){
	        if (!_launch) {
	            that.start();
	        }
	        else {
	            that.stop();
	        }
	        _launch = !_launch;
	    };

        var _INITCONTAINER = function(){
            if (!$E('ULCONTAINER')) {
                parentUL = document.createElement('UL');
				document.body.appendChild(parentUL);
                parentUL.id = 'ULCONTAINER';
                parentUL.className='MIB_feed';
				if(ie6){
					Core.Dom.setStyle2(parentUL, {
                    'display': "block",
                    'position': 'absolute',
                    'visibility': "hidden"
                    });
					var _scroll = Core.System.getScrollPos();
		            parentUL.style.top = "0px";
		            parentUL.style.right = "10px";
				}else{
					Core.Dom.setStyle2(parentUL, {
                    'display': "block",
                    'position': 'fixed',
                    'visibility': "hidden",
//					'left': '50%',
                    'top': '0%'
                    });
				}
            }
        };

        var _SETVALUECONTAINER = function(html){			
           
			//if(that.marquee&&that.marquee.liveStop===true){
            //     parentUL.innerHTML = '';
            //}
            parentUL.innerHTML = html;
//			try {
//                if(parentUL){
//                    parentUL.removeAttribute('cacheid');
//                }
//            App.bindMedia(parentUL);
//            }catch(e){};
        };
		var _refreshTime = function(){
            try {
				if(marqueeBox){
                    marqueeBox.removeAttribute('cacheid');
                }
				var _els = App.getElementsByAttribute(marqueeBox,'strong','date');
				var num = 0;
				for (var i = 0, len = _els.length; i < len; i++) {
					num = _els[i].getAttribute('date')*1;
					num && (_els[i].innerHTML = App.FormatViewTime(num));
				}
            }catch(e){};
		}
        var playLive = function(param){
            //data是一段HTML
//			_reload = setTimeout(function(){location.reload(true)},60000*15);
            var succ = function(html,count){
                var lis = [];
                _SETVALUECONTAINER(html);
                var l = parentUL.getElementsByTagName('LI');
//                var i = Core.Dom.getElementsByAttr(parentUL, index, 'true')[0] || null;
//				var pos = Core.Array.findit(l, i);
				for (var len = l.length ,j = len - 1 ; j >= 0; j--) {
                    lis.push(l[j]);
//                    if (j == len - 1) {
//						if(i){
//                            i.removeAttribute(index);
//						}
//                        lis[lis.length - 1].setAttribute(index, true);
//                    }
                }
                //_feedBox.parentNode.removeChild(_feedBox);
                if (!that.marquee) {
                    that.marquee = proxy.insmarquee(marqueeBox, lis, {
                        forward: "insertDown",
                        speed: 30,
						afterIns : function(ele){
							try {
								var rm = marqueeBox.getElementsByTagName('LI');
								if (rm.length >= (_spec['MAXFEEDCOUNT'] ? _spec['MAXFEEDCOUNT'] : 50)) {
//									rm[rm.length - 1].innerHTML = '';
									marqueeBox.removeChild(rm[rm.length - 1]);
									if(param&&param['afterIns']){
										param['afterIns'](param);
									}
//									if (ie6) {
                                        //操，被逼的！！！IE6
//                                        var pub_top = Core.Dom.getTop($E('publisher_bottom'));
//                                        var bot_top = Core.Dom.getTop($E('bottomborder'));
//	                                    if (pub_top&&bot_top&&pub_top >= bot_top) {
//                                        window.scrollBy(0, (pub_top - bot_top)*-1)
//                                      }
//                                    }
								}
//								App.bindMedia(ele);
							}catch(e){
							}
						}
                    });
					that.marquee.__count = count;
					that.marquee.afterRoll = function(){
						if (that.marquee.liveStop === true) {
							_spec['live_stop']();
							clearTimeout(_hoop);
//                            clearTimeout(_reload);
						}else{
							if(that.marquee.list.length==0){
								if(that.marquee.__count>=5){
	                                playLive(param);
									return false;
								}else{
						             /*
					                 * 
					                 * 少于5条10s以后再请求
					                 * 
					                 * */
				                    clearTimeout(_hoop);
				                        _hoop = setTimeout(function(){
				                            playLive(param);
				                    }, 10000);
								}
							}	
						}
					}
//					Core.Events.addEvent(marqueeBox, function(){
//			            that.marquee.pause()
//			        }, 'mouseover');
//			        Core.Events.addEvent(marqueeBox, function(){
//			            that.marquee.restart()
//			        }, 'mouseout');
                    that.marquee.start();
                }
                else {
					that.marquee.__count = count;
					//被人为停掉了，需要重启,所有数据清除
					if (that.marquee.liveStop === true && that.marquee.rollDone == true) {
						that.marquee.setLivePlay();
						that.marquee.setList(lis, 'reset');
					}else{
						if (that.marquee.list == 0) {
							that.marquee.setList(lis, 'reset');
						}
						else {
							that.marquee.setList(lis);
						}
					}
                }
//				if(that.marquee.__count<5){
//                    clearTimeout(_hoop);
//                        _hoop = setTimeout(function(){
//                            playLive();
//                    }, _delay);
//                }
            };
            var error = function(json){
				if ((that.marquee&&that.marquee.getLiveStop() === true)||json.code==='M18001') {
                        _spec['live_stop']();
						clearTimeout(_hoop);
//                        clearTimeout(_reload);
                }else{
					_hoop = setTimeout(function(){
                            playLive(param);
                    }, _delay);
				}
            }
			Utils.Io.Ajax.request('/person/aj_live.php?uid='+scope.$uid, {
            'POST': {timer:_spec['eleTimer']||'',search:scope.$key},
            'onComplete': function(json){
				_refreshTime();
                if (json.code == 'A00006') {
					if (!json.data.html || json.data.html === '') {
						//					   	if (that.marquee&&that.marquee.getLiveStop() === true) {
						//			                _spec['live_stop']();
						//							clearTimeout(_hoop);
						//                            clearTimeout(_reload);
						//			                return false;
						//			            }
						//	                    if(json.data.html ===''){
						clearTimeout(_hoop);
						_hoop = setTimeout(function(){
							playLive(param);
						}, _delay);
						//	                    }
						return false;
					}
					succ(json.data.html, json.data.count);
					_spec['eleTimer'] = json.data.timer;
					if (_spec['count'] && json.data.count) {
						_spec['count'].innerHTML = (parseInt(_spec['count'].innerHTML) + parseInt(json.data.count));
					}
				}
				else {
					error(json);
				}
            },
            'onException': function(){
                error({code:'M18001'});
            },
            'returnType': 'json'
            });
			
//            proxy.doRequest({timer:that.eleTimer||'',search:scope.$key}, '/person/aj_live.php', function(json, result){
//				
//            }, error);
        }
        that.start = function(){
			try {
				clearTimeout(_hoop);
				if (that.marquee && that.marquee.rollDone == false && _spec['live_checkwait']()) {
					return false;
				}
				_INITCONTAINER();
				_spec['live_start']();
				playLive(spec);
//				_hoop = setTimeout(function(){
//					playLive();
//				}, _delay);
                /*
                 * 15分钟刷新一次页面，防止死掉！
                 */
			}catch(e){
//				launch();
                location.reload(true);
			}
        };
        that.stop = function(){
			clearInterval(_ctn_hoop);
			if (that.marquee) {
				that.marquee.setLiveStop(function(){
					if (_spec['live_div']) {
						if (that.marquee.rollDone == false) {
							_spec['live_wait']();
						}else{
							_spec['live_stop']();
	                        clearTimeout(_hoop);
//	                        clearTimeout(_reload);
						}
					}
				});
			}else{
				if (_spec['live_div']) {
                        _spec['live_stop']();
						clearTimeout(_hoop);
//                        clearTimeout(_reload);
                }
			}

        };
		

		/*
		 * spec{
		 *      style:absolute//默认absolute
		 *      XY:[X,Y]
		 *      
		 * }
		 */
		that.setposition = function(ele,spec){
			spec['position'] = spec['position']||'absolute';
			ele.style.position = spec['position'];
			ele.style.zIndex = 1000;
			if (spec['position'] == 'absolute') {
				clearInterval(st_pos);
				st_pos = setInterval(function(){
					var _p = Core.System.pageSize();
					var _s = Core.System.getScrollPos();
					ele.style.top = spec['XY'] ? (_s[0] + parseInt(spec['XY'][0])) + 'px' : (_s[0] + _p[3] / 2) + "px";
					ele.style.left = spec['XY'] ? parseInt(spec['XY'][1])+ 'px' : (_p[2]*spec['perct'])+"px";
				}, 100);
				ele.style.display='';
			}
		};
		that.clearposition = function(){
			clearInterval(st_pos);
		}
		that.setStyle = function(ele,spec){
			Core.Dom.setStyle2(ele, spec) ;
		};
		for(var i = 0;i<_spec['live_btn'].length;i++){
		  _addEvent(_spec['live_btn'][i], launch, 'click');	
		}
        return that;
    }
})(App);
