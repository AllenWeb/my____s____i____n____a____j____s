$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/system/pageSize.js");

/**
 * 创建一个iframe蒙板
 * @param {Object} zIndex  必选参数，蒙板把在的z-index值，默认为 799;
 * @param {Object} fResize 可选参数，在窗口尺寸发生改变时回调，并将窗口尺寸回传给注册函数
 * @author Liusong liusong@staff.sina.com.cn
 * @example 
 *  <div id="divExample" style="position:absolute;background-color:#990000;z-index:800">
 *     信教主，教主让你吃白薯
 *  </div>
 *  function fOnResize(pageSize){
 *      var oDiv = $E("divExample");
 *      oDiv.style.left = (aPos[2] - this.offsetWidth)/2+"px";
 *      oDiv.style.top  = (aPos[3] - this.offsetHeight)/2+"px";
 *  }
 *  var oMask = App.iframeMask(799,fOnResize);
 *      oMask.show();
 */

App.iframeMask = function(zIndex,fResize){
	var IM = {};
	var oParent = IM.oParent = document.getElementsByTagName("body")[0];
	var oMask = IM.oMask = oParent.appendChild($C("div"));
	var oProtective = IM.oProtective = oParent.appendChild($C("iframe"));
		oProtective.frameborder = 0;
	var oMStyle = oMask.style;
	var oPStyle = oProtective.style;
	var oPStyle = oProtective.style;
		oMStyle.top             = oPStyle.top             = "0px";
		oMStyle.left            = oPStyle.left            = "0px";
		oMStyle.overflow        = oPStyle.overflow        = "hidden";
		oMStyle.border          = oPStyle.border          = "0px";
		oMStyle.position        = oPStyle.position        = "absolute";
		oMStyle.display         = oPStyle.display         = "none";
		oMStyle.backgroundColor = oPStyle.backgroundColor = "#000000";
		oMStyle.zIndex = zIndex || 799;
		oPStyle.zIndex = (zIndex - 1)||798;
		Core.Dom.setStyle(oMask,       "opacity", "0.15");
		Core.Dom.setStyle(oProtective, "opacity", "0");
		//重置蒙板尺寸
		IM.oMaskResize = (function(p){
			return function(){
				var pageSize = Core.System.pageSize();
				p.oMask.style.width  = p.oProtective.style.width  = Math.max(document.body.scrollWidth, (document.documentElement)?document.documentElement.scrollWidth:0) + "px";
				p.oMask.style.height = p.oProtective.style.height = pageSize[1] + "px";
				if(fResize){fResize(pageSize)};
			};
		})(IM);
		//隐藏iframe蒙板
		IM.hidden = (function(p){
			return function(){
				p.oMask.style["display"] = p.oProtective.style["display"] = "none";
			};
		})(IM);
		//显示iframe蒙板
		IM.show = (function(p){
			return function(){
				p.oMask.style["display"] = p.oProtective.style["display"] = "block";
			};
		})(IM);
		IM.oMaskResize();
		Core.Events.addEvent(window, IM.oMaskResize, "resize");
	return IM;
};