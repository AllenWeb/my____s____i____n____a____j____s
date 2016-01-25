/**
 * 基础弹层
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("diy/builder3.js");
$import("sina/core/events/addEvent.js");
$import("diy/unit.js");

(function(proxy){
	
	var d = document, zIndex = 1000;
	
	function b2(t, b){return App.builder3(t,b,{"dd":"id", "mm":"action"})};
	
	proxy.PopUp = function(){
		var it = App.unit(), u = it.u, wrap, body, mask, cp = "position:absolute;clear:both;", ch = "visibility:hidden;display:none", cs = "width:100%;height:100%", rall = App.removeChildren;
		with(it.wrap = wrap = $C("div")){
			appendChild(it.body = body = $C("div"));
			style.cssText = [cp,ch,"z-index:"+zIndex++].join(";");
		}
		/**
		 * 设置弹层蒙板,默认不进行初始化，如果有需要则执行 PopUp.mask()
		 */
		it.mask = u(function(){
			if(!mask){
				wrap.insertBefore(mask = $C("iframe"),body);
				with(mask){
					frameborder = 0;
					src = "about:blank";
					style.cssText = [cp,cs,"filter:alpha(opacity=0);opacity:0;z-index:-1"].join(";");
				}
			}
		})
		/**
		 * 设置弹层内容
		 * @param {String} html 必选参数，弹层内部html代码
		 */
		it.content = u(function(html){
			rall(body);
			it.dom = b2(html, body)["domList"];
		})
		/**
		 * 设置弹层x,y坐标
		 * @param {Number} x 必选能数
		 * @param {Number} y 必选能数
		 */
		it.position = u(function(x, y){
			with(wrap.style){
				left = x + "px";
				top = y + "px";
			}
		})
		/**
		 * 显示隐藏弹层
		 * @param {Boolean} b 必选参数，可选参数为 true, false, 1, 0
		 */
		it.visible = u(function( b ){
			with(wrap.style){
				visibility = b? "visible": "hidden";
				display = b? "": "none";
			}
		})
		/**
		 * 设置弹层深度
		 * @param {Number} nIndex 必选参数
		 */
		it.zIndex = u(function(nIndex){
			wrap.style.zIndex = nIndex;
		})
		/**
		 * 移除弹层
		 */
		it.destroy = u(function(){
			wrap.parentNode.removeChild(wrap);
			wrap = body = mask = dom = null;
		})
		d.body.appendChild(wrap);
		return it;
	}
	
})(App);