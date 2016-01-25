/**
 * @fileoverview
 *	定义访客组件类
 *	各产品首页
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-08
 */
$import("sina/module/component/_component.js");
// 引入接口
$import("sina/interface.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/template.js");
$import("sina/module/component/registComp.js");
$import("sina/module/deleteVistorOrFriendOrBlac.js");

/**
 * 定义访客组件类(首页访客)
 */
$registComp("12", {
	dataUrl : "http://footprint.cws.api.sina.com.cn/listhtml.php",
	load : function () {
		var _urlcfg = this.getParam();
		$Debug("load has been overwrote.");
		var _visitor = (this.getReqObject != null) ? this.getReqObject() : new Interface(this.dataUrl, "jsload");
//		var _visitor = new Interface("http://footprint.cws.api.sina.com.cn/listhtml.php?pid=1&uid=1269737157", "ijax");
		_visitor.request({
			GET : _urlcfg,
			//接口传输正常，且状态码为A00006,(可选)
			onSuccess : (function(result){
//				alert("ok: " + result.rang);
				if (result.record == "") {
					this.showEmpty();
				}
				else {
					this.show(result.record);
				}
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
		//this.show("");
	},
	showEmpty : function () {
		this.getContent().innerHTML = '<div class="nodata2">暂无访客。</div>';
	},
	getParam : function () {
		var _urlcfg = {
			uid : scope.$uid,
			pagesize : 12
		};
		var _pid = {
			"blog" : 1,
			"vblog" : 2,
			"quanzi" : 4,
			"photo" : 8,
			"space" : 128,
			"tiezi" : 64,
			"music" : 1024
		};
//		博客:1
//  播客:2
//  圈子:4
//  相册:8
//魔方:16
//邮箱:32
//  论坛:64
//  Space:128
//  贴吧:256
		_urlcfg.pid = _pid[$CONFIG.$product];
		return _urlcfg;		
	},
	parse : function (arrData) {
		$Debug("parse has been overwrote.");
		var _template = this.template || '<div><b>#{name}</b></div><div>#{url}</div>';
		_template = new Utils.Template(_template);
		var str = _template.evaluateMulti(arrData);
		this.show(str);
	},
	show : function (sResult) {
		$Debug("show has been overwrote.");
		$Debug("html="+sResult);
		//var html="<div class=\"CP_li3\"><ul class=\"CP_lis\"><li class=\"CP_litem\"><p class=\"CP_avt\"><a class=\"CP_avt_a\" href=\"http:\/\/blog.sina.com.cn\/u\/1313533191\" target=\"_blank\"><img title=\"test117\" alt=\"test117\" class=\"CP_brd\" src=\"http:\/\/portrait8.sinaimg.cn\/1313533191\/blog\/50\"\ onmouseover=\"this.parentNode.nextSibling.style.display=\'\';\" onmouseout=\"this.parentNode.nextSibling.style.display=\'none\';\" /><\/a><img style=\'display:none;\' onmouseover=\"this.style.display=\'\';\" onmouseout=\"this.style.display=\'none\';\" align=\"absmiddle\" title=\"\u5220\u9664\u8bbf\u95ee\u8bb0\u5f55\" alt=\"\" src=\"http:\/\/www.sinaimg.cn\/pay\/space\/images2\/images\/icon\/icon16.gif\" class=\"CP_i CP_i_del\" onclick=\"$deleteVistorOrFirendOrBlack('1313533191','c','blog');return false;\" \/><\/p><p class=\"CP_pf_nm\"><a href=\"http:\/\/blog.sina.com.cn\/u\/1313533191\" title=\"test117\" alt=\"test117\" target=\"_blank\">test117<\/a><\/p><p class=\"CP_pf_tm CP_txtc\"><cite>12\u67085\u65e5<\/cite><\/p><\/li><li class=\"CP_litem\"><p class=\"CP_avt\"><a class=\"CP_avt_a\" href=\"http:\/\/blog.sina.com.cn\/u\/1325239402\"><img title=\"wangxinyu\" alt=\"wangxinyu\" class=\"CP_brd\" src=\"http:\/\/portrait3.sinaimg.cn\/1325239402\/blog\/50\"\/><\/a><img align=\"absmiddle\" title=\"\u5220\u9664\u8bbf\u95ee\u8bb0\u5f55\" alt=\"\" src=\"http:\/\/www.sinaimg.cn\/pay\/space\/images2\/images\/icon\/icon16.gif\" class=\"CP_i CP_i_del\" onclick=\"$deleteVistorOrFirendOrBlack('1325239402','c','blog');return false;\" \/><\/p><p class=\"CP_pf_nm\"><a href=\"http:\/\/blog.sina.com.cn\/u\/1325239402\" title=\"wangxinyu\" alt=\"wangxinyu\">wangxi...<\/a><\/p><p class=\"CP_pf_tm CP_txtc\"><cite>11\u670825\u65e5<\/cite><\/p><\/li><li class=\"CP_litem\"><p class=\"CP_avt\"><a class=\"CP_avt_a\" href=\"http:\/\/blog.sina.com.cn\/u\/1315842000\"><img title=\"ChinaMajor\" alt=\"ChinaMajor\" class=\"CP_brd\" src=\"http:\/\/portrait1.sinaimg.cn\/1315842000\/blog\/50\"\/><\/a><img align=\"absmiddle\" title=\"\u5220\u9664\u8bbf\u95ee\u8bb0\u5f55\" alt=\"\" src=\"http:\/\/www.sinaimg.cn\/pay\/space\/images2\/images\/icon\/icon16.gif\" class=\"CP_i CP_i_del\" onclick=\"$deleteVistorOrFirendOrBlack('1315842000','c','blog');return false;\" \/><\/p><p class=\"CP_pf_nm\"><a href=\"http:\/\/blog.sina.com.cn\/u\/1315842000\" title=\"ChinaMajor\" alt=\"ChinaMajor\">ChinaM...<\/a><\/p><p class=\"CP_pf_tm CP_txtc\"><cite>11\u670821\u65e5<\/cite><\/p><\/li><li class=\"CP_litem\"><p class=\"CP_avt\"><a class=\"CP_avt_a\" href=\"http:\/\/blog.sina.com.cn\/u\/1565713432\"><img title=\"wwwwwwww\" alt=\"wwwwwwww\" class=\"CP_brd\" src=\"http:\/\/portrait1.sinaimg.cn\/1565713432\/blog\/50\"\/><\/a><img align=\"absmiddle\" title=\"\u5220\u9664\u8bbf\u95ee\u8bb0\u5f55\" alt=\"\" src=\"http:\/\/www.sinaimg.cn\/pay\/space\/images2\/images\/icon\/icon16.gif\" class=\"CP_i CP_i_del\" onclick=\"$deleteVistorOrFirendOrBlack('1565713432','c','blog');return false;\" \/><\/p><p class=\"CP_pf_nm\"><a href=\"http:\/\/blog.sina.com.cn\/u\/1565713432\" title=\"wwwwwwww\" alt=\"wwwwwwww\">wwwwwwww<\/a><\/p><p class=\"CP_pf_tm CP_txtc\"><cite>11\u670810\u65e5<\/cite><\/p><\/li><li class=\"CP_litem\"><p class=\"CP_avt\"><a class=\"CP_avt_a\" href=\"http:\/\/blog.sina.com.cn\/u\/1406758883\"><img title=\"\u6de1\u6de1\u82b1\u9999\u5165\u68a6\u6765\" alt=\"\u6de1\u6de1\u82b1\u9999\u5165\u68a6\u6765\" class=\"CP_brd\" src=\"http:\/\/portrait4.sinaimg.cn\/1406758883\/blog\/50\"\/><\/a><img align=\"absmiddle\" title=\"\u5220\u9664\u8bbf\u95ee\u8bb0\u5f55\" alt=\"\" src=\"http:\/\/www.sinaimg.cn\/pay\/space\/images2\/images\/icon\/icon16.gif\" class=\"CP_i CP_i_del\" onclick=\"$deleteVistorOrFirendOrBlack('1406758883','c','blog');return false;\" \/><\/p><p class=\"CP_pf_nm\"><a href=\"http:\/\/blog.sina.com.cn\/u\/1406758883\" title=\"\u6de1\u6de1\u82b1\u9999\u5165\u68a6\u6765\" alt=\"\u6de1\u6de1\u82b1\u9999\u5165\u68a6\u6765\">\u6de1\u6de1\u82b1...<\/a><\/p><p class=\"CP_pf_tm CP_txtc\"><cite>11\u67089\u65e5<\/cite><\/p><\/li><\/ul><\/div>";
		this.getContent().innerHTML = sResult;
		this.finalize();
	}
});
