/**
 * @desc ： 企业微薄友情链接
 */

$import("sina/core/dom/setStyle2.js");
$import("diy/dom.js");
$import("diy/sizzle.js");
$import("sina/core/events/addEvent.js");
$import("diy/dialog.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/getElementsByClass.js");

$registJob("friendLink", function () {
		var triger = App.sizzle('a[act=friendLink]')[0];
		
		Core.Events.addEvent(triger, function(){
			var _html = '<table class="mBlogLayer">' +
  							'<tbody>' +
  								'<tr>' +  
    								'<td class="mid_c"><div class="layerBox">' +   
        								'<div style="height: auto; width: 592px;" class="layerBoxCon">' +
          									'<div class="lbConBox">' +
            									'<div class="lbtitle">添加新的友情链接</div>' +
            									'<div class="lbfuncInp" id="newLink">' +
              										'<input type="text" value="链接名称" class="inputS" style="color: rgb(153, 153, 153);">' +
              										'<input type="text" value="链接地址" class="input" style="color: rgb(153, 153, 153);">' +
              										'<a class="newabtngrn" href="javascript:void(0);" id="addNewLink"><em>添加</em></a> </div>' +
            									'<div class="errorbox" style="visibility: visible;" id="warn"><img class="tipicon tip2" src="../images/common/transparent.gif" alt="" title=""><em>链接名称不能为空！</em></div>' +
            									'<div class="addvoteLBox">' +
              										'<div class="addvote">' +
                										'<ul class="addvoTit">' +
                  											'<li class="at1">链接名称</li>' +
                  											'<li class="at2">链接地址</li>' +
                  											'<li class="at3">编辑&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</li>' +
                										'</ul>' +
                										'<div class="video_mag">' +
                  											'<ul id="existLinks">' +
                    											'<li class="">' +
																	'<div class="at1"><a href="javascript:void(0);"><span>123</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="inputS" value="123" /></a></div>' +
																	'<div class="at2"><a href="javascript:void(0);"><span>www.baidu.com</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="input" value="www.baidu.com" /></a></div>' +
																	'<div class="at3"><a href="javascript:void(0);" class="ico"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/enterprisestyle/images/common/transparent.gif" class="sicon edit_ico"><em style="display:none;">确定</em></a><a href="javascript:void(0);" class="ico"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/enterprisestyle/images/common/transparent.gif" class="sicon del_ico"><em style="display:none;">取消</em></a></div>' +
																'</li>' +
    															'<li class="">' +
																	'<div class="at1"><a href="javascript:void(0);"><span>123</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="inputS" value="123" /></a></div>' +
																	'<div class="at2"><a href="javascript:void(0);"><span>www.baidu.com</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="input" value="www.baidu.com" /></a></div>' +
																	'<div class="at3"><a href="javascript:void(0);" class="ico"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/enterprisestyle/images/common/transparent.gif" class="sicon edit_ico"><em style="display:none;">确定</em></a><a href="javascript:void(0);" class="ico"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/enterprisestyle/images/common/transparent.gif" class="sicon del_ico"><em style="display:none;">取消</em></a></div>' +
																'</li>' +
																'<li class="">' +
																	'<div class="at1"><a href="javascript:void(0);"><span>123</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="inputS" value="123" /></a></div>' +
																	'<div class="at2"><a href="javascript:void(0);"><span>www.baidu.com</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="input" value="www.baidu.com" /></a></div>' +
																	'<div class="at3"><a href="javascript:void(0);" class="ico"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/enterprisestyle/images/common/transparent.gif" class="sicon edit_ico"><em style="display:none;">确定</em></a><a href="javascript:void(0);" class="ico"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/enterprisestyle/images/common/transparent.gif" class="sicon del_ico"><em style="display:none;">取消</em></a></div>' +
																'</li>' +
																'<li class="">' +
																	'<div class="at1"><a href="javascript:void(0);"><span>123</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="inputS" value="123" /></a></div>' +
																	'<div class="at2"><a href="javascript:void(0);"><span>www.baidu.com</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="input" value="www.baidu.com" /></a></div>' +
																	'<div class="at3"><a href="javascript:void(0);" class="ico"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/enterprisestyle/images/common/transparent.gif" class="sicon edit_ico"><em style="display:none;">确定</em></a><a href="javascript:void(0);" class="ico"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/enterprisestyle/images/common/transparent.gif" class="sicon del_ico"><em style="display:none;">取消</em></a></div>' +
																'</li>' +
                  											'</ul>' +
                										'</div>' +
              										'</div>' +
              										'<p class="btn"><a href="javascript:void(0);" class="btn_normal btns" id="submit"><em>确定</em></a><a href="javascript:void(0);" class="btn_normal btns" id="cancel"><em>取消</em></a></p>' +
            									'</div>' +
          									'</div>' +
        								'</div>' +
      								'</div></td>'
  							'</tr></tbody></table>';
			App.friendLink = {};
			App.friendLink.dialog = new App.Dialog.BasicDialog('设置友情链接', _html, {
				zIndex: 1000,
				width: 593,
				height: 352
			});
			//	debugger;
			App.friendLink.dialog.show();
			
			setTimeout(function(){
				//开始编辑
				var turnEditble = function(editIcon, liObj){
					Core.Events.addEvent(editIcon, (function(li){
					
						return function(){
							App.Dom.addClass(li, "select");
							
							var divObj_0 = li.getElementsByTagName("div")[0], divObj_1 = li.getElementsByTagName("div")[1], divObj_2 = li.getElementsByTagName("div")[2];
							
							divObj_0.getElementsByTagName("span")[0].style.display = "none";
							divObj_0.getElementsByTagName("input")[0].value = divObj_0.getElementsByTagName("span")[0].innerHTML;
							divObj_0.getElementsByTagName("input")[0].style.display = "block";
							
							divObj_1.getElementsByTagName("span")[0].style.display = "none";
							divObj_1.getElementsByTagName("input")[0].value = divObj_1.getElementsByTagName("span")[0].innerHTML;
							divObj_1.getElementsByTagName("input")[0].style.display = "block";
							
							var oAList = divObj_2.getElementsByTagName("a"), oImg = divObj_2.getElementsByTagName("img"), oEm = divObj_2.getElementsByTagName("em");
							for (var j = 0; j < oEm.length; j++) {
								App.Dom.replaceClass(oAList[j], "btn_normal btnxs", "ico");
								oImg[j].style.display = "none";
								oEm[j].style.display = "block";
							}
							
						}
					})(liObj), 'click');
				}
				
				//编辑现有链接
				var turnUnEditble = function(sureBtn, li){
					Core.Events.addEvent(sureBtn, (function(li){
						return function(){
							App.Dom.removeClass(li, "select");
							
							var divObj_0 = li.getElementsByTagName("div")[0], divObj_1 = li.getElementsByTagName("div")[1], divObj_2 = li.getElementsByTagName("div")[2];
							
							var name = divObj_0.getElementsByTagName("input")[0].value;
							var len = Core.String.byteLength(Core.String.trim(name));
							if (len == 0) {
								App.alert("名称不能为空！");
								return false
							}
							else 
								if (len > 20) {
									App.alert("链接名称不能超过20个字节！");
									return false;
								}
								else {
								
									var url = divObj_1.getElementsByTagName("input")[0].value;
									len = Core.String.byteLength(Core.String.trim(url));
									if (len == 0) {
										App.alert("地址不能为空！");
										return false;
									}
									else 
										if (len > 120) {
											App.alert("地址不能大于120字节！");
											return false;
										}
										else 
											if (!/\S+\.\S+/.test(Core.String.trim(url))) {
												App.alert("地址不合法！");
												return false;
											}
											else {
												divObj_0.getElementsByTagName("span")[0].innerHTML = name;
												divObj_0.getElementsByTagName("input")[0].style.display = "none";
												divObj_0.getElementsByTagName("span")[0].style.display = "block";
												divObj_1.getElementsByTagName("span")[0].innerHTML = url;
												divObj_1.getElementsByTagName("input")[0].style.display = "none";
												divObj_1.getElementsByTagName("span")[0].style.display = "block";
											}
								}
							
							var oAList = divObj_2.getElementsByTagName("a"), oImg = divObj_2.getElementsByTagName("img"), oEm = divObj_2.getElementsByTagName("em");
							for (var j = 0; j < oEm.length; j++) {
								App.Dom.replaceClass(oAList[j], "ico", "btn_normal btnxs");
								oImg[j].style.display = "block";
								oEm[j].style.display = "none";
							}
						}
					})(li), 'click');
				}
				
				//取消编辑
				var cancelEdit = function(cancelBtn, li){
					Core.Events.addEvent(cancelBtn, (function(li){
						return function(){
							App.Dom.removeClass(li, "select");
							var divObj_0 = li.getElementsByTagName("div")[0], divObj_1 = li.getElementsByTagName("div")[1], divObj_2 = li.getElementsByTagName("div")[2];
							var nameTemp = divObj_0.getElementsByTagName("input")[0].value, urlTemp = divObj_1.getElementsByTagName("span")[0].innerHTML;
							divObj_0.getElementsByTagName("span")[0].innerHTML = nameTemp;
							divObj_0.getElementsByTagName("input")[0].style.display = "none";
							divObj_0.getElementsByTagName("span")[0].style.display = "block";
							//divObj_1.getElementsByTagName("span")[0].innerHTML =
							//divObj_1.getElementsByTagName("input")[0].value;
							divObj_1.getElementsByTagName("input")[0].style.display = "none";
							divObj_1.getElementsByTagName("span")[0].style.display = "block";
							var oAList = divObj_2.getElementsByTagName("a"), oImg = divObj_2.getElementsByTagName("img"), oEm = divObj_2.getElementsByTagName("em");
							for (var j = 0; j < oEm.length; j++) {
								App.Dom.replaceClass(oAList[j], "ico", "btn_normal btnxs");
								oImg[j].style.display = "block";
								oEm[j].style.display = "none";
							}
						}
					})(li), 'click');
				}
				
				//删除一个链接
				var deleteOneLink = function(deleteIcon, li){
					Core.Events.addEvent(deleteIcon, (function(li){
						return function(){
							var parent = $E("existLinks");
							try {
								parent.removeChild(li);
								App.existLinks--;
							} 
							catch (e) {
							//console.log( e.message );
							}
							
							if (0 < App.existLinks < 5) {
								Core.Dom.setStyle2($E("warn"), {
									"visibility": "hidden"
								});
							}
						}
					})(li), 'click');
				}
				
				//验证链接名称
				var verifyLinkName = function(nameElement){
					var warnObj = $E("warn"), nameLen = Core.String.byteLength(Core.String.trim(nameElement.value)), warnShow = warnObj.getElementsByTagName("em")[0];
					if (nameLen == 0) {
						Core.Dom.setStyle2(warnObj, {
							"visibility": "visible"
						});
						warnShow.innerHTML = "链接名称不能为空！";
					}
					else 
						if (nameLen > 20) {
							Core.Dom.setStyle2(warnObj, {
								"visibility": "visible"
							});
							warnShow.innerHTML = "链接名称不能超过20个字节！";
						}
						else {
							Core.Dom.setStyle2(warnObj, {
								"visibility": "hidden"
							});
							return true;
						}
					
					return false;
				}
				
				//验证链接地址
				var verifyLinkURL = function(URLElement){
					var warnObj = $E("warn"), urlLen = Core.String.byteLength(Core.String.trim(URLElement.value)), warnShow = warnObj.getElementsByTagName("em")[0];
					if (urlLen == 0) {
						Core.Dom.setStyle2(warnObj, {
							"visibility": "visible"
						});
						warnShow.innerHTML = "链接地址不能为空！";
					}
					else 
						if (urlLen > 120) {
							Core.Dom.setStyle2(warnObj, {
								"visibility": "visible"
							});
							warnShow.innerHTML = "链接地址最长不能超过120个字节！";
						}
						else 
							if (!/\S+\.\S+/.test(Core.String.trim(URLElement.value))) {
								Core.Dom.setStyle2(warnObj, {
									"visibility": "visible"
								});
								warnShow.innerHTML = "不是一个有效的链接地址！";
							}
							else {
								Core.Dom.setStyle2(warnObj, {
									"visibility": "hidden"
								});
								return true;
							}
					
					return false;
				}
				
				App.existLinks = 0;
				
				
				//添加一个新的链接
				var addOneNewLinkEvent = function(){
					var nameObj = $E("newLink").getElementsByTagName("input")[0], urlObj = $E("newLink").getElementsByTagName("input")[1];
					
					Core.Events.addEvent(nameObj, function(){
						if (Core.String.trim(nameObj.value) == "链接名称") 
							nameObj.value = "";
					}, 'click');
					Core.Events.addEvent(urlObj, function(){
						if (Core.String.trim(urlObj.value) == "链接地址") 
							urlObj.value = "";
					}, 'click');
					
					App.existLinks = $E("existLinks").getElementsByTagName("li").length;
					
					Core.Events.addEvent($E("addNewLink"), function(){
						if (verifyLinkName(nameObj)) {
							if (verifyLinkURL(urlObj)) {
								if (App.existLinks >= 5) {
									Core.Dom.setStyle2($E("warn"), {
										"visibility": "visible"
									});
									$E("warn").getElementsByTagName("em")[0].innerHTML = "最多只能添加5条友情链接！";
									return false;
								}
								else {
									var oLi = $C("li");
									oLi.innerHTML = '<div class="at1"><a href="javascript:void(0);"><span>' +
									nameObj.value +
									'</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="inputS" value="' +
									nameObj.value +
									'" /></a></div><div class="at2"><a href="javascript:void(0);"><span>' +
									urlObj.value +
									'</span><input type="text" style="color:rgb(153, 153, 153);display:none;" class="input" value="' +
									urlObj.value +
									'" /></a></div><div class="at3"><a href="javascript:void(0);" class="ico"><img style="display:block;" title="" alt="" src="../images/common/transparent.gif" class="sicon edit_ico"><em style="display:none;">确定</em></a><a href="javascript:void(0);" class="ico"><img style="display:block;" title="" alt="" src="../images/common/transparent.gif" class="sicon del_ico"><em style="display:none;">取消</em></a></div>';
									var oImg1 = oLi.getElementsByTagName("div")[2].getElementsByTagName("img")[0];
									turnEditble(oImg1, oLi);
									var oEm1 = oLi.getElementsByTagName("div")[2].getElementsByTagName("em")[0];
									turnUnEditble(oEm1, oLi);
									var oImg2 = oLi.getElementsByTagName("div")[2].getElementsByTagName("img")[1];
									deleteOneLink(oImg2, oLi);
									var oEm2 = oLi.getElementsByTagName("div")[2].getElementsByTagName("em")[1];
									cancelEdit(oEm2, oLi);
									$E("existLinks").appendChild(oLi);
									
									App.existLinks = App.existLinks + 1;
								}
							}
						}
					}, 'click');
				};
				
				App.editble = false;
				
				//循环给UL绑定事件
				var addEachLiEvent = function(){
					var liList = $E("existLinks").getElementsByTagName("li");
					
					for (var i = 0; i < liList.length; i++) {
						if (!App.editble) {
						
							//开始编辑
							var finishEdit = liList[i].getElementsByTagName("div")[2].getElementsByTagName("img")[0];
							turnEditble(finishEdit, liList[i]);
							
							//编辑现有链接
							var toEdit = liList[i].getElementsByTagName("div")[2].getElementsByTagName("em")[0];
							turnUnEditble(toEdit, liList[i]);
							
							//取消编辑
							var cancelEditBtn = liList[i].getElementsByTagName("div")[2].getElementsByTagName("em")[1];
							cancelEdit(cancelEditBtn, liList[i]);
							
							//删除一个链接
							var cancelLink = liList[i].getElementsByTagName("div")[2].getElementsByTagName("img")[1];
							deleteOneLink(cancelLink, liList[i]);
						}
					}
				};
				
				//提交数据
				var submitData = function(){
					Core.Events.addEvent($E("submit"), function(){
						var postData = {};
						var liList = $E("existLinks").getElementsByTagName("li");
						for (var i = 0; i < liList.length; i++) {
							//获取第一个div中的span
							postData["name_" + i] = Core.String.trim(liList[i].getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerHTML);
							postData["url_" + i] = Core.String.trim(liList[i].getElementsByTagName("div")[1].getElementsByTagName("span")[0].innerHTML);
						}
						try {
							Utils.Io.Ajax.request("http://t.sina.com.cn/shaofu/link/aj_set.php", {
							
								"onComplete": function(oResult){
									//成功加载内容
									if (oResult.code == "A00006") {
										//页面内容添加
										App.alert("success");
										var dialog = new App.Dialog.BasicDialog('设置友情链接成功！', json.data, {
											zIndex: 1000,
											width: 400
										});
										dialog.show();
									}
									else {
										alert("haha");
									}
								},
								"onException": function(){
									//begin 提交数据成功后将数据写到首页上
									var fL = App.sizzle('div[mid=mod_4]')[0];
									var showLinks = Core.Dom.getElementsByClass( fL, "ul", "con" )[0];
									showLinks.innerHTML = "";
									var len = 0;
									for ( var name in postData ) {
										if ( /name\S+/.test(name) ) len++;
									}
									for ( var i = 0; i < len; i++ ) {
										var oLi = $C( "li" );
										oLi.innerHTML = '<a title="" href="' + postData[ "url_" + i ] + '">' + postData[ "name_" + i ] + '</a>';
										showLinks.appendChild( oLi );
									}
									App.friendLink.dialog.close();
									//end
									App.alert("error");
								},
								"returnType": "json",
								"POST": postData
							});
						} 
						catch (e) {
							alert(e.message)
						}
					}, 'click');
				};
				
				//取消提交
				var cancelToSubmit = function(){
					Core.Events.addEvent($E("cancel"), function(){
						App.friendLink.dialog.close();
					}, 'click');
				};
				
				addOneNewLinkEvent();
				addEachLiEvent();
				submitData();
				cancelToSubmit();
				
			}, 1);
		}, 'click');
});
