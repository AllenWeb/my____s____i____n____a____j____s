/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 引导模块 真实姓名填写
 */
$import("sina/utils/io/ajax.js");
$import("sina/core/events/addEvent.js");

$registJob('guide_name',function(){
	if($E('real_name')){
		var submit =  function(){
			Utils.Io.Ajax.request('http://t.sina.com.cn/person/aj_full_info.php',{
				'POST' : App.htmlToJson($E('real_name')),
				'onComplete' : function(json){
					if(json.code == 'A00006'){
						window.location.reload();
					}else{
						$E('errorinfo').innerHTML = $SYSMSG[json.code];
						$E('errorinfo').parentNode.style.display = '';
					}
				},
				'onException' : function(){
					window.location.reload();
				},
				'returnType' : 'json'
			});
		};
		var skip = function(){
			var json = App.queryToJson(window.location.search.slice(1));
			json.skip = 2;
			var url = location.protocol + '//' + location.hostname + location.pathname + '?' + App.jsonToQuery(json);
			location.replace(url);
		};
		if($E('name_sub')){
			Core.Events.addEvent($E('name_sub'),function(){
				if($E('real_name').getElementsByTagName('INPUT')[0].value){
					submit();
				}else{
					skip();
				}
			},'click');
			Core.Events.addEvent($E('real_name').getElementsByTagName('INPUT')[0],function(){
				$E('errorinfo').parentNode.style.display = 'none';
			},'blur');
		};
		if($E('name_skip')){
			Core.Events.addEvent($E('name_skip'),function(){
				skip();
			},'click');
		};
	}
});