/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/unit.js");
$import("sina/core/dom/getStyle.js");

(function(){
	var it = App.unit(), u = it.u;
	App.rollOut1 = function(eWrap, eTarget, nCount){
		var it = App.unit(), es = App.ELSize, isPlaying = 0, u = it.u, timer, c = nCount || 8, wp = eWrap, ws = wp.style;
		it.queue = function(form, to){
			var m = Math.max(form, to), n = Math.min(form, to), que = [m], snap = m, i = 1;
			que[c] = n;
			for(i; i<c; i++){ que[i] = (snap = snap/2) }
			return form>to? que: que.reverse();
		};
		it.gen = function(afix, b, d){
			var i=0, qs = {}, que = [];
			for(i; i<afix.length;i++){
				if(/width|height/.test(afix[i])){
					l = es(wp, afix[i]);
				}else{
					l = parseInt(gs(wp, afix[i]));
				}
				qs[afix[i]] = it.queue(b? l: 0, b? 0: l)
				if(/up|left/.test(d)){qs[afix[i]].reverse()};
			}
			return qs
		}
		it.set = function(o, p){
			var i = 0; len = p.length, c;
			for(i; i<len; i++){
				c = o[p[i]];
				ws[p[i]] = c.shift() + "px";
			}
			return c.length
		}
		it.wipe = function(sType, bVisible, fCallBack, bReverse){
			if(isPlaying){return}
			isPlaying = 1;
			var que, w, h, v = /up|down/.test(sType), d = v? "height": "width", f, t, l;
			var i = 0, ps = {}, p = v? [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ]: [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ];
			ws.position = "relative";
			ws.visible = "hidden";
			ws.overflow = "hidden";
			ws.display = "block";
			ws.clear = "both";
			que = it.gen(p, bVisible, sType);
			it.set(que,p);
			ws.visibility = "visible";
			timer = setInterval(function(){
				if(it.set(que,p)){return}
				clearInterval(timer);
				isPlaying = 0;
				try{typeof fCallBack=="function" && u(fCallBack)()}catch(e){}
			},30);
		}
	};
})(App);
