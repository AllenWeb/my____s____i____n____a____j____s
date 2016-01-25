/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/app.js");
$import("diy/unit.js");
$import("diy/ELSize.js");
(function(ns){
	var d = document, udf;
	App.Wipe = function( eWrap, eTarget, nCount ){
		var it = App.unit(), es = App.ELSize, isPlaying = 0, u = it.u, timer, c = nCount||8, wp = eWrap, ws, bp = eTarget, bs = bp.style, parent, sw, sh, ow, oh;
		if(!wp){
			wp = $C("div");
			wp.style.cssText = "position:relative;clear:both";
			parent = bp.parentNode;
			parent.insertBefore(wp,bp);
			wp.appendChild(bp);
		}
		ws = wp.style;
		it.isPlaying = function(){
			return isPlaying;
		}
		it.isVisible = function(){
			return isVisible;
		}
		it.reset = u(function(){
			isPlaying = 0;
			clearInterval(timer);
			ws.visibility = "hidden";
			sw = sh = ow = oh = null;
		})
		it.wipe = u(function(sType, bVisible, fCallBack, bReverse){
			if(isPlaying){return}
			var d, a, t, o, r, q, i = 1, v = bVisible == udf? true: bVisible, que, uque;
			isPlaying = 1;
			ws.visibility = ws.overflow = "hidden";
			ws.display = "block";
			bs[$IE? "styleFloat": "cssFloat"] = "left";
			bs.marginTop = bs.marginLeft = "0px";
			bs.width  = ( sw || (sw = es(bp,"width")))  + "px";
			bs.height = ( sh || (sh = es(bp,"height"))) + "px";
			ws.width  = ( ow || (ow = bp.offsetWidth))  + "px";
			ws.height = ( oh || (oh = bp.offsetHeight)) + "px";
			bs.marginTop = bs.marginLeft = "0px";
			d = {"up":0,"down":1,"left":2,"right":3}[sType];
			a = ["marginTop","height","marginLeft","width"][d];
			t = [bs,ws,bs,ws][d];
			o = [oh,oh,ow,ow][d];
			r = [0,1,0,1][d];
			que = [o]; que[c] = 0;
			for(i; i<c; i++){ que[i] = (o = o/2)}
			bReverse && que.reverse();
			uque = que.concat().reverse();
			q = (v ? r: !r)? uque: que;
			t[a] = [q[0],"px"].join("");
			ws.visibility = "visible";
			clearInterval(timer);
			timer = setInterval(function(){
				if (q.length) {
					t[a] = Math.floor(q.shift()) + "px";
					return;
				}
				clearInterval(timer);
				isPlaying = 0;
				v && (ws.overflow = "");
				try{bs.cssText = "";fCallBack && u(fCallBack)()}catch(e){}
			},30);
		})
		return it;
	};
})(App);
