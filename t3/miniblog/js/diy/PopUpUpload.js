/**
 * 弹出文件上传及推荐配图
 * @author liusong@staff.sina.com.cn
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/dom/getXY.js");
$import("diy/builder3.js");
$import("diy/SimpleAjax.js");
$import("diy/PopUp.js");
$import("diy/Group.js");
$import("diy/BindUploadImgToFile.js");
$import("diy/getimgsize.js");
$import("diy/imgURL.js");
$import("diy/curtain.js");
$import("diy/removeChildren.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");

(function(){
	//配图获取接口
	var api = "/face/aj_face.php";
	//变量声名
	var d = document, de = d.documentElement||{}, ce = Core.Events, cs = Core.String,st = ce.stopEvent, add = ce.addEvent, unadd = ce.removeEvent, fire = ce.fireEvent, ajax = App.simpleAjax, getXY = Core.Dom.getXY, group = App.group, popUp = App.popUp, reflush, removeAll = App.removeChildren;
	//dom创建简化
	function b2(t, b){return App.builder3(t,b,{"dd":"id", "mm":"action"})};
	var encodeTitle = function(value){
		return value.replace(/[^\w\u4e00-\u9fa5\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u2014\uff3f]/g,"");
	}
	
	//上传初始化
	App.popUpUpload = (function(){
        var it = {}, dl, upc, allow = true, figure, panel, req, cache, status = 0, oldStatus = 0, title, toggleCss = {"selected":"cur","unselected":" "}, clear;
		
		title = ['<li id="upload"><a href="####" onclick="this.blur();return false;">', $CLTMSG["CL0905"], '</a></li><li id="figure"><a href="####" onclick="this.blur();return false;">', $CLTMSG["CL0906"], '</a></li>'].join("");
		return function( target, offsetX, offsetY, flush, enabled ){
			//首次使用初始化
			if(!panel){
				enabled = enabled||function(){};
				panel = App.PopUp().content('<table class="mBlogLayer"><tbody><tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr><tr><td class="mid_l"></td><td class="mid_c"><div id="contentPanel" class="layerBox phiz_layerN"><div id="topPanel" class="layerBoxTop" style="width:100%;"><div class="layerArrow"></div><div class="topCon" id="titlePanel"><ul id="title" class="phiz_menu"></ul><a id="close" title="'+$CLTMSG["CL0701"]+'" href="####" onclick="return false" class="close"></a><div class="clearit"></div></div></div><div id="content"></div></div></td><td class="mid_r"></td></tr><tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr></tbody></table>');
				panel.zIndex(800);
				dl = b2(title, panel.dom.title)["domList"];
				uploadPanel = dl["upload"];
				figurePanel = dl["figure"];
				var html = '<div id="upload" class="layerBoxCon" style="display:none"><div class="local_pic" style="position:rev"><a id="actButton" class="btn_green" style="overflow:hidden;position:relative;" href="javascript:void(0)"><em id="status">'+$CLTMSG["CL0907"]+'</em><input type="file" hideFoucs="true" style="outline:none;width:75px;height:25px;" id="file" name="pic1"/></a><p id="tip" class="gray9">'+$CLTMSG["CX0193"]+'</p></div></div><div id="uploading" class="layerBoxCon1" style="display:none;width:258px;"><div class="layerMedia"><div class="layerArrow" style="left:25px"></div><div class="statusBox"><span class="status_p"><img src="' + [scope.$BASEIMG,'style/images/common/loading.gif'].join("") + '" />'+$CLTMSG["CC1503"]+'...</span><span class="status_b"><a id="cancelButton" href="####" onclick="return false" class="btn_normal"><em>'+$CLTMSG["CX0176"]+'</em></a></span></div></div></div><div id="successpanel" class="layerBoxCon1" style="display:none;width:258px;"><div class="layerMedia"><div class="layerArrow" style="left:25px"></div><div class="cur_status"><a id="deleteuploaded" href="####" onclick="return false" class="dele">'+$CLTMSG["CX0043"]+'</a><strong id="viewfilename"></strong></div><div class="cur_pic"><center><img id="imgview" /></center></div></div></div><div id="tabNav" class="magicT"><div class="magicTL"><ul id="tab"></ul></div><div class="magicTR"><a href="#" onclick="return false;" id="prevBtn" class="magicbtnL02" title="'+$CLTMSG["CX0076"]+'"></a><a href="#" onclick="return false;" id="nextBtn" title="'+$CLTMSG["CX0077"]+'" class="magicbtnR02"></a></div><div class="clear"></div></div><div id="illustration" class="layerBoxCon" style="width:100%;display:none"><div class="magic_list"><ul id="norm"></ul><div class="clearit"></div></div><div class="magicB"><div id="pageing" style="visibility:hidden" class="pages"></div></div></div>';
				var dom               = b2(html,panel.dom.content)["domList"],
					topPanel          = panel.dom.topPanel,
					contentPanel      = panel.dom.contentPanel,
					titlePanel        = panel.dom.titlePanel,
					upload            = dom.upload,
					file              = dom.file,
					actButton         = dom.actButton,
					tip               = dom.tip,
					tab               = dom.tab,
					prevBtn           = dom.prevBtn,
					nextBtn           = dom.nextBtn,
					cancelButton      = dom.cancelButton,
					uploading         = dom.uploading,
					successpanel      = dom.successpanel,
					deleteuploaded    = dom.deleteuploaded,
					viewfilename      = dom.viewfilename,
					imgview           = dom.imgview,
					illustration      = dom.illustration,
					norm              = dom.norm,
					more              = dom.more,
					morebox           = (dom.morebox||{})["style"],
					mpageing          = dom.morepageing,
					pageing           = dom.pageing,
					morePanel         = dom.morePanel,
					tabNav            = dom.tabNav,
					moretab           = dom.moretab;
					
				var cancel = function(){
						upc && upc.cancel();
						flush();
						return false;
					},
					setStatus = function( type ){
						allow = true;
						var topPanelv          = "none",
							contentPanelv      = "layerBox phiz_layerN",
							titlePanelv        = "",
							selectPanelv       = "none",
							uploadingv         = "none",
							uploadv            = "none",
							successpanelv      = "none",
							imgviewv           = "none",
							illustrationv      = "none",
							tabview            = "none",
							topPanelWidth      = "378px",
							uploadv            = "none";
						switch(type){
							case 0:
								uploadv = "";
								topPanelv = "";
								selectPanelv = "";
								enabled(true);
								break;
							case 1:
								uploadingv = "";
								cancelButton.onclick = cancel;
								allow = false;
								enabled(false);
							break;
							case 2:
								successpanelv = "";
								viewpanelv = ""
								deleteuploaded.onclick = clear;
								allow = false;
								setTimeout(function(){enabled(true)},1000);
							break;
							case 3:
								tabview = "";
								topPanelv = "";
								illustrationv = "";
								topPanelWidth = "442px";
								contentPanelv = "layerBox phiz_layerN";
								enabled(true);
							break;
						}
						titlePanel.style.width            = topPanelWidth;
						upload.style.display            = uploadv;
						topPanel.style.display          = topPanelv;
						contentPanel.className          = contentPanelv;
						titlePanel.style.display        = titlePanelv;
						uploading.style.display         = uploadingv;
						successpanel.style.display      = successpanelv;
						imgview.style.display           = imgviewv;
						illustration.style.display      = illustrationv;
						tabNav.style.display            = tabview;
						status = type;
						panel.visible(true);
					},
					start = function(){
						setStatus(1);
					},
					setImgUrl = function(pid){
						imgview.src = [scope.$BASECSS,"style/images/common/transparent.gif"].join("");
						setStatus(2);
						var url = App.imgURL(pid,"small");
						new App.getImgSize(App.imgURL(pid, 'small'), function(size){
							imgview.style.width = size[0] + "px";
							imgview.style.height = size[1] + "px";
							imgview.src = url;
							fire(uploadPanel, "mouseup");
							setStatus(2);
							setTimeout(function(){App.curtain.droop(imgview, function(){})},100);
						});
						flush(pid);
					},
					success = function(json,filename){
						if(json.pid){
							viewfilename.innerHTML = "";
							var tn = d.createTextNode(filename);
							viewfilename.appendChild(tn);
							setImgUrl(json.pid);
						}
					},
					fail = function(){
						setStatus(0);
						imgview.src = null;
					},
					insertImg = function(data, parent){
						var i = 0, len = data.length, tmpArr = [], c, acts, icons, plays, className = '', viewButton = '', nv;
						for(i; i<len; i++){
							c = data[i];
							nv = encodeTitle(c.title);
							tmpArr.push(['<li action="icon" title="', nv, '"><a href="####" onclick="return false" class="face_box">', '<img src="', c.src, '"/></a>', '<span class="face_box_tex">', (cs.byteLength(nv) > 8 ? cs.leftB(nv, 6) + "..." : nv), '</span>', '</li>'].join(""));
						}
						removeAll(parent);
						acts = b2(tmpArr.join(""), parent)["actList"];
						icons = acts["icon"];
						group(icons,
						//点击图标执行插入图标动作
						function(item, index, c){
							item.onclick = function(){return false};
							var pid = (pid = data[index]) && pid.picid;
							if(pid){
								setImgUrl(pid);
								viewfilename.innerHTML = data[index].value;
							}
						});
					};
					
					clear = function(){
						upc && upc.reset();
						setStatus(0);
						panel.visible(false);
						flush();
						return false;
					};
				
				if(file){
					upc = App.bindUploadImgToFile(dom.file, success, fail, start);
				}
				var initPage = function(data, parent,fclick){
					var i = 0, len = data.length, tm = [];
					for(i; i<len; i++){
						c = data[i];
						tm.push(['<a action="pb" href="####" onclick="return false">',(i+1),'</a>'].join(""));
					}
					removeAll(parent);
					pages = b2(tm.join(""),parent)["actList"]["pb"];
					if(pages.length<2){
						parent.style.visibility = "hidden";
					}else{
						parent.style.visibility = "visible";
					}
					group(pages,fclick,toggleCss);
					//默认选中第一页
					fire(pages[0], "mouseup");
				};
				var initpic = function(json){
					//循环类别
					removeAll(tab);
					var data = [{
						"type": $CLTMSG["CL0914"],
						"icon": json.data.norm
					}].concat(json.data.more);
					var i = 0, len = data.length, current, tabList = [], tabs;
					for (i; i < len; i++) {
						current = data[i];
						if (!current || !current.type) {
							continue
						}
						tabList.push('<li style="visibility:hidden"><a action="tabs" onclick="return false;" href="#">' + current.type + '</a></li>')
					}
					if (!tabList.length) {
						return
					}
					tabs = b2(tabList.join(splitHTML), tab)["actList"]["tabs"];
					group(tabs, function(item, index){
						item.onclick = function(){return false};
						tabIndex = index;
						initPage(data[index].icon,pageing,function(item, index1, c){
							insertImg(data[index].icon[index1], norm);
							item.blur();
							return false
						});
						item.blur();
					}, {
						"selected": "magicTcur",
						"unselected": " "
					});
					fire(tabs[0], "mouseup");
					var pi = 1, mi = 0, lil = tab.getElementsByTagName("li"), ml = lil.length, pageList = [], step = 0, cacheList = [], pl;
					setTimeout(function(){
						for (mi; mi < ml; mi++) {
							lil[mi].style.visibility = "visible";
							lil[mi].style.display = "";
							var width = lil[mi].innerHTML == "|" ? 8 : lil[mi].offsetWidth;
							if (step + width > 400) {
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
							prevBtn.className = pi == 0 ? "magicbtnL01" : "magicbtnL02";
							nextBtn.className = pi == pl ? "magicbtnR01" : "magicbtnR02";
						}
						function toggle(list, b){
							var i = 0;
							len = list.length, end = Math.max(len - 1, 0);
							for (i; i < len; i++) {
								list[i].style.visibility = b ? "visible" : "hidden";
								list[i].style.display = !b ? "none" : ((i == 0 || i == end) && list[i].innerHTML == "|") ? "none" : "";
							}
						}
						function dep(key, n){
							var snap = Math[key](pi + n, n > 0 ? pl : 0);
							if (pi == snap) {
								setPN();
								return
							}
							pageList[pi] && toggle(pageList[pi], false);
							pageList[snap] && toggle(pageList[snap], true);
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
						dep("max", -1);
					}, 100);
				}
				group([uploadPanel, figurePanel], 
				//点击舌签后切换上传/配图
				function(item, index, tabConsole){
					req && req.abort();
					item.onclick = function(){return false};
					if(item == uploadPanel){
						removeAll(tab);
						removeAll(norm);
						setStatus(status==3?oldStatus:status);
					}else{
						setStatus(3);
						if(!cache){
							norm.innerHTML = '<div style="width:100%;text-align:center;margin-top:10px;margin-bottom:10px"><img src="' + scope.$BASEIMG + 'style/images/common/loading.gif"/></div>';
							req = ajax(
								[api,"?type=cartoon"].join(""),
								function(json){
									initpic(json);
									cache = json;
								}
							)
							return;
						}
						initpic(cache);
					}
				},toggleCss);
				//在上传浮层中不会触发浮层隐藏
				add(panel.wrap, function(){st()},"mouseup");
				//解决上传按钮相对于背景按钮过短无法触发上传的问题
				add(actButton,function(event){
					var p = getXY(actButton);
					var st = window.pageYOffset||Math.max(de.scrollTop,d.body.scrollTop);
					var sl = window.pageXOffset||Math.max(de.scrollLeft,d.body.scrollLeft);
					file.style.top = ((event.clientY+st) - p[1] - 13)+"px";
					file.style.left = ((event.clientX+sl) - p[0] - 32)+"px";
				},"mousemove");
				//当用户点击非浮层以外区域则隐藏浮层,但如果图片已经上传或上传中则产生例外
				add(d.body, function(event){
					if(!allow){return}
					panel.visible(false);
					st()
				},"mouseup");
				//关闭浮层时则终止当前已发出的数据请求
				add(panel.dom.close, function(){
					req && req.abort();
					panel.visible(false);
					return false;
				}, "click")
				var resetXY = function(){
					var point = getXY(target);
					panel.position(point[0] + (offsetX||0), point[1] + target.offsetHeight + (offsetY||0));
				}
				add(window, function(){
					//重置浮层的位置
					resetXY();
				},"resize");
				resetXY();
				//第一次打开时，默认显示上传舌签
				fire(uploadPanel,"mouseup");
			}
			panel.visible(true);
			if (!/^(1|2)$/.test(status)) {
				fire(uploadPanel,"mouseup");
			}
			return {
				"clear": function(){
					clear();
					fire(uploadPanel,"mouseup");
					panel.visible(false)
				}
			};
		};
	})();	
})();