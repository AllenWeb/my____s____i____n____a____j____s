/**
 * @author Liusong liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("sina/utils/cookie/cookie.js");

/**
 * 手机绑定信息异步加载
 */
$registJob("bind_mobile_info",function(){
	var panel = $E("bind_mobile_info");
	var _param = {};
	var setc = Utils.Cookie.setCookie;
	var getc = Utils.Cookie.getCookie;
	var delc = Utils.Cookie.deleteCookie;
	
	var getCount = function(){
		var a = decodeURIComponent(getc('uc'));
		if(a){
			a = a.split("|");
			for(var i=0;i<a.length;i++){
				a[i] = parseInt(a[i],32);
			}
			return a;
		}
		return '';
	};
	var setCount = function(a){
		for(var i=0;i<a.length;i++){
			a[i] = a[i].toString(32);
		}
		a = a.join('|');
		delc('uc');
		setc('uc', a, 24);
	};
	
	if(panel){
		_param.ouid = scope.$oid;
		if(scope.$pageid === 'mymblog'){
			_param.pageid = 'mymblog';
		}
		Utils.Io.Ajax.request("/plugins/aj_showbind.php",{
			"GET" : _param,
			"onComplete" : function (oResult){
				if(oResult.code=="A00006"){
					panel.innerHTML = oResult.data;
				}
			},
			returnType : "json"
		});	
	}
	var a = $E("attentions"), m = $E("myfans"), b = $E("mblog"), d;
	if(a && m && b){
		Utils.Io.Ajax.request("/mblog/aj_getuserinfo.php",{
			"GET" : {"oid":scope.$oid},
			"onComplete" : function (oResult){
				if(oResult.code === "A00006" && (d = oResult.data)){
					//chibin modify 2010-7-5
					if(d["attentions"].toString().length+d["myfans"].toString().length+d["mblogs"].toString().length > 14){
						a.parentNode.parentNode.className +=' funs_num';
						m.parentNode.parentNode.className +=' funs_num';
					    b.parentNode.parentNode.className +=' funs_num';	
					}
					//end modify
					a.innerHTML = d["attentions"] || 0;
					m.innerHTML = d["myfans"] || 0;
					b.innerHTML = d["mblogs"] || 0;
					//写入cookie
					var c = [d["attentions"], d["myfans"], d["mblogs"]];
					setCount(c);
				}else{
					//如果返回失败，则读取cookie数据
					var c = getCount();
					if(c){
						a.innerHTML = d[0];
						m.innerHTML = d[1];
						b.innerHTML = d[2];
					}else{
						a.innerHTML = 0;
						m.innerHTML = 0;
						b.innerHTML = 0;
					}
				}
			},
			returnType : "json"
		});	
	}

});
