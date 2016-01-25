/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 引导页面，填写昵称
 */
$import("sina/utils/io/ajax.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");

$import("diy/htmltojson.js");
$import('diy/check.js');
$registJob('guide_nick',function(){
	if($E('nick_name')){
		var input = $E('nick_name').getElementsByTagName('INPUT')[0];
		var check = function(str,fun,err){
			Utils.Io.Ajax.request('http://t.sina.com.cn/person/aj_checknick.php',{
				'GET' : {'nickname' : str},
				'onComplete' : function(json){
					if(json.code == 'A00006'){
						fun(json.data);
					}else{
						err(json);
					}
				},
				'onException' : function(){
					err('errorCode');
				},
				'returnType' : 'json'
			});
		};
		var submit = function(){
			Utils.Io.Ajax.request('http://t.sina.com.cn/person/aj_full_info.php',{
				'POST' : App.htmlToJson($E('nick_name')),
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
		if($E('nick_sub')){
			var lock = false;
			Core.Events.addEvent($E('nick_sub'),function(){
				if(lock){
					return false;
				}
				lock = true;
				input.value = Core.String.trim(input.value);
				check(
					input.value,
					function(){
						submit();
						lock = false;
					},
					function(err){
						$E('errorinfo').innerHTML = $SYSMSG[err.code];
						$E('errorinfo').parentNode.style.display = '';
						lock = false;
					}
				);
			},'click');
			Core.Events.addEvent(input,function(){
				$E('errorinfo').parentNode.style.display = 'none';
			},'blur');
			
			$E('nick_sub').scrollIntoView();
		}
	}
	
});