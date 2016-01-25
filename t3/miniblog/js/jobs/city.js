/**
 * @fileoverview 同城微博
 * @
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("diy/dialog.js");
$import("diy/date.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/array/each.js");
$import("diy/check.js");
$import("diy/marquee2.js");
$import("diy/sbc2dbc.js");

$registJob("city", function(){
    var _addEvent = Core.Events.addEvent;
    
    //切换城市-------------------------------------------------------------------------------------
    (function(){
        var area;
        if(area = $E('changearea')){
            scope.areaname = [], oBox = false;
            _addEvent(area,function(){
                if(!oBox){
                   App.request('/aj_citylist',{},function(json){
                        oBox = showCityList(area,json.data);
                    },"GET"); 
                }else{
                    oBox.style.display = oBox.style.display === 'none' ? "" : "none";
                }
            },'click');
            
            function showCityList(el,list){
                var oBox = $C("DIV");
                oBox.className = 'arealayer'; 
                var content = '<ul class="areaName">';
                for(var i = 0,len = list.length; i < len; i++){
                    if(list[i].link){
                        content += '<li><a href="' + 'http://' + list[i].link + location.pathname + '" >' + list[i].name + '</a></li>';
                    }else{
                        content += '<li><a href="javascript:void(0);" onclick = "javascript:{window.location.replace(\'/pub/city?p=' + list[i]['p'] + '&c=' + list[i]['c']+'\');};">'+list[i].name+'</a></li>';
                    }
                }
                content += '</ul>';
                oBox.innerHTML = content;
                document.body.appendChild(oBox);
                
                var xy = Core.Dom.getXY(el);
                oBox.style.cssText = 'position:absolute;top:'+ (xy[1]+parseInt(el.offsetHeight)) + 'px;left:' + xy[0] +'px;';
                
                Core.Events.addEvent(document.body, function(e){
                    var t = e.srcElement || e.target;
                    if (t != el && !Core.Dom.contains(oBox, t)) {
                        oBox.style.display = "none";
                    }
                }, "click");
        
                return oBox;
            }
        }
    })();
    
    
    //滚筒动画----------------------------------------------------------------------------------------
    (function pully(){
        var shell
        if(shell = $E("pully_list")){
            shell.style.width = '2000px';
            var box = shell.parentNode;
            var items = shell.getElementsByTagName('dd');
            if(items.length>0){
                App.pulley($E('turn_left'), $E('turn_right'), box, items, shell, 1, 440); 
            }
            
        }
    })();
    
    //日期--------------------------------------------------------------------------------------------
    (function(){
        var dateBtn;
        if(dateBtn = $E('datebtn')){
            var newDate = new Date();
            dateBtn.innerHTML = scope.$selectData?scope.$selectData:[newDate.getFullYear(), newDate.getMonth()+1, newDate.getDate()].join("-");
            var created = false;
            _addEvent(dateBtn,function(){
                if(!created){
                    created = true;
                    var box = $C('DIV'), dateBox = $C('DIV');
                    box.className = "pc_caldr";
                    box.style.cssText = 'z-index:999;position:absolute;display:none';
                    var pos = Core.Dom.getXY(dateBtn);
                    box.style.left = pos[0] + 'px';
                    box.style.top = pos[1] + 20 + 'px';
                    box.appendChild(dateBox);
                    document.body.appendChild(box);
                    
                    if(scope.$selectData){
                        var ymd = scope.$selectData.split("-");
                    }
                    
                    var date = new domkey.Date(dateBox, function(y,m,d){
                        var loc = window.location;
                        var href = loc.protocol + "//" +  loc.host + loc.pathname + "?date=" + [y,parseFloat(m)+1,d].join("-"); ;
                        loc.href = href ;
                    }, 
                     ymd ? ymd[0]: newDate.getFullYear(), //年
                     ymd ? parseFloat(ymd[1]) - 1 : newDate.getMonth(), //月
                     newDate, //点击范围开始
                     365*10,//点击范围长度［天］
                     (ymd?ymd[2]:newDate.getDate()) //选中的日期
                    );
                    scope.$selectData
                    
                    box.style.display = '';
                    dateBtn._box = box;
                    _addEvent(document.body, function(e){
                        var t = e.srcElement || e.target;
                        if (t != dateBtn && !Core.Dom.contains(box, t)) {
                            box.style.display = "none";
                    }
                }, 'click', false);
                }else{
                    dateBtn._box.style.display = dateBtn._box.style.display === "none"?"":"none";
                }
            },'click');
        }
    })();
    
    
    //切换‘热门’和‘最新’tab页-------------------------------------------------------------------
    (function(){
        var oHotTab;
        if(oHotTab = $E('hot_tab')){
            var oLatestTab = $E('latest_tab');
            _addEvent(oHotTab,function(){
                $E('hot_content').style.display = "";
                $E('latest_content').style.display = "none";
                
                oHotTab.className = 'PY_tago';
                oLatestTab.className = 'PY_tagn';
            },'mouseover');
            _addEvent(oLatestTab,function(){
                $E('hot_content').style.display = "none";
                $E('latest_content').style.display = "";
                
                oHotTab.className = 'PY_tagn';
                oLatestTab.className = 'PY_tago';
            },'mouseover');
        }
    })();
    
    
    //城市地区搜索--------------------------------------------------------------------------------------
    (function(){
        var oProvince;
        if(oProvince = $E('province')){
            var oCity = $E('city');
            new App.ProvinceAndCity(oProvince, oCity, (oProvince.getAttribute('truevalue') || oProvince.value), (oCity.getAttribute('truevalue') || oCity.value));
        }
    })();
    
    
    
    //切换型男美女、更多
    (function(){
        var beauty_girls,beauty_boys;
        if((beauty_girls = $E('beauty_girls')) && (beauty_boys = $E('beauty_boys'))){
            var beauty_total = $E('beauty_total'),container = $E("beauty_container");
            
            var map = {
                'beauty_girls':beauty_girls.parentNode.parentNode,
                'beauty_boys':beauty_boys.parentNode.parentNode,
                'beauty_total':$E('beauty_total').parentNode.parentNode
            };
            
            function current(id,map,html){
                for(var k in map){
                    map[k].className = "PY_tagn";
                }
                map[id].className = "PY_tago";
                if(container){
                    container.innerHTML = html;
                }
            }
            
            _addEvent(beauty_total,function(){
                App.request('/aj_getboysgirls.php',{},function(json){
                    current('beauty_total',map,json.data);
                },"GET"); 
            },'mouseover');
            
            _addEvent(beauty_girls,function(){
                App.request('/aj_getboysgirls.php',{
                    'gender':2
                },function(json){
                    current('beauty_girls',map,json.data);
                },"GET"); 
            },'mouseover');
            
            _addEvent(beauty_boys,function(){
                 App.request('/aj_getboysgirls.php',{
                    'gender':1
                },function(json){
                   current('beauty_boys',map,json.data);
                },"GET"); 
            },'mouseover');
        }
    })();
    
    (function(){//滚动显示feed列表
        function slideDown(marqueeBox){
            var list = marqueeBox.getElementsByTagName("li");
            var items = [];
            for (var i = 0, len = list.length; i < len; i++) {
                items.push(list[i]);
                (function(li){
                    li.onclick = function(){
                        //点击缩略图时去掉高度限制,不然图片可能显示不全
                        li.style.cssText = "";
                    };
                })(list[i]);
            }
            try{
                var marquee = new App.marquee2(marqueeBox, items, {
                    forward: "down",
                    speed: 20
                });
                Core.Events.addEvent(marqueeBox, function(){
                    marquee.pause();
                }, 'mouseover');
                Core.Events.addEvent(marqueeBox, function(){
                    marquee.restart();
                }, 'mouseout');
                marquee.start();
            }catch(e){
                
            }
        }
        
        var marqueeBox;
        if(marqueeBox = $E("feed_list")){
            slideDown(marqueeBox);
        }
    })();
    
    //自荐
    (function(){
        var oRecommend;
        if(oRecommend = $E('beauty_recommend')){
            _addEvent(oRecommend,function(){
                App.request("/beauty_recommend.php", {}, function(result){
                    if(result.msg === 'succ'){
                        submitMobile(result.mobile);
                    }
                    if(result.msg === 'fail'){//不合格提示层
                        var html = '\
                            <div class="titbold">抱歉，请满足以下条件再来自荐吧！</div>\
                            <div class="contxt">\
                                <p>1.已上传头像</p>\
                                <p>2.粉丝数&gt;100</p>\
                                <p>3.发微博数&gt;30</p>\
                            </div>\
                            <div class="btn3">\
                                <a class="btn_normal" id="close_failed_tip" href="javascript:void(0);"><em>确定</em></a>\
                            </div>\
                        ';
                        
                        var dialog = new App.Dialog.BasicDialog('提示',html,{
                            zIndex:1000
                        });
                        dialog.show();
                        
                        var oClose = $E('close_failed_tip');
                        var pNode = oClose.parentNode.parentNode;
                        pNode.className = "layerBoxCon zjlayer2";
                        pNode.style.cssText = "";
                        
                        _addEvent(oClose,function(){
                            dialog.close(); 
                        },'click');
                    }
                }, "GET");
            },'click');
            
            //自荐--提交电话
            function submitMobile(mobile){
                var html = '<div class="titbold">留下你的电话，方便我们审核的时候联系你：）</div>\
                <div class="inputtype">电话：<input type="text" id="beauty_girl_phone" ></div>\
                <div class="inputerror">\
                    <table class="cudTs3" id="phone_input_tip" style="display:none">\
                        <tbody>\
                            <tr><td class="topL"></td><td></td><td class="topR"></td></tr>\
                            <tr> <td></td><td class="tdCon"  style="width:175px;">请输入正确的电话号码</td><td></td></tr>\
                            <tr><td class="botL"></td><td></td><td class="botR"></td></tr>\
                        </tbody>\
                    </table>\
                </div>\
                <div class="MIB_btn">\
                    <a class="btn_normal" id="submit_phone_tip" href="javascript:void(0);"><em>确定</em></a>\
                    <a class="btn_notclick" id="close_phone_tip" href="javascript:void(0);"><em>取消</em></a>\
                </div>';
                
                var dialog = new App.Dialog.BasicDialog('提示',html,{
                    zIndex:1000
                });
                dialog.show();
                
                var oClose = $E('close_phone_tip');
                var pNode = oClose.parentNode.parentNode;
                pNode.className = "layerBoxCon zjlayer";
                pNode.style.cssText = "";
                
                oClose.onclick = function(){
                   dialog.close(); 
                };
                
                var oInput = $E('beauty_girl_phone');
                if(mobile){
                    oInput.value = mobile;
                }
                
                var oTip = $E("phone_input_tip"),oSubmit = $E('submit_phone_tip'),value;
                function check(){
                    value = App.sbc2dbcCase(Core.String.trim(oInput.value));
                    if(value && value.length<=12 && /\d{7,12}/.test(new Number(value))){//7~12位数字
                        oTip.style.display = "none";
                        return value;
                    }else{
                        oTip.style.display = "";
                        oInput.focus();
                        return false;
                    }
                }
                _addEvent(oSubmit,function(){
                    if(value = check()){
                        dialog.close(); 
                        App.request("/add_beautyrec.php", {
                            'mobile':value
                        }, function(result){
                            var oAlert = App.alert($SYSMSG[result.code], {
                                icon: 3
                            });
                            
                            setTimeout(function(){
                                if(!oAlert._distory){
            						oAlert.close();
            					}
                            },2000);
                        }, "POST");
                    }
                },'click');
                oInput.onblur = function(){
                    setTimeout(check,200);//延时，不然oSubmit的click事件第一次居然不触发
                };
            };
    
        }
    })();
});


//重载搜索-------------------------------------------------------------------------------------
$registJob("initSearch2", function(){
    Core.Events.addEvent($E('m_keyword'),App.focusblur,'blur');
    Core.Events.addEvent($E('m_keyword'),App.focusblur,'focus');
    App.search("m_keyword", "m_submit", "m_search", 30, $CLTMSG['CD0001']);
});
/**
 * @param {Object} options
 * maxlen 输入框的长度，默认为30
 * input  输入框
 * form   搜索框form
 */
App.search = function(input, subbtn, form, maxlen, txt, cindex){
    var maxlen = maxlen || 30;
    var textnode = $E(input);
    var subbtn = $E(subbtn);
    var form = $E(form);
    Utils.Sinput.limitMaxLen(textnode, maxlen);
    var auto = new App.autoSelect({
        input: textnode,
        id: textnode.id + "_tip_",
        subbtn: subbtn
    });
    var urls = {
        0: "http://t.sina.com.cn/k/",
        1: "http://t.sina.com.cn/search/user.php?search="
    };
    if (cindex !== undefined) {
        auto.curIndex = cindex;
    }
    function formget(event){
        var value = Core.String.trim(textnode.value);
        value = Core.String.leftB(value, maxlen);
        if(value == textnode.getAttribute('keywords')){
            return;
        }
        if (value && value != txt) {
            location.href = urls[auto.curIndex] + encodeURIComponent(encodeURIComponent(value));
        }
        else {
            textnode.focus();
        }
        Core.Events.stopEvent(event);
    }
    Core.Events.addEvent(subbtn, formget, "click");
    
    App.enterSubmit({
        parent: form,
        action: function(event){
            Core.Events.fireEvent(subbtn, "click");
        }
    });
};  
/**
 * @param{String}url
 * @param{Object}oParams
 * @param{Function}callback
 * @param{String}method
 * */
App._locked = false;
App.request = function(url, oParams, callback, method){
    if (!App._locked) {
        method = method || "GET";
        var config = {
            returnType: "json",
            onComplete: function(result){
                App._locked = false;
                if ((result && result.code)) {
                    if (result.code === "M00003") {
                        return App.ModLogin(null);
                    }
                    if (result.code === "MR0122") {
                        return App.alert($SYSMSG["MR0122"]);
                    }
                    if (result.code === "A00006") {
                        callback(result);
                    }
                    else {
                        App.alert($SYSMSG[result.code], {
                            icon: 1
                        });
                    }
                }
            },
            onException: function(msg){
                App._locked = false;
            }
        };
        config[method] = oParams;
        App._locked = true;
        Utils.Io.Ajax.request(url, config);
    }
};