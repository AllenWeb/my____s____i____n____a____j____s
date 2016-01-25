/**
 * @fileoverview
 *	模块添加、删除、拖动保存数据到 Conf 接口
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-10-06
 */
$import("sina/interface.js");
$import("sina/utils/io/jsload.js");
$import("sina/module/component/_component.js");
$import("sina/module/component/comp.js");
Module.Component.updateComponentToConf = function (_data, _callback){
	var _param = {
		uid : scope.$uid,
		productid : scope.pid_map[$CONFIG.$product],
		module : _data
	};
	var _comps_manage = new Interface("http://icp.cws.api.sina.com.cn/pfconf/module_manager.php", $IE6 ? "ijax" : "jsload");
	var _post = _callback || {};
	_post.GET = _param;
	if (_callback == null) {
		_post.onSuccess = function(_data){
			$Debug("success:" + _data);
			window.location.reload();
		};
		_post.onError = function(_data){
			$Debug("error:" + _data.code);
			showError(_data.code);
		};
		_post.onFail = function(){
			traceError("S00001");
		};
	}
	_comps_manage.request(_post);
};
