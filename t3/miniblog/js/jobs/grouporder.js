$import("sina/sina.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/previous.js");
$import("sina/core/dom/next.js");
$import("sina/core/dom/contains.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import('jobs/group_manage.js');
$import("sina/utils/io/ajax.js");
$registJob('grouporder', function() {
	//groupdialog
	var i;

	var _addEvent = Core.Events.addEvent;
	var _removeEvent = Core.Events.removeEvent;
	var _groupOrder = $E("Adjust_group_order");
	var get_firstchild = function (n) {
		var x = n.firstChild;
		while (x.nodeType != 1 || x.nodeName!= "LI") {
			x = x.nextSibling;
		}
		return x;
	};
	var get_lastchild = function (n) {
		var x = n.lastChild;
		while (x.nodeType != 1 || x.nodeName!= "LI") {
			x = x.previousSibling;
		}
		return x;
	};
	var orderId;
	var makeHtml = function(data) {
		//		orderId = [];//清空
		var html = ['<div class="friLayBox">\
                <div class="frileft">\
                  <ul id="mpop_ul_frititle" class="frititle">\
                    <li>'+$CLTMSG['YA0002']+'</li>\
                  </ul>\
                  <div class="friList">\
					<ul id="group_ul_lists">'];

		var liHtml = '<li class="current"><span>'+$CLTMSG['YA0010']+'</span></li>';

		for (var i = 0,len = data.length; i < len; i++) {
			if (i < 4) {
//				html.push('<li _index=' + i + '><a  href="javascript:void(0)">' + data[i].value + '<span class="dis">(' + $CLTMSG['YA0007'] + ')</span></a></li>');
				html.push('<li _index=' + i + '><a  href="javascript:void(0)">' + data[i].value + '</a></li>');
				liHtml += '<li>' + (data[i].value2 || data[i].value) + '</li><li class="MIB_line_l">|</li>';
			} else {
				/*if (i === 3) {
					liHtml += '<li>更多</li>'
				}*/
				html.push('<li _index=' + i + '><a  href="javascript:void(0)">' + data[i].value + '</a></li>');
			}
		}
		liHtml += '<li>更多</li>';
			//			orderId.push(data[i].key);

		html.push('</ul>\
                  </div>\
                </div>\
                <div class="friright">\
                  <a id="orderup" href="javascript:void(0)" class="btn_notclick"><em><img src="http://timg.sjs.sinajs.cn/t3/style/images/common/transparent.gif" class="chupdwn_icon dch_icon" title="">' + $CLTMSG['YA0005'] + '</em></a>\
                  <a id="orderdown" href="javascript:void(0)" class="btn_notclick"><em><img title="" class="chupdwn_icon uch_icon" src="http://timg.sjs.sinajs.cn/t3/style/images/common/transparent.gif">' + $CLTMSG['YA0006'] + '</em></a>\
               </div>\
                <p id="mpop_p_btn" class="btn"><a id="gosave" href="javascript:void(0)" class="newabtngrn"><em>' + $CLTMSG['CX0036'] + '</em></a><a id="gocancel" href="javascript:void(0)" class="btn_normal btns"><em>' + $CLTMSG['CC1103'] + '</em></a></p>\
              </div>\
			</div>');

		html.unshift('<div class="friexpicbor">\
				  <div class="friexpic">\
					<h3>'+$CLTMSG['YA0008']+'</h3>\
					<div class="fbTagB">\
					  <ul id="ul_oriderLists">',
				liHtml,
				'</ul>\
					 </div>\
					</div>\
				</div>');
		return html.join("");
	};
	var a_clicked=false;
	_addEvent(_groupOrder, function() {
		//		_groupDialog.show();

		getData();
		a_clicked=true;
		return false;
	}, "click");

	var _fixEvent = function(event) {
		//from jquery
		event = event || window.event;
		if (!event.target) {
			event.target = event.srcElement || document;
		}
		if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode)) {
			event.which = event.charCode || event.keyCode;
		}
		if (!event.which && event.button !== undefined) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		if (event.pageX == null && event.clientX != null) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
		}
		return event
	};

	//todo 改用Core.Dom.contains
	var _wantedTarget = function(tag, node) {
		while (tag) {
			if (tag.parentNode === node) {
				return tag;
			}
			tag = tag.parentNode;
		}
		return null;
	};
	var tmpdiv = document.createElement("div");
	tmpdiv.style.cssText = "cursor:move; height:3px; background-color:#36f;display:none;overflow:hidden";
	var Mouse = function() {
		this.initialize.apply(this, arguments);
	};

	Mouse.prototype = {
		//初始化
		initialize:function() {
			var _this = this;
			this._mouseStarted = false;
			var mouseDownFunc = function(event) {
				event = _fixEvent(event);
				_this.mouseDown(event);      //传入经过fix的event
			};
			_addEvent(document, mouseDownFunc, "mousedown");
		},
		//鼠标按下
		mouseDown:function(event) {
			var _this = this;
			//不是想要的鼠标点击，取消
			this.cancel = !this.mouseCapture(event);
			if (this.cancel) {
				return false;
			}
			this.mouseStart(event);
			this.mouseMoveFunc = function(event) {
				_this.mouseDrag(event);
			};
			this.mouseUpFunc = function(event) {
				_this.mouseUp(event);
			};
			_addEvent(document, _this.mouseMoveFunc, "mousemove");
			_addEvent(document, _this.mouseUpFunc, "mouseup");

		},
		mouseDrag: function(event) {
			event = _fixEvent(event);
			if (this._mouseStarted) {
				this.mouseMove(event);
			}
			if (this.moveDistance(event)) {
				this._mouseStarted = true;
			}
		},
		//鼠标放开
		mouseUp:function(event) {
			if (this.cancel) {
				return false;
			}
			var _this = this;
			_removeEvent(document, _this.mouseMoveFunc, "mousemove");
			_removeEvent(document, _this.mouseUpFunc, "mouseup");

			//			 document.onmousemove=document.onmouseup=null;
			this._mouseStarted = false;
			this.mouseStop(event);
		},

		// 对外接口
		mouseStart: function(event) {
			return true;
		},
		mouseMove: function(event) {
		},
		mouseStop: function(event) {
		},
		mouseCapture: function(event) {
			return true;
		},
		moveDistance:function(event) {
			return true;
		}
	};

	var _groupDialog;
	var getData = function() {
		if(a_clicked) return;
		//todo 链接写死了  json数据正确性是否判断?
		Utils.Io.Ajax.request("http://t.sina.com.cn/attention/aj_grouplist.php", {
			'onComplete': function(json) {
				json = json || [];
				var _groupHtml = makeHtml(json);
				_groupDialog = new App.Dialog.BasicDialog($CLTMSG['YA0004'], _groupHtml, {
					zIndex: 1200
					,width:440
					//					hiddClose: true,
					//					hidden: true
				});

				a_clicked=false;
				var group_ul = $E("group_ul_lists");//ul
				var group_ul_lists = group_ul.getElementsByTagName("a");
				var len = group_ul_lists.length;
				var selected = Core.Dom.getElementsByClass(group_ul, "a", "down")[0];


				var _gosave = $E("gosave");            //保存
				var _gocancel = $E("gocancel");              //取消
				var orderup = $E("orderup");              //取消
				var orderdown = $E("orderdown");              //取消


				var groupOrderSave = function() {			   //保存顺序
					orderId = [];
					for (var i = 0,len = json.length; i < len; i++) {
						orderId.push(json[i].key);
					}
					Utils.Io.Ajax.request('http://t.sina.com.cn/attention/aj_update_group_order.php?gids=' + orderId.join(","), {
						'onComplete': function(json) {
							if (json.code === 'A00006') {
								var tip = App.alert({'code':'A00006'}, {
									'icon':3,
									'ok':function() {
										window.location.reload();
									}
								});
								setTimeout(function() {
									tip.close();
									window.location.reload();
								}, 1000);
							} else {
								App.alert({'code':json.code});
							}
						},
						'returnType': 'json'
					});
				};

				var next,prev,selectedLi;
				var ul_olists = document.getElementById("ul_oriderLists");
				var moveOverFunc = function(o, d) {
					 o.getElementsByTagName("a")[0].focus();
					var oi = o.getAttribute("_index");
					var di = d.getAttribute("_index");
					o.setAttribute("_index", di);
					d.setAttribute("_index", oi);

					if (di < 4 && oi > 3) {
//						o.getElementsByTagName("a")[0].innerHTML = json[oi].value + '<span class="dis">('+$CLTMSG['YA0007']+')</span>';
//						d.getElementsByTagName("a")[0].innerHTML = json[di].value;
						ul_olists.getElementsByTagName("li")[di * 2 + 1].innerHTML =  json[oi].value2||json[oi].value;
					} else if (oi < 4 && di > 3) {
//						o.getElementsByTagName("a")[0].innerHTML = json[oi].value;
//						d.getElementsByTagName("a")[0].innerHTML = json[di].value + '<span class="dis">('+$CLTMSG['YA0007']+')</span>';
						ul_olists.getElementsByTagName("li")[oi * 2 + 1].innerHTML = json[di].value2||json[di].value;
					} else if (di < 4 && oi < 4) {
						ul_olists.getElementsByTagName("li")[oi * 2 + 1].innerHTML = json[di].value2||json[di].value;
						ul_olists.getElementsByTagName("li")[di * 2 + 1].innerHTML = json[oi].value2||json[oi].value;
					}
					var tmp = json[di];
					json[di] = json[oi];
					json[oi] = tmp;
				};

				var changeMouseOrder = function(o, d) {
					var lis = group_ul.getElementsByTagName("li");
					var orlis = ul_olists.getElementsByTagName("li");
					var oi = 0 | o.getAttribute("_index"),di;
					if (d) {
						di = d && 0 | d.getAttribute("_index");
					} else {
						di = -1;       //插到首位置特殊处理
					}


					//					debugger;
					var joi = json[oi];
					if (oi < di) {
						json.splice(di + 1, 0, joi);
						json.splice(oi, 1);
					} else if (oi > di) {
						json.splice(oi, 1);
						json.splice(di + 1, 0, joi);
					} else {
						return;
					}

					for (var i = 0,len = lis.length; i < len; i++) {
						if (i < 4) {
							orlis[i * 2 + 1].innerHTML = json[i].value2||json[i].value;
//							lis[i].getElementsByTagName("a")[0].innerHTML = json[i].value + '<span class="dis">('+$CLTMSG['YA0007']+')</span>';
						} else {
//							lis[i].getElementsByTagName("a")[0].innerHTML = json[i].value;
						}
						lis[i].setAttribute("_index", i);
						lis[i].getElementsByTagName("a")[0].style.cursor = "";

					}
				};


				/**
				 * 移动节点
				 * @param direction	   方向
				 * @param selectedNode
				 * @param toAppendNode
				 */
				//todo css 和 js 解耦
				var moveNode = function(selectedNode, toAppendNode, direction) {
					//direction判断方向
					if (direction) {		//向后加
						Core.Dom.insertAfter(selectedNode, toAppendNode);
					} else {					   //向前加
						group_ul.insertBefore(selectedNode, toAppendNode);
					}
					if (selectedNode === get_firstchild(group_ul)) {  //移到第一个节点
						orderup.className = "btn_notclick";
						orderdown.className = "btn_normal";
					} else if (selectedNode === get_lastchild(group_ul)) {  //移到最后一个节点
						orderup.className = "btn_normal";
						orderdown.className = "btn_notclick";
					} else {
						orderup.className = "btn_normal";
						orderdown.className = "btn_normal";
					}
					moveOverFunc(selectedNode, toAppendNode);
				};


				_addEvent(_gosave, function() {
					_groupDialog.close();
					groupOrderSave();
				}, "click");
				_addEvent(_gocancel, function() {
					_groupDialog.close();
					return false;
				}, "click");

				_addEvent(orderup, function() {				//移动顺序
					if (!selected) return;
					selectedLi = selected.parentNode;
					prev = Core.Dom.previous(selectedLi, "");
					while (prev && prev.nodeName!= "LI") {
						prev = Core.Dom.previous(prev, "");
					}
					if (orderup.className != "btn_notclick") {
						moveNode(selectedLi, prev);
					}
					return false;
				}, "click");
				_addEvent(orderdown, function() {
					if (!selected) return;
					selectedLi = selected.parentNode;
					next = Core.Dom.next(selectedLi, "");
					while (next && next.nodeName!= "LI") {
						next = Core.Dom.next(next, "");
					}
					if (orderdown.className != "btn_notclick") {
						moveNode(selectedLi, next, true);
					}
					return false;
				}, "click");


				var mouseorder = new Mouse(),destag,thisTag,firstFlag,taga,tagli = null;
				var mpop_ul_frititle=document.getElementById("mpop_ul_frititle"),
				mpop_p_btn=document.getElementById("mpop_p_btn");

				mouseorder.mouseCapture = function(event) {
					var _tag = _wantedTarget(event.target, group_ul);
					return event.which === 1 && _tag && (_tag.nodeName=== "LI");
				};

				mouseorder.mouseStart = function(event) {
					this.pageY = event.pageY;
					thisTag = event.target;
					while (thisTag.nodeName != "A") {
						thisTag = thisTag.parentNode;
					}
					thisTag.className = "drag";
					thisTag.ondragstart = function() {
						return false;
					};
				};

				mouseorder.moveDistance = function(event) {
					return (Math.abs(event.pageY - this.pageY)) > 2;    //只有竖向移动距离大于2PX，才执行mouseMove方法
				};

				mouseorder.mouseMove = function(event) {
					if(event.target===tmpdiv){    //鼠标移动到插入的tmpdiv（小蓝条）
						return;
					}
					tagli = _wantedTarget(event.target, group_ul);     //当前鼠标所在的LI ，让事件冒泡到LI上方便统一处理
					
					if(tagli){
						if (firstFlag||destag != tagli) {       //上一次的鼠标停留位置和现在不同
							taga = tagli.getElementsByTagName("a")[0];
							if (taga.style.cursor == "") {
								taga.style.cursor = "move";
							}

							firstFlag = false;
							tmpdiv.style.display = "";
							destag = tagli;  //目的LI
							Core.Dom.insertAfter(tmpdiv, destag);
						}

					}else{ //鼠标移出UL
						if (destag === get_firstchild(group_ul)) {   //前一个目标节点是首节点
							firstFlag = true;
							group_ul.insertBefore(tmpdiv, destag);
						}

						if (Core.Dom.contains(mpop_ul_frititle, event.target)) {
							group_ul.parentNode.scrollTop -= 10;
						} else if (Core.Dom.contains(mpop_p_btn, event.target)) {
							group_ul.parentNode.scrollTop += 10;
						}

					}
				};
				mouseorder.mouseStop = function(event) {
					tmpdiv.style.display = "none";
					if (destag) { //有拖动
						//拖动时已经有选中的
						if (selected) {
							selected.className = "";
						}
						thisTag.className = "down";
						selected = thisTag;
						if (firstFlag) {
							group_ul.insertBefore(thisTag.parentNode, get_firstchild(group_ul));

							changeMouseOrder(thisTag.parentNode);

						} else {

							Core.Dom.insertAfter(thisTag.parentNode, destag);
							changeMouseOrder(thisTag.parentNode, destag);

						}
						destag = null;
					} else {	//只点击
						if (thisTag == selected) {		 //点击已经选中的
							selected = null;
							thisTag.className = "";
						} else {			//点击未选中的
							selected && (selected.className = "");
							thisTag.className = "down";
							selected = thisTag;
						}
					}

					if (selected === null) {
						orderup.className = "btn_notclick";
						orderdown.className = "btn_notclick";
					} else if (selected == group_ul_lists[0]) {
						orderup.className = "btn_notclick";
						orderdown.className = "btn_normal";
					} else if (selected == group_ul_lists[len - 1]) {
						orderup.className = "btn_normal";
						orderdown.className = "btn_notclick";
					} else {
						orderup.className = "btn_normal";
						orderdown.className = "btn_normal";
					}
				};
			},
			'returnType':'json'
		});
	};
	//for test
	//	getData();
});
