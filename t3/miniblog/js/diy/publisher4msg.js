/**
 * @fileoverview 私信发布器
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
$import("sina/utils/io/ajax.js");
$import('sina/core/events/addEvent.js');
$import("sina/core/events/stopEvent.js");
$import("diy/insertText.js");
$import("diy/TextareaUtils.js");
$import("diy/general_animation.js");
$import("diy/getTextAreaHeight.js");
$import("diy/check_login.js");
$import("jobs/mod_login.js");
$import("sina/core/dom/contains.js");
$import("sina/core/array/each.js");
$import("sina/core/dom/getElementsByClass.js"); 

(function(proxy){
	proxy.miniblogPublisher4msg = function(elements, config){
		var that = {};
		var spec = {};
		var allow = true;
		spec.pluginList	= [];
		spec.submitKey	= true;
		spec.content = '';
		
		//清空内容，回到原始状态
		var clear = function(){
            elements['editor'].value = '';
            doLimit();
            spec.pic = [];
			for(var i = 0, len = spec.pluginList.length; i < len; i += 1){
				if(typeof spec.pluginList[i].clear == 'function'){
					spec.pluginList[i].clear();
				}
			}
        };
		
		//发布成功后的调用
		var success = function(json, parameters){
			clear();
            config.onSuccess(json, parameters);
            
            elements['faces'].parentNode.className = "tear_bottom tear_bottomJ";//hide
            elements['editor'].style.height = "50px";
        };
		
		//发布失败的调用
		var error = function(json){
			spec.submitKey	= true;
			config.onError(json);
		};
		
		//获得内容的长度，去掉首尾空格的
		var getLength = function(str){
			var reg = new RegExp(config['emptyStr'][0],'g');
			var len = Core.String.trim(str.replace(reg, '')).length;
            if (len > 0) {
                return Math.ceil(Core.String.byteLength(str) / 2);
            } else {
                return 0;
            }
		};
		
		//对发布条件的测试，可同时执行一个跟数字有关的函数
		var testlimit = function(func){
            var len = getLength(elements['editor'].value);
            if (typeof func === 'function') {
                func(len);
            }
            if (len > 0 && len <= 300) {
                return true;
            }
            else {
                return false;
            }
        };

		var doLimit = function(event){
			if(!allow){
			    return
			}
            if (testlimit(config.onLimit)) {
                if (!spec.submitKey) {
                   submitEnable();
                }
            } else {
                submitDisable();
            }
        };
		
		var submitDisable = function(){
			config.onDisable();
            spec.submitKey = false;
		};
		
		var submitEnable = function(){
			 config.onEnable();
             spec.submitKey = true;
		};
		
		//发布区域
		var submit = function(){
			 if (!spec.submitKey) {
                if (!testlimit()) {
                    App.cartoon.noticeInput(elements['editor']);
                    return false;
                }
//                return false
            }
			submitDisable();
			
            spec.content	= Core.String.trim(elements['editor'].value || '');
            publishRumor(spec.content, success, error);
            return false;
		};
		
		var cashCur = function(){
			var selValue = App.TextareaUtils.getSelectedText(elements['editor']);
			var slen = (selValue == '' || selValue == null) ? 0 : selValue.length;
			var start = App.TextareaUtils.getCursorPos(elements['editor']);
			
			var curStr = start + '&' + slen;
			elements['editor'].setAttribute('range',curStr);
		};
		
		var ctrlSubmit = function(event){
            if (event.ctrlKey == true && event.keyCode == "13") {
                submit();
            }
            return false;
        };
        
		//事件绑定
		Core.Events.addEvent(elements['editor'], doLimit, 'keyup');
		Core.Events.addEvent(elements['editor'], doLimit, 'input');
		Core.Events.addEvent(elements['submit'], submit, 'click');
		Core.Events.addEvent(elements['editor'], ctrlSubmit, 'keyup');
		Core.Events.addEvent(elements['editor'], cashCur, 'mouseup');
		Core.Events.addEvent(elements['editor'], cashCur, 'keyup');
		Core.Events.addEvent(elements['editor'], function(){
		    elements['faces'].parentNode.className = "tear_bottom";
		}, 'focus');
		Core.Events.addEvent(document.body,function(e){
		    if(!elements['faces']){
		        return;
		    }
		    var t = e.target||e.srcElement;
		    var showFaceLayer = false;
    		var tables = document.getElementsByTagName("table");
    		Core.Array.each(tables,function(t){
    		    if(t.className === "mBlogLayer" && t.parentNode.parentNode.style.display !== "none"){
    		        if(Core.Dom.getElementsByClass(t,"ul","phiz_menu").length>0){
    		            showFaceLayer = true;
    		        }
    		    }
    		});
    		if(!Core.Dom.contains(elements['faces'].parentNode.parentNode, t) && !Core.String.trim(elements['editor'].value) && !showFaceLayer){
    			elements['faces'].parentNode.className = "tear_bottom tear_bottomJ";//hide
    		}else{
    		    elements['faces'].parentNode.className = "tear_bottom";//show
    		}
		},'click',false);
		
		App.autoHeightTextArea(elements.editor, function(){});//自动增高
		
		//对外接口
		that.checkLogin = function(arg){
			var isLog = true;
			if (!scope.loginKit().isLogin) {
                App.ModLogin({
                    "func": function(){
                        arg.callee.apply(arg)
                    }
                });
                isLog = false;
            }
			return isLog;
		};
		that.insertText = function(txt,func){
			func = func || function(){return true;};
			var range = elements['editor'].getAttribute('range') || "0&0";
			var cur = range.split('&');
			App.TextareaUtils.unCoverInsertText(elements['editor'],txt,{'rcs':cur[0],'rccl':cur[1]});
			func(that);
			that.limit();
            cashCur();
		};
		that.limit = doLimit;
		that.getDom = function(key){
			return elements[key];
		};
		that.set = function(key,value){
			spec[key] = value;
		};
		that.plugin = function(ext){
			spec.pluginList.push(ext);
			ext.init(that);
			return that;
		};
		that.enabled = function(b){
			allow = b;
			!b ? submitDisable(): doLimit();
		};
		clear();
		
		var lock = false;
		var publishRumor = function(content, success, error){
            var parameters = {
                'content'	: encodeURIComponent(content),
                'name':encodeURIComponent(Core.String.trim(elements.nick.getAttribute("nick"))),
                'html':'1'
            };
            if(lock){
                return;
            }
            lock = true;
            Utils.Io.Ajax.request('/message/addmsg.php', {
                'POST': parameters,
                'onComplete': function(json){
                    lock = false;
                    if (json.code == 'A00006') {
                        success(json, parameters);
                    }else if(json.code){
                        App.alert($SYSMSG[json.code]);
                    }
                },
                'onException': function(){
                    lock = false;
                    error();
                },
                'returnType': 'json'
            });
        };
    
		return that;
	};
})(App);