/**
 * @ Robin Young | yonglin@staff.sina.com.cn
 * @ 微博发布器
 */
$import("jobs/base.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/dom/insertAfter.js");
$import('diy/querytojson.js');
$import("diy/flyout.js");
$import("diy/check.js");
$import("diy/imgURL.js");
$import("diy/curtain.js");
$import("diy/getimgsize.js");
$import("diy/general_animation.js");
$import("jobs/refurbishNumber.js");
$import("jobs/insertTextArea.js");
$import("diy/addvideo.js");
$import("diy/addmusic.js");
$import("sina/core/string/decodeHTML.js");
$import("diy/PopUpFace.js");
$import("jobs/mod_login.js");
$import("diy/forbidrefresh_dialog.js");

$registJob('publisher', function(){
    try {
        //函数集
        var _addEvent = Core.Events.addEvent;
        var _trim = Core.String.trim;
        var _bLength = Core.String.byteLength;
        var _imgURL = App.imgURL;
        var _insertAfter = Core.Dom.insertAfter;
        var _query2json = App.queryToJson;
        var _alert = App.alert;
        var _feedType = scope['$feedtype'];
        var _search = scope['$search'] ? decodeURIComponent(scope['$search']) : false;
        var _leftB = Core.String.leftB;
        /*
         * @发布器的操作函数
         * @elements: 发布器需要的页面元素
         * 	{
         *		'image' :
         *		'topic'	:
         *		'info'	:
         *		'editor':
         *		'submit':
         *		'imgPerch'	:
         *		'imgForm'	:
         *		'imgFile'	:
         *		'preview'	:
         *		'hotopic'	:
         *		'shadow'	:
         *		'modal'		:
         *		'close'		:
         *	}
         * @config	: 发布器的配置参数
         *
         */
        App.publisher = function(elements, config){
            if (!elements) {
                throw ('publisher need elements as parameters');
            }
            var _submitKey = true;
            
            var _newImageFile = function(){
                var file = document.createElement('INPUT');
                file.type = 'file';
                file.size = '1';
                file.name = 'pic1';
                file.style.cssText = 'cursor:pointer !important;height:18px;left:0;margin:0;opacity:0;filter:alpha(opacity=0);overflow:hidden;padding:0;position:absolute;top:0;';
                elements['imgFile'].parentNode.insertBefore(file, elements['imgFile']);
                elements['imgFile'].parentNode.removeChild(elements['imgFile']);
                elements['imgFile'] = file;
                _addEvent(elements['imgFile'], _upImage, 'change');
            };
            
            var _upImage = function(){
                var filename = elements['imgFile'].value;
                //对可用性的判断
                if (!/\.(gif|jpg|png|jpeg)$/i.test(filename)) {
                    App.alert({
                        'code': "M07004"
                    });
                    return false;
                }
                else {
                    // IE only detect local fileSize
                    elements['imgPre'].src = filename;
                    if (elements['imgPre'].fileSize > 0) {
                        var file_size = elements['imgPre'].fileSize / (1024 * 1024);
                        if (file_size > 5) {
                            App.alert({
                                'code': "M07003"
                            });
                            return false;
                        }
                    }
                }
                //页面操作
                elements['imgLoading'].style.display = '';
                elements['image'].style.display = 'none';
                //返回函数
                scope.addImgSuccess = function(cfg){
                    if (cfg['ret'] === '1') {
                        filename = filename.match(/[^\/|\\]*$/)[0];
                        imgName = filename.slice(0, -4);
                        if (imgName.length > 10) {
                            imgName = imgName.slice(0, 10) + '...'
                        }
                        filename = imgName + filename.slice(-4);
                        elements['imgName'].innerHTML = filename || $CLTMSG['CX0118'];
                        elements['imgPerch'].style.display = '';
                        elements['imgPerch'].value = cfg['pid'];
                        elements['imgPre'].innerHTML = '<img src="' + _imgURL(cfg['pid'], 'small') + '" />';
                        if (!_trim(elements['editor'].value.replace('#'+$CLTMSG['CX0119']+'#', '')).length) {
                            elements['editor'].value = $CLTMSG["CD0070"];
                            _limit();
                        }
                        App.getImgSize(_imgURL(cfg['pid'], 'bmiddle'), function(){
                        });
                        App.getImgSize(_imgURL(cfg['pid'], 'thumbnail'), function(){
                        });
                    }
                    else {
                        elements['image'].style.display = '';
                        App.alert({
                            'code': 'M07002'
                        });
                    }
                    _newImageFile();
                    elements['imgLoading'].style.display = 'none';
					setTimeout(function(){
						elements['preview'].style.display = '';
					}, 100);
                };
                
                elements['imgForm'].submit();
            };
            
            var _preview = function(begin, target){
                App.doFlyOut(begin, target, {
                    'resFun': function(){
                        target.style.display = 'block';
                        target.style.visibility = 'visible';
                    },
                    'style': 'border:#000 2px solid;background:#bad;opacity:0.2',
                    'time': 1
                });
            };
            //得到输入内容的长度
            var _getLength = function(str){
            	
                var len = _trim(str.replace(new RegExp('(#'+ $CLTMSG['CD0069'] +'#)','g'), '')).length;
                if (len > 0) {
                    return Math.ceil(_bLength(_trim(str)) / 2);
                }
                else {
                    return 0;
                }
            };
            //输入框的限制
            var _testlimit = function(func){
                var len = _getLength(elements['editor'].value);
                if (typeof func === 'function') {
                    func(len);
                }
                if (len > 0 && len <= 140) {
                    return true;
                }
                else {
                    return false;
                }
            };
            //修改自数提示信息
            var _countInfo = function(len){
                if (len >= 0 && len <= 140) {
                    elements['info'].className = 'wordNumBg';
                    elements['info'].innerHTML = $CLTMSG['CD0071'].replace(/#\{cls\}/,"bold").replace(/#\{len\}/,140 - len);
                }
                else {
                    elements['info'].className = 'wordNumBg error';
					var _src = 'src="'+ scope.$BASECSS + 'style/images/common/transparent.gif" ';
					var _num = $CLTMSG['CD0072'].replace(/#\{cls\}/,"pipsLim").replace(/#\{style\}/,"").replace(/#\{len\}/,(140 - len) * (-1));
					elements['info'].innerHTML = '<div class="word_c"><img '+_src+' title="" alt="" class="tipicon tip2">'+_num+'</div><b class="rcorner"></b>';
                }
            };
            //限制函数
            var _limit = function(event){
                if (event && event.ctrlKey == true && (event.keyCode == "13" || event.keyCode == "10")) {
                    return;
                }
                if (_testlimit(_countInfo)) {
                    if (!_submitKey) {
                        elements['submit'].parentNode.className = 'postBtnBg';
                        _submitKey = true;
                    }
                }
                else {
                    elements['submit'].parentNode.className = 'postBtnBg bgColorA_No';
                    _submitKey = false;
                }
            };
            /*
             *	插入视频
             * 	chibin 2009-12-7
             *
             */
            var _upVideo = function(el){
                var _suc = function(json){
                    if (json) {
                        //App.insertTextArea(elements['editor'], " " + json.data.shorturl + " ");
                    	elements['editor'].value +=" " + json.data.shorturl + " ";
						elements['editor'].focus();
						elements['editor'].value = Core.String.decodeHTML(elements['editor'].value);
					}
                }
                App.addvideo(el, _suc, function(){
                });
            };
            
            /*
             *	插入音频
             * 	chibin 2009-12-8
             *
             */
            var _upMusic = function(el){
                var _suc = function(json){
                    if (json) {
                        //App.insertTextArea(elements['editor'], "  " + json.singer + "-" + json.name + "-" + json.shorturl + "  ");
						
						elements['editor'].value += "  " + (_trim(json.singer).length>0? json.singer + "-" :"")  + json.name + "-" + json.shorturl + "  ";
						elements['editor'].focus();
						elements['editor'].value = Core.String.decodeHTML(elements['editor'].value);
					}
                }
                App.addmusic(el, _suc, function(){
                });
            };
            
            var _setextinfo = function(extinfo){
				if(extinfo&&extinfo.length>0){
					if(!scope.extinfo){
						scope.extinfo = new Array();
					}
					for(var i = 0;i<extinfo.length;i++){
						scope.extinfo[extinfo[i]["shorturl_id"]]={
							url:extinfo[i]["url"],
							title:extinfo[i]["title"],
							type:extinfo[i]["type"],
							ourl:extinfo[i]["ourl"]
						};
					}
					
				}
				else{
					return false;
				}
			};
            
            var _addFeed = function(feedStr, extinfo){
                if (config['feedList']) {
                    var feedBox = document.createElement('UL');
                    config['feedList'].parentNode.insertBefore(feedBox, config['feedList']);
                    feedBox.innerHTML = feedStr;
                    if (App.refurbishUpdate) {
                        App.refurbishUpdate.add(1);
                    }
					//add by chibin 2009-12-13
					_setextinfo(extinfo);
//					alert(isvideo);
//                    if (isvideo == "1") {
                        App.bindmedia(feedBox);
//                    }
                    config['feedList'].insertBefore((feedBox.getElementsByTagName('LI'))[0], (config['feedList'].getElementsByTagName('LI'))[0]);
                    feedBox.parentNode.removeChild(feedBox);
                }
            };
            
            var _submit = function(){
            	if(scope.$uid == ""){
            		return App.ModLogin(null);
            	}
                if (!_submitKey) {
                    if (!_testlimit()) {
                        App.cartoon.noticeInput(elements['editor']);
                    }
                    return false
                }
                _submitKey = false;
                
                elements['submit'].parentNode.className = 'postBtnBg bgColorA_No';
                var content = _trim(elements['editor'].value || '');
                var pic = [_trim(elements['imgPerch'].value || '')];
                
                var success = function(json, parameters){
                    _clear();                    
                    elements['editor'].style.display = 'none';
					//add by dimu 连接开心网成功后publisher
					if (scope.$pageid == 'tools_share_link' && $E('publish_cover')) {
						 $E('publish_cover').style.display = '';
					}
					else {
						elements['editor'].parentNode.className = 'inputsuccess';
						setTimeout(function(){
							elements['editor'].parentNode.className = 'inputarea';
							elements['editor'].style.display = '';
						}, 2000);
					}
                    if (_feedType === 'ispic' && !parameters.pic) {
                        return false;
                    }
                    if (_feedType === 'islink' && json.islink != 1) {
                        return false;
                    }
                    if (_feedType === 'isrt') {
                        return false;
                    }
                    if (_feedType === 'favorite') {
                        return false;
                    }
                    if (_feedType === 'isat') {
                        if (scope.$uname) {
                            if (!(new RegExp('(@|＠)' + scope.$uname + '([^a-zA-Z0-9\u4e00-\u9fa5_]|$)')).test(parameters.content)) {
                                return false;
                            }
                        }
                    }
                    setTimeout(function(){
                        //_addFeed(json['html'], json.isvideo);
						_addFeed(json['html'], json['extinfo']);
						
						if(scope.adjustCulumns){
						    scope.adjustCulumns();
						}
                    }, 1000);
                };
                var error = function(json){
                    _submitKey = true;
                    if (json) {
						if(json.code == "MR0050"){
							App.forbidrefresh(function(){
								_submitKey = true;
								_submit();
							},"/mblog/publish.php");
							return false;
	                    }
                        _alert({
                            'code': json['code']
                        });
						if(json['code'] == "M01155"){
							_clear();
						}
                    }
                    else {
                        _alert({
                            'code': 'R01404'
                        });
                    }
                };
                
                App.publishRumor(content, pic, success, error);
				
				cashInput.clear();
				elements['editor'].focus();
                return false;
            };
            
            var _ctrlSubmit = function(event){
                if (event.ctrlKey == true && event.keyCode == "13") {
                    _submit();
                }
                return false;
            };
            
            var _clear = function(){
                if (_search) {
                    elements['editor'].value = '#' + _search + '#';
                }
                else {
                    elements['editor'].value = '';
                }
                _limit();
                _delImg();
                //add by chibin 2009-12-10
//                if (scope.$vdialog) {
//                    scope.$vdialog.close();
//                    scope.$vdialog = null;
//                }
				if(scope.$extdialog){
					scope.$playsong = null;
					if ($E("musicflash")) {
                        Core.Dom.removeNode($E("musicflash"));
                    };
					scope.$extdialog.close();
					scope.$extdialog = null;
				}
//                if (scope.$mdialog) {
//                    
//                    if ($E("musicflash")) {
//                        Core.Dom.removeNode($E("musicflash"));
//                    };
//                    scope.$mdialog
//                    scope.$mdialog = null;
//                }
            };
            
            var _delImg = function(){
				elements['preview'].style.display = 'none';
				
                elements['imgPerch'].value = '';
                elements['imgPerch'].style.display = 'none';
                elements['imgLoading'].style.display = 'none';
                elements['image'].style.display = '';
                scope.addImgSuccess = function(){
                };
            };
            
            var _getPos = function(){
                if (elements['editor'].createTextRange) {
                    elements['editor'].caretPos = document.selection.createRange().duplicate();
                }
            };
            
            var _publishFocus = function(){
                _limit();
                elements['editor'].focus();
            };
			
			//获得内容的长度，去掉首尾空格的
			var getLength = function(str){
	            str = str.replace(/(^[\s]*)|([\s]*$)/g, '');
	            return Math.ceil(Core.String.byteLength(Core.String.trim(str)) / 2);
	        };
            //cash user input
	        var cashInput = {
	            save: function(){
	                Utils.Cookie.setCookie('cash_input', elements['editor'].value);
	            },
	            recover: function(){
	                elements['editor'].value = unescape(Utils.Cookie.getCookie('cash_input'));
	            },
	            clear: function(){
					Utils.Cookie.setCookie('cash_input', '');
					//Utils.Cookie.deleteCookie('cash_col_input');
	            },
	            action: function(){
	                var len = getLength(elements['editor'].value);
	                if (len <= 140) {
	                    cashInput.save();
	                }
	            },
				pageInit: function(){
	        		cashInput.recover();
					var len = getLength(elements['editor'].value);
					config.onLimit(len);
					if (len <= 140) {
						elements['submit'].parentNode.className = 'postBtnBg';
					}
					elements['editor'].focus();
				}
	        };
            _addEvent(elements['imgFile'], _upImage, 'change');
            _addEvent(elements['editor'], _limit, 'keyup');
            _addEvent(elements['editor'], _limit, 'keypress');
            
            _addEvent(elements['editor'], _limit, 'input');
            _addEvent(elements['editor'], function(){
                setTimeout(_limit, 0);
            }, 'paste');
            _addEvent(elements['editor'], function(){
                setTimeout(_limit, 0);
            }, 'cut');
            _addEvent(elements['editor'], _limit, 'focus');
            _addEvent(elements['submit'], _submit, 'click');
            _addEvent(elements['editor'], _ctrlSubmit, 'keyup');
            _addEvent(elements['imgDelete'], _delImg, 'click');
            
			_addEvent(elements['editor'], cashInput.action, 'keyup');
            _addEvent(elements['editor'], _getPos, "keyup");
            _addEvent(elements['editor'], _getPos, "focus");
            _addEvent(elements['editor'], _getPos, "select");
            _addEvent(elements['editor'], _getPos, "click");
            //add by chibin 
            _addEvent(elements['video'], function(){
                _upVideo(elements['video'])
            }, "click");
            _addEvent(elements['music'], function(){
                _upMusic(elements['music']);
            }, "click");
			/*
            var mouseinarea = false;
            _addEvent(elements['imgName'], function(){
                mouseinarea = true;
                setTimeout(function(){
                    if (mouseinarea) {
                    	elements['preview'].style.left = '120px';
                        elements['preview'].style.display = '';
                    }
                }, 100);
            }, 'mouseover');
            _addEvent(elements['imgName'], function(){
                mouseinarea = false;
                setTimeout(function(){
                    if (!mouseinarea) {
                        elements['preview'].style.display = 'none';
                    }
                }, 100);
            }, 'mouseout');
            */
            _addEvent(elements['topic'], function(){
                App.insertTextArea(elements['editor'], "#" + $CLTMSG['CD0069'] + "#", _publishFocus);
            }, 'click');
            
            //		if(elements['hotopic']){
            //			_addEvent(
            //				elements['image'],
            //				function(){
            //					elements['hotopic'].style.display = '';
            //				},
            //				'mouseover'
            //			);
            //			_addEvent(
            //				elements['image'],
            //				function(){
            //					elements['hotopic'].style.display = 'none';
            //				},
            //				'mouseout'
            //			);
            //		}
            
            //_publishFocus();
            _limit();
			
			cashInput.pageInit();
			
            //start 增加表情--------------------------------------------------------------
            _addEvent(elements.faceIcon, function(e){
            	var target = e.srcElement||e.target;
                App.showFaces(target,elements.editor,-30,5);
            }, 'click');
            //end 增加表情----------------------------------------------------------------
        };
        
        //提交数据的发布函数
        App.publishRumor = function(content, pic, success, error){
        
            if (typeof content != 'string') {
                throw ('The publishRumor need a string as first parameter');
            }
            
            if (!(pic instanceof Array)) {
                throw ('The publishRumor need an array as second parameter');
            }
            
            if (typeof success != 'function') {
                throw ('The publishRumor need a function as thrid parameter');
            }
            
            if (typeof error != 'function') {
                throw ('The publishRumor need a function as fourth parameter');
            }
            if (_search) {
                if (content.indexOf(_search) == -1) {
                    content = '#' + _search + '#' + content;
                }
            }
            var parameters = {
                'content': content.replace(/\uff20/ig, '@'),
                'pic': pic.join(','),
                'styleid': scope['styleid'],
				'retcode': scope.doorretcode||""
            };
			scope.doorretcode = "";
            Utils.Io.Ajax.request('/mblog/publish.php', {
                'POST': parameters,
                'onComplete': function(json){
                    if (json.code == 'A00006') {
                        success(json.data, parameters);
					} else if (json.code == 'M00008') {
                            window.location.replace(json.data);
                    } else {
						error(json);
					}
                },
                'onException': function(){
                    error();
                },
                'returnType': 'json'
            });
        };
        /*publish start2*/
        if (!$E('publisher_submit')) {
            return false;
        }
        App.publisher({
        	'faceIcon':$E("publisher_faces"),//增加表情
            'image': $E('publisher_image'),
            'topic': $E('publisher_topic'),
            'info': $E('publisher_info'),
            'editor': $E('publish_editor'),
            'submit': $E('publisher_submit'),
            'imgForm': $E('publisher_image_form'),
            'imgPerch': $E('publisher_perch'),
            'imgFile': $E('publisher_file'),
            'imgName': $E('publisher_perch_name'),
            'imgDelete': $E('publisher_perch_delete'),
            'imgLoading': $E('publisher_image_loading'),
            'imgPre': $E('publisher_preimage'),
            'preview': $E('publisher_imgpreview'),
            //add by chibin 2009-12-7
            'music': $E('publisher_music'),
            'video': $E('publisher_video'),
            //add end
            //			'hotopic'	: $E('publisher_tpcpreview'),
            //			'shadow'	: $E('publisher_shadow'),
            //			'modal'		: $E('publisher_modal'),
            //			'close'		: $E('publisher_close_shadow'),
            'at': $E('publisher_at')
        }, {
            'feedTitle': $E('feed_title'),
            'feedList': $E('feed_list')
        });
    } 
    catch (exp) {
    }
});
scope.addImgSuccess = function(){
};
