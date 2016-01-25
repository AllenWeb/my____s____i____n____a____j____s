$import("sina/utils/flash/_flash.js");
$import("sina/utils/flash/swfObject.js");
/**
 * 往页面插入一个 Flash 文件
 * @param {Object} sURL		SWF文件的URL
 * @param {Object} sID		写入容器的ID
 * @param {Object} sPID		为SWF文件分配的id值，它将用于给embed与object标签设定name属性，以便于可以支持swliveconnect的功能，如动态传入变量
 * @param {Object} nWidth	SWF文件的宽度
 * @param {Object} nHeight	SWF文件的高度
 * @param {Object} nVersion		FlashPlayer需要的版本号，它可以详细到 '主版本号.小版本号.细节'，例如："6.0.65"。一般地，我们只需传入主版本即可，例如："6"。
 * @param {Object} sBGColor		Flash资源的背景色，16进制格式
 * @param {Object} oVar		采用"Flashvars"传入的参数
 * @param {Object} oParam	传入的Flash内联参数
 * @example
	var swf_url = "http://sjs.sinajs.cn/test.swf";
	Utils.Flash.swfView.Add(swf_url, "comp_3", "myFlash", 210, 100, "8.0.0.0", "#F00", {}, {
	        scale: "noscale",
	        allowScriptAccess: "always"
	    });
 */
Utils.Flash.swfView = {
	// 需要呈现的SWF列表
	swfList: [],
	// 添加方法
	// SwfView.Add("test.swf", "swfBox", "200", "100", "7", "#ffffff");
	Add: function (sURL, sID, sPID, nWidth, nHeight, nVersion, sBGColor, oVar, oParam) {
		if(sURL && sPID) {
			this.swfList[this.swfList.length] = {
				sURL: sURL,
				sID: sID,
				sPID: sPID,
				nWidth: nWidth,
				nHeight: nHeight,
				nVersion: nVersion,
				sBGColor: sBGColor,
				oVar: oVar,
				oParam: oParam
			};
			this.Init();
			return;
		}
	},
	// 初始化方法
	Init: function () {
		var so;
		var list = this.swfList;
		for(var i = 0, len = list.length; i < len; i ++) {
			var _list = list[i];
			so = new Utils.Flash.swfObject(_list.sURL, _list.sPID, _list.nWidth, _list.nHeight, _list.nVersion, _list.sBGColor);
			if(_list.oVar) {
				for(var key in _list.oVar) {
					so.addVariable(key, _list.oVar[key]);
				}
			}
			if(_list.oParam) {
				for(var Key in _list.oParam) {
					so.addParam(Key, _list.oParam[Key]);
				}
			}
			so.write(_list.sID);
		}
		list = [];
		_list = null;
		so = null;
	}
};