/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/app.js");
$import("diy/unit.js");
$import("diy/builder3.js");
$import("diy/removeChildren.js");
$import("diy/PopUpWipe.js");
$import("diy/removeChildren.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
(function(ns){
	var d          = document,
		ce         = Core.Events,
		adde       = ce.addEvent,
		removee    = ce.removeEvent,
		stope      = ce.stopEvent,
		rall       = App.removeChildren,
		unf,
		builder    = function(t, b){return App.builder3(t,b,{"dd":"id", "mm":"action"})};
		
		/**
		 * 弹出气泡层
		 * @example
		 	App.BasePopUpDialog().content("hello1").position(0,0).icon(1).addButton("确认",function(){alert("确认")}).addButton("确认",function(){alert("取消")}).wipe("left",true,function(){
    			var it = this.it;
    			setTimeout(function(){
        			it.close();
    			},1000)
			});
			App.BasePopUpDialog().content("hello2").position(300,0).icon(2).addButton("确认",function(){alert("确认")}).addButton("确认",function(){alert("取消")}).wipe("right");
			App.BasePopUpDialog().content("hello3").position(0,300).icon(3).addButton("确认",function(){alert("确认")}).addButton("确认",function(){alert("取消")}).wipe("up");
			App.BasePopUpDialog().content("hello4").position(300,300).icon(4).addButton("确认",function(){alert("确认")}).addButton("确认",function(){alert("取消")}).wipe("down");
		 */
		ns.BasePopUpDialog = function(){
			var contnet = '<div id="panel" class="miniPopLayer" style="width:200px;"><div id="typePanel" class="txt1 gray6"><img class="tipicon tip1" id="icon" src="' + scope.$BASECSS + 'style/images/common/PY_ib.gif"/><div id="content"></div></div><div id="buttonPanel" style="display:none" class="btn"></div></div>';
			var it = ns.PopUpWipe().content(contnet), u = it.u, dom = it.dom;// close = dom.close;
			it.show = u(function(){
				it.visible(true);
			})
			it.hide = u(function(){
				it.visible(false);
			})
			it.width = u(function(nWidth){
				dom["panel"].style.width = (nWidth||200) + "px";
			})
			it.addButton = u(function(sLabel, fClick){
				if (sLabel === unf && fClick === unf) {
					rall(dom["buttonPanel"])
					return;
				};
				var span;
				dom["buttonPanel"].appendChild(span = $C("span"));
				var button = builder(['<a id="button" style="width:39px;" class="newabtn_ok" href="javascript:void(0)" onclick="return false;"><em>',sLabel,'</em></a>'].join(""),span)["domList"]["button"];
				button.onclick = u(fClick);
				dom["buttonPanel"].style.display = "";
			})
			it.content = u(function(sContent){
				dom["content"].innerHTML = sContent;
			})
			it.icon = u(function(nType){
				dom["icon"].className = ["tipicon tip",nType].join("")
			})
			it.wipe = u(function(sType, bVisible, fCallBack){
				this.sup(sType, bVisible, fCallBack);
			},"wipe")
			adde(window,function(){it.visible(false)},"resize");
			return it;
		};
		ns.PopUpAlert = (function(){
			var it, u, cx, cy, clock;
			return function(){
				if(it){ return it }
				it = ns.BasePopUpDialog();
				u = it.u;
				it.yes = u(function(f){
					it.onYes = f
				});
				it.close = u(function(f){
					clearTimeout(clock);
					typeof it.onYes=="function" && it.onYes();
					this.sup();
				},"close");
				it.lateClose = u(function(n){
					clearTimeout(clock);
					clock = setTimeout(function(){it.close()},n||3000);
				})
				it.position = u(function(x,y){
					if(x!=cx || y!=cy){
						cx = x; cy = y;
						clearTimeout(clock);
					}
					this.sup(x,y);
				},"position");
				return it;
			};
		})();
		ns.PopUpConfirm = (function(){
			var it, u, cx, cy;
			return function(){
				if(it){ return it }
				it = ns.BasePopUpDialog();
				u = it.u;
				it.yes = u(function(f){
					it.onYes = f
				});
				it.no = u(function(f){
					it.onNo = f
				});
				it.close = u(function(f){
					typeof it.onNo=="function" && it.onNo();
					this.sup()
				},"close");
				it.addButton($CLTMSG["CX0125"],function(){
					typeof it.onYes=="function" && it.onYes();
					it.wipeHide();
				});
				it.addButton($CLTMSG["CX0126"],function(){
					it.close();
				});
				return it;
			};
		})();
})(App);

//===============================backup=====================================
//<table class="Poptips">
//    <tbody>
//    <tr>
//        <td class="top_l">
//        </td>
//        <td class="top_c">
//        </td>
//        <td class="top_r">
//        </td>
//    </tr>
//    <tr>
//        <td class="mid_l">
//        </td>
//        <td class="mid_c">
//            <div class="layerBox">
//                <div class="layerBoxCon1" style=" width:auto;">
//                    <div class="PopInfo clearFix">
//                        <div class="Pop_close">
//                            <a id="close" href="####" class="close"></a>
//                        </div>
//                        <div class="Poparrow3">
//                        </div>
//                        <div class="iconntent">
//                            <div style="width:200px">
//                                <div class="popMod_1">
//                                    <span class="img"><img class="PY_ib PY_ib_1" id="icon" src="' + scope.$BASECSS + 'style/images/common/PY_ib.gif"/></span>
//                                    <p id="content" class="gray9">
//                                    </p>
//                                </div>
//                                <div id="buttonPanel" class="MIB_btn" style="display:block;padding-top:10px">
//                                </div>
//                            </div>
//                            <div class="clearit">
//                            </div>
//                        </div>
//                    </div>
//                </div>
//            </div>
//        </td>
//        <td class="mid_r">
//        </td>
//    </tr>
//    <tr>
//        <td class="bottom_l">
//        </td>
//        <td class="bottom_c">
//        </td>
//        <td class="bottom_r">
//        </td>
//    </tr>
//	</tbody>
//</table>
//==========================================================================