/**
 * @fileoverview
 *	定义组件基础类
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-07
 */
$import("sina/module/component/_component.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/function/cache.js");
$import("sina/core/class/create.js");
$import("sina/utils/flash/swf.js");
$import("sina/module/component/component.js");
/**
 * 定义组件基础类
 */
Module.Component.Comp = Core.Class.create();

Module.Component.Comp.prototype = {
	initialize : function(){
		if(this.isInit == true){ return; }
		this.isInit = true;
	},
	compId : 0,
	template : "",
	/**
	 * 在组件内插入一个 Flash
	 * @param {Object} option {
	 		url			[必选] SWF文件的URL
	 		id			[可选] 为SWF文件分配的id值
			width		[可选] SWF文件的宽度
			height		[必选] SWF文件的高度，默认会设置为300
			vars		[可选] 采用"Flashvars"传入的参数
			para		[可选] 传入的Flash内联参数
		}
	 * @example
		this.addFlash({
			url : "http://sjs.sinajs.cn/test.swf",
			height : "200"
		});
	 */
	addFlash : function (option) {
		// 如果没带 Flash 信息或者信息内不包含 Flash 地址，则不做处理
		if(option == null || typeof option.url == "undefined"){return;}
		var _url = option.url, _id = option.id || ("compflash_" + this.compid), _height = option.height || 300, _ver = "8", _bg = "#FFF";
		var _vars = option.vars || {}, _para = option.para || {};
		var _cnt = "comp_" + this.compid + "_content";
		Core.Dom.addHTML(this.getContent(), '<div id="' + _cnt + '" class="CP_li"></div>');
		Utils.Flash.swfView.Add(_url, _cnt, _id, 190, _height, _ver, _bg, _vars, _para);		
	},
	
	clear : function () {
		
	},
	//显示或隐藏组件
	display: function(value){
		this.getContainer().style.display=value;
	},
	// 获得标题字容器
	getTitle : function () {
		return Core.Dom.getElementsByClass($E("module_" + this.compid), "span", "title floatLeft")[0];
	},
	// 获得组件管理链接容器
	getManage : function () {
		
	},
	// 获取组件容器
	getContainer:function(){
		return $E("module_" + this.compid);
	},
	// 取得内容区域的容器
	getContent : function () {
		return Core.Dom.getElementsByClass($E("module_" + this.compid), "div", "componentContent")[0];
	},
	// 必须重载
	load : function () {
		$Debug(">>> load");
//		scope.interface_1.request({});
//		scope.interface_2.request({});
		this.parse();
	},
	// 必须重载
	parse : function () {
		$Debug(">>> parse");
		this.show();
	},
	reload : function (){
		this.clear();
		this.load();
	},
	setTitle : function () {
		
	},
	showError : function () {
		$Debug("组件加载失败");
		this.getContent().innerHTML = '<div class="nodata2">组件加载失败。</div>';
	},
	// 必须重载
	showEmpty : function () {
		$Debug("组件无数据");
		this.getContent().innerHTML = '<div class="nodata2">暂无内容。</div>';
	},
	// 必须重载	
	show : function (sResult) {
		$Debug(">>> show");
		this.getContent().innerHTML = sResult || "";
		this.finalize();
	},
	finalize : function () {
//		$Debug(">>> finalize");
	}
};
