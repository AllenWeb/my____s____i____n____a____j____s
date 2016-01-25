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
$import('sina/core/string/trim.js');
//$import("sina/utils/sinput/sinput.js");
$import("diy/enter.js");
$import("diy/search/searchform.js");
$import("diy/htmltojson.js");
$registJob('search_topic', function(){
    var _addEvent = Core.Events.addEvent;
    var _trim = Core.String.trim;
    var ie6 = false;
    var _spec = {
        form: $E('search_condition'),
        search_txt: $E('hot_keyword_top'),
        search_btn: $E('seachBtn'),
        dsable: ['filter_ori', 'filter_ret'],
        province: $E('province'),
        city: $E('city'),
        url: '/k/',
        urlRedirect: true,//地址重定向，则后面参数都是&链接，否则第一个参数是?
        defaultUrl: '/k/',
        autocomp: {
            dom: ['hot_keyword_top'],
            url: ['/person/aj_blogchooser.php'],
			ok: function(){
				Core.Events.fireEvent($E('seachBtn'),'click')
			}
        },
        defaultBtn: $E('defaultSet'),
        h_mod: false,
        //        autocomp: {
        //            dom: ['s_school', 's_work', 's_tag'],
        //            url: ['/person/relateschool.php', '/person/relatecompany.php', '/person/aj_tagchooser.php']
        //        },
        defaultValue: {
            'nickname': '1',
            'domain': '1',
            'desc': '1',
            'isauth': '1'
        },
        starttime: $E('starttime'),
        endtime: $E('endtime')
    }
    var searchBox = new App.searchForm(_spec);
    //  searchBox.initForm(_spec);
    var showModDialog = function(bh){
        if (!$E('changeSearchMod')) {
            return false;
        }
        //显示和隐藏高级搜索         
        if (bh) {
            searchBox.show();
        }
        else {
            searchBox.hidd();
        }
        $E('changeSearchMod').innerHTML = $CLTMSG[bh ? 'CF0115' : 'CF0113'];
        searchBox.setter('h_mod', bh);
    }
    App.openLive = function(){
        var win = Core.System.winSize();
        window.open('/search/live.php?search=' + scope.$search || '', '', 'height=' + win.height + ',width=' + win.width + ',left=0,top=0,toolbar=yes,menubar=yes,resizable=yes,scrollbars=yes,location=yes')
        //        location.href = '/search/live.php?search=' + scope.$search || '';
        return false;
    }
    showModDialog(/#showsearch/.test(location.href));
    _addEvent($E('changeSearchMod'), function(){
        Core.Events.stopEvent();
        showModDialog(!searchBox.getter('h_mod'));
    }, 'click');
    _addEvent($E('closeAdvPanel'), function(){
        Core.Events.stopEvent();
        showModDialog(false)
    }, 'click');
    _addEvent(_spec['search_txt'], function(){
        if (Core.String.trim(_spec['search_txt'].value) === $CLTMSG['CC4401']) {
            _spec['search_txt'].value = "";
        }
    }, 'focus');
    _addEvent(_spec['search_txt'], function(){
        if (Core.String.trim(_spec['search_txt'].value) === '') {
            _spec['search_txt'].value = $CLTMSG['CC4401'];
        }
    }, 'blur');
    
    (function(){
        var isCss1 = false, ua = navigator.userAgent, r = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(ua);
        if (r && (r = parseFloat(RegExp.$1)) && r <= 6) {
            ie6 = true;
        };
            })();
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
                                    <img class="PY_ib PY_ib_3" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" align="absmiddle" alt="" title="" /> ' + $CLTMSG['CD0151'] + '\
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
                'topic': scope.$search ? decodeURIComponent(scope.$search) : ''
            });
        } 
        catch (e) {
        }
//        App.setOpacity($E('publisher_bottom'), 90);
        if (ie6) {
            var _scroll, _page;
            var ifm = document.getElementsByTagName("BODY")[0].appendChild($C("iframe"));
            var _full = false;
            $E('publisher_bottom').style.position = "absolute";
                    ifm.className="mskframe"
			with (ifm.style) {
                position = "absolute";
                width = '0px';
                height = '86px';
                zIndex = 998;
                border = "0";
                left = $E('publisher_bottom').offsetLeft+'px';
            }
            window.setInterval(function(){
                _scroll = Core.System.getScrollPos();
                _page = Core.System.pageSize();
                $E('publisher_bottom').style.top = (_scroll[0] + _page[3]) + "px";
                ifm.style.top = (_scroll[0] + _page[3]-86)+'px';
                ifm.style.left = $E('publisher_bottom').offsetLeft+'px';
//                ifm.style.width = $E('publisher_bottom').offsetWidth+'px';
//                var pub_top = Core.Dom.getTop($E('publisher_bottom'));
//                var bot_top = Core.Dom.getTop($E('bottomborder'));
//                if (pub_top && bot_top && pub_top >= bot_top+$E('bottomborder').offsetHeight) {
//                    window.scrollBy(0, (pub_top - bot_top - $E('bottomborder').offsetHeight) * -1)
//                }
            }, 100)
        }
		App._showPub = !/#showPublish/.test(location.href);
        var showPublish = function(){
            //展开
            if (!App._showPub) {
                //            $E('publisher_bottom').className = $E('publisher_bottom').className.replace(/ hiddbar/, '');
                $E('publisher_disp_btn').style.display = 'none';
                $E('publisher_disp').style.display = '';
                if (ie6) {
                    ifm.style.width = $E('publisher_bottom').offsetWidth+'px';
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
            App._showPub = !App._showPub;
        };
        _addEvent($E('publisher_hidd'), showPublish, 'click')
        _addEvent($E('publisher_disp_btn'), showPublish, 'click');
		showPublish();
    };
    var _userscope = document.getElementsByName('filter_userscope');
    
    for (var i = 0, len = _userscope.length; i < len; i++) {
        _addEvent(_userscope[i], (function(el){
            return function(){
                if (el.value == '2') {
                    $E('nickname').disabled = false;
                }
                else {
                    $E('nickname').disabled = true;
                    $E('nickname').value = '';
                }
            }
        })(_userscope[i]), 'click');
    }
});
