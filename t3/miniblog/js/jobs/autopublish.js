$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");

App.autoPublish = function(content,pic){
	Utils.Io.Ajax.request('/mblog/publish.php', {
		'POST': {
			'content' : decodeURIComponent(content),
			'pic' : pic || ''
		},
		'onComplete': function(json){
			if(json.code === 'A00006'){
				App.alert({'code':'A00006'},{'icon':3});
				try{
					App.medalNewClose();
				}catch(exp){
					
				}
			}else{
				App.alert({'code':json.data});
			}
		},
		'onException': function(){},
		'returnType': 'json'
	});
};
