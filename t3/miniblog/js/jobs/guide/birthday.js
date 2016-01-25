/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 引导页面，生日页面
 */
$import("sina/utils/io/ajax.js");
$import("sina/core/events/addEvent.js");
$import("diy/htmltojson.js");
$import("diy/constellation.js");
$import("diy/querytojson.js");
$import("diy/jsontoquery.js");

$registJob('guide_birthday',function(){
	if($E('user_age')){
		var y = $E('user_age').getElementsByTagName('SELECT')[0];
		var m = $E('user_age').getElementsByTagName('SELECT')[1];
		var d = $E('user_age').getElementsByTagName('SELECT')[2];
		
		var rendDate = function(v){
			var total = 31;
			var curValue = parseInt(d.value) || 1;
			if(v == 3 || v == 5 || v == 8 || v == 10){
				total = 30;
			}
			if(v == 1){
				total = 29;
			}
			if(v == -1){
				total = 0;
			}
			while(d.options.length > 1){
				d.remove(1);
			}
			d.remove(0);
			for(var i = 0; i <= total - 1; i+= 1){
				d.options[d.options.length] = new Option(i+1,i+1);
			}
			d.value = Math.min(curValue,total);
		};
		var rendConstellation = function(){
			var hash = {
				'Capricorn'		: 'mojie',
				'Aquarius'		: 'shuiping',
				'Pisces'		: 'shuangyu',
				'Aries'			: 'baiyang',
				'Taurus'		: 'jinniu',
				'Gemini'		: 'shuangzi',
				'Cancer'		: 'juxie',
				'Leo'			: 'shizi',
				'Virgo'			: 'chunv',
				'Libra'			: 'tianping',
				'Scorpio'		: 'tianxie',
				'Sagittarius'	: 'sheshou'
			};
			var path = scope.$BASEIMG+'style/images/regguide/';
			var back = $E('user_age').parentNode.parentNode;
			if(parseInt(m.value,10) > 0){
				var img = hash[App.constellation(parseInt(m.value,10)-1,parseInt(d.value,10))];
				back.style.backgroundImage = 'url(' + path + img + '.jpg)';
			}else{
				back.style.backgroundImage = '';
			}
		};
		var submit = function(){
			Utils.Io.Ajax.request('http://t.sina.com.cn/person/aj_full_info.php',{
				'POST' : App.htmlToJson($E('user_age')),
				'onComplete' : function(){
					window.location.reload();
				},
				'onException' : function(){
					window.location.reload();
				},
				'returnType' : 'json'
			});
		};
		var skip = function(){
			var json = App.queryToJson(window.location.search.slice(1));
			json.skip = 1;
			var url = location.protocol + '//' + location.hostname + location.pathname + '?' + App.jsonToQuery(json);
			location.replace(url);
		};
		Core.Events.addEvent(m,function(){
			rendDate(parseInt(m.value,10)-1);
			rendConstellation();
		},'change');
		Core.Events.addEvent(d,function(){
			rendConstellation();
		},'change');
		
		if($E('age_next')){
			Core.Events.addEvent($E('age_next'),function(){
				if(y.value || m.value || d.value){
					submit();
				}else{
					skip();
				}
			},'click');
		}
		if($E('age_skip')){
			Core.Events.addEvent($E('age_skip'),function(){
				skip();
			},'click');
		}
	}
});