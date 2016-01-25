$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/dom/getXY.js");
$import("diy/builder3.js");
$import("diy/TextareaUtils.js");
$import("diy/SimpleAjax.js");
$import("diy/PopUp.js");
$import("diy/PopUpSwfPlayer.js");
$import("diy/Group.js");
$import("diy/removeChildren.js");
$import("sina/core/string/leftB.js");
$import("sina/core/system/winSize.js");
$import("sina/core/string/byteLength.js");
/**
 * 表情弹层
 * @author liusong@staff.sina.com.cn
 */


(function(){
	var d         = document,
		api       = "/face/aj_face.php",
		ce        = Core.Events,
		cs        = Core.String,
		st        = ce.stopEvent,
		add       = ce.addEvent,
		unadd     = ce.removeEvent,
		fire      = ce.fireEvent,
		ajax      = App.simpleAjax,
		getXY     = Core.Dom.getXY,
		group     = App.group,
		removeAll = App.removeChildren,
		popUp     = App.PopUp,
		req;
		
		function b2(t, b){return App.builder3(t,b,{"dd":"id", "mm":"action"})};
		
		function encodeTitle(value){
			return value.replace(/[^\w\u4e00-\u9fa5\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u2014\uff3f]/g,"");
		}
		
		App.showFaces = (function(){
			var cache = {},
				dom,
				panel,
				inited = false,
				hotinited = false,
				insertFunc,
				setCss = { "selected": "cur", "unselected": " "};
				splitHTML = '<li class="magiclicur" style="visibility:hidden">|</li>',
				panelHTML = '<table class="mBlogLayer"><tbody><tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr><tr><td class="mid_l"></td><td class="mid_c"><div class="layerBox phiz_layerN"><div class="layerBoxTop"><div class="layerArrow" style="left:6px;"></div><div class="topCon"><ul class="phiz_menu"><li id="face" class="cur"><a href="#" onclick="this.blur();return false;">'+$CLTMSG["CL0901"]+'</a></li><li id="ani" act="topTab" class="magic"><a href="#" onclick="this.blur();return false;"><strong></strong>'+$CLTMSG["CL0902"]+'</a></li></ul><a id="close" href="#" onclick="return false;" title="'+$CLTMSG["CL0701"]+'" class="close"></a><div class="clearit"></div></div></div><div class="magicT"><div class="magicTL"><ul id="tab"></ul></div><div class="magicTR"><a href="#" onclick="return false;" id="prevBtn" class="magicbtnL02" title="'+$CLTMSG["CX0076"]+'"></a><a href="#" onclick="return false;" id="nextBtn" title="'+$CLTMSG["CX0077"]+'" class="magicbtnR02"></a></div><div class="clear"></div></div><div class="layerBoxCon" style="width:450px;"><div id="hotPanel" class="faceItemPicbgT"><ul id="hot"></ul><div class="clearit"></div></div><div id="normPanel" class="faceItemPicbg"><ul id="norm"></ul><div class="clearit"></div></div><div id="pagePanel" class="magicB"><div id="magicNotes" class="magic_tit" style="display:none">'+$CLTMSG["CL0904"]+'</div><div class="pages" id="pageing"></div></div></div></div></td><td class="mid_r"></td></tr><tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr></tbody></table>';			
			return function(target,editor,offsetX,offsetY,width,flush,fInsertFunc){
				if(target.tagName == "A"){target.href = "####";}
				insertFunc = fInsertFunc || function(){return false;};
				if(!inited){
					//初始化层
					panel = popUp().zIndex(1500).content(panelHTML);
					var dom        = panel.dom,
						close      = dom.close, 
						hot        = dom.hot,
						hotPanel   = dom.hotPanel,
						magicNotes = dom.magicNotes,
						norm       = dom.norm,
						normPanel  = dom.normPanel,
						pageing    = dom.pageing,
						prevBtn    = dom.prevBtn,
						nextBtn    = dom.nextBtn,
						tab        = dom.tab
						face       = dom.face,
						ani        = dom.ani,
						cType      = 1,
						tabIndex   = 0;
					function insertIcon(data, parent){
						removeAll(parent);
						var i = 0, len = data.length, iconList = [], c, acts, icons, plays, className = '', viewButton = '', nv;
						for(i; i<len; i++){
							c = data[i];
							nv = encodeTitle(c.title);
							cType == 1 && (className = 'class="face_box"');
							cType == 1 && (viewButton = ('<a action="play" title="' + $CLTMSG['CL0912'] + '" class="play_btn" href="#" onclick="return false;"></a><span class="face_box_tex">' + (cs.byteLength(nv)>8?cs.leftB(nv,6)+"...":nv) + '</span>'));
							iconList.push(['<li action="icon" title="', nv, '"><a href="#" onclick="return false;" ', className, '>', '<img src="', c.icon, '"/>', '</a>', viewButton, '</li>'].join(""));
						}
						acts = b2(iconList.join(""), parent)["actList"];
						icons = acts["icon"];
						plays = acts["play"];
						if(plays){
							//初始化播放按钮
							group(plays,
							//点击播放按钮打开动画播放层
							function(item, index, c){
								item.onclick = function(){return false}
								st();
								App.PopUpSwfPlayer(data[index].src);
								return false;
							});
						}
						//初始化图标
						group(icons,
						//点击图标执行插入图标动作
						function(item, index, c){
							item.onclick = function(){return false};
							setTimeout(function(){tArea.focus()},0);
							setTimeout(function(){
								var range = tArea.getAttribute('range');
								var value = data[index].value + " ";
								if(insertFunc(value)){
									
								}else if(document.selection){
									var sel = document.selection.createRange();
									document.selection.empty();	
									sel.text = value;
								}else if(tArea.setSelectionRange){
									var start = tArea.selectionStart;
									var end = tArea.selectionEnd;
									var str1 = tArea.value.substring(0, start);
									var str2 = tArea.value.substring(end);
									var v = str1 + value,len = v.length;
									tArea.value =  v + str2 ;
									tArea.setSelectionRange(len,len);
								}else{
									tArea.value += value;
								}
								if(reflush){reflush()}
								panel.visible(false);
							},200);
							return false;
						});
					};
						
					//初始化页
					function initPage(data){
						removeAll(pageing);
						var i = 0, len = data.length, pageList = [], pages;
						if(!len){return}
						for(i; i<len; i++){
							pageList.push('<a action="pageBtn" href="#" onclick="return false;">' + (i+1) + '</a>');
						}
						pages = b2(pageList.join(""),pageing)["actList"]["pageBtn"];
						group(pages,function(item, index){
							item.onclick = function(){return false};
							hotPanel.style.display = (!cType && !tabIndex && !index)?"":"none";
							setTimeout(function(){insertIcon(data[index], norm)},50);
							item.blur();
						},setCss);
						pageing.style.display = pages.length<2? "none": "";
						fire(pages[0],"mouseup");
					}
					//初始化分类
					function initTab(json){
						//循环类别
						removeAll(tab);
						var data = [{"type":$CLTMSG["CL0914"],"icon":json.data.norm}].concat(json.data.more);
						var i = 0, len = data.length, current, tabList = [], tabs;
						for(i; i<len; i++){
							current = data[i];
							if(!current || !current.type){continue}
							tabList.push('<li style="visibility:hidden"><a action="tabs" onclick="return false;" href="#">' + current.type + '</a></li>')
						}
						if(!tabList.length){return}
						tabs = b2(tabList.join(splitHTML),tab)["actList"]["tabs"];
						group(tabs, function(item, index){
							item.onclick = function(){return false};
							tabIndex = index;
							initPage(data[index].icon);
							item.blur();
						},{ "selected": "magicTcur", "unselected": " "});
						fire(tabs[0],"mouseup");
						var pi = 1, mi = 0, lil = tab.getElementsByTagName("li"), ml = lil.length, pageList = [], step = 0, cacheList = [], pl;
						setTimeout(function(){
							for(mi; mi<ml; mi++){
								lil[mi].style.visibility = "visible";
								lil[mi].style.display = "";
								var width = lil[mi].innerHTML=="|"? 8: lil[mi].offsetWidth;
								if(step + width > 400){
									step = 0;
									pageList.push(cacheList);
									cacheList = [];
								}
								lil[mi].style.display = "none";
								cacheList.push(lil[mi]);
								step += width;
							}
							cacheList.length && pageList.push(cacheList);
							pl = pageList.length - 1;
							function setPN(){
								prevBtn.className = pi==0?  "magicbtnL01": "magicbtnL02";
								nextBtn.className = pi==pl? "magicbtnR01": "magicbtnR02";
							}
							function toggle(list, b){
								var i = 0; len = list.length, end = Math.max(len - 1,0);
								for(i; i<len; i++){
									list[i].style.visibility = b?"visible":"hidden";
									list[i].style.display = !b?"none": ((i==0||i==end)&&list[i].innerHTML=="|")?"none":"";
								}
							}
							function dep(key, n){
								var snap = Math[key](pi + n, n>0? pl: 0);
								if(pi == snap){setPN();return}
								pageList[pi] && toggle(pageList[pi],false);
								pageList[snap] && toggle(pageList[snap],true);
								pi = snap; 
								setPN();
							}
							prevBtn.onclick = function(){
								dep("max",-1);
								prevBtn.blur();
								return false;
							};
							nextBtn.onclick = function(){
								dep("min",1);
								nextBtn.blur();
								return false;
							};
							dep("max",-1);
						},100);
						
					}
					//常用表情/魔法表情页签点击动作
					function onTabChange(item, index, data){
						st();
						item.onclick = function(){return false};
						//初始化显示
						removeAll(norm);
						removeAll(tab);
						removeAll(pageing);
						//初始化tab样式
						face.className           = index? ""           : "cur";
						ani.className            = index? "magic cur"  : "magic";
						normPanel.className      = index? "magic_list" : "faceItemPicbg";
						hotPanel.style.display   = index? "none"       : "";
						magicNotes.style.display = index? ""           : "none";
						pageing.style.display    = "none";
						prevBtn.className = "magicbtnL01";
						nextBtn.className = "magicbtnR01";
						prevBtn.onclick = function(){return false;}
						nextBtn.onclick = function(){return false;}
						cType = index;
						//如果已经请求过该舌签数据，则直接使用缓存数据
						req && req.abort();
						if(cache[index]){initTab(cache[index]); return false};
						//如果该舌签没有缓存数据，则选将内容区初始化为loading状态
						norm.innerHTML = '<center><img style="margin-top:10px;margin-bottom:10px" src="' + scope.$BASEIMG + 'style/images/common/loading.gif"/></center>';
						//请求舌签数据
						req = ajax(
							[api,"?type=",index? "ani": "face"].join(""),
							function(json){
								var data;
								if (json.code == "A00006" && (data = json.data)) {
									initTab(json)
									if(!hotinited && data.hot){
										hotinited = true;
										insertIcon(data.hot, hot)
									}
									cache[index] = json;
								}
							}
						);
						item.blur();
						return false;
					}
					//初始化 常用表情/魔法表情页签切换
					group([face, ani], onTabChange);
					inited = true;
					//清除弹层的冒泡
					add(close,function(){close.onclick = function(){return false};panel.visible(false);st()},"mouseup");
					add(panel.wrap, function(){st()},"mouseup");
					//如果在非层地区点击则隐藏弹层
					add(d.body, function(){panel.visible(false);},"mouseup");
					var s = Core.System.winSize();
					add(window, function(event){
						var s1 = Core.System.winSize();
						if(s.width!=s1.width || s.height!=s1.height){
							panel.visible(false);
							s = s1;
						}
					},"resize");
				}
				//初始化发布器
				tArea = editor;
				reflush = flush;
				var point = getXY(target);
				panel.position(point[0] + 19 +(offsetX||0),point[1]+target.offsetHeight+(offsetY||5));
				fire(face,"mouseup");
				//显示表情弹出层
				setTimeout(function(){panel.visible(true)},0);
				return false;
			}
		})();
		
})();
/**
<table class="mBlogLayer">
	<tbody>
		<tr>
			<td class="top_l"></td>
			<td class="top_c"></td>
			<td class="top_r"></td>
		</tr>
		<tr>
			<td class="mid_l"></td>
			<td class="mid_c">
				<div class="layerBox phiz_layerN">
					<div class="layerBoxTop">
						<div class="layerArrow"></div>
						<div class="topCon">
							<ul class="phiz_menu">
								<li id="face" class="cur"><a href="#" onclick="this.blur();return false;">#{CL0901}</a></li>
								<li id="ani" act="topTab" class="magic"><a href="#" onclick="this.blur();return false;"><strong></strong>#{CL0902}</a></li>
							</ul>
							<a id="close" href="#" onclick="return false;" title="#{CL0701}" class="close"></a>
							<div class="clearit"></div>
						</div>
					</div>
					<div class="magicT">
						<div class="magicTL">
							<ul id="tab"></ul>
						</div>
						<div class="magicTR"><a href="#" onclick="return false;" id="prevBtn" class="magicbtnL02" title="#{CX0076}"></a><a href="#" onclick="return false;" id="nextBtn" title="#{CX0077}" class="magicbtnR02"></a></div>
						<div class="clear"></div>
					</div>
					<div class="layerBoxCon" style="width:426px;">
						<div id="hotPanel" class="faceItemPicbgT">
							<ul id="hot"></ul>
							<div class="clearit"></div>
						</div>
						<div id="normPanel" class="faceItemPicbg">
							<ul id="norm"></ul>
							<div class="clearit"></div>
						</div>
						<div id="pagePanel" class="magicB">
							<div id="magicNotes" class="magic_tit" style="display:none"><em class="play_btn"></em>#{CL0904}</div>
							<div class="pages" id="pageing"></div>
						</div>
					</div>
				</div>
			</td>
			<td class="mid_r"></td>
		</tr>
		<tr>
			<td class="bottom_l"></td>
			<td class="bottom_c"></td>
			<td class="bottom_r"></td>
		</tr>
	</tbody>
</table>
**/
