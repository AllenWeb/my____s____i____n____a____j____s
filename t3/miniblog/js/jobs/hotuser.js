/**
 * @author chibin
 	人气用户推荐
 */
$registJob('hotuser', function(){
	var ___init = function(){
		var dom = $E('right_hot_user');
		
		if(!dom){
			return false;
		}
		Utils.Io.Ajax.request('/person/aj_hotuser.php', {
                    'GET': {
                        'ouid':scope.$oid||''
                    },
                    'onComplete': function(json){
                        if (json.code === 'A00006' && json.data) {
							dom.innerHTML = json.data;
                        }
                        else {
                            dom.innerHTML = "";
							dom.style.display="none";
                        }
                        
                    },
                    'onException': function(exp2){   
                    },
                    'returnType': 'json'
                });
	}
	if (scope.rightmodule) {
		App.CustomEvent.add("widget", "app6", ___init);
	}else{
		___init();
	}
});

