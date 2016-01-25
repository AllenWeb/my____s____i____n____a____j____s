/**
 * 基础滑动弹层
 * @example
	App.PopUpWipe().content("hello").wipe("up",true,function(){this.it.close()});
	App.PopUpWipe().content("hello").wipe("down",true);
	App.PopUpWipe().content("hello").wipe("left",true);
	App.PopUpWipe().content("hello").wipe("right",true);
 * @author liusong@staff.sina.com.cn
 */
$import("sina/app.js");
$import("diy/PopUp.js");
$import("diy/builder3.js");
$import("diy/Wipe.js");
$import("diy/scrollTo.js");

(function(ns){
	
	var d = document, de = (d.documentElement||{}), udf, b2 = function(t, b){return App.builder3(t,b,{"dd":"id", "mm":"action"})};
	
	ns.PopUpWipe = function(){
		var it = ns.PopUp(), u = it.u, e = it.e, uque=[], type, isOpened, cx, cy, t;
		
		/**
		 * 弹层滑动
		 * @param {String}   sType     必选参数，  滑动方向，可选参数 up、down、left、right
		 * @param {Boolean}  bVisible  非必选参数，指示弹层为显示/隐藏, 默认为true
		 * @param {Function} fCallBack 非必选能数，滑动完成后回调函数
		 */
		it.ani = App.Wipe(it.wrap, it.body);
		it.wipe = u(function(sType, bVisible, fCallBack){
			type = sType;
			it.ani.wipe(sType, bVisible, fCallBack);
		});
		it.wipeHide = u(function(){
			it.ani.reset();
			it.wipe(type, false, function(){
				it.visible(false);
			});
		});
		it.position = u(function(x,y){
			if(cx!=x || cy!=y){cx = x; cy = y; it.ani.reset()}
			type = null;
			t = window.pageYOffset||Math.max(de.scrollTop, d.body.scrollTop);
			if(y<t){
				App.scrollTo(t,y);
			}
			this.sup(x,y);
		},"position");
		it.close = u(function(){
			if(!type){it.visible(false);return false}
			it.wipeHide();
		})
		return it;
	};
	
})(App);