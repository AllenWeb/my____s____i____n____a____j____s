$import('diy/timer.js');
$import('diy/animation.js');
$import('diy/opacity.js');
$import('sina/core/dom/domInsert.js');
$import('sina/core/dom/previous.js');
$import('sina/core/dom/getStyle.js');
$import('sina/core/dom/setStyle.js');
$import('sina/core/dom/setStyle2.js');
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/pageSize.js");
(function(proxy){
    proxy.insmarquee = function(pulley, list, cfg){
        var that = {
            hooker: null,
            list: list,
            sttimeout: cfg['sttimeout']
        };
        var insorbit = [];
        var hooker = null;
        var current = 0;
        var showing = 0;
        var scroll = 0;
        var parent = that.list[0].parentNode;
        var st;
        var ele;
        if (cfg === undefined) {
            cfg = {};
        }
        var speed = cfg.speed || 5;
        var forward = cfg.forward || 'left';
        var orbitk = 2
        var getinsOrbit = function(distance){
            return proxy.animation.speed(proxy.timer.delay * orbitk, distance, speed);
        };
        var finishOne = function(){
        };
        var moveOne = function(){
        };
        var looping = function(){
        };
        pulley.style.overflow = 'hidden';
        var isIns = false;
        //对方向的懒加载
        if (forward === 'up') {
            scroll = pulley.scrollTop;
            insorbit = getinsOrbit(that.list[0].offsetHeight);
            finishOne = function(itemNum){
                //scroll = 0;
                //pulley.scrollTop = 0;
                parent.removeChild(that.list[itemNum]);
                parent.appendChild(that.list[itemNum]);
            };
            
            moveOne = function(itemNum){
                insorbit = getinsOrbit(that.list[itemNum].offsetHeight);
            };
            
            looping = function(step){
                pulley.scrollTop = scroll + insorbit[step];
            };
            
        }
        else 
            if (forward === 'down') {
                scroll = pulley.scrollTop;
                insorbit = getinsOrbit(that.list[that.list.length - 1].offsetHeight);
                //把最后一个搞掉
                finishOne = function(itemNum){
                    that.pause('opacity');
                    isIns = false
                    that.list[that.list.length - 1 - itemNum].style.backgroundColor = '#fff';
                    proxy.opacity(that.list[that.list.length - 1 - itemNum], {
                        first: 0,
                        last: 100,
                        time: Math.ceil(that.list[that.list.length - 1 - itemNum].offsetHeight / speed / 4)
                    }, function(){
                        clearTimeout(st)
                        st = setTimeout(function(){
                            if (!that.hooker || that.hooker == 'parse') {
                                return false;
                            }
                            that.restart();
                        }, that.sttimeout || 3000)
                    });
                };
                
                moveOne = function(itemNum){
                    insorbit = getinsOrbit(that.list[that.list.length - 1 - itemNum].offsetHeight);
                };
                
                looping = function(step, itemNum){
                    if (!isIns) {
                        parent.removeChild(that.list[that.list.length - 1 - itemNum]);
                        proxy.setOpacity(that.list[that.list.length - 1 - itemNum], '0')
                        that.list[that.list.length - 1 - itemNum].style.height = '0px';
                        that.list[that.list.length - 1 - itemNum].style.overflow = 'hidden'
                        Core.Dom.domInsert(parent, that.list[that.list.length - 1 - itemNum], 'afterBegin');
                    }
                    isIns = true
                    that.list[that.list.length - 1 - itemNum].style.height = insorbit[step] + 'px'
                };
            }
            else 
                if (forward === 'right') {
                /*something to up*/
                }
                else 
                    if (forward === 'left') {
                        scroll = pulley.scrollLeft;
                        insorbit = getinsOrbit(that.list[0].offsetWidth);
                        finishOne = function(itemNum){
                            //scroll = 0;
                            //pulley.scrollLeft = 0;
                            parent.removeChild(that.list[itemNum]);
                            parent.appendChild(that.list[itemNum]);
                            
                        };
                        moveOne = function(itemNum){
                            insorbit = getinsOrbit(that.list[itemNum].offsetWidth - parseInt(Core.Dom.getStyle(that.list[that.list.length - 1], 'paddingTop')));
                        };
                        looping = function(step){
                        //pulley.scrollLeft = scroll + insorbit[step];
                        };
                    }
                    else 
                        if (forward == 'insertDown') {
                            /*
             * 此种情况为不是循环数据，而是每一次都是新的数据从上往下插插插,需要外面插一个父级容器UL
             *
             */
			                 pulley.style.overflow = 'visible';
                            ele = that.list.shift();
                            insorbit = getinsOrbit(ele.offsetHeight);
                            //把最后一个搞掉
                            finishOne = function(itemNum){
                                that.pause('opacity');
                                isIns = false;
								if (ele&&ele.style) {
									ele.style.height = "auto";
									ele.style.backgroundColor = '#fff';
									proxy.opacity(ele, {
										first: 0,
										last: 100,
										time: 1
									}, function(){
										clearTimeout(st);
										st = setTimeout(function(){
											if (typeof that.afterRoll === 'function') {
												that.afterRoll();
											}
											that.rollDone = true;
											if (that.list.length == 0 || !that.hooker || that.liveStop == true || that.hooker == 'pause') {
												return false;
											}
											that.restart();
											ele = that.list.shift();
										}, that.sttimeout || 2500)
									});
								}
                            };
                            
                            moveOne = function(itemNum){
                                if (typeof cfg['afterIns'] === 'function') {
                                    cfg['afterIns'](ele);
                                }
                            };
                            
                            looping = function(step, itemNum){
                                if (!isIns) {
                                    if (!ele) {
                                        return false;
                                    }
                                    insorbit = getinsOrbit(ele.offsetHeight);
//									ele.parentNode.removeChild(ele);
                                     proxy.setOpacity(ele, '0')
                                    ele.style.height = '0px';
                                    ele.style.overflow = 'hidden'
                                    Core.Dom.domInsert(pulley, ele, 'afterBegin',function(){that.rollDone = false;});
                                }
                                isIns = true
                                ele.style.height = insorbit[step] + 'px'
                            };
                        }
        
        that.start = function(){
            hooker = proxy.timer.add(function(){
                looping(current, showing);
                current += 1;
                if (current >= insorbit.length) {
                    finishOne(showing);
                    showing += 1;
                    showing %= that.list.length;
                    moveOne(showing);
                    current = 0;
                }
            });
            that.hooker = hooker;
        };
        that.stop = function(){
            proxy.timer.remove(hooker);
            that.hooker = null;
        };
        that.pause = function(str){
            proxy.timer.pause(hooker);
            that.hooker = str || 'parse';
        };
        that.restart = function(){
            proxy.timer.play(hooker);
            that.hooker = hooker;
        };
        that.setList = function(arr, act){
            if (act === "reset" || that.list.length == 0) {
                that.list = [];
                for (var k = 0; k < arr.length; k++) {
                    that.list.push(arr[k]);
                }
                clearTimeout(st)
                //已完成
                ele = that.list.shift();
				that.setLivePlay();
            }
            else {
                //                for (var k = 0; k < arr.length; k++) {
                //                    that.list.push(arr[k]);
                //                }
                that.list = that.list.concat(arr);
            }
        };
        that.getList = function(){
            return that.list;
        };
        that.setLiveStop = function(fun){
            that.liveStop = true;
            if (typeof fun == 'function') {
                fun();
            }
        };
        that.getLiveStop = function(){
            return that.liveStop;
        };
        that.setLivePlay = function(){
            proxy.timer.play(hooker);
            that.hooker = hooker;
            that.liveStop = false;
        };
        
        
        
        return that;
    };
})(App);
