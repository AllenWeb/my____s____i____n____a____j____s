/**
 * @author chibin
 * 
 * 世博广场首页用于加关注渲染
 * 
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/insertHTML.js");
$registJob('expo_index_loadatt', function(){
	if(!scope.expo_att) return false; 
	var element={
		uids : scope.expo_att,
		url :　'/get_attrelation.php'
	};
	var render = function(htmls){
		if(htmls){
		  for(var key in htmls){
			if ($E('expo_att_' + key)) {
				Core.Dom.insertHTML($E('expo_att_' + key), htmls[key],'afterend');
				Core.Dom.removeNode($E('expo_att_' + key));
			}
		  }
		}
	};
	(function(){
		Utils.Io.Ajax.request(element['url'], {
            'POST': {
				uids: element['uids'].join(',')
			},
            'onComplete': function(json){
                if (json && json.code == 'A00006') {
                    render(json.data);
                }
            },
            'onException': function(){
               //window.location.reload();
            },
            'returnType': 'json'
        });
	})();
});
