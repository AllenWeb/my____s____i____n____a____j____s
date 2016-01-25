$import('diy/timer.js');
$import('diy/animation.js');
(function(proxy){
    proxy.marquee = function(pulley, list, cfg){
        var that = {};
        var orbit = [];
        var hook = null;
        var current = 0;
        var showing = 0;
        var scroll = 0;
        var parent = list[0].parentNode;
        var margin = cfg['margin'] || 8;
        if (cfg === undefined) {
            cfg = {};
        }
        var speed = cfg.speed || 5;
        var forward = cfg.forward || 'left';
        var getOrbit = function(distance){
            return proxy.animation.speed(proxy.timer.delay, distance, speed);
        };
        var finishOne = function(){
        };
        var moveOne = function(){
        };
        var looping = function(){
        };
        pulley.style.overflow = 'hidden';
        //对方向的懒加载
        if (forward === 'up') {
            scroll = pulley.scrollTop;
            orbit = getOrbit(list[0].offsetHeight);
            finishOne = function(itemNum){
                //scroll = 0;
                //pulley.scrollTop = 0;
                parent.removeChild(list[itemNum]);
                parent.appendChild(list[itemNum]);
            };
            
            moveOne = function(itemNum){
                orbit = getOrbit(list[itemNum].offsetHeight);
            };
            
            looping = function(step){
                pulley.scrollTop = scroll + orbit[step];
            };
            
        }
        else 
            if (forward === 'down') {
            /*something to down*/
            }
            else 
                if (forward === 'right') {
                /*something to up*/
                }
                else {
                    scroll = pulley.scrollLeft;
                    orbit = getOrbit(list[0].offsetWidth + margin);
                    finishOne = function(itemNum){
                        //				scroll = 0;
                        //				pulley.scrollLeft = 0;
                        parent.removeChild(list[itemNum]);
                        parent.appendChild(list[itemNum]);
                    };
                    moveOne = function(itemNum){
                        orbit = getOrbit(list[itemNum].offsetWidth + margin);                        
                    };
                    looping = function(step){
                        pulley.scrollLeft = scroll + orbit[step];
                    };
                }
        
        that.start = function(){
            hook = proxy.timer.add(function(){
                if (current >= orbit.length) {
                    finishOne(showing);
                    showing += 1;
					showing %= list.length;
                    moveOne(showing);
                    current = 0;
                }
                looping(current);
                current += 1;
            });
        };
        that.stop = function(){
            proxy.timer.remove(hook);
        };
        that.pause = function(){
            proxy.timer.pause(hook);
        };
        that.restart = function(){
            proxy.timer.play(hook);
        };
        return that;
    };
})(App);
