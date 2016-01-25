/**
 * @author liusong@staff.sina.com.cn
 */
$import("diy/check_login.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
App.widgetPublish = function( cfg ){
	try {
		var ins = {};
		var addEvent = Core.Events.addEvent;
		var leftB = Core.String.leftB;
		var byteLength = Core.String.byteLength;
		var trim = Core.String.trim;
		var allow = false;
		ins.textarea = $E(cfg.textarea);
		ins.limit = $E(cfg.limit);
		ins.submit = $E(cfg.submit);
		ins.id = cfg.id||"publish";
		ins.topic = cfg.topic||"";
		
		App.io.register(ins.id, {
			'success': cfg["success"],
			'method': 'POST',
			'url': 'http://v.t.sina.com.cn/mblog/publish.php'
		});
		
		ins.allowSubmit = function(){
            var len = Math.ceil(byteLength(trim(ins.textarea.value))/2);
			cfg.onLimit && cfg.onLimit(len);
            return (len > 0 && len <= 140)?true:false;
        };
		
		ins.onSubmit = cfg.onSubmit || function(){
			if(!allow){return}
			var content = leftB(trim(ins.textarea.value),280);
			App.io.fire(ins.id,{
				'content': '#' + ins.topic.split('~')[0] + '#' + content,
				'appkey' : scope.$widget_appkey||"",
				'pageid' : scope.$pageid
			})
			return false;
		};
		
		ins.onLimit = function(event){
			if (event && event.ctrlKey == true && (event.keyCode == "13" || event.keyCode == "10")) {
                return;
            }
			allow = ins.allowSubmit();
 			cfg.enabled && cfg.enabled(allow);
		};
		
		ins.onCtrlSubmit = cfg.onCtrlSubmit || function(event){
            if (event && event.ctrlKey == true && (event.keyCode == "13" || event.keyCode == "10")) {
                ins.onSubmit();
            }
            return false;
        };
		
		ins.onClear = cfg.onClear || function(){
			ins.textarea.value = "";
			ins.onLimit();
		};
		
		
		addEvent(ins.textarea,ins.onLimit,"input");
		addEvent(ins.textarea,ins.onLimit,"keyup");
		addEvent(ins.textarea,ins.onCtrlSubmit,"keyup");
		addEvent(ins.submit,ins.onSubmit,"click");
		return ins;
	}catch(e){throw e}
};
