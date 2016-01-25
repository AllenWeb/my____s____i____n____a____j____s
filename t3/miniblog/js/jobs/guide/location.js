/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 引导页面，填写所在地
 */
$import("sina/utils/io/ajax.js");
$import("sina/core/events/addEvent.js");
$import("diy/provinceandcity.js");
$import("diy/htmltojson.js");

$registJob('guide_location',function(){
	try{

	if($E('location')){
		var prov = $E('location').getElementsByTagName('SELECT')[0];
		var city = $E('location').getElementsByTagName('SELECT')[1];
		var provCode = prov.getAttribute('truevalue');
		var cityCode = city.getAttribute('truevalue');
		var provAndCity	= new App.ProvinceAndCity(
			prov,
			city,
			0,
			0
		);
	}
	
	if($E('location_sub') && $E('location')){
		Core.Events.addEvent($E('location_sub'),function(){
			var data = App.htmlToJson($E('location'));
			if(data.province == 0){
				$E('errorinfo').innerHTML = $SYSMSG['M01008'];
				$E('errorinfo').parentNode.style.display = '';
				return false;
			}
			Utils.Io.Ajax.request('http://t.sina.com.cn/person/aj_full_info.php',{
				'POST' : data,
				'onComplete' : function(json){
					if(json.code == 'A00006'){
						window.location.reload();
					}else{
						$E('errorinfo').innerHTML = $SYSMSG[json.code];
						$E('errorinfo').parentNode.style.display = '';
					}
				},
				'onException' : function(){},
				'returnType' : 'json'
			});
		},'click');
		Core.Events.addEvent(prov,function(){
			if(this.value != 0){
				$E('errorinfo').parentNode.style.display = 'none';
			}
		},'change');
	}
	
	}catch(exp){
		console.log(exp);
	}
});


