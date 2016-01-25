/**
 * @author chibin
 *
 *
 * input id:vinput
 * submit id:vsubmit
 * redinfo id:redinfo
 *
 */
$import("jobs/base.js");
$import("diy/flyout.js");
$import("sina/core/events/addEvent.js");
$import("diy/mediadialog.js");
$import("diy/fansfind.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/dom/removeNode.js");
$import("diy/swfobject.js");
$import("jobs/inputHandler.js");
$import('sina/core/string/encodeHTML.js');
scope.jsReady = function(){
    return true;
};
App.addmusic = function(el, cb, ecb, owner){
    if (scope.$extdialog) {
        scope.$extdialog.close();
        scope.$extdialog = null;
    }
    scope.$playsong = null;
    var musichtml = '<div class="layerTag">\
                    	<ul>\
                        <li id="findsong" class="cur"><a href="javascript:void(0)" onclick = "App.musicchangeli(\'1\');return false;">' + $CLTMSG['CL0101'] + '</a><span class="tagR"></span></li>\
                        <li id="inputmusiclink"><a href="javascript:void(0);"  onclick = "App.musicchangeli(\'2\');return false;">' +
    $CLTMSG['CL0102'] +
    '</a><span class="tagR"></span></li>\
                        </ul>\
                     </div>\
					 <div id="findsongdiv">\
						 <div class="layerMedia_input">\
		                    <input id="mfindinput" type="text" value="' +
    $CLTMSG['CL0103'] +
    '" class="layerMusic_txt"/>\
							<a id="mfindsubmit" class="btn_normal" href="javascript:void(0);"><em>' +
    $CLTMSG['CL0104'] +
    '</em></a>\
						</div>\
						<p id="mfindredinfo" style="display:none;" class="layerMedia_err error_color">' +
    $CLTMSG['CL0105'] +
    '</p>\
					 	<div id="mfindmusictip" class="layerMedia_tip01" style="display:none"></div>\
						<div id="musicDetail" class="musicDetail" style="display:none">\
						<div><a id="mfindinfo" class="btn_normal" href="javascript:void(0)"><em>' +
    $CLTMSG['CL0106'] +
    '</em></a></div>\
						</div>\
					 </div>\
					 <div id="linksongdiv" style="display:none;">\
					 <div id="linksonginput" class="layerMedia_input">\
	                    <input id="mlinkinput" type="text" value="' +
    $CLTMSG['CL0107'] +
    '" class="layerMusic_txt" style=""/>\
	                    <a id="mlinksubmit" class="btn_normal" href="javascript:void(0);" style=""><em>' +
    $CLTMSG['CL0106'] +
    '</em></a>\
	                 </div>\
					 <p id="mlinkredinfo" style="display:none;" class="layerMedia_err error_color">' +
    $CLTMSG['CL0105'] +
    '</p>\
					 <p id="mlinkre" class="mail_pl" style="display:none;"><a href="javascript:void(0);" id="mlinkback">' +
    $CLTMSG['CL0108'] +
    '</a>。</p>\
					 <div id="mlinkmusictip" class="layerMedia_tip01" style="display:none"></div>\
					 <div id="musicInfo" class="musicInfo" style="display:none">\
                            <table>\
                            	<tbody><tr>\
                                	<th><em class="error_color">*</em>' +
    $CLTMSG['CL0109'] +
    '</th>\
                                	<td><input id = "songname" type="text" value="" class="musicInfo_txt"/><span id="mlinkredtext" class="error_color" style="display:none">' +
    $CLTMSG['CL0110'] +
    '</span></td>\
                                </tr>\
                                <tr>\
                                	<th>' +
    $CLTMSG['CL0111'] +
    '</th>\
                                	<td><input id = "singer" type="text" value="" class="musicInfo_txt"/></td>\
                                </tr>\
                                <tr>\
                                	<th/>\
                                	<td><a class="btn_normal" id="mlinkinfo" href="javascript:void(0);"><em>' +
    $CLTMSG['CL0112'] +
    '</em></a></td>\
                                </tr>\
                            </tbody></table>\
                            </div>\
						</div>';
    var beforeClose = function(){
        scope.$playsong = null;
        if ($E("musicflash")) {
            Core.Dom.removeNode($E("musicflash"));
        };
        scope.$extdialog = null;
    }
    scope.$extdialog = new App.MediaDialog.BasicDialog(musichtml, {
        width: 373,
        zIndex: 1000,
        hidden: true,
        timer: 2,
        distance: 5,
        beforeClose: function(){
            beforeClose();
        }
    });
    //中文文字提示
    var _musicfindtip = $E("mfindmusictip");
    //红字警告提示
    var _mfindredinfo = $E("mfindredinfo");
    //返回操作
    var _mlinkre = $E("mlinkre");
    //查找歌曲第一个按钮
    var _mfindsubmit = $E("mfindsubmit");
    //查找歌曲第二个按钮
    var _mfindinfo = $E("mfindinfo");
    //查找歌曲div
    var _musicDetail = $E("musicDetail");
    
    
    //插入歌曲链接第一个按钮
    var _mlinksubmit = $E("mlinksubmit");
    //插入歌曲链接第二个按钮
    var _mlinkinfo = $E("mlinkinfo");
    //插入歌曲输入曲名人名
    var _musicInfo = $E("musicInfo");
    //红字警告提示
    var _mlinkredinfo = $E("mlinkredinfo");
    //歌曲名
    var _songname = $E("songname");
    //演唱者
    var _singer = $E("singer");
    //返回的短url
    var _linkshorturl;
    //插入歌曲链接歌曲名不为空提示
    var _mlinkredtext = $E("mlinkredtext");
    //中文文字提示
    var _musiclinktip = $E("mlinkmusictip");
    
    //播放flash
    var _flashobject;
    var _getElementsByAttr = Core.Dom.getElementsByAttr;
    var _addEvent = Core.Events.addEvent;
    var position = Core.Dom.getXY(el);
    scope.$extdialog.setPosition(position[0], position[1] + parseInt(el.offsetHeight) + 5);
    var _cb = typeof cb === "function" ? cb : function(){
    };
    var _ecb = typeof ecb === "function" ? ecb : function(){
    };
    var _mfindinput = $E("mfindinput");
    var _mlinkinput = $E("mlinkinput");
    var _dorequest = App.doRequest;
    
    var _show = function(el, txt){
        if (txt) {
            el.innerHTML = txt;
        }
        el.style.display = "";
    };
    var _hidden = function(el){
        el.innerHTML = "";
        el.style.display = "none";
    };
    //创建1像素div
    var _addmusicflash = function(){
        if ($E("musicflash")) {
            return;
        }
        Core.Dom.insertHTML($E("publisher_music"), '<div id="musicflash"></div>', "AfterEnd");
        var flashParams = {
            quality: "high",
            allowScriptAccess: "always",
            wmode: "transparent",
            allowFullscreen: true
        };
        var flashVars = {};
        swfobject.embedSWF([scope.$BASESTATIC + "miniblog/static/swf/player/MiniPlayer.swf", Boot.getJsVersion()].join(""), "musicflash", "1", "1", "9.0.0", null, flashVars, flashParams);
    };
    //获取flash对象2
    var _getflash = function(){
        return Core.Base.detect.$IE ? window['musicflash'] : document['musicflash'];
    };
    //得到输入内容的长度
    var _getLength = function(str){
        var len = Core.String.trim(str).length;
        if (len > 0) {
            return Math.ceil(Core.String.byteLength(Core.String.trim(str)) / 2);
        }
        else {
            return 0;
        }
    };
    var _getmusicdom = function(elplay){
        while (elplay.tagName.toLowerCase() != "tr") {
            elplay = elplay.parentNode;
        }
        return elplay;
    };
    //歌名曲名限制15个字符
    var _testlimit = function(){
        var songlen = _getLength(_songname.value);
        var songrtn = true;
        var singerrtn = true;
        if (songlen >= 0 && songlen <= 15) {
            songrtn = true;
        }
        else {
            songrtn = false;
        }
        var singerlen = _getLength(_singer.value);
        if (singerlen >= 0 && singerlen <= 15) {
            singerrtn = true;
        }
        else {
            singerrtn = false;
        }
        if (singerrtn && songrtn) {
            _hidden(_mlinkredinfo);
            return true;
        }
        else {
            if (!singerrtn) {
                _show(_mlinkredinfo, $CLTMSG['CL0113']);
                return false;
            }
            if (!songrtn) {
                _show(_mlinkredinfo, $CLTMSG['CL0114']);
                return false;
            }
        }
        
        
    };
    //查找歌曲
    var _event_mfindsubmit = function(){
        if (Core.String.trim(_mfindinput.value) == "" || Core.String.trim(_mfindinput.value) == $CLTMSG['CL0103']) {
            return false;
        }
        _flashobject.songStop();
        _mfindinput.value = Core.String.trim(_mfindinput.value)
        _dorequest({
            songname: _mfindinput.value
        }, "/music/search.php", function(json, result){
            if (result) {
                _hidden(_mfindredinfo);
                _hidden(_musicfindtip);
                if ($E("music_list")) {
                    Core.Dom.removeNode($E("music_list"));
                }
                var tempsongname = Core.String.encodeHTML(_getLength(_mfindinput.value) > 25 ? (_mfindinput.value.substr(0, 25) + "...") : _mfindinput.value);
                if (result.count > 0) {
                    //_show(_musicfindtip, '在新浪乐库找到了 ' + result.count + ' 首包含“' + tempsongname + '”的歌曲');
                    _show(_musicfindtip, $CLTMSG['CL0115']);
                    Core.Dom.insertHTML(_musicDetail, json, "AfterBegin");
                    _show(_musicDetail);
                    var li_play = Core.Dom.getElementsByClass($E("music_list"), "div", "play");
                    var li_label = $E("music_list").getElementsByTagName("label");
                    for (var i = 0; i < li_play.length; i++) {
                        li_label[i].innerHTML = _getLength(li_label[i].innerHTML) > 25 ? li_label[i].innerHTML.substr(0, 47) + "..." : li_label[i].innerHTML;
                        _addEvent(li_play[i], (function(el, allel){
                            return function(){
                                try {
                                    var cursong = _getmusicdom(el);
                                    var tmpclass = el.className == "play" || false;
                                    for (var j = 0; j < allel.length; j++) {
                                        allel[j].className = "play";
                                    }
                                    //播放和暂停
                                    if (scope.$playsong === cursong) {
                                        //暂停->播放
                                        if (tmpclass) {
                                            //  el.className = "stop";
                                            _flashobject.songPlay();
                                            return false;
                                        }
                                        //播放->暂停
                                        else {
                                            _flashobject.songStop();
                                            return false;
                                        }
                                    }
                                    else {
                                        //播放->另一首歌播放
                                        //el.className = "stop";
                                        var cursongurl = encodeURIComponent(_getElementsByAttr(cursong, "name", "url")[0].value);
                                        scope.$playsong = cursong;
                                        _flashobject.setUrl(cursongurl);
                                        return false;
                                    }
                                } 
                                catch (e) {
                                }
                            };
                        })(li_play[i], li_play), "click");
                    }
                    var li_select = Core.Dom.getElementsByClass($E("music_list"), "p", "mselect");
                    for (var j = 0; j < li_select.length; j++) {
                        _addEvent(li_select[j], (function(el){
                            return function(){
                                var cur = _getmusicdom(el);
                                var radio = _getElementsByAttr(cur, "name", "url")[0];
                                radio.checked = true;
                            }
                        })(li_select[j]), "click");
                    }
                }
                else {
                    _show(_mfindredinfo, $CLTMSG['CL0116'] + tempsongname + $CLTMSG['CL0117'])
                    _musicDetail.style.display = "none";
                }
            }
        }, function(json){
            //失败
            if (json) {
                var tempsongname = Core.String.encodeHTML(_getLength(_mfindinput.value) > 25 ? (_mfindinput.value.substr(0, 25) + "...") : _mfindinput.value);
                _show(_mfindredinfo, $CLTMSG['CL0116'] + tempsongname + $CLTMSG['CL0117']);
                
            }
            _hidden(_musicfindtip);
            _musicDetail.style.display = "none";
        });
    };
    //选择明细中的某条记录添加歌曲
    var _event_mfindinfo = function(){
        var radiosong = Core.Dom.getElementsByAttr(_musicDetail, "name", "url");
        var selectsong, songname, singer;
        for (var i = 0; i < radiosong.length; i++) {
            if (radiosong[i].checked == true) {
                selectsong = radiosong[i];
                songname = Core.Dom.getElementsByAttr(selectsong.parentNode, "name", "songname")[0].value;
                singer = Core.Dom.getElementsByAttr(selectsong.parentNode, "name", "singer")[0].value;
                break;
            }
        }
        if (!selectsong) {
            _show(_mfindredinfo, $CLTMSG['CL0118']);
            return;
        }
        _dorequest({
            url: selectsong.value,
            name: songname,
            singer: singer
        }, "/music/publish.php", function(json, result){
            //成功
            _cb(json);
            
            scope.$extdialog.close();
        }, function(json){
            //失败
            if (json) {
                _show(_mfindredinfo, App.getMsg({
                    'code': json.code
                }));
            }
            _hidden(_musicfindtip);
            _musicDetail.style.display = "none";
        });
    };
    
    //输入音乐链接
    var _event_mlinksubmit = function(){
        _musicInfo.style.display = "none";
        _mlinksubmit.style.display = "";
        if (Core.String.trim(_mlinkinput.value) == "" || Core.String.trim(_mlinkinput.value) == $CLTMSG['CL0107']) {
            return false;
        }
        _dorequest({
            url: _mlinkinput.value
        }, "/music/input_check.php", function(json){
            //成功
            _show(_musiclinktip, $CLTMSG['CL0119']);
            _hidden(_mlinkredinfo);
            _mlinkre.style.display = "none";
            _show(_musicInfo);
            //_mlinksubmit.style.display = "none";
            if (json) {
                _singer.value = json.author || "";
                _songname.value = json.title || "";
                _linkshorturl = json.url;
            }
        }, function(json){
            //失败
            if (json) {
                if (json.code) {
                    _show(_mlinkredinfo, App.getMsg({
                        'code': json.code
                    }));
                    _show(_mlinkre);
                }
                else {
                    _show(_mlinkredinfo, App.getMsg({
                        'code': "M14002"
                    }));
                    _show(_mlinkre);
                }
            }
            _musicInfo.style.display = "none";
            _singer.value = "";
            _songname.value = "";
            _linkshorturl = "";
            _hidden(_musiclinktip);
        });
    };
    
    //输入歌曲名称演唱者后
    var _event_mlinkinfo = function(){
        _hidden(_mlinkredtext);
        if (!_testlimit()) {
            return false;
        }
        
        if (_songname.value == "" || Core.String.trim(_songname.value) == "") {
            _show(_mlinkredtext, $CLTMSG['CL0103']);
            return false;
        }
        _dorequest({
            url: _linkshorturl,
            name: _songname.value,
            singer: _singer.value
        }, "/music/publish_link.php", function(json){
            //alert(123);
            _cb(json);
            scope.$extdialog.close();
        }, function(json){
            //失败
            if (json) {
                _show(_mlinkredinfo, App.getMsg({
                    'code': json.code
                }));
            }
            _ecb(json);
        });
    };
    
    try {
        _addmusicflash();
        _flashobject = _getflash();
        
        //粉丝选择器音乐借用
        App.fansfind({
            'input': _mfindinput,
            'timer': 7,
            'light': function(el){
                el.className = "cur";
            },
            'select': function(value, text){
                _mfindinput.value = text;
                _event_mfindsubmit();
            },
            'class': 'layerMedia_menu',
            'data': '/music/recommend.php'
        });
        scope.$extdialog.show();
        _addEvent(_songname, function(){
            _hidden(_mlinkredtext);
            _testlimit();
        }, "blur");
        _addEvent(_singer, function(){
            _hidden(_mlinkredtext);
            _testlimit();
        }, "blur");
        
        
        _addEvent(_mfindinput, function(){
            if (_mfindinput.value == $CLTMSG['CL0103']) {
                _mfindinput.value = "";
            };
                    }, "focus");
        _addEvent(_mfindinput, function(){
            if (_mfindinput.value == "") {
                _mfindinput.value = $CLTMSG['CL0103'];
            };
                    }, "blur");
        
        _addEvent(_mlinkinput, function(){
        
            if (_mlinkinput.value == $CLTMSG['CL0107']) {
                //                if ($IE) {
                //                    App.setCursor(_mlinkinput, -1, _mlinkinput.value.length + 2);
                //                }
                //                else {
                //                    _mlinkinput.setSelectionRange(0, _mlinkinput.value.length);
                //                }
                _mlinkinput.value = "";
            };
                    }, "focus");
        _addEvent(_mlinkinput, function(){
            if (_mlinkinput.value == "") {
                _mlinkinput.value = $CLTMSG['CL0107'];
            }
            else {
                _event_mlinksubmit();
            };
                    }, "blur");
        //取消操作
        _addEvent($E("mlinkcancel"), function(){
            if (scope.$extdialog) {
                scope.$extdialog.close();
            }
        });
        //普通链接发布工作
        _addEvent($E("mlinkback"), function(){
            //App.insertTextArea($E('publish_editor'), " " + _mlinkinput.value + " ");
            if (_mlinkinput) {
//                $E('publish_editor').value += " " + _mlinkinput.value + " ";
//                $E('publish_editor').focus();
//                $E('publish_editor').value = $E('publish_editor').value;
//                owner.limit && owner.limit();
//                owner.cashInput && owner.cashInput();
//                owner.cashCur && owner.cashCur();

				owner.insertText(" " + _mlinkinput.value + " ");
            }
            if (scope.$extdialog) {
                scope.$extdialog.close();
            }
        });
        
        _addEvent(_mfindsubmit, function(){
            _event_mfindsubmit();
        }, "click");
        _addEvent(_mfindinfo, function(){
            _event_mfindinfo();
        }, "click");
        _addEvent(_mlinksubmit, function(){
            _event_mlinksubmit();
        }, "click");
        _addEvent(_mlinkinfo, function(){
            _event_mlinkinfo();
        }, "click");
        App.enterSubmit({
            parent: 'findsongdiv',
            action: function(){
                _event_mfindsubmit();
            }
        });
        App.enterSubmit({
            parent: 'linksonginput',
            action: function(){
                _event_mlinksubmit();
                _mlinkinput.blur();
            }
        });
        var hidd = function(){
			var oEvent = Core.Events.getEvent();
            var oTarget = oEvent? (oEvent.srcElement || oEvent.target): null;
			if (scope.$extdialog) {
				while (oTarget && oTarget != document.body) {
					if (oTarget == scope.$extdialog._node || oTarget.className == "layerMedia_menu") {
						return true;
					}
					oTarget = oTarget.parentNode;
				}
				scope.$extdialog && scope.$extdialog.close();
			}
            Core.Events.removeEvent(document.body, hidd, 'click');
			Core.Events.stopEvent();
			return false;
        };
		Core.Events.addEvent(document.body, hidd, 'click');
    } 
    catch (e) {
    }
};
App.musicchangeli = function(lid){
    //找歌
    if (lid == "1") {
        $E("findsongdiv").style.display = "";
        $E("linksongdiv").style.display = "none";
        $E("findsong").className = "cur";
        $E("inputmusiclink").className = "";
    }
    //插入链接
    if (lid == "2") {
        $E("findsongdiv").style.display = "none";
        $E("linksongdiv").style.display = "";
        $E("inputmusiclink").className = "cur";
        $E("findsong").className = "";
    }
    return false;
};

//注册音频播放回调函数
scope.listener = function(SONG_PLAYING, b){
    if (!scope.$playsong) {
        return false;
    }
    var play = Core.Dom.getElementsByClass(scope.$playsong, "div", "play")[0] || Core.Dom.getElementsByClass(scope.$playsong, "div", "stop")[0] || Core.Dom.getElementsByClass(scope.$playsong, "div", "loading")[0];
    if (b == "playing") {
        play.className = "stop";
    }
    else 
        if (b == "buffer") {
            play.className = "loading";
        //scope.$playsong = null;
        }
        else {
            play.className = "play";
        }
};
