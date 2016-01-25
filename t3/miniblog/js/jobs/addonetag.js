/**
 * @author Pjan | peijian@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/request.js");


/**
 * 重载添加tag函数
 * @param{String}tagName 标签名称
 * @param{Boolean}recommendedTag　是否是推荐标签
 * */
App.addOneTag = function(tag, dom){
	var _data = {
		"tag":tag
	};
	var _url = 'http://t.sina.com.cn/person/aj_addusertag.php';
	
	App.doRequest(
		_data,
		_url,
		function(data,result){
			_div = '<div class="add_status">'+$CLTMSG['CX0213']+'</div>';
			dom.parentNode.innerHTML = _div;
		},function(result){
			App.alert(result);
		});
};