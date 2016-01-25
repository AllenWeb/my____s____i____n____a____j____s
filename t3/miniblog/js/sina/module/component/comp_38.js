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
 * 定义漂流瓶组件
 */
$registComp("38", {
	load : function () {
		$Debug("load has been overwrote.");
		if(scope.comp_38_loaded != null){
			this.getContent().innerHTML = this.getContent().innerHTML;
		}
		scope.comp_38_loaded = true;
	},
	show : function (sResult) {
		$Debug("show has been overwrote.");
		this.getContent().innerHTML = sResult;
//		this.getTitle().innerHTML = "应用";
		this.finalize();
	}
});