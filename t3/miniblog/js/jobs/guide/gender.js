/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 引导页面，填写性别
 */

$import("sina/utils/io/ajax.js");
$import('sina/core/events/addEvent.js');
$registJob('guide_gender',function(){
	if($E('male')){
		Core.Events.addEvent($E('male'),function(){
			Utils.Io.Ajax.request('http://t.sina.com.cn/person/aj_full_info.php',{
				'POST' : {'gender' : 1},
				'onComplete' : function(){
					window.location.reload();
				},
				'onException' : function(){
					window.location.reload();
				},
				'returnType' : 'json'
			});
		},'click');
	}
	if($E('female')){
		Core.Events.addEvent($E('female'),function(){
			Utils.Io.Ajax.request('http://t.sina.com.cn/person/aj_full_info.php',{
				'POST' : {'gender' : 1},
				'onComplete' : function(){
					window.location.reload();
				},
				'onException' : function(){
					window.location.reload();
				},
				'returnType' : 'json'
			});
		},'click');
	}
});
