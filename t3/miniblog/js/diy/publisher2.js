/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * The file is for edit miniblogs。
 */
//base
$import("sina/sina.js");
$import("sina/app.js");
//string
$import("sina/core/string/trim.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
//io
$import("sina/utils/io/ajax.js");
//event
$import('sina/core/events/addEvent.js');
$import("sina/core/events/stopEvent.js");
//moudel
$import("jobs/msgDialog.js");
$import("diy/insertText.js");
$import("diy/general_animation.js");
$import("diy/mb_dialog.js");
$import("diy/forbidrefresh_dialog.js");
$import("diy/TextareaUtils.js");

/**
 * @param {Object} elements
	'editor'	: 内容编辑器	//$E('publish_editor');
	'submit'	: 提交按钮	//$E('publisher_submit');
	'info'		: 信息提示区	//$E('publisher_info');
	
 * @param {Object} config
 *  'onLimit'	: function(){};
 *  'onSuccess'	: function(){};
 *  'onError'	: function(){};
 *  'onDisable'	: function(){};
 *  'onEnable'	: function(){};
 *  'limitNum'	: 140;
 *  'emptyStr'	: [];
 *  'topic': '';
 */

(function(proxy){
	
	proxy.miniblogPublisher = function(elements, config){
		if (!elements) {throw 'publisher need elements as parameters';}
		
		var that = {};
		var spec = {};
		var allow = true;
		spec.pluginList	= [];
		spec.submitKey	= true;
		spec.content = '';
		spec.pic	 = '';
		
		//清空内容，回到原始状态
		var clear = function(){
            if (config.topic) {
                elements['editor'].value = '#' + config.topic + '#';
            } else {
                elements['editor'].value = '';
            }
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
        };
		
		//发布失败的调用
		var error = function(json){
			spec.submitKey	= true;
			if (json && json['code']) {
				if(json.code == "MR0050"){
					App.forbidrefresh(function(){
						submit();
					},"/mblog/publish.php");
					return false;
				}
				App.alert({'code': json['code']});
			}else {
				App.alert({'code': 'R01404'});
			}
			config.onError(json);
		};
		
		//获得内容的长度，去掉首尾空格的
		var getLength = function(str){
			var reg = new RegExp(config['emptyStr'][0],'g');
			var len = Core.String.trim(str.replace(reg, '')).length;
            if (len > 0) {
                return Math.ceil(Core.String.byteLength(Core.String.trim(str)) / 2);
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
            if (len > 0 && len <= 140) {
                return true;
            }
            else {
                return false;
            }
        };

		var doLimit = function(event){
			if(!allow){return}
            if (event && event.ctrlKey == true && (event.keyCode == "13" || event.keyCode == "10")) {
                return;
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
                }
                return false
            }
			submitDisable();
			
            spec.content	= Core.String.trim(elements['editor'].value || '');
            publishRumor(spec.content, spec.pic, success, error,config.styleId,config.topic);
            return false;
		};
		
		var ctrlSubmit = function(event){
            if (event.ctrlKey == true && event.keyCode == "13") {
                submit();
            }
            return false;
        };
		
		var cashCur = function(){
			var selValue = App.TextareaUtils.getSelectedText(elements['editor']);
			var slen = (selValue == '' || selValue == null) ? 0 : selValue.length;
			var start = App.TextareaUtils.getCursorPos(elements['editor']);
			
			var curStr = start + '&' + slen;
			elements['editor'].setAttribute('range',curStr);
		};
		
		//end publish
		
		//插入文本区域
		var inserter = App.insertText({'dom' : elements['editor']});
		
		//事件绑定
		Core.Events.addEvent(elements['editor'], doLimit, 'keyup');
		Core.Events.addEvent(elements['editor'], doLimit, 'input');
		Core.Events.addEvent(elements['submit'], submit, 'click');
        Core.Events.addEvent(elements['editor'], ctrlSubmit, 'keyup');
		Core.Events.addEvent(elements['editor'], cashCur, 'mouseup');
		Core.Events.addEvent(elements['editor'], cashCur, 'keyup');
		
		//对外接口
		that.inserter = inserter;
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
		
		return that;
	};
	
	var publishRumor = function(content, pic, success, error, styleid, keyWord){
        if (typeof content != 'string')	{throw ('The publishRumor need a string as first parameter');}
        if (!(pic instanceof Array))	{throw ('The publishRumor need an array as second parameter');}
        if (typeof success!= 'function'){throw ('The publishRumor need a function as thrid parameter');}
        if (typeof error != 'function')	{throw ('The publishRumor need a function as fourth parameter');}
		
        if (keyWord) {
            if (content.indexOf(keyWord) === -1) {
                content = '#' + keyWord + '#' + content;
            }
        }
		
        var parameters = {
            'content'	: content.replace(/\uff20/ig, '@'),
            'pic'		: pic.join(','),
            'styleid'	: styleid,
			'retcode'   : scope.doorretcode||""
        };
		scope.doorretcode = "";
        Utils.Io.Ajax.request('/mblog/publish.php', {
            'POST': parameters,
            'onComplete': function(json){
                if (json.code == 'A00006') {
                    success(json.data, parameters);
                }
                else 
                    if (json.code == 'M00008') {
                        window.location.replace(json.data);
                    }else {
                        error(json);
                    }
            },
            'onException': function(){
                error();
            },
            'returnType': 'json'
        });
    };
})(App);
