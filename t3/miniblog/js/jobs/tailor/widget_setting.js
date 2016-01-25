/**
 * @author wangliang3@staff.sina.com.cn
 */
//import API
$import("diy/dom.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/getEvent.js");
//ajax
$import("sina/utils/io/ajax.js");
//widget
$import("diy/dialog.js");
$import("diy/widget/poplayer.js");
$import("diy/widget/dragdrop.js");

$registJob('widget_setting', function(){
    var event = Core.Events, dom = App.Dom;
    //pars
    var config = {
        btn: 'custom_widget_btn',
        win_id: 'widget_layer',
        ghost_id: 'widget_layer_ghost',
        con_tag: '_con',
        srv_pop: 'widget/aj_modulelist.php',
        srv_tab: 'widget/aj_exchange.php',//tab切换暂时取消,后续扩展(JS已经完成)
        srv_post: 'widget/aj_savemodule.php'
    };
    
    var popPanel = null, loading = null, atList = null, tabCon = [], ddItems = {},isDrag = false;
	
    //feed tab and drag&drop event
    var handler = {
        click: function(){
			event.stopEvent();
            if (popPanel) {
                popPanel.show();
                return;
            }
			//init loading
	        if (!loading) {
	            loading = handler.layer.loading();
				loading.play($SYSMSG['WL0001']);
	        }
			//end
            Utils.Io.Ajax.request(config.srv_pop, {
                'POST': '',
                'onComplete': function(json){
                    loading.hide();
                    if (json.code == 'A00006') {
                        //layer html builder
                        popPanel = handler.layer.ddLayer(json.data);
                        //get right list ul
                        atList = dom.getByClass('atmodule_list', 'ul', popPanel.bd)[0];
                        //show dd parent panel
                        popPanel.show();
                    }
                    else {
                        App.alert($SYSMSG[json.code]);
                    }
                },
                'onException': function(){
                    //                App.alert($SYSMSG['A00001']);
                },
                'returnType': 'json'
            });
        },
        layer: {
            loading: function(){
                var panel = App.PopLayer('io_loading', {
                    index: 2000,
                    ismask: true,
                    height: '150px',
                    width: '300px'
                });
                var html = [];
                html.push('<div class="layerBox_loading"><div class="ll_info">');
                html.push('<img height="16" width="16" src="' + scope.$BASEIMG + 'style/images/common/loading.gif" alt="" title="">');
                html.push('<p id="msg"></p></div></div>');
                
                var build = App.builder3(html.join(''), panel.root, {
                    dd: 'id'
                });
				panel.items = build.domList;
				panel.play = function(txt){
					panel.items.msg.innerHTML = txt;
					panel.show();
				};
                return panel;
            },
            tipLayer: function(func){
                var panel = App.PopLayer('isfirst_confirm', {
                    index: 1000,
                    ismask: true,
                    width: '500px'
                });
                var html = [];
                html.push('<div class="layersetcont">');
                html.push(' <div class="hd">');
                html.push(' <p class="gray9">'+$SYSMSG['WL0002']+'</p>');
                html.push(' <p>'+$SYSMSG['WL0003']+'</p>')
				html.push('<a id="start" class="newbbtngrn" href="#"><em>'+$SYSMSG['WL0004']+'</em></a>');
				html.push('</div>');
                html.push(' <div class="bd">');
                html.push(' <img height="194" width="434" src="' + scope.$BASEIMG + 'style/images/common/layer/set_movepic.gif" alt="" title="">');
                html.push(' </div>');
                html.push('</div>');
                
                var build = App.builder3(html.join(''), panel.root, {
                    dd: 'id'
                });
                
                event.addEvent(build.domList['start'], function(){
					event.stopEvent();
                    func();
                    panel.hide();
                });
                panel.show();
            },
            ddLayer: function(html){
				var panel = App.PopLayer(config.win_id, {
					index: 1500,
					ismask: true,
					width: '648px'
				});
				panel.hd.innerHTML = '<div class="cg_panel_top"><span class="cpt_icon"></span><div class="cpt_tip"><p>'+$SYSMSG['WL0005']+'</p><p class="graya">'+$SYSMSG['WL0006']+'</p></div><div class="cpt_btn"><a act="save" class="newbbtngrn" href="#"><em>'+$SYSMSG['WL0007']+'</em></a><a act="cancel" class="btn_gray" href="#"><em>'+$SYSMSG['WL0008']+'</em></a></div><div class="clear"></div></div>';
				panel.bd.innerHTML = html;
				//bind events
				dom.getBy(function(el){
					if (el.getAttribute('act')) {
						event.addEvent(el, function(){
							event.stopEvent();
							handler.feed[el.getAttribute('act')](panel);
						});
					}
				}, 'a', panel.hd);
				//bind feed event
				handler.feed.build(panel.bd);
				//bind tab event
				handler.tab.build(panel.bd);
				//check right dd items
				handler.dd.empty(panel.bd);
				return panel;
            }
        },
        feed: {
            build: function(obj){
				var lmodule = dom.getByClass('lmodule','div',obj)[0];
				var rmodule = dom.getByClass('rmodule','div',obj)[0];
                dom.getBy(function(el){
                    switch (el.tagName.toLowerCase()) {
                        case 'a':
							//展开module预览面板
                            if (dom.hasClass(el, 'moduleo')) {
                                event.addEvent(el, function(){
                                    event.stopEvent();
                                    handler.feed.expand(el);
                                });
                            }
							//点击左侧添加按钮动作
                            if (dom.hasClass(el, 'rbm')) {
                                event.addEvent(el, function(){
                                    event.stopEvent();
                                    handler.feed.add(el);
									//check right dd items
                					handler.dd.empty(popPanel.bd);
                                });
                            }
							//点击右侧展开按钮动作
                            if (dom.hasClass(el, 'rdel')) {
                                event.addEvent(el, function(){
                                    event.stopEvent();
                                    for (; !dom.hasClass(el, 'item_module'); el = el.parentNode) 
                                        ;
                                    handler.feed.recover(el);
									//check right dd items
                					handler.dd.empty(popPanel.bd);
                                });
                            }
							//设定鼠标华东到title是的提示文案
							if(el.getAttribute('act')&&el.getAttribute('act')=='title'){
								event.addEvent(el, function(){
									var isLmodule = dom.contains(lmodule,el);
									el.setAttribute('title',isLmodule?$SYSMSG['WL0009']:$SYSMSG['WL0010']);
                                },'mouseover');
							}
                            break;
                        case 'div':
                            if (dom.hasClass(el, 'item_module')) {
                                //over
                                event.addEvent(el, function(){
                                    event.stopEvent();
									if (isDrag) {
					                    return;
					                }
					                dom.addClass(el, 'module_hover');
                                }, 'mouseover');
                                event.addEvent(el, function(){
                                    event.stopEvent();
									if (isDrag) {
					                    return;
					                }
					                dom.removeClass(el, 'module_hover');
                                }, 'mouseout');
                                //bind dd event
                                handler.dd.build(el);
                            }
                            break;
                    }
                }, '', obj);
            },
            expand: function(el){
                var mod = el;
                for (; !dom.hasClass(mod, 'item_module'); mod = mod.parentNode) 
                    ;
                
                var css = 'open';
                if (dom.hasClass(mod, css)) {
                    dom.removeClass(mod, css);
                }
                else {
                    dom.addClass(mod, css);
                }
            },
            add: function(el){
                var mod = el;
                for (; !dom.hasClass(mod, 'item_module'); mod = mod.parentNode) 
                    ;
                dom.addClass(mod.parentNode, 'located');
                dom.removeClass(mod, 'module_hover');
				dom.removeClass(mod, 'open');
                //设定conid
				mod.parentNode.setAttribute('id',mod.getAttribute('id') + config.con_tag);
				
                var nliCon = $C('li');
                nliCon.appendChild(mod);
                var lists = dom.getByClass('item_module', 'div', atList);
                if (lists.length > 0) {
                    atList.insertBefore(nliCon, lists[0].parentNode);
                }
                else {
                    atList.appendChild(nliCon);
                }
            },
            recover: function(el){
                var liCon = $E(el.getAttribute('id') + config.con_tag);
                dom.removeClass(el, 'open');
				
                var moveItem = function(el){
                    var tmp = el.parentNode;
                    liCon ? liCon.appendChild(el) : '';
                    var parent = tmp.parentNode;
                    if (parent) {
                        parent.removeChild(tmp);
                    }
                    return liCon;
                };
                
                //tabCon[index],Tab操作预留，本版本暂不使用
				var index = el.getAttribute('index');
                if (!liCon && tabCon[index]) {
                    liCon = $C('li');
                    
                    var attType = el.getAttribute('type');
                    var appCon = dom.getBy(function(el){
                        return (dom.hasClass(el, 'app_module') || dom.hasClass(el, 'default_module')) && el.getAttribute('type') == attType;
                    }, 'div', tabCon[index])[0];
                    if (appCon) {
                        var ulCons = dom.getByClass('modulelist', 'ul', appCon);
                        /*防止PHP未输出占位UL使用
                         if (!ulCons[0]) {
                         ulCons[0] = $C('ul');
                         dom.addClass(ulCons[0], 'modulelist');
                         appCon.appendChild(ulCons[0]);
                         }
                         if (!ulCons[1]) {
                         ulCons[1] = $C('ul');
                         dom.addClass(ulCons[1], 'modulelist');
                         appCon.appendChild(ulCons[1]);
                         }*/
						
						//ulCons 0/1组测为左/右两列未选中module
                        ulCons[0].count = ulCons[0].getElementsByTagName('li').length;
                        ulCons[1].count = ulCons[1].getElementsByTagName('li').length;
                        
                        liCon = moveItem(el);
                        if (ulCons[0].count > ulCons[1].count) {
                            ulCons[1].appendChild(liCon);
                        }
                        else {
                            ulCons[0].appendChild(liCon);
                        }
                        appCon.style.display = '';
                    }
                }
                else {
                    dom.removeClass(liCon, 'located');
                    moveItem(el);
                }
				
                //取消右侧模块后恢复带原分组中，闪烁效果
                var i = 0;
                var interval = setInterval(function(){
                    if (i == 4) {
                        clearInterval(interval);
                        dom.removeClass(el, 'module_hover');
                        return;
                    }
                    else 
                        if (i % 2 == 0) {
                            dom.addClass(el, 'module_hover');
                        }
                        else 
                            if (i % 2 == 1) {
                                dom.removeClass(el, 'module_hover');
                            }
                    i++;
                }, 200);
                
            },
            apps: function(func){
                func = func ||
                function(){
                    return true
                };
                var ids = [], items = [];
                dom.getBy(function(el){
                    if (dom.hasClass(el, 'item_module') && func(el)) {
                        ids.push(el.getAttribute('id'));
                        items.push(el);
                    }
                }, 'div', atList);
                return {
                    ids: ids,
                    items: items
                }
            },
            save: function(){
                //add loading layer
                loading.play($SYSMSG['WL0012']);
                var pars = {};
                pars.apps = handler.feed.apps().ids;
                Utils.Io.Ajax.request(config.srv_post, {
                    'POST': pars,
                    'onComplete': function(json){
                        if (json.code == 'A00006') {
                            //close layer
//                            window.location.reload();
							window.location.href = window.location.href;
                        }
                        else {
                            App.alert($SYSMSG[json.code]);
                        }
                    },
                    'onException': function(){
                    },
                    'returnType': 'json'
                });
            },
            cancel: function(){
//                popPanel.hide();
				popPanel.fire();
				popPanel = null;
            }
        },
        tab: {
            build: function(obj){
                var nav = dom.getByClass('modulenav', 'div', obj)[0];
                dom.getBy(function(el){
                    if (dom.hasClass(el, 'modulect') && el.getAttribute('index')) {
                        tabCon[el.getAttribute('index')] = el;
                    }
                }, 'div', obj);
                dom.getBy(function(el){
                    event.addEvent(el, function(){
                        handler.tab.click(el, nav);
                    });
                }, 'span', nav);
            },
            click: function(obj, nav){
                dom.getBy(function(el){
                    if (obj == el) {
                        dom.replaceClass(el, 'cur', 'navitem');
                    }
                    else 
                        if (dom.hasClass(el, 'cur')) {
                            dom.replaceClass(el, 'navitem', 'cur');
                        }
                }, 'span', nav);
                
                var index = obj.getAttribute('index');
                if (!tabCon[index]) {
                    tabCon[index] = $C('div');
                    dom.addClass(tabCon[index], 'modulect');
                    tabCon[index].setAttribute('index', index);
                    nav.parentNode.appendChild(tabCon[index]);
                    
                    var pars = {};
                    pars.type = index;
                    pars.apps = handler.feed.apps(function(el){
                        return el.getAttribute('index') == index;
                    }).ids;
                    
                    Utils.Io.Ajax.request(config.srv_tab, {
                        'POST': pars,
                        'onComplete': function(json){
                            if (json.code == 'A00006') {
                                tabCon[index].innerHTML = json.data;
                                
                                for (var i = 0, len = tabCon.length; i < len; i++) {
                                    if (tabCon[i]) {
                                        dom.setStyle(tabCon[i], 'display', index == i ? '' : 'none');
                                    }
                                }
                                //bind feed event
                                handler.feed.build(tabCon[index]);
                                //bind tab event
                                handler.tab.build(tabCon[index]);
                                
                            }
                            else {
                                App.alert($SYSMSG[json.code]);
                            }
                        },
                        'onException': function(){
                        },
                        'returnType': 'json'
                    });
                }
                
                for (var i = 0, len = tabCon.length; i < len; i++) {
                    if (tabCon[i]) {
                        dom.setStyle(tabCon[i], 'display', index == i ? '' : 'none');
                    }
                }
            }
        },
        dd: {
            //create dd object
            build: function(el){
				//触发拖拽的dom对象
                var tiger = dom.getByClass('modulen', 'div', el)[0];
				//创建拖拽对象
                var drag = App.DragDrop(el, tiger);
                drag.dragStart(handler.dd.start);
                drag.onDrag(handler.dd.draging);
                drag.dragEnd(handler.dd.end);
				return drag;
            },
            //check right empty tip
            empty: function(popbd){
				//check left tip
                var lTip = dom.getByClass('lmodule_mention', 'div', popbd)[0];
                if (lTip && dom.getStyle(lTip, 'display') != 'none') {
                    var lmod = dom.getByClass('lmodule', 'div', popbd)[0];
                    var litems = lmod.getElementsByTagName('li');
                    if (litems.length > 0) {
                        dom.setStyle(lTip, 'display', 'none');
                    }
                }
                //check right tip
				var rTip = dom.getByClass('cpr_notip', 'div', popbd)[0];
                var atList = dom.getByClass('atmodule_list', 'ul', popbd)[0];
                var atItems = [];
                atItems = dom.getByClass('item_module', 'div', atList);
                var setTipView = function(view){
                    view = view || false;
                    if (rTip) {
                        dom.setStyle(rTip, 'display', view ? '' : 'none');
                    }
                    else {
                        var tip = $C('div');
                        tip.innerHTML = $SYSMSG['WL0013'];
                        dom.addClass(tip, 'cpr_notip');
                        dom.setStyle(tip, 'display', view ? '' : 'none');
                        atList.parentNode.appendChild(tip);
                    }
                };
                setTipView(!(atItems.length > 0));
				
				//check right ad
				var rAd = dom.getBy(function(el){if(el.getAttribute('act')&&el.getAttribute('act')=='rad'){return true;}},'div',popbd)[0];
				var setViewAd = function(view){
					view = view || false;
					if(rAd){
						dom.setStyle(rAd, 'display', view ? '' : 'none')
					}
				};
                setViewAd(atItems.length<=5);
				
                
            },
            ghost: function(view){
                view = view || false;
                dragGhost = document.createElement('li');
                dragGhost.setAttribute('id', config.ghost_id);
                dom.addClass(dragGhost, 'item_target');
                dom.setStyle(dragGhost, 'display', view ? '' : 'none');
                atList.appendChild(dragGhost);
                return dragGhost;
            },
            //drag start
            start: function(){
                isDrag = true;
                this.dragGhost = $E(config.ghost_id);
				                
                //取消hover样式
//                dom.removeClass(this.dragDom, 'module_hover');

				//title移除
				this.dragDom.setAttribute('title','');

                var liCon = this.dragDom.parentNode;
                //获取排序区域的xy值
                this.atListPos = dom.getXY(atList);
                //判断是否排序区域module
                this.isAtModule = dom.hasClass(liCon.parentNode, 'atmodule_list');
                //初始ghost
                if (!this.dragGhost) {
                    this.dragGhost = handler.dd.ghost();
                }
                //显示拖拽dom的站位虚线框
                if (this.isAtModule) {
                    atList.insertBefore(this.dragGhost, this.dragDom.parentNode);
                    this.dragGhost.style.display = '';
                }
                else {
                    this.dragGhost.style.display = 'none';
                    dom.addClass(liCon, 'located');
                }
            },
            //draging
            draging: function(){
                var curPos = this.curPos;
                var colPos = this.atListPos;
                if (curPos == null || colPos == null) {
                    return;
                }
                if (!this.dragGhost) {
                    if ($E(config.ghost_id)) {
                        this.dragGhost = $E(config.ghost_id);
                    }
                    else {
                        this.dragGhost = handler.dd.ghost();
                    }
                }
                
                var isX = curPos.x > colPos.x && curPos.x < colPos.x + atList.offsetWidth;
                var isY = curPos.y > colPos.y && curPos.y < colPos.y + atList.offsetHeight;
                if (isX && isY) {
                    var items = dom.getByClass('item_module', 'div', atList);
                    var tmp = null;
                    for (var i = 0, len = items.length; i < len; i++) {
                        var item = items[i];
                        if (this.dragDom == item) {
                            continue;
                        }
                        //check cursor move position
                        var colPos = dom.getXY(item);
						this.dragGhost.style.display = '';
                        item = item.parentNode;
                        if (curPos.y > colPos.y && curPos.y < (colPos.y + item.offsetHeight)) {
                            if (curPos.y < colPos.y + item.offsetHeight / 2) {
                                atList.insertBefore(this.dragGhost, item);
                            }
                            else {
                                dom.insertAfter(this.dragGhost, item);
                            }
                            break;
                        }
                    }
                }
                else 
                    if (isX && curPos.y > colPos.y + atList.offsetHeight) {
                        this.dragGhost.style.display = '';
                        atList.appendChild(this.dragGhost);
                    }
                    else 
                        if (isX && curPos.y < colPos.y) {
							this.dragGhost.style.display = '';
                            atList.firstChild != this.dragGhost && atList.insertBefore(this.dragGhost, atList.firstChild);
                        }
						else 
							if(!isX){
								this.dragGhost.style.display = 'none';
							}
					
            },
            //drag end
            end: function(){
                isDrag = false;
                this.dragDom.style.cssText = '';
                
                var inertAtlist = this.dragGhost.style.display == '';
				
                //移动到module到拖拽位置
                if (this.isAtModule) {
                    if (inertAtlist) {
                        dom.insertAfter(this.dragDom.parentNode, this.dragGhost);
						
                        this.dragGhost.style.display = 'none';
                    }
                    else {
                        handler.feed.recover(this.dragDom);
                    }
                }
                else {
                    if (inertAtlist) {
                        this.dragDom.parentNode.setAttribute('id', this.dragDom.getAttribute('id') + config.con_tag);
                        var _atLi = $C('li');
                        _atLi.appendChild(this.dragDom);
                        dom.insertAfter(_atLi, this.dragGhost);				
                        this.dragGhost.style.display = 'none';
						//左侧拖拽到右侧是展开的面板收折
						dom.removeClass(this.dragDom, 'open');
                    }
                    else {
                        dom.removeClass(this.dragDom.parentNode, 'located');
                    }
                }
                //check right dd items
                handler.dd.empty(popPanel.bd);
            }
        }
    };
    //click tiger popwin
    var buildPoplayer = function(){
        event.stopEvent();
        var btn = $E(config.btn);
        //add tip layer
        //只有用户在第一次点击定制功能时才会出现
        //start
        if (btn.getAttribute('isfirst') != null && btn.getAttribute('isfirst') == 1) {
            btn.setAttribute('isfirst', '0');
            var tips = handler.layer.tipLayer(function(){
                handler.click();
            });
            return;
        }
        //end
        handler.click();
    };
    //bind tiger event
    if ($E(config.btn)) {
        event.addEvent(config.btn, buildPoplayer);
    }
});
