$import('diy/timer.js');
$import('diy/animation.js');
$import('diy/opacity.js');
$import('sina/core/dom/domInsert.js');
$import('sina/core/dom/getStyle.js');
(function(proxy){
    proxy.marquee2 = function(pulley, list, cfg){
        var that = {
            hooker: null,
            count:0
        };
        var insorbit = [];
        var hooker = null;
        var current = 0;
        var showing = 0;
        var scroll = 0;
        var parent = pulley;
        var timer;
        
        if (cfg === undefined) {
            cfg = {};
        }
        var speed = cfg.speed || 10;
        var forward = cfg.forward || 'left';
        var orbitk = 2;
        var getinsOrbit = function(distance){
            return proxy.animation.speed(proxy.timer.delay * orbitk, distance, speed);
        };
        
        var finishOne,moveOne,looping ;
        
        pulley.style.overflow = 'hidden';
        var isIns = false;
        if (forward === 'down') {
            scroll = pulley.scrollTop;
            
            //offsetHeight包含padding，必须去掉，不然滑动几次后会渐渐地高度增高
            var offsetPaddingTop = parseInt(Core.Dom.getStyle(list[list.length - 1],"paddingTop"));
            var offsetPaddingBottom = parseInt(Core.Dom.getStyle(list[list.length - 1],"paddingBottom"));
            var offsetHeight = list[list.length - 1].offsetHeight - offsetPaddingTop - offsetPaddingBottom;
            insorbit = getinsOrbit(offsetHeight);
            
            finishOne = function(itemNum){
                that.pause('opacity');
                isIns = false;
                clearTimeout(timer);
                timer = setTimeout(function(){
                    if (!that.hooker || that.hooker == 'pause') {
                        return false;
                    }
                    that.restart();
                }, 3000);
            };
            
            moveOne = function(itemNum){
                var offsetPaddingTop = parseInt(Core.Dom.getStyle(list[list.length - 1 - itemNum],"paddingTop"));
                var offsetPaddingBottom = parseInt(Core.Dom.getStyle(list[list.length - 1 - itemNum],"paddingBottom"));
                var offsetHeight = list[list.length - 1 - itemNum].offsetHeight - offsetPaddingTop - offsetPaddingBottom;
                insorbit = getinsOrbit(offsetHeight);
            };
            
            var IE = '\v' == 'v';
            
            looping = function(step, itemNum){
                if (!isIns) {
                    Core.Dom.domInsert(parent, list[list.length - 1 - itemNum], 'afterBegin');
                }
                isIns = true;
                
                if(IE){// hack for IE(修正内层元素有浮动，外层overflow不管用的bug)
                   list[list.length - 1 - itemNum].style.position = "relative"; 
                }
                list[list.length - 1 - itemNum].style.height = insorbit[step] + 'px';
            };
            
        }
        that.start = function(){
            hooker = proxy.timer.add(function(){
                looping(current, showing);
                current += 1;
                if (current >= insorbit.length) {
                    that.moveEnded = true;//滑动一个item结束
                    if(that.onEnd){//callback
                        that.onEnd();
                    }
                    finishOne(showing);
                    showing += 1;
                    showing %= list.length;
                    moveOne(showing);
                    current = 0;
                    
                    if(that.count === (list.length - 1)){
                        if(that.afterLoop){
                            that.afterLoop();
                        }
                        that.count = 0;
                    }
                    that.count++;
                }else{
                    that.moveEnded = false;//正在滑动一个item
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
            that.hooker = str || 'pause';
        };
        that.restart = function(){
            proxy.timer.play(hooker);
            that.hooker = hooker;
        };
        return that;
    };
})(App);