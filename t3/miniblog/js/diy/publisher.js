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
//$import("sina/utils/cookie/cookie.js");
$import("sina/core/base/detect.js");
//dom
$import('diy/dom.js');
//io
$import("sina/utils/io/ajax.js");
//event
$import('sina/core/events/addEvent.js');
$import("sina/core/events/stopEvent.js");
//moudel
$import("jobs/msgDialog.js");
$import("diy/general_animation.js");
$import("diy/mb_dialog.js");
$import("diy/forbidrefresh_dialog.js");
$import("diy/TextareaUtils.js");
$import("diy/BindAtToTextarea.js");
$import("diy/timer.js");
//check user islogin
$import("diy/check_login.js");
$import("jobs/mod_login.js");
$import("diy/comm/storage.js");

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
		config.init = config.init || function(){};
        if (!elements) {
            throw 'publisher need elements as parameters';
        }
        
        var that = {};
        var spec = {};
		var allow = true;
        spec.pluginList = [];
        spec.content = '';
        spec.pic = [];
		       
        //清空内容，回到原始状态
        var reset = function(){
            if (config.topic) {
                elements['editor'].value = '#' + config.topic + '#';
            }
            else {
                elements['editor'].value = '';
            }
            doLimit();
            spec.pic = [];
            for (var i = 0, len = spec.pluginList.length; i < len; i += 1) {
                if (typeof spec.pluginList[i].clear == 'function') {
                    try{spec.pluginList[i].clear()}catch(e){};
                }
            }
        };
        
        //发布成功后的调用
        var success = function(json, parameters){
            reset();
            config.onSuccess(json, parameters);
			casheInput.clear();
        };
        
        //发布失败的调用
        var error = function(json){
            if (json && json['code']) {
                if (json.code == "MR0050") {
                    App.forbidrefresh(function(){
						App.Dom.removeClass(elements['submit'],' bgColorA_No');
						submit();
                    }, "/mblog/publish.php");
                    return false;
                }
                App.alert({
                    'code': json['code']
                });
            }
            else {
                App.alert({
                    'code': 'R01404'
                });
            }
            config.onError(json);
        };
        
        //获得内容的长度
		///^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
		var getLength = function(str){
            var reg = new RegExp(config['emptyStr'][0], 'g');
            var len = Core.String.trim(str.replace(reg, '')).length;
            if (len > 0) {
				var min=41,max=140,surl=24,tmp=str; //surl按照短链为23英文字符，考虑中文设定为24防止用户输入差异
				var urls = str.match(/http:\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-A-Z0-9a-z\$\.\+\!\*\(\)//,:;@&=\?\~\#\%]*)*/gi) || [];
				var urlCount = 0;
				for(var i=0,len=urls.length;i<len;i++){
					var count = Core.String.byteLength(urls[i]);
					if(/^(http:\/\/sinaurl.cn)/.test(urls[i])){//同步php端操作对该类型链接做特例处理，统计链接全部字数
						continue;
					}else if(/^(http:\/\/)+(t.sina.com.cn|t.sina.cn)/.test(urls[i])){//'|sinaurl.cn'特例调整移除
						//本域的小于41字符按照实际值算，大于41小于等于140以23字符算，超过140为23加溢出长度
						urlCount += count<=min?count:(count<=max?surl:(count-max+surl));
					}else{
						//非本域的小于140的按照23算，超过140为23加溢出长度
						urlCount += count<=max?surl:(count-max+surl);
					}
					tmp = tmp.replace(urls[i],'');
				};
				return Math.ceil((urlCount + Core.String.byteLength(tmp))/ 2)
            }
            else {
                return 0;
            }
        };
		
        //cash user input
        var casheInput = {
			cashKey : 'pub_'+$CONFIG.$uid,
            save: function(){
				if(Core.Base.detect.$IOS){return;}
				App.storage.set(casheInput.cashKey, elements['editor'].value);
            },
            recover: function(){
				if(Core.Base.detect.$IOS){return;}
				elements['editor'].value = App.storage.get(casheInput.cashKey)==null ?'':App.storage.get(casheInput.cashKey);
            },
            clear: function(name){
				if(Core.Base.detect.$IOS){return;}
				App.storage.set(casheInput.cashKey,'');
            },
            action: function(){
                var len = getLength(elements['editor'].value);
                if (len <= 140) {
                    casheInput.save();
                }
            },
			casheCur : function(e){
				var selValue = App.TextareaUtils.getSelectedText(elements['editor']);
				var slen = (selValue == '' || selValue == null) ? 0 : selValue.length;
				var start = App.TextareaUtils.getCursorPos(elements['editor']);
				
				var curStr = start + '&' + slen;
				elements['editor'].setAttribute('range',curStr);
			},
			getCur : function(){
				var range = elements['editor'].getAttribute('range');
				return range.split('&');
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
                submitEnable();
				casheInput.save();
            }
            else {
                submitDisable();
            }
        };
        
        var submitDisable = function(){
            config.onDisable();
        };
        
        var submitEnable = function(){
            config.onEnable();
        };
		
		var checkLogin = function(arg){
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
        //发布区域
        var submit = function(){
			if(!checkLogin(arguments)){
				return;
			};
			if(App.Dom.hasClass(elements['submit'].parentNode,'bgColorA_No')){
				if (!testlimit()) {
                    App.cartoon.noticeInput(elements['editor']);
					return false;
                }
			}
            submitDisable();
            
            spec.content = Core.String.trim(elements['editor'].value || '');
			
			casheInput.clear();
            
            publishRumor(spec.content, spec.pic, success, error, config.styleId, config.topic);
            return false;
        };
        
        var ctrlSubmit = function(event){
            if (event.ctrlKey == true && event.keyCode == "13") {
                submit();
            }
            return false;
        };
        //end publish
		
		
		//计时器
		var timer,_num = 0;
        var timerAdd = function(){
			//字符计算
			if(_num >= 30){
				if (testlimit(config.onLimit)) {
	                submitEnable();
					casheInput.save();
	            }
	            else {
	                submitDisable();
	            }
				_num = 0;
			}
			_num++;
		};
		//输入字符计算加入时间轴
		var timerControl = function(e){
			switch(e.type){
				case 'focus' :
					if(!timer){
						timer = App.timer.add(function(){timerAdd();});
					}
					App.timer.play(timer);
					break;
				case 'blur' :
					App.timer.pause(timer);
					break;
			}
		};
		Core.Events.addEvent(elements['editor'],timerControl,'focus');
		Core.Events.addEvent(elements['editor'],timerControl,'blur');
        //事件绑定
		App.BindAtToTextarea(elements['editor']);
        Core.Events.addEvent(elements['submit'], submit, 'click');
        Core.Events.addEvent(elements['editor'], ctrlSubmit, 'keyup');
        Core.Events.addEvent(elements['editor'], casheInput.action, 'keyup');
		Core.Events.addEvent(elements['editor'], casheInput.casheCur, 'mouseup');
		Core.Events.addEvent(elements['editor'], casheInput.casheCur, 'keyup');
        //对外接口
		
		//缓存插入话题用户操作
		that.casheInput = casheInput.save;
		that.casheCur = casheInput.casheCur;
		that.getCur = casheInput.getCur;

		that.elements = elements;
		
        that.limit = doLimit;
		that.checkLogin = checkLogin;
        that.getDom = function(key){
            return elements[key];
        };
        that.set = function(key, value){
            spec[key] = value;
        };
        that.plugin = function(ext){
            //$Debug(ext);
            spec.pluginList.push(ext);
            ext.init(that);
            return that;
        };
		that.enabled = function(b){
			allow = b;
			!b ? submitDisable(): doLimit();
		};
		that.insertText = function(txt,func){
			func = func || function(){return true;};
			
			var cur = casheInput.getCur();
			App.TextareaUtils.unCoverInsertText(elements['editor'],txt,{'rcs':cur[0],'rccl':cur[1]});
			
			//设定插入后文本的自定义处理事件
			func(that);
			
			that.limit();
			that.casheCur();
		};
		
		//page init
		if (config.init(that)) {
			reset();
			casheInput.recover();
			casheInput.casheCur();
		}
		doLimit();
        return that;
    };
    
    var publishRumor = function(content, pic, success, error, styleid, keyWord){
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
        
        if (keyWord) {
            if (content.indexOf(keyWord) === -1) {
                content = '#' + keyWord + '#' + content;
            }
        }
        var url = '/mblog/publish.php';
        var parameters = {
            'content': content.replace(/\uff20/ig, '@'),
            'pic': pic.join(','),
            'styleid': styleid,
            'retcode': scope.doorretcode || ''
        };
		
		if(scope.appid){//用以指明发布微博的应用或客户端
		    parameters['appid'] = scope.appid;
		}
		
		var options;
		if(options = proxy.miniblogPublisher.options){
		    for(var key in options){
                if(options[key] && !(key in {})){
                    parameters[key] = options[key];
                }
            }
		}
		url = proxy.miniblogPublisher.url || url;
		
		if(scope.$eid){ //这个是新活动的提交地址，先注释掉
			//url = '/aj_publishmblog.php';
			url = '/event/aj_publishmblog.php'
			parameters['eid'] = scope.$eid;
		}
		
        scope.doorretcode = "";
        Utils.Io.Ajax.request(url, {
            'POST': parameters,
            'onComplete': function(json){
                if (json.code == 'A00006') {
                    success(json.data, parameters);
                }
                else 
                    if (json.code == 'M00008') {
                        window.location.replace(json.data);
                    }
                    else {
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
