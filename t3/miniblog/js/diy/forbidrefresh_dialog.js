/**
 * @author chibin
 * 防止刷新的层
 * forbidrefresh
 */
$import("sina/core/events/fireEvent.js");
$import("sina/core/string/trim.js");
$import("diy/enter.js");
$import("sina/utils/io/jsload.js");

(function(){
	var defaultLanguage = scope.$lang;
	var currentLanguage = scope.$lang;
	var currentFunction;
	var currentAPI;
	var changeFlag = false;
	App.changeLanguage = function( sLangType, cb ){
		if(currentLanguage==sLangType){return false}
		currentLanguage = sLangType;
		var langUrl;
		if(!scope.$devMode) {
			langUrl = scope.$BASEJS + "bind/pack.php?pro=" + $CONFIG.$product + "&page=conf/lang_" + sLangType + ".dev.js";
		}else{
            langUrl = scope.$BASEJS + $CONFIG.$product + "/js/lang_" + sLangType + ".js" + Boot.getJsVersion();
        }
		Utils.Io.JsLoad.request(langUrl, {
			onComplete: function(){
				if(cb){cb();return false}
				if (scope.forbidrefreshD) {
					changeFlag = true;
					scope.forbidrefreshD.close();
				}
				changeFlag = false;
				setTimeout(function(){
					currentFunction && currentAPI && App.forbidrefresh(currentFunction, currentAPI);
				}, 10);
			},
            onException: function(){
				changeFlag = false;
            },
            timeout: 30000
        });
	};
	var wrapA = function(text, lang){
		var returns = ['<a href="javascript:;" onClick="App.changeLanguage(\'' + lang + '\');return false;">',text,'</a>'];
		if(lang==currentLanguage){
			returns[0] = returns[2] = "";
		}
		return  returns.join("");
	}
	App.forbidrefresh = function(_func,_url){
		currentFunction = _func;
		currentAPI = _url;
	    if (!scope.forbidrefreshD) {
	        var _html = '<div class="auth_code">\
						<div class="auth_img"><img id="door2img" width="450" height="50" /><div style="text-align:right;padding:3px 0 0 0"><a id="changeyzm" href="javascript:void(0);" onclick="App.refreshCheckCode2();return false;">' + $CLTMSG['CC2103'] + '</a></div></div>\
						<p class="tips">' +
	        $CLTMSG['CC2104'] +
	        '</p>\
						<div class="code_input" id="yzm_input_div"><input id="yzm_input" type="text" value="" /></div>\
						<p id="yzm_error" class="errorTs error_color" style="display:none;">' +
	        $CLTMSG['CC3301'] +
	        '</p>\
						<p class="btn"><a class="btn_normal" href="javascript:void(0);" id="auth_submit"><em>' +
	        $CLTMSG['CC2105'] +
	        '</em></a> <a class="btn_normal" href="javascript:void(0);" id="door2Cancel"><em>' +
	        $CLTMSG['CL0603'] +
	        '</em></a></p>\
			<div class="change_lan">' + wrapA('中文简体','zh') + '<em class="line">|</em>' + wrapA('中文繁體','zh-tw') + '<!--<em class="line">|</em>' + wrapA('English','en') + '--></div>\
			</div>';
	        //请输入验证码
	        scope.forbidrefreshD = new App.Dialog.BasicDialog($SYSMSG['MR0050'], _html, {
	            zIndex: 1200,
	            hidden: true,
	            'hiddClose': false,
				width:510
	        });
			scope.forbidrefreshD.onClose = function(){
	             scope.forbidrefreshD = null;
				 if(!changeFlag && defaultLanguage){
				 	App.changeLanguage(defaultLanguage,function(){});
				 }
			};
	        var _addEvent = Core.Events.addEvent;
	        var _trim = Core.String.trim;
	        var _fireEvent = Core.Events.fireEvent;
	        var elements = {
	            img_yzm2: $E('door2img'),
	            btn_chgyzm: $E('changeyzm'),
	            input_yzm: $E('yzm_input'),
	            errinfo_yzm: $E('yzm_error'),
	            submit: $E('auth_submit'),
	            door2Cancel: $E('door2Cancel'),
	            yzm_input_div: $E('yzm_input_div'),
	            cb: function(data){
	                scope.forbidrefreshD.close();
	                scope.forbidrefreshD = null;
					scope.doorretcode = data||'';
	                _func();
	            },
	            ecb: function(json){
	                //elements['input_yzm'].value='';
	                if (json.code != 'R01409') {
	                    scope.forbidrefreshD.close();
	                    scope.forbidrefreshD = null;
	                }
	                else {
                        App.refreshCheckCode2();
                        elements['errinfo_yzm'].style.display = '';
                        elements['errinfo_yzm'].innerHTML = $CLTMSG['CC3301'];
	                }
	            },
	            url: _url||'/attention/aj_addfollow.php'
	        };
	        elements['errinfo_yzm'].style.display = 'none';
	        var _submit = function(){
	            elements['door'] = encodeURIComponent(_trim(elements['input_yzm'].value)) || _trim(elements['input_yzm'].value);
				App.doRequest({
	                door: elements['door']
	            }, elements['url'], elements['cb'] ||
	            function(){
	            }, elements['ecb'] ||
	            function(){
	            });
	        }
	        //绑定事件
	        _addEvent(elements['submit'], function(){
	            if (_trim(elements['input_yzm'].value) == '') {
	                elements['errinfo_yzm'].style.display = '';
	                elements['errinfo_yzm'].innerHTML = $SYSMSG['MR0050'];
	                return false;
	            }
	            _submit();
	            return false;
	        }, 'click');
	        _addEvent(elements['door2Cancel'], function(){
	            scope.forbidrefreshD.close();
	            return false;
	        }, 'click');
	        _addEvent(elements['input_yzm'], function(){
	            elements['errinfo_yzm'].style.display = 'none';
	        }, 'focus');
	//        _addEvent(elements['input_yzm'], function(){
	//            if (_trim(elements['input_yzm'].value) == '') {
	//                elements['errinfo_yzm'].style.display = '';
	//                elements['errinfo_yzm'].innerHTML = $SYSMSG['MR0050'];
	//                return false;
	//            }
	//        }, 'blur');
	        App.enterSubmit({
	            parent: elements['yzm_input_div'],
	            action: function(){
	                _fireEvent(elements['submit'], 'click')
	            }
	        });
	    }
	    App.refreshCheckCode2();
	    if ($E('yzm_error')) {
	        $E('yzm_error').style.display = 'none';
	    }
	    if ($E('yzm_input')) {
	        $E('yzm_input').value = '';
	    }
	    scope.forbidrefreshD.show();
	    
	};
	//更新验证码2
	App.refreshCheckCode2 = function(){
		setTimeout(function(){
			if($E("door2img")){			
				var imgsrc = 'pin1.php';
				if(scope.$pageid == 'registermail'){
					imgsrc = 'pin.php';
				}				
				$E("door2img").src = '/pincode/'+imgsrc+'?lang=' + currentLanguage + '&r=' + ((new Date()).getTime()) + '&rule';
				$E("door2img").style.display = "";
			}
		},100);
	};
})();

