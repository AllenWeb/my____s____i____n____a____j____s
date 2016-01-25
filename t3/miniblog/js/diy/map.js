/**
 * @author yuwei
 * @fileoverview 地图上展现微博（如同城微博地图聚合）
 * 微博地图展现流程：
 * 1　后台根据city和keyword 返回经纬度、微博等信息；
 * 2　客户端根据经纬度创建地图；把对应微博定位到地图上（popup展现）。
 * 3　一组处理完毕后定时轮询，循环更新。
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/template.js");
$import("sina/utils/io/ajax.js");
$import('sina/core/events/addEvent.js');
$import("sina/utils/template.js");
$import("jobs/mod_login.js");
$import('diy/timer.js');
$import('diy/animation.js');
(function(proxy){
    var locked = false;
    proxy.map = {};
    /**
     * @param{String}containerID:地图容器的dom ID
     * @param{Object}config:keyword,city,interval,popupCallback,params
     * */
    var Map = proxy.map.Map = function(containerID,config){
        if(!containerID || !($E(containerID))){
            throw new Error("Constructor of App.map.Map has Error!,see: " + arguments.callee.toSource ? arguments.callee.toSource(3) : arguments.callee.toString());
        }
        
        this.containerID = containerID;
        this.keyword = config.keyword;
        this.city = config.city;
        this.zoom = config.zoom || 6;
        this.overviewMap = config.overviewMap;
        
        this.interval = config.interval || 3000;
        this.timer = 0;
        
        this.callback = config.popupCallback;
        this.params = config.params;
        
        this.coordinates();//开始执行
    };
    Map.prototype = {
        /**
         * 获取经纬度
         * */
        coordinates:function(){
            var me = this, xy,x,y,data,len,i = 1;
            this._jsonpRequest(function(result){
                data = result.data[0],len = result.data.length;
                if(! (data && data.coordinate)){
                    return;
                }
                xy = data.coordinate.split(",");
                x = me._toReal(xy[0]),y = me._toReal(xy[1]);
                me.create(x,y,data);
                result.data.shift();
                (function loop(){
                    me.timer = setTimeout(function(){
                        data = result.data[0];
                        if(!(data && data.coordinate)){
                            clearTimeout(me.timer);
                            me.coordinates();
                            return;
                        }
                        xy = data.coordinate.split(",");
                        x = me._toReal(xy[0]),y = me._toReal(xy[1]);
                        
                        //显示popup------------------------------------------------------
                        me.popup(x,y,data);
                        //--------------------------------------------------------------
                        result.data.shift();
                        if(result.data.length > 0){
                            loop();
                        }else{
                            clearTimeout(me.timer);
                            me.coordinates();
                        }
                    },me.interval);
                })();
            });
        },
        /**
         * 根据经纬度创建地图
         * @param{Number}x,经度
         * @param{Number}y,纬度
         * @param{Object}data:微博信息:uid,name,icon,img,content,ctime,url,province,city
         * */
        create:function(x,y,data){
            if(!this.map){
                var mapoption = new MMapOptions();
                mapoption.mapComButton = HIDE;//隐藏“新增商户“
                mapoption.zoom = this.zoom;
                mapoption.center = new MLngLat(x, y);
                mapoption.toolbar = DEFAULT; //设置工具条
                mapoption.toolbarPos = new MPoint(0, 0);
                mapoption.overviewMap = this.overviewMap; //是否显示鹰眼
                mapoption.returnCoordType = COORD_TYPE_OFFSET;
//                var oMap = this.map = new MMap(this.containerID, mapoption);
                var oMap = this.map = new SMap(this.containerID, mapoption);
                var me = this;
                oMap.addEventListener(oMap,MAP_READY,function(){
                    setTimeout(function(){
                        me.popup(x,y,data);//
                    },1000);
                    
                });
            }else{
                this._position($E('popup'),x,y);
            }
        },
        /**
         * 弹出微博信息层
         * @param{Number}x,经度
         * @param{Number}y,纬度
         * @param{Object}data:微博信息:uid,name,icon,img,content,ctime,url,province,city 
         * */
        popup:function(x,y,data){
            var mapNode = $E(this.containerID),oPopup;
            var pixel = this.map.fromLngLatToContainerPixel(new MLngLat(x,y)); 
            if(!$E("popup_container")){
                oContainer = $C("div");
                oContainer.style.cssText = "width:2000px; height:2000px; position:absolute; overflow:hidden;top:0px;left:0px;";
                oContainer.id =  "popup_container";
                oPopup = $C("div");
                oPopup.id = "popup";
                oPopup.className = "layerspa";
                oPopup.style.overflow = "hidden";
                oPopup.style.zIndex = 1000;
                oContainer.appendChild(oPopup);
                mapNode.appendChild(oContainer);
            }else{
                oPopup = $E("popup");
            }
            
            data.gender = (data.gender === "1") ? "男":((data.gender === "2") ? "女" : "");
            data.age = data.age? data.age + "岁" : "";
            oPopup.innerHTML = this._popup().evaluate(data);
            
            var me = this;
            setTimeout(function(){//key point,延时才能定位较准!
                me._position(oPopup,x,y);
            },100);
            
            $E("close_tip").onclick = function(){
                oPopup.style.display = "none";
            };
            
            if(typeof this.callback === "function"){
               this.callback(this.map,oPopup); 
            }
        },
        /**
         * 定位微博弹出层
         * @param{HTMLElement}oPopup
         * @param{x}
         * @param{y}
         * */
        _position:function(oPopup,x,y){
            if(!x||x==0){
                x=116;
            }
    		if(!y||y==0){
    		    y=39;
    		}
    		var opt = new STipOptions();
    		opt.xOffset = oPopup.offsetWidth - 40;//小角到右边宽度
    		opt.rightSpace = oPopup.offsetWidth;//防止popup右侧被遮挡住
    		
            this.map.setDivPosition("popup",x*100000,y*100000,opt);//定位
        },
        /**
         * 处理移动、拖动、缩放等事件
         * @param{Object}oMap
         * */
        _handleEvents:function(oMap){
            oMap.removeEventListener(oMap,MAP_MOVE_END,this._callback);
            oMap.removeEventListener(oMap,DRAG_END,this._callback);
            oMap.removeEventListener(oMap,MAP_MOVE_END,this._callback);
            oMap.removeEventListener(oMap,OVERVIEWMAP_CHANGED,this._callback);
            
            oMap.addEventListener(oMap,MAP_MOVE_END,callback);
            oMap.addEventListener(oMap,DRAG_END,callback);
            oMap.addEventListener(oMap,MAP_MOVE_END,callback);
            oMap.addEventListener(oMap,OVERVIEWMAP_CHANGED,callback);
            
            var me = this;
            var callback = this._callback = function (e){
                
            }
        },
        /**
         * @requires square/square.css
         * */
        _popup:function(){
            if(!this._template){
                var tpl = '<div class="layermc">\
                    <table>\
                        <tr>\
                            <td class="lt"></td><td class="mt"></td><td class="rt"></td>\
                         </tr>\
                         <tr>\
                            <td class="lm"></td><td class="mm">\
                            <div class="grid9cont">\
                              <div class="closeBtn"><a title="关闭" id="close_tip" href="javascript:void(0)"></a></div>\
                              <div class="layera">\
                                  <a href="#{url}" target="_blank" class="img"><img src="#{icon}" /></a>\
                                  <p><a href="#{url}" target="_blank">#{name}</a></p>\
                                  <p>#{gender}&nbsp;&nbsp;&nbsp;#{age}</p>\
                                  <p>#{province}&nbsp;&nbsp;#{city}</p>\
                              </div>\
                              <div class="layerb">\
                                  <a href="http://t.sina.com.cn/#{uid}" target="_blank">#{pic}</a>\
                                  <p class="p_1">#{content}</p>\
                                  <p class="p_2">#{ctime}</p>\
                              </div>\
                              <div class="clear"></div>\
                          </div>\
                            </td><td class="rm"></td>\
                         </tr>\
                         <tr>\
                            <td class="lb"></td><td class="mb"></td><td class="rb"></td>\
                         </tr>\
                      </table>\
                   </div>\
                   <div class="arrowsp"></div>';

                var template = this._template = new Utils.Template(tpl);
                return template;
            }else{
                return this._template;
            }
        },
        /**
         * 经纬度转换
         * */
        _toReal:function(x){
            return (new Number(x)) / 100000;
        },
        /**
         * 跨域请求
         * @param{Object}oParams
         * @param{Function}callback
         * */
        _jsonpRequest:function(callback){
            var script = document.createElement("script");
            script.charset = "UTF-8";
            script.setAttribute("type", "text/javascript");
            var request_id = "jsonp_" + (new Date()).getTime().toString();
            script[document.all ? "onreadystatechange" : "onload"] = function(){
                if (this.onload || this.readyState.toLowerCase() == 'complete' || this.readyState.toLowerCase() == 'loaded') {
                    var result = window[request_id];
                    if (result && result.code && result.code === "A00006") {
                        callback(result);
                    }
                }
            };
            
            if(!this._url){
                var arr = [];
                var oParams = this.params || {};
                oParams.keyword = this.keyword;
                oParams.city = this.city;
                for(var k in oParams){
                    arr.push([k,"=",oParams[k]].join(''));
                }
                var url = this._url = 'http://t.sina.com.cn/pub/aj_getmapmblog.php?' + arr.join("&");
            }
            script.setAttribute("src", [this._url,"&request_id=",request_id].join(""));
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    };
})(App);