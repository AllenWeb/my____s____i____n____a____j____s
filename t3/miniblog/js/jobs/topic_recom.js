/**
 * @author chibin
 *
 * 话题推荐
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
App.topic_recommend = function(el,topic){
    var tpc = $E("cat_list");
	var div = $E('category');
	if(el&&el.getElementsByTagName('EM').length > 0) return false;
	if (tpc) {
		(function(cont){
			var d = cont.getElementsByTagName('A');
			for(var i = 0;i<d.length;i++){
				d[i].style.cssText="";
				d[i].innerHTML = d[i].innerText||d[i].textContent;
			}
		})(div);
		el.style.cssText="cursor: text; text-decoration: none;";
		el.innerHTML = '<em class="MIB_txtar fb">'+el.innerHTML+'</em>' 
		Utils.Io.Ajax.request("/public/get_cat_list.php", {
			"GET": {
				cat_id: topic || ''
			},
			"onComplete": function(json){
				if (json.code == 'A00006') {
					tpc.innerHTML = json.data;
				}
				else {
					tpc.innerHTML = '';
				}
			},
			"onException": function(){
				tpc.innerHTML = '';
			},
			returnType: "json"
		});
	}
};
