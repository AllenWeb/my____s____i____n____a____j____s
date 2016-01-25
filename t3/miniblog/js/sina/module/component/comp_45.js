/**
 * @fileoverview
 *	定义我的应用组件类
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-08
 */
$import("sina/module/component/_component.js");
// 引入接口
$import("sina/interface.js");
$import("sina/core/function/bind2.js");
$import("sina/core/array/foreach.js");
$import("sina/utils/template.js");
$import("sina/module/component/registComp.js");
/**
 * 定义我的应用组件类
 */
$registComp("45", {
	template : '<li><a class="CP_apico" href="#{url}"><img class="CP_brd" src="#{icon}"/></a><em><a href="##{key}">#{name}</a></em></li>',
	load : function () {
		$Debug("load has been overwrote.");
		var _myapp = new Interface("http://v.space.sina.com.cn/app/list.php", "jsload");
//		var _myapp = new Interface("http://test.sina.com.cn/app/v3/list.php", "ijax");
		var _get = {};
		if(!$isAdmin){
			_get.uid = scope.$uid;
		}
		_myapp.request({
			GET : _get,
			//接口传输正常，且状态码为A00006,(可选)
			onSuccess : (function(result){
//				alert("ok: " + result.app);
				this.parse(result.app);
			}).bind2(this),
			
			//接口传输正常，且状态码不是A00006,(可选)
			onError : (function(result){
//				alert("no: " + result);
				this.parse(result.code);
			}).bind2(this),
			
			//接口传输异常,(可选)
			onFail : (function(){
				this.showError();
			}).bind2(this)
		});
//		alert("内容区域：\n\n" + this.getTitle().innerHTML);
//		}, {"uids" : "1406758883,1312273654"});
		
	},
	parse : function (arrData) {
		$Debug("parse has been overwrote.");
		var _template = this.template;
		Core.Array.foreach(arrData, function(e){
			e.url = "http://space.sina.com.cn/plugin/app.php?id=" + e.key;
		});
		_template = new Utils.Template(_template);
		var str = _template.evaluateMulti(arrData);
		// 如果是博主登录，还输出发博文等链接
		if($isAdmin){
			var _adm = [{	url : "#",
							icon : "http://www.sinaimg.cn/pay/space/spaceapp/fgp/fgp_icon_s.gif",
							name : "发博文"
						},
						{	url : "#",
							icon : "http://www.sinaimg.cn/pay/space/spaceapp/fgp/fgp_icon_s.gif",
							name : "发视频"
						},
						{	url : "#",
							icon : "http://www.sinaimg.cn/pay/space/spaceapp/fgp/fgp_icon_s.gif",
							name : "发照片"
						},
						{	url : "#",
							icon : "http://www.sinaimg.cn/pay/space/spaceapp/fgp/fgp_icon_s.gif",
							name : "发邮件"
						}];
			str = _template.evaluateMulti(_adm) + '<li class="CP_hr2"></li>' + str;
		}
		str = '<div class="CP_myapps"><ul>' + str + '</ul></div>';
		this.show(str);
	},
	show : function (sResult) {
		$Debug("show has been overwrote.");
		this.getContent().innerHTML = sResult;
//		this.getTitle().innerHTML = "应用";
		this.finalize();
	}
});