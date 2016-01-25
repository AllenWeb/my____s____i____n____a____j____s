$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/string/leftB.js");
$import('sina/core/string/decodeHTML.js');
$import('sina/core/string/encodeHTML.js');
$import("diy/builder.js");
$import("diy/page.js");
$import("diy/fansfind.js");
$import("diy/followingsInfo.js");
$import('jobs/group_manage.js');
$import("diy/TextareaUtils.js");

(function(proxy){
	var getTextLength = function(str){
		var ret = 0;
		for(var i = 0, len = str.length; i < len; i += 1){
			var code = str.charCodeAt(i);
			if(code > 96 && code < 123){
					ret += 8;
			}else{
				ret += 13;
			}
		}
		return ret; 
	};
	var checkIn = function(Arr,key){
		for(var i = 0, len = Arr.length; i < len; i += 1){
			if(Arr[i] == key){
				return true;
			}
		}
		return false;
	};
	var priv = {};
	
	priv.userText = function(spec){
		var inp = document.createElement('INPUT');
			inp.type = 'text';
			
		var box = document.createElement('LI');
			box.appendChild(inp);
			box.style.cssText = 'height:20px;float:left';
	
		var suggest = proxy.fansfind({
			'select' : function(uid,name){
				spec.fire(uid,name);
				inp.value = '';
				setTimeout(function(){
					//suggest.end();
					inp.focus();
					setLength();
				},0);
			},
			'input' : inp,
			'style' : 'width:200px;position:absolute;z-Index:1200;',
			'emptyInfo' : $CLTMSG['CY0102'],
			'noblur' : true,
			'emptyClass' : 'mbf_input_layer'
		});	
			
		var setLength = function(){
			setTimeout(function(){
				inp.style.width = getTextLength(inp.value) + 6 + 'px';
			},0);
		};
//		Core.Events.addEvent(inp,function(){
//			setLength();
//		},'keydown');
		Core.Events.addEvent(inp,function(){
			setLength();
			if(!$IE){
				var curpos = App.TextareaUtils.getCursorPos(inp);
				inp.value = inp.value;
				App.TextareaUtils.setCursor(inp,curpos);
			}
		},'keyup');
		Core.Events.addEvent(inp,function(){
			//inp.style.display = 'none';
			inp.value = '';
		},'blur');
		setLength();
		
		var that = {};
		that.get = function(key){
			if(key == 'input'){
				return inp;
			}
			if(key == 'box'){
				return box;
			}
		};
		that.show = function(){
			inp.style.display = '';
			inp.focus();
		};
		return that;
	};
	priv.errorItem = function(spec){
		var temp = [
			{'tagName' : 'div', 'attributes' : {'class' : 'mbFL_top'}},
			{'tagName' : 'div', 'attributes' : {'class' : 'mbFL_cen'}, 'childList': [
				{'tagName' : 'img', 'attributes' : {'class' : 'tipicon tip1','src':scope.$BASEIMG+'style/images/common/transparent.gif'}},
				{'tagName' : 'span', 'attributes' : {'class' : 'txt','id':'text'}}
			]},
			{'tagName' : 'div', 'attributes' : {'class' : 'mbFL_bottom'}}
		];
		var box = document.createElement('LI');
			box.className = 'mbFL_clue';
			box.style.position = 'absolute';
			box.style.zIndex = 1000;
		var item = (new proxy.Builder(temp,box));
		var current = null;
		var timer = null;
		
		var show = function(obj,text){
			var UI = obj.domList['layer'];
			if(UI.parentNode){
				clear();
				UI.parentNode.appendChild(box);
				box.style.display = 'block';
				item.domList['text'].innerHTML = text;
				current = obj;
				var pos1 = Core.Dom.getXY(UI);
				var pos2 = Core.Dom.getXY(UI.parentNode.parentNode.parentNode);
				if(UI.parentNode.parentNode.parentNode.style.position !== 'absolute'){
					pos2 = [0,0];
				}
				box.style.top =pos1[1] - pos2[1] + 'px';
				box.style.left = pos1[0] - pos2[0] + 'px';
				timer = setTimeout(function(){
					hidd(current);
				},1000);
			}
		};
		var hidd = function(obj){
			box.style.display = 'none';
			box.parentNode.removeChild(box);
		};
		var clear = function(){
			box.style.display = 'none';
			if(current){
				current = null;
			}
			if(timer){
				clearTimeout(timer);
				timer = null;
			}
			if(box.parentNode){
				box.parentNode.removeChild(box);
			}
		};
		
		var that = {};
		that.show = show;
		that.hidd = hidd;
		that.clear = clear;
		return that;
	};
	/**
	 * spec:
		len:数据的长度。
		fire:选择的时候的函数。
		
		that:
		 show:
		 hidd:
		 get:
		 selectOne:
		 unselectOne:
	 */
	priv.itemList = function(spec){
		var temp = [{'tagName' : 'li', 'attributes' : {'id':'layer'}, 'childList': [
			{'tagName' : 'div', 'attributes' : {'class' : 'mbFL_top'}},
			{'tagName' : 'div', 'attributes' : {'class' : 'mbFL_cen'}, 'childList': [
				{'tagName' : 'div', 'attributes' : {'class' : 'head_pic'}, 'childList': [
					{'tagName' : 'a', 'attributes' : {'id':'link'}, 'childList': [
						{'tagName' : 'img', 'attributes' : {'class' : 'picborder_l','id':'head'}}
					]},
					{'tagName' : 'img', 'attributes' : {'id':'icon','class' : 'tipicon tip3', 'src' : scope.$BASEIMG+'style/images/common/transparent.gif', 'style':'display:none'}}
				]},
				{'tagName' : 'div', 'attributes' : {'class' : 'mbFLcen_con'}, 'childList': [
					{'tagName' : 'p', 'attributes' : {'class' : 'head_name','id':'name'}},
					{'tagName' : 'p', 'attributes' : {'id':'remark'}}
				]}
			]},
			{'tagName' : 'div', 'attributes' : {'class' : 'mbFL_bottom'}}
		]}];
		var box = document.createElement('UL');
		var list = [];
		
		var bind = function(dom){
			var UI = dom.domList;
			Core.Events.addEvent(UI['layer'],function(){
				if(UI['layer'].className == 'mbFL_current'){
					return false;
				}
				UI['layer'].className = 'mbFL_hover';
			},'mouseover');
			
			Core.Events.addEvent(UI['layer'],function(){
				if(UI['layer'].className == 'mbFL_current'){
					return false;
				}
				UI['layer'].className = '';
			},'mouseout');
			
			Core.Events.addEvent(UI['layer'],function(){
				spec.fire(dom.info,dom.domList);
			},'click');
			return dom;
		};
		
		var rend = function(dom,data){
			var UI = dom.domList;
			if(!data){
				UI['layer'].style.display = 'none';
				dom.info = {};
				return dom;
			}
			UI['layer'].style.display = 'block';
			UI['head'].src = data.icon;
			UI['name'].innerHTML = data.name + (data['isvip']?'<img class="small_icon vip" title="新浪认证" alt="" src="'+scope.$BASEIMG+'style/images/common/transparent.gif">':'');
			if(data['remark']){
				var showRemark = Core.String.decodeHTML(data['remark']);
				if(Core.String.byteLength(showRemark) > 10){
					showRemark = Core.String.leftB(showRemark,10) + '...';
				}
				UI['remark'].innerHTML = '(' +  Core.String.encodeHTML(showRemark) + ')';
			}else{
				UI['remark'].innerHTML = '';
			}
			UI['layer'].className = '';
			UI['layer'].title = data.name + (data['remark'] ? ('(' + data['remark'] + ')') : '');
			UI['icon'].style.display = 'none';
			dom.info = data;
			return dom;
		};
		
		var selectOne = function(UI){
			UI['layer'].className = 'mbFL_current';
			UI['icon'].style.display = '';
		};
		
		var unselectOne = function(UI){
			UI['layer'].className = '';
			UI['icon'].style.display = 'none';
		};
		
		for(var i = 0, len = (spec.len || 12); i < len; i += 1){
			list.push(bind(new App.Builder(temp,box)));
		}
		
		
		var that = {};
		//sList被选中的id列表
		that.show = function(data,sList){
			for(var i = 0, len = spec.len; i < len; i += 1){
				rend(list[i],data[i]);
				if(data[i]){
					if(checkIn(sList,data[i]['uid'])){
						selectOne(list[i].domList);
					}else{
						unselectOne(list[i].domList);
					}
				}
			}
			box.style.display = '';
		};
		that.hidd = function(){
			box.style.display = 'none';
		};
		that.get = function(key){
			if(key == 'box'){
				return box;
			}
		};
		that.selectOne = function(key){
			for(var i = 0, len = list.length; i < len; i += 1){
				if(key == list[i]['info']['uid']){
					selectOne(list[i].domList);
				}
			}
		};
		that.unselectOne = function(key){
			for(var i = 0, len = list.length; i < len; i += 1){
				if(key == list[i]['info']['uid']){
					unselectOne(list[i].domList);
				}
			}
		};
		that.getItemByKey = function(key){
			for(var i = 0, len = list.length; i < len; i += 1){
				if(key == list[i]['info']['uid']){
					return list[i];
				}
			}
		};
		return that;
	};
	
	
	priv.dropList = function(spec){
		var temp = [{'tagName':'li','attributes':{'id':'outer'},'childList':[
			{'tagName':'a','attributes':{'id':'inner','href':'javascript:void(0);'}}
		]}];
		var btnTemp = [{'tagName':'div','attributes':{'class':'mbf_last','id':'btn'},'childList':[
			{'tagName':'span','attributes':{},'childList':[
				{'tagName':'a','attributes':{'href':'javascript:void(0);'},'childList':[
					{'tagName':'img','attributes':{'class':'mbfl_sicon','src':scope.$BASEIMG+'style/images/common/transparent.gif'}}
				]}
			]}
		]}];
		var btnBox = document.createElement('LI');
		var box = document.createElement('UL');
		var shell = document.createElement('DIV');
			shell.className = 'mbfl_other';
			shell.appendChild(box);
			shell.style.display = 'none';
			shell.style.top = '29px';
			shell.style.left = '-99px';
			shell.style.zIndex = 1000;
		var list = [];
		var btn = new App.Builder(btnTemp,btnBox);
			btnBox.appendChild(shell);
			
			Core.Events.addEvent(btn.domList['btn'],function(){
				if(shell.style.display == 'none'){
					shell.style.display = '';
				}else{
					shell.style.display = 'none';
				}
			},'click');
			
		var bind = function(dom){
			var UI = dom.domList;
			Core.Events.addEvent(UI['inner'],function(){
				shell.style.display = 'none';
				spec.fire(dom.info,dom);
			},'click');
			return dom;
		};
		var rend = function(dom,data){
			var UI = dom.domList;
			UI['inner'].innerHTML = data.name;
			UI['outer'].style.display = '';
			dom.info = data;
		};
		var create = function(){
			var ret = bind(new App.Builder(temp,box));
			list.push(ret);
			ret['used'] = true;
			return ret;
		};
		var getOne = function(){
			for(var i = 0, len = list.length; i < len; i += 1){
				if(!list[i]['used']){
					list[i]['used'] = true;
					return list[i];
				}
			}
			return create();
		};
		var unUsedAll = function(){
			for(var i = 0, len = list.length; i < len; i += 1){
				list[i]['used'] = false;
				list[i]['domList']['outer'].style.display = 'none';
			}
		};
		if (spec.staticSelectorPanel) {		
			App.group_manage.register('rename', function(json, params){
				for (var i = 0, len = list.length; i < len; i += 1) {
					if (list[i]['info']['gid'] == params['id']) {
						list[i]['name'] = params['name'];
						rend(list[i], list[i].info);
					}
				}
			});
		}
		var that = {};
		that.show = function(data){
			unUsedAll();
			for(var i = 0, len = data.length; i < len; i += 1){
				rend(getOne(),data[i]);
			}
			btnBox.style.display = '';
			shell.style.display = 'none';
		};
		that.hidd = function(){
			btnBox.style.display = 'none';
		};
		that.get = function(key){
			if(key == 'box'){
				return btnBox;
			}
			if(key == 'list'){
				return list;
			}
		};
		return that;
	};
	
	priv.tabList = function(spec){
		var temp = [{'tagName':'li','attributes':{'id':'outer'},'childList':[
			{'tagName':'div','attributes':{'class':'mbf_tagn','id':'shelf'},'childList':[
				{'tagName':'span','attributes':{'id':'btnStyle'},'childList':[
					{'tagName':'a','attributes':{'id':'inner','href':'javascript:void(0)'}}
				]},
				{'tagName':'span','attributes':{'id':'currentStyle','style':'display:none'}}
			]}
		]}];
		var box = document.createElement('UL');
		var list = [];
		var current = null;
		
		var bind = function(dom,index){
			var UI = dom.domList;
			Core.Events.addEvent(UI['outer'],function(){
				selectOne(index);
			},'click');
			return dom;
		};
		
		var rend = function(dom,data){
			var UI = dom.domList;
			var showName = Core.String.decodeHTML(data.name);
			if(Core.String.byteLength(showName) > 8){
				showName = Core.String.leftB(showName,8) + '...';
			}
			UI['inner'].innerHTML = Core.String.encodeHTML(showName);
			UI['outer'].style.display = '';
			UI['outer'].title = Core.String.decodeHTML(data.name);
			UI['currentStyle'].innerHTML = Core.String.encodeHTML(showName);
			dom.info = data;
			return dom;
		};
		
		var selectOne = function(index){
			if(current !== null){
				list[current].domList['shelf'].className = 'mbf_tagn';
				list[current].domList['currentStyle'].style.display = 'none';
				list[current].domList['btnStyle'].style.display = '';
			}
			var UI = list[index]['domList'];
			UI['shelf'].className = 'mbf_tago';
			UI['currentStyle'].style.display = '';
			UI['btnStyle'].style.display = 'none';
			current = index;
			spec.fire(list[index].info);
		};
		
		for(var i = 0, len = (spec.len || 6); i < len; i += 1){
			list.push(bind(new App.Builder(temp,box),i));
		}
		
		var that ={};
		that.show = function(data){
			var len = Math.min(spec.len,data.length);
			for(var i = 0; i < len; i += 1){
				rend(list[i],data[i]);
			}
			for(var i = len; i < spec.len; i += 1){
				list[i].domList['outer'].style.display = 'none';
			}
			box.style.display = '';
		};
		if (spec.staticSelectorPanel) {		
			App.group_manage.register('rename', function(json, params){
				for (var i = 0, len = list.length; i < len; i += 1) {
					if (list[i]['info']['gid'] == params['id']) {
						list[i]['name'] = params['name'];
						rend(list[i], list[i].info);
					}
				}
			});
		}
		that.hidd = function(){
			box.style.display = 'none';
		};
		that.get = function(key){
			if(key == 'box'){
				return box;
			}
		};
		that.setTab = function(index,info){
			rend(list[index],info);
		};
		that.getTab = function(index){
			return list[index];
		};
		that.set = function(key,value){
			if(key == 'current'){
				current = value;
			}
		};
		that.go = selectOne;
		return that;
	};
	
	
	
	priv.selectPanel = function(spec){
		var temp = [
			{'tagName':'div','attributes':{'class':'mflshadow_right'}},
			{'tagName':'div','attributes':{'class':'mflshadow_bottom'}},
			{'tagName':'div','attributes':{'class':'mbf_tag','id':'tab'}},
			{'tagName':'div','attributes':{'class':'mbFL_person','id':'item'}},
			{'tagName':'div','attributes':{'class':'mbFL_comment','id':'empty','style':'display:none','innerHTML':'<p class="txt"><img class="tipicon tip5" src="' + scope.$BASEIMG + 'style/images/common/transparent.gif" alt="" title="" />&nbsp;' + $CLTMSG['CY0103'] + '</p>'}},
			{'tagName':'div','attributes':{'class':'mbFL_person_bottom','id':'page'},'childList':[
				{'tagName':'a','attributes':{'class':'btn_normal btnxs lf','id':'close','href':'javascript:void(0);','innerHTML':'<em>关闭</em>'}}
			]}
		];
		
		var box = document.createElement('DIV');
			box.className = 'mbFollowLayer';
			box.style.display = 'none';
		var InputBox = null;
		var UI = (new App.Builder(temp,box)).domList;
		Core.Events.addEvent(box,function(){
			Core.Events.stopEvent();
			return false;
		},'click');
		if(spec.staticSelectorPanel){
			UI['close'].style.display = 'none';
		}else{
			box.style.display = 'none';
			Core.Events.addEvent(document.body,function(){
				selector.setPanelIconDown();
				hidd();
			},'click');
			Core.Events.addEvent(UI['close'],function(){
				selector.setPanelIconDown();
				hidd();
				//try{
				//	selector.getInput().get('box').scrollIntoView();
				//}catch(ex){
				//	
				//}
			},'click');
		}
		var cList = [];
		var selector = spec.selector;
		var page = App.page({
			'total' : 1,
			'size' : 12,
			'fire' : function(a,b){
				var data = cList.slice(a,a+b);
				Utils.Io.Ajax.request('/person/aj_getuserinfo.php',{
					'GET' : {'uid' : data.join(',')},
					'onComplete' : function(json){
						for(var i = 0, len = data.length; i < len; i += 1){
							data[i] = json[data[i]];
						}
						errItem.clear();
						items.show(data,selector.getSelectList());
					},
					'onException' : function(){},
					'returnType' : 'json'
				});
				
			}
		});
		var items = priv.itemList({
			'len' : 12,
			'fire': function(info,dom){
				selector.setSelectList('toggle',info['uid'],info['name']);
			}
		});
		var tabs = priv.tabList({
			'len' : 6,
			'staticSelectorPanel' : spec.staticSelectorPanel,
			'fire': function(info){
				cList = proxy.followingsInfo.getGroupInfo(info.gid);
				var size = cList.length;
				if(size <= 0){
					page.get('box').style.display = 'none';
					items.show([]);
					UI['empty'].style.display = '';
					UI['item'].style.display = 'none';
					return false;
				}
				page.get('box').style.display = '';
				page.set('total',size);
				page.go(0);
				UI['item'].style.display = '';
				UI['empty'].style.display = 'none';
			}
		});
		var drop = priv.dropList({
			'staticSelectorPanel' : spec.staticSelectorPanel,
			'fire' : function(info,dom){
				var dlist = drop.get('list');
				var buff = dlist[0].info;
				if(buff.gid == info.gid){
					dlist[0].info = tabs.getTab(5).info;
					dlist[0].domList['inner'].innerHTML = dlist[0].info.name;
				}else{
					for(var i = 1, len = dlist.length; i < len; i += 1){
						dlist[0].info = dlist[i].info;
						dlist[i].info = buff;
						dlist[i].domList['inner'].innerHTML = dlist[i].info.name;
						buff = dlist[0].info;
						if(buff.gid == info.gid){
							dlist[0].info = tabs.getTab(5).info;
							dlist[0].domList['inner'].innerHTML = dlist[0].info.name;
							break;
						}
					}
				}
				//dom.info = tabs.getTab(5).info;
				//dom.domList['inner'].innerHTML = dom.info.name;
				tabs.setTab(5,info);
				tabs.go(5);
			}
		});
		var errItem = priv.errorItem({});
		
		selector.regSelectList(function(type,key,name){
			if(type == 'add'){
				items.selectOne(key);
			}
			if(type == 'del'){
				items.unselectOne(key);
			}
			if(type == 'length_err'){
				errItem.show(items.getItemByKey(key),name);
			}
			if(inputBox){
				setPosition(inputBox);
			}
		});
		UI['tab'].appendChild(tabs.get('box'));
		UI['page'].appendChild(page.get('box'));
		UI['item'].appendChild(items.get('box'));
		
		
		var setPosition = function(posEl){
			setTimeout(
				function(){
					if(spec.staticSelectorPanel){
						return false;
					}
					if(posEl){
						var position = Core.Dom.getXY(posEl);
						var left = spec.panelLeft;
						var top = spec.panelTop;
						box.style.position = 'absolute';
						box.style.top = position[1] + posEl.offsetHeight + (top?top:0) + 'px';
						box.style.left = position[0] + (left?left:0) + 'px';
					}
				},1);
		};
		
		var that = {};
		var show = function(layer,posEl){
			layer.appendChild(box);
			box.style.display = '';
			var groups = proxy.followingsInfo.getGroupList();
			if(groups[0] && groups[0]['gid']){
				groups.unshift({'name':'全部','gid':''});
			}
			if(groups.length > 6){
				tabs.show(groups.slice(0,6));
				tabs.get('box').appendChild(drop.get('box'));
				drop.show(groups.slice(6));
			}else{
				tabs.show(groups);
			}
			setPosition(posEl);
			inputBox = posEl;
			tabs.go(0);
		};
		
		var hidd = function(){
			box.style.display = 'none';
		};
		that.show = function(layer,posEl){
			show(layer,posEl);
		};
		that.hidd = function(){
			hidd();
		};
		that.toggle = function(layer,posEl){
			if(box.style.display  == 'none'){
				setTimeout(function(){
					show(layer,posEl);
					selector.setPanelIconUp();
				},10);
				return true;
			}else{
				setTimeout(function(){
					hidd();
					selector.setPanelIconDown();
				},10);
				return false;
			}
		};
		that.get = function(key){
			if(key == 'box'){
				return box;
			}
		};
		return that;
	};
	
	
	priv.selectInput = function(spec){
		var ctemp = [
			{'tagName':'a','attributes':{'class':'arrowup','href':'javascript:void(0);','id':'panel'}},
			{'tagName':'ul','attributes':{'class':'tagList','id':'lbox'}}
		];
		var cbox = document.createElement('div');
			cbox.className = 'mbf_input';
		var cdom = new proxy.Builder(ctemp,cbox);
		var temp = [{'tagName':'li','attributes':{'class':'tagListli','id':'outer'},'childList':[
			{'tagName':'text','attributes':{'id':'name','nodeValue':'abc'}},
			{'tagName':'a','attributes':{'id':'del','href':'javascript:void(0);','class':'close','innerHTML':'<img src="' + scope.$BASEIMG + 'style/images/common/follow/close.gif" />'}}
		]}];
		if(spec.inputWidth){
			cbox.style.width = spec.inputWidth + 'px';
			cdom.domList['lbox'].style.width = (spec.inputWidth - 18) + 'px';
		}
		var list = [];
		var dataList = {};
		var selector = spec.selector;
		var inp = priv.userText({
			'fire' : function(uid,name){
				dataList['' + uid] = name;
				selector.setSelectList('add',uid,name);
			}
		});
		if(spec.hiddPanel || spec.staticSelectorPanel){
			cdom.domList['panel'].style.display = 'none';
		}
		cdom.domList['lbox'].appendChild(inp.get('box'));
		Core.Events.addEvent(cdom.domList['panel'],function(){
			return selector.togglePanel(cbox);
		},'click');
		Core.Events.addEvent(cdom.domList['lbox'],function(){
			inp.show();
		},'click');
		Core.Events.addEvent(inp.get('input'),function(e){
			if(e.keyCode === 8){
				var l = selector.getSelectList();
				if(l.length && !inp.get('input').value.length){
					selector.setSelectList('del', l[l.length - 1]);
				}
			}
		},$IE?'keydown':'keypress');
		
		var newItem = function(){
			var item = bind(new proxy.Builder(temp,cdom.domList['lbox']));
			list.push(item);
			cdom.domList['lbox'].appendChild(inp.get('box'));
			//inp.get('input').focus();
			return item;
		};
		var getItem = function(){
			for(var i = 0, len = list.length; i < len; i += 1){
				if(!list[i].used){
					list[i].used = true;
					return list[i];
				}
			}
			var item = newItem();
			item.used = true;
			return item;
		};
		
		var bind = function(item){
			var UI = item.domList;
			UI['del'].onclick = function(){
				selector.setSelectList('del',item.info.uid);
				Core.Events.stopEvent();
				return false;
			};
			return item;
		};
		
		var rend = function(item,data){
			var UI = item.domList;
			UI['name'].nodeValue = data['name'];
			item.info = data;
			return item;
		};
		
		var del = function(index){
			cdom.domList['lbox'].removeChild(list[index]['domList']['outer']);
			list.splice(index,1);
		}
		
		var clear = function(){
			for(var i = 0, len = list.length; i < len; i += 1){
				list[i].used = false;
			}
		}
		selector.regSelectList(function(type,key,name){
			if(type == 'add'){
				rend(getItem(),{'name':name,'uid':key});
			}
			if(type == 'del'){
				that.del(key);
			}
		});
		var that = {};
		that.show = function(data){
			clear();
			for(var i = 0, len = data.length; i < len; i += 1){
				rend(getItem(),data[i]);
			}
		};
		that.insert = function(data){
			for(var i = 0, len = data.length; i < len; i += 1){
				rend(getItem(),data[i]);
			}
		};
		that.del = function(id){
			for(var i = 0, len = list.length; i < len; i += 1){
				if(list[i].info['uid'] == id){
					del(i);
					return;
				}
			}
		};
		that.get = function(key){
			if(key == 'box'){
				return cbox;
			}
			if(key == 'panelIcon'){
				return cdom.domList['panel'];
			}
		};
		return that;
	};
	
	proxy.followingSelector = function(spec){
		var that = {};
		var selectedList = [];
		var selectedFuns = [];
		var panel;
		var input;
		var limit = spec.limitNumber || 10;
		that.getSelectList = function(){
			return selectedList;
		};
		that.setSelectList = function(type,value,name){
			if(type == 'toggle'){
				if(checkIn(selectedList,value)){
					type = 'del';
				}else{
					type = 'add';
				}
			}
			var err = null;
			if(type == 'add'){
				if(!checkIn(selectedList,value)){
					if(selectedList.length >= limit){
						type = 'length_err';
					}else{
						selectedList.push(value);
					}
				}else{
					err = 'add_error';
				}
			}
			
			if(type == 'del'){
				if(checkIn(selectedList,value)){
					for(var i = 0, len = selectedList.length; i < len; i += 1){
						if(selectedList[i] == value){
							selectedList.splice(i,1);
						}
					}
				}else{
					err = 'del_error';
				}
			}
			if(err){
				type = err;
			}
			for(var i = 0, len = selectedFuns.length; i < len; i += 1){
				try{
					if(type == 'length_err'){
						selectedFuns[i](type,value,'最多可以选中${count}个关注人，不能再继续添加了。'.replace(/\$\{count\}/ig,limit));
					}else{
						selectedFuns[i](type,value,name);
					}
				}catch(exp){
				}
			}
		};
		that.regSelectList = function(func){
			selectedFuns.push(func);
		};
		that.showPanel = function(posEl){
			var box = document.body;
			if(spec.staticSelectorPanel){
				box = spec.selectorPanelBox || document.body;
			}
			panel.show(box,posEl);
		};
		that.togglePanel = function(posEl){
			var box = document.body;
			if(spec.staticSelectorPanel){
				box = spec.selectorPanelBox || document.body;
			}
			return panel.toggle(box,posEl);
		}
		that.setPanel = function(sp){
			panel = sp;
		};
		that.getPanel = function(){
			return panel;
		};
		that.setInput = function(inp){
			input = inp;
		};
		that.getInput = function(){
			return input;
		};
		that.show = function(){
			if(spec.perchElement && spec.perchElement.parentNode && spec.perchElement != document.body){
				spec.perchElement.parentNode.insertBefore(input.get('box'),spec.perchElement);
				spec.perchElement.style.display = 'none';
			}else{
				document.body.appendChild(input.get('box'));
			}
		};
		that.getSelected = function(){
			return selectedList;
		};
		that.get = function(key){
			if(key == 'box'){
				return input.get('box');
			}
		};
		that.setPanelIconDown = function(){
			input.get('panelIcon').className = 'arrowup';
		};
		that.setPanelIconUp = function(){
			input.get('panelIcon').className = 'arrowup arrowdown';
		}
		return that;
	};
	
	/*
		spec:{
			'perchElement': element
			'limitNumber' : '',number
			'hiddSelectorPanel' : '',boolean
			'staticSelectorPanel' : '',boolean
			'selectorPanelBox':,element
			'autoShowPanel' :boolean
			'panelLeft' : number
			'panelTop' : number
			'inputWidth' : number
		}
	*/
	proxy.getFollowingSelector = function(spec){
		var ret = proxy.followingSelector(spec);
			ret.setPanel(priv.selectPanel({
				'selector': ret,
				'hiddPanel': spec.hiddSelectorPanel,
				'staticSelectorPanel': spec.staticSelectorPanel,
				'autoShowPanel':spec.autoShowPanel,
				'panelLeft':spec.panelLeft,
				'panelTop':spec.panelTop
			}));
			ret.setInput(priv.selectInput({
				'selector': ret,
				'hiddPanel': spec.hiddSelectorPanel,
				'staticSelectorPanel': spec.staticSelectorPanel,
				'autoShowPanel':spec.autoShowPanel,
				'panelLeft':spec.panelLeft,
				'panelTop':spec.panelTop,
				'inputWidth':spec.inputWidth
			}));
			if (!spec.hiddSelectorPanel) {
				proxy.followingsInfo.init(function(){
					if (spec.staticSelectorPanel) {
						ret.showPanel(spec.selectorPanelBox);
					}
					if (spec.autoShowPanel){
						ret.showPanel(ret.getInput().get('box'));
						ret.setPanelIconUp();
					}
				});
			}
		return ret;
	};
})(App);