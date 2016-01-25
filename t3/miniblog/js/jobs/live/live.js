/**
 * @author chibin
 *
 * 直播
 *
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/stopEvent.js');
$import('sina/core/events/fireEvent.js');
$import('sina/core/events/removeEvent.js');
$import('sina/core/array/foreach.js');
$import('sina/core/string/trim.js');
//$import("sina/utils/sinput/sinput.js");
$import("diy/enter.js");
$import("diy/Live/LiveForm.js");
$import("diy/htmltojson.js");
$import("sina/utils/sinput/sinput.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/leftB.js");
$import("diy/TextareaUtils.js");
$import("diy/enter.js");
$import('sina/core/dom/getTop.js');
$import('sina/utils/sinput/sinput.js');
$import("diy/dragbar.js");
$registJob('live', function(){
    var _addEvent = Core.Events.addEvent;
    var _fireEvent = Core.Events.fireEvent;
    var _stopEvent = Core.Events.stopEvent;
    var _removeEvent = Core.Events.removeEvent;
    var _trim = Core.String.trim;
    var _launch = false;
    var _showPub = true;
    var launch_btn = $E('pause_a');
    var launch_div = $E('pause');
    //    var launch_btn2 = $E('live_font_but');
    var launch_span = $E('pause_span');
    var MAXFEEDCOUNT = 50;
    var ie6 = false;
    var ifm;
    var _scroll, _page;
    var _ondrag = false;
    var showPublish = function(){
        //展开
        if (!_showPub) {
            //            $E('publisher_bottom').className = $E('publisher_bottom').className.replace(/ hiddbar/, '');
            $E('publisher_disp_btn').style.display = 'none';
            $E('publisher_disp').style.display = '';
            if (ie6) {
                ifm.style.width = $E('publisher_bottom').offsetWidth + 'px';
            }
        }
        else {
            //            $E('publisher_bottom').className += " hiddbar";
            $E('publisher_disp').style.display = 'none';
            $E('publisher_disp_btn').style.display = '';
            if (ie6) {
                ifm.style.width = '0px';
            }
        }
        
        _showPub = !_showPub;
    };
    (function(){
        var isCss1 = false, ua = navigator.userAgent, r = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(ua);
        if (r && (r = parseFloat(RegExp.$1)) && r <= 6) {
            ie6 = true;
        };
            })();
    var search = function(txt){
        var textnode = $E('hot_keyword_top');
        var subbtn = $E('hot_submit_top');
        function formget(event){
            var value = Core.String.trim(textnode.value);
            //            if (value && value != txt) {
            if (value && value !== $CLTMSG['CC4205']) {
                location.href = '/search/live.php?search=' + encodeURIComponent(value);
            }
            else {
                App.TextareaUtils.setCursor(textnode);
            }
            //            Core.Events.stopEvent(event);
        }
        Utils.Sinput.limitMaxLen(textnode, 40)
        Core.Events.addEvent(subbtn, function(){
            setTimeout(function(){
                formget()
            }, 0)
        }, "click");
        App.enterSubmit({
            parent: textnode.parentNode,
            action: function(){
                Core.Events.fireEvent(subbtn, 'click');
            }
        });
        //        Core.Events.addEvent(textnode, function(e){
        //            if (e.keyCode == 13) {
        //                formget();
        //            }
        //        }, 'keydown');
        Core.Events.addEvent(textnode, function(){
            if (Core.String.trim(textnode.value) == $CLTMSG['CC4205']) {
                textnode.value = '';
            }
            return false;
        }, 'focus');
        Core.Events.addEvent(textnode, function(){
            if (Core.String.trim(textnode.value) === '') {
                textnode.value = $CLTMSG['CC4205'];
            }
            return false;
        }, 'blur');
    };
    var setbtm = function(ifm){
        var _cssText = "bottom:0px;_position:absolute;";
        var _ifmWidth = _showPub ? $E('publisher_bottom').offsetWidth + 'px' : '0px'
        var _ifmText = 'bottom:0px;position:absolute;width:' + _ifmWidth + ';height:86px;z-Index:998;border:0;left:' + $E('publisher_bottom').offsetLeft + 'px';
        if (ie6) {
            $E('publisher_bottom').style.cssText = _cssText;
            $E('publisher_bottom').className = $E('publisher_bottom').className;
            ifm.style.cssText = _ifmText;
            ifm.className = ifm.className;
            //            setTimeout(arguments.callee, 200);
        }
    }
    if (launch_div) {
        var live = new App.live({
            live_btn: [launch_div],
            live_start: function(){
                launch_div.className = 'pause_div'
                //launch_btn2.innerHTML = $CLTMSG['CC4203']
                launch_span.innerHTML = $CLTMSG['CC4202']
            },
            live_wait: function(){
                //                launch_div.className = 'pause_div nopause_div'
                launch_div.className = 'play_div'
                //launch_btn2.innerHTML = $CLTMSG['CC4203']
                launch_span.innerHTML = $CLTMSG['CC4201']
            },
            live_stop: function(){
                launch_div.className = 'play_div'
                //launch_btn2.innerHTML = $CLTMSG['CC4204']
                launch_span.innerHTML = $CLTMSG['CC4201']
            },
            live_checkwait: function(){
                //true为给我他娘的等着
                return launch_div.className == 'pause_div nopause_div';
            },
            live_div: launch_div,
            MAXFEEDCOUNT: MAXFEEDCOUNT,
            eleTimer: scope.$timer || '',
            afterIns: function(param){
                if (ie6) {
                    _scroll = Core.System.getScrollPos();
                    _page = Core.System.pageSize();
                    var pub_top = Core.Dom.getTop($E('publisher_bottom'));
                    var bot_top = Core.Dom.getTop($E('bottomborder'));
                    if (pub_top && bot_top && pub_top >= bot_top) {
                        window.scrollBy(0, (pub_top - bot_top) * -1)
                    }
                    return false;
                }
            },
            count: $E('startnum')
        });
        if (ie6) {
            live.setposition(launch_div, {
                position: 'absolute',
                perct: 0.72
            });
        }
        else {
            var _p = Core.System.pageSize();
            live.setStyle(launch_div, {
                zIndex: 1000,
                position: 'fixed',
                left: _p[2] * 0.72 + 'px',
                top: _p[3] * 0.5 + 'px'
            })
            launch_div.style.display = '';
        }
    };
    if ($E('publisher_bottom')) {
        try {
            App.miniblogPublisher({
                'editor': $E('publisher_editor'),
                'submit': $E('publisher_submit'),
                'info': $E('publisher_info')
            }, {
                'onDisable': function(){
                    //                    $E('publisher_submit').getElementsByTagName('IMG')[0].className = 'submit_notclick';
                },
                'onEnable': function(){
                    //                    $E('publisher_submit').getElementsByTagName('IMG')[0].className = 'submit';
                },
                'onLimit': function(len){
                    if (len >= 0 && len <= 140) {
                        $E('publisher_info').innerHTML = $CLTMSG['CD0071'].replace(/#\{cls\}/, "pipsLim").replace(/#\{len\}/, 140 - len);
                    }
                    else {
                        $E('publisher_info').innerHTML = $CLTMSG['CD0159'].replace(/#\{cls\}/, "pipsLim").replace(/#\{style\}/, "color:#FF3300").replace(/#\{len\}/, (140 - len) * (-1));
                    }
                },
                'onSuccess': function(json, params){
                    var successContent = '\
                        <div class="commonLayer2" style="padding-top:0">\
                                <div class="zok">\
                                    <img class="PY_ib PY_ib_3" src="' + scope.$BASEIMG + 'style/images/common/transparent.gif" align="absmiddle" alt="" title="" /> ' + $CLTMSG['CD0151'] + '\
                                </div>\
                        </div>';
                    var _ins = null;
                    _ins = new App.Dialog.BasicDialog($CLTMSG['CD0151'], successContent, {
                        width: 490,
                        zIndex: 1000,
                        hidden: true
                    });
                    _ins.show();
                    setTimeout(function(){
                        _ins.close();
                        /*
                         * 一条都没有就给老子刷新页面
                         */
                        if (!$E('feed_list')) {
                            location.reload(true);
                        }
                    }, 2000);
                },
                'onError': function(){
                },
                'limitNum': 140,
                'emptyStr': scope.$key || ['#' + $CLTMSG['CD0069'] + '#'],
                'topic': scope.$search ? decodeURIComponent(scope.$search): ''
            });
        } 
        catch (e) {
        }
    };
    
    if ($E('hot_keyword_top')) {
        App.autoComplate({
            'input': $E('hot_keyword_top'),
            'ok': function(value, text){
                $E('hot_keyword_top').value = text;
            },
            'light': function(el){
                el.className = 'cur';
            },
            'dark': function(el){
                el.className = '';
            },
            'timer': 2,
            'style': 'width:' + $E('hot_keyword_top').offsetWidth + 'px;position:absolute;z-index:200;',
            'class': 'layerMedia_menu',
            'type': 'ajax',
            'data': '/person/aj_blogchooser.php'
        });
        search($E('hot_keyword_top').value);
    };
    if ($E('publisher_bottom') && ie6) {
        var ifm = document.getElementsByTagName("BODY")[0].appendChild($C("iframe"));
        var _full = false;
        $E('publisher_bottom').style.position = "absolute";
        ifm.className = "mskframe"
        setTimeout(function(){
            setbtm(ifm);
        }, 200);
        _addEvent(window, function(){
            _scroll = Core.System.getScrollPos();
            _page = Core.System.pageSize();
            //            $E('publisher_bottom').style.top = (_scroll[0] + _page[3]) + "px";
            //            ifm.style.top = (_scroll[0] + _page[3] - 86) + "px";
            //            ifm.style.left = $E('publisher_bottom').offsetLeft + 'px';
            var pub_top = Core.Dom.getTop($E('publisher_bottom'));
            var bot_top = Core.Dom.getTop($E('bottomborder'));
            setTimeout(function(){
                setbtm(ifm);
            }, 200);
            if (pub_top && bot_top && pub_top >= bot_top) {
                //                window.scrollBy(0,(pub_top-bot_top)*-1)                
            }
            return false;
        }, 'scroll');
    };
    _addEvent($E('publisher_hidd'), showPublish, 'click')
    _addEvent($E('publisher_disp_btn'), showPublish, 'click');
    
    
    var startX, startY, origX, origY, deltaX, deltaY;
    _addEvent(launch_div, function(){
        if (Core.Base.detect.$IE) 
            return false
        live.clearposition();
        var evt = Core.Events.getEvent();
        _ondrag = true;
        startX = evt.clientX;
        startY = evt.clientY;
        origX = launch_div.offsetLeft;
        origY = launch_div.offsetTop;
        deltaX = startX - origX;
        deltaY = startY - origY;
    }, 'mousedown');
    _addEvent(launch_div, function(){
        //document.body.blur();
        if (Core.Base.detect.$IE) 
            return false
        if (_ondrag) {
            var evt = Core.Events.getEvent();
            //            if ($IE) {
            
            launch_div.style["left"] = evt.clientX - deltaX + "px";
            launch_div.style["top"] = evt.clientY - deltaY + "px";
            //            }
            //            else {
            //                launch_div.style["left"] = evt.pageX - offsetx + "px";
            //                launch_div.style["top"] = evt.pageY - offsety + "px";
            //            }
        }
    }, 'mousemove');
    _addEvent(launch_div, function(){
        if (Core.Base.detect.$IE) 
            return false
        _ondrag = false;
        //        if (ie6) {
        //            live.setposition(launch_div, {
        //                position: 'absolute',
        //                //                perct: 0.7,
        //                XY: [launch_div.style["top"], launch_div.style["left"]]
        //            });
        //        }
        //        else {
        //            live.setStyle(launch_div, {
        //				zIndex:1200,
        //                position: 'fixed',
        //                left: launch_div.style["left"],
        //                top: launch_div.style["top"]
        //            })
        //            //            launch_div.style.display = '';
        //        }
        offsetx = null;
        offsety = null;
    }, 'mouseup');
    //    //一进页面就直播
    if (launch_div) {
        _fireEvent(launch_div, 'click');
    };
    
    /*
     * 拖动滚动
     */
    var dragfunc = function(drag_spec){
        var csstxt = '.newsearch_result .MIB_feed li .MIB_feed_c .sms {font-size:#FONTSIZE#px;line-height:#LINEHEIGHT#px;}'.replace(/#FONTSIZE#/g, (12 + Math.ceil(drag_spec['percent'] * 0.01 * 12))).replace(/#LINEHEIGHT#/g, (18 + Math.ceil(drag_spec['percent'] * 0.01 * 12)));
        if (!scope.fontsize) {
            scope.fontsize = document.createElement('STYLE');
            scope.fontsize.setAttribute("type", "text/css");
        }
        if (scope.fontsize.styleSheet) {
            scope.fontsize.styleSheet.cssText = csstxt;
        }
        else {
            scope.fontsize.innerHTML = csstxt;
        }
        document.getElementsByTagName("head")[0].appendChild(scope.fontsize);
    };
    if ($E('bar') && $E('slider')) {
        var param = {
            bar: $E('bar'),
            slider: $E('slider'),
            step: 50,
            dragfunc: dragfunc
        };
        var dragbar = App.dragbar(param);
        var dragmouseup = function(){
            dragbar.drag_mouseup(document.body);
            _removeEvent(document.body, dragmouseup, 'mouseup');
            _stopEvent();
            return false;
        }
        _addEvent($E('dragleft'), function(){
            param['dragtype'] = 'cut';
            _addEvent(document.body, dragmouseup, 'mouseup');
            dragbar.drag_mousedown(param);
        }, 'mousedown');
        _addEvent($E('dragright'), function(){
            param['dragtype'] = 'plus';
            _addEvent(document.body, dragmouseup, 'mouseup');
            dragbar.drag_mousedown(param);
        }, 'mousedown');
    };
    
    //    if (ie6) {
    //        //操，被逼的！！！IE6
    //        setInterval( function(){
    //            var pub_top = Core.Dom.getTop($E('publisher_bottom'));
    //            var bot_top = Core.Dom.getTop($E('bottomborder'));
    //            if (pub_top && bot_top && pub_top >= bot_top) {
    //                window.scrollBy(0, (pub_top - bot_top) * -1)
    //            }
    //        }, 500);
    //    }
});

