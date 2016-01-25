/**
 * @author yuwei
 * @fileoverview 老虎机游戏
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/array/each.js");
$import("diy/liquid.js");

(function(proxy){
    /**
     * 单个老虎机
     * @param{Object}oContainer:老虎机滚动图片的外层容器
     * @param{String}src: 摇奖结果图片的src属性值
     * @param{Object}oManager:可选参数，Instance of SlotMachineManager
     * */
    var SlotMachine = proxy.SlotMachine = function(oContainer,src,oManager){
        this.container = oContainer;
        this.src = src;
        this.manager = oManager;
        this.timer = null;
    };
    SlotMachine.prototype = {
        /**
         * 启动老虎机
         * @param{Number}step
         * @param{Number}interval
         * */
        start: function(step, interval){
            var node = this.container;
            if (!this.timer) {
                this._toggle(true);
                this.timer = setInterval(function(){
                    if (node.scrollTop >= 210) {
                        node.appendChild(node.getElementsByTagName("LI")[0]);//无限循环
                    }
                    else {
                        node.scrollTop += step;
                    }
                }, interval);
            }
        },
        /**
         * 停止老虎机
         * */
        stop: function(){
            var oContainer = this.container,me = this;
            clearTimeout(this.timer);
            this.timer = null;
            oContainer.scrollTop = 0;
            
            this._toggle(false);
            var speed = (this.manager && this.manager.speed) ? this.manager.speed : 100;
            var scale = (this.manager && this.manager.scale) ? this.manager.scale : 2000;
            App.liquid({
                speed: 100,
                scale: 2000,
                src: this.getResultImg().src,
                target: oContainer,
                direction: "bottom",
                callback: function(config){
                    oContainer._wrap = config.wrap;
                    me.callback(me,config);
                    if(me.manager && me.manager.callback){
                        me.manager.callback(me,me.src);
                    }
                }
            });
        },
        /**
         * 停止老虎机后触发回调
         * @param{Object}Instance of SlotMachine
         * @param{Object}config
         * */
        callback:function(oSlotMachine,config){
            
        },
        /**
         * 设置单轮老虎机显示结果
         * */
        getResultImg:function(){
            var List = this.container.getElementsByTagName("IMG"),src = this.src,oImg;
            Core.Array.each(List,function(item,index){
                if(item.src.indexOf(src) !== -1){
                    return oImg = item;
                }
            });
            return oImg;
        },
        /**
         * @private
         * @param
         * */
        _toggle: function(bShow){
            var oContainer = this.container;
            if (oContainer._wrap) {
                oContainer.removeChild(oContainer._wrap);
                oContainer._wrap = null;
            }
            var display = bShow ? "" : "none";
            var List = oContainer.getElementsByTagName("LI");
            for (var i = 0,len=List.length; i < len; i++) {
                List[i].style.display = display;
            }
        }
    };
    
    //\\---------------------------------------------------------------------\\//
    
    /**
     * 老虎机管理者（管理所有老虎机）
     * @param{Number}timeout
     * @param{Number}speed
     * @param{Number}scale
     * @param{Number}step
     * @param{Number}interval
     * */
    var SlotMachineManager = proxy.SlotMachineManager = function(timeout,speed,scale,step,interval){
        this.timeout = typeof timeout === "number" ?  timeout : 200;
        this.speed = typeof speed === "number" ?  speed : 100;
        this.scale = typeof scale === "number" ?  scale : 2000;
        this.step = typeof step === "number" ?  step : 70;
        this.interval = typeof interval === "number" ?  interval : 5;
        
        this.winTarget = "";
        this.list = [];
        this.chained = false;
    };
    SlotMachineManager.prototype = {
         /**
         * 注册一个或者多个被管理的老虎机
         * @param{Object　or　Array}
         * */
        register:function(){
            if(arguments[0].push){
                this.list = arguments[0];
            }else{
                this.list.push(arguments[0]);
            }
            
            return this;
        },
        /**
         * 连锁所有老虎机,便于后续依次停止
         * */
        chain:function(){
            var List = this.list,len = List.length,timeout = this.timeout;
            Core.Array.each(List,function(item,index){
                item.callback = function(){
                    (function(index){
                        if(index + 1 < len){
                            setTimeout(function(){
                                List[index + 1].stop();
                            },timeout);
                        }
                    })(index);
                    
                };
            });
            
            this.chained = true;
            
            return this;
        },
        /**
         * 启动所有老虎机
         * @param{Boolean}bDestine:赢不赢，已注定，愿赌服输。
         * @param{String}winTarget:注定要赢的目标物品图片的src属性值
         * */
        start:function(bDestine,winTarget){
            this.destine = bDestine;
            this.winTarget = winTarget;
            var step = this.step,interval = this.interval;
            Core.Array.each(this.list,function(item,index){
                item.start(step,interval);
            });
        },
         /**
         * 停止所有老虎机(如果连锁了则依次停止；否则同时停止所有老虎机)
         * */
        stop:function(){
            var List = this.list;
            if(this.chained){
                List[0].stop();
            }else{
                Core.Array.each(List,function(item,index){
                    item.stop();
                });
            }
        },
        /**
         * 中奖啦！回调
         * */
        win:function(){
            
        },
        /**
         * 没有中奖
         * */
        lost:function(){
            
        },
        /**
         * @private
         * @param{Object}oSlotMachine
         * @param{String}src
         * */
        callback:function(oSlotMachine,src){
            this.executed = this.executed||[];
            this.executed.push(src);
            if(this.executed.length === this.list.length){
                if(this.destine){
                    this.win(this.winTarget);
                }else{
                    this.lost();
                }
                this.executed = [];
            }
        }
    };
    
})(App);