/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */


$import('sina/core/dom/getXY.js');
$import('sina/core/events/stopEvent.js');
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
$import('diy/builder.js');
$import('jobs/base.js');
$import('jobs/group_manage.js');
$import('sina/core/string/decodeHTML.js');
$import('sina/core/string/encodeHTML.js');

(function(proxy){
	
	//每一条可选元素的模板
	var itemTemplate = [
		{'tagName':'INPUT','attributes':{'id':'checkbox','type':'checkbox','class':'labelbox','value':'1'}},
		{'tagName':'LABEL','attributes':{'id':'label'},'childList':[
			{'tagName':'TEXT','attributes':{'id':'groupName'}}
		]}
	];
	
	/**
	 * 每个下拉的元素对象
	 * @param {Object} spec :{
	 * 		name : ''
	 * 		gid : ''
	 * 		click : function(){}
	 * }
	 * @return that:{
	 * 		set:function(){}(name,gid,click)
	 * 		get:function(){}(name,gid,box,dom,click)
	 * 		checked:function(){}[true/false]
	 * }
	 */
	proxy.dropItem = function(spec){
		var that = {};
		//创建一条记录
		
		var box = document.createElement('P');
		spec.view = new App.Builder(itemTemplate,box);
		spec.view.domList['groupName'].nodeValue = Core.String.decodeHTML(spec['name']);
		spec.view.domList['checkbox'].onclick = function(){
			if(spec.view.domList['checkbox'].checked){
				spec.click('add',spec);
			}else{
				spec.click('remove',spec);
			}
		};
		spec.view.domList['checkbox'].setAttribute('id','group_selector_item_' + spec['gid']);
		spec.view.domList['label'].setAttribute('for','group_selector_item_' + spec['gid']);
		spec.view.domList['label'].title = Core.String.decodeHTML(spec['name']);
		that.checked = function(key){
			spec.view.domList['checkbox'].checked = key;
			return that;
		};
		that.set = function(key,value){
			if(key === 'name'){
				spec.name = value;
				spec.view.domList['groupName'].nodeValue = Core.String.decodeHTML(value);
				spec.view.domList['label'].title = Core.String.decodeHTML(value);
				return that;
			}
			if(key === 'click'){
				if(typeof value === 'function'){
					spec.click = value;
				}
				return that;
			}
			if(key === 'view'){
				return that;
			}
			spec[key] = value;
			return that;
		};
		that.get = function(key){
			if(key === 'box'){
				return spec.view.box;
			}
			if(key === 'dom'){
				return spec.view.domList;
			}
			return spec[key];
		};
		return that;
	};
	
	/**
	 * 人员对象(就是人列表的那个按钮)
	 * @param {Object} box ： 触发对象，上边有初始信息。
	 * @return that : 
	 */
	proxy.person = function(box){
		var personTemplate = '<em>${names}<img src="'+scope.$BASEIMG+'style/images/common/transparent.gif" class="small_icon down_arrow"/></em>';
		var that = {};
		var spec = {};
		
		//从dropItem里获取名字是否可取？还是从数据源里取？
		var getName = function(groupId){
			var list = App.group_manage.list();
			for(var i = 0, len = list.length; i < len; i += 1){
				if(list[i]['gid'] == groupId){
					return list[i]['name'];
				}
			}
			return false;
		};
		
		//从新渲染分组按钮，没什么好说的。
		var reView = function(){
			var names = [];
			for(var i = 0, len = spec.groupsId.length; i < len; i += 1){
				var name = getName(spec.groupsId[i]);
				if(name){
					names.push(name);
				}
			}
			var str = Core.String.decodeHTML(names.length ? names.join(',') : $CLTMSG['CC1301']);
			var fullStr = str;
			if(Core.String.byteLength(str) > 14){
				str = Core.String.leftB(str,14) + '…';
			}
			spec.box.innerHTML = personTemplate.replace('${names}',Core.String.encodeHTML(str));
			spec.box.title = fullStr;
		};
		
		//本条信息的几个关键元素box,personId,groupsId
		spec.box = box;
		spec.box.href = 'javascript:void(0);';
		spec.personId = spec.box.getAttribute('personid');
		spec.groupsId = spec.box.getAttribute('groupids').split(',');
		
		//获得分组信息，鸡肋，应该整合到get里。
		that.data = function(){
			return spec.groupsId;
		};
		
		//！！重要，给这个人修改分组
		//key = [add/remove]
		//data:组信息，data.gid，组id，非常重要
		that.action = function(key,data){
			proxy.dropBox.hidd();
			if(key === 'add'){
				App.group_manage.add({
					'group_id'	: data.gid,
					'person_id' : spec.personId,
					'success'	: function(json){
						spec.groupsId.push(data['gid']);
						reView();
					}
				});
				return that;
			}
			if(key === 'remove'){
				App.group_manage.remove({
					'group_id'	: data.gid,
					'person_id' : spec.personId,
					'success'	: function(json){
						for(var i = 0, len = spec.groupsId.length; i < len; i += 1){
							if(data.gid == spec.groupsId[i]){
								spec.groupsId.splice(i,1);
								
								//由于移除人员不在本系统内，在这里做个trick
								//全局，当前所在组的id:scope.groupCurrentId;
								if(data.gid == scope.groupCurrentId){
									var personBox = spec.box.parentNode.parentNode.parentNode;
									personBox.parentNode.removeChild(personBox);
									proxy.dropBox.hidd();
								}
								
								break;
							}
							
						}
						reView();
					}
				});
				return that;
			}
		};
		
		that.get = function(key){
			return spec[key];
		};
		
		
		//对组做修改时同时需要处理的函数，这个交给manager去处理了。
		App.group_manage.register('del',function(json,params){
			for(var i = 0, len = spec.groupsId.length; i < len; i += 1){
				if(params['id'] == spec.groupsId[i]){
					spec.groupsId.splice(i,1);
					break;
				}
			}
			reView();
		},spec);
		
		App.group_manage.register('rename',function(json,params){
			setTimeout(reView,0);
		},spec);
		//结束同步处理内容
		
		reView();
		return that;
	};
	
	/**
	 * 下拉框对象
	 */
	proxy.dropBox = (function(){
		var that = {};
		var spec = {};
		spec.box = document.createElement('DIV');
		spec.box.className = 'downmenu downmenuAttr';
		spec.box.style.display = 'none';
		spec.box.style.position = 'absolute';
		//add by chibin 防止profileu页被挡住
		spec.box.style.zIndex=800;
		spec.person = null;
		spec.items = [];
		spec.renderData = function(data,click){
			for(var i = 0, len = spec.items.length; i < len; i += 1){
				spec.items[i].set('click',click);
				spec.items[i].checked(false);
				for(var j = 0, len2 = data.length; j < len2; j += 1){
					if(data[j] == spec.items[i].get('gid')){
						spec.items[i].checked(true);
					}
				}
			}
		};
		
		//对组做修改时同时需要处理的函数，这个交给manager去处理了。
		var bindManage = function(){
			App.group_manage.register('del',function(json,params){
				for(var i = 0, len = spec.items.length; i < len; i += 1){
					if(spec.items[i].get('gid') == params['id']){
						spec.box.removeChild(spec.items[i].get('box'));
						spec.items.splice(i,1);
						break;
					}
				}
				spec.adder.show();
			},spec);
			
			App.group_manage.register('rename',function(json,params){
				for(var i = 0, len = spec.items.length; i < len; i += 1){
					if(spec.items[i].get('gid') == params['id']){
						spec.items[i].set('name',Core.String.encodeHTML(params['name']));
						break;
					}
				}
			},spec);
			
			App.group_manage.register('create',function(json,params){
				var item = proxy.dropItem({
					'gid':json,
					'name':Core.String.encodeHTML(params['name'])
				});
				spec.items.push(item);
				if(spec.person){
					item.set('click',spec.person.action);
				}
				spec.box.insertBefore(item.get('box'),spec.adder.domList['line']);
				setTimeout(function(){
					if(spec.items.length >= 20){
						spec.adder.hidd();
					}
				},10);
			},spec);
		};
		//结束同步处理内容
		
		
		//在下拉框上添加组的功能
		var dropAddGroup = function(){
			var temp = [
				{'tagName' : 'DIV', 'attributes': {
					'class': 'MIB_linedot1',
					'id' : 'line'
				}},
				{'tagName' : 'P', 'attributes':{'id' : 'btnbox'}, 'childList' : [
					{'tagName' : 'A', 'attributes' : {'innerHTML' : $CLTMSG['CC1302'],'href' : 'javascript:void(0);','id' : 'button'}}
				]},
				{'tagName' : 'P', 'attributes':{'id' : 'inputbox','class' : 'opt','style' : 'display:none'}, 'childList' : [
					{'tagName' : 'INPUT', 'attributes' : {'type' : 'text','id' : 'input'}}
				]},
				{'tagName' : 'SPAN', 'attributes':{'id' : 'info', 'class' : 'error_color', 'innerHTML' : $CLTMSG['CC1303'],'style' : 'display:none'}},
				{'tagName' : 'P', 'attributes':{'id' : 'subox','class' : 'btn','style' : 'display:none'}, 'childList' : [
					{'tagName' : 'A', 'attributes' : {'href' : 'javascript:void(0);','id' : 'submit','class' : 'btn_normal btnxs','innerHTML':'<em>'+$CLTMSG['CC1102']+'</em>'}},
					{'tagName' : 'A', 'attributes' : {'href' : 'javascript:void(0);','id' : 'cancel','class' : 'btn_normal btnxs','innerHTML':'<em>'+$CLTMSG['CC1103']+'</em>'}}
				]}
			];
			var lock = false;
			var adder = new App.Builder(temp,spec.box);
			adder.domList['button'].onclick = function(){
				adder.domList['line'].style.display = 'none';
				adder.domList['btnbox'].style.display = 'none';
				adder.domList['inputbox'].style.display = '';
				adder.domList['subox'].style.display = '';
				adder.domList['btnbox'].style.display = 'none';
				adder.domList['input'].value = $CLTMSG['CC1304'];
				adder.domList['input'].focus();
				adder.domList['input'].select();
				lock = false;
			};
			var checkGroupName = function(){
				var str = Core.String.trim(adder.domList['input'].value);
				if(Core.String.byteLength(str) > 16){
					adder.domList['info'].innerHTML = $SYSMSG['M14010'];
					adder.domList['info'].style.display = '';
					return false;
				}
				if(str == '' || str==$CLTMSG['CC1304']){
					adder.domList['info'].innerHTML = $SYSMSG['M14014'];
					adder.domList['info'].style.display = '';
					return false;
				}
				for(var i = 0, len = spec.items.length; i < len; i += 1){
					if(Core.String.decodeHTML(spec.items[i].get('name')) == str){
						adder.domList['info'].innerHTML = $SYSMSG['M14008'];
						adder.domList['info'].style.display = '';
						return false;
					}
				}
				adder.domList['input'].value = str;
				adder.domList['info'].style.display = 'none';
				return true;
			};
			
			var addSubmit = function(){
				if(lock){
					return false;
				}
				adder.domList['input'].value = Core.String.trim(adder.domList['input'].value);
				if(!checkGroupName()){
					return false;
				}
				if(!adder.domList['input'].value){
					return false;
				}
				lock = true;
				App.group_manage.create({
					'name' : Core.String.trim(adder.domList['input'].value),
					'success' : function(json){
						adder.domList['input'].blur();
						adder.domList['line'].style.display = '';
						adder.domList['btnbox'].style.display = '';
						adder.domList['inputbox'].style.display = 'none';
						adder.domList['subox'].style.display = 'none';
						adder.domList['info'].style.display = 'none';
//						setTimeout(function(){
//							var item = spec.items[spec.items.length-1];
//							item.checked(true);
//							spec.person.action('add',{'gid':json});
//						},0);
						lock = false;
					},
					'onError' : function(json){
						lock = false;
						App.alert($SYSMSG[json['code']]);
					}
				});
			};
			
			adder.domList['input'].onkeypress = function(e){
				var ev = e || window.event;
				if(ev.keyCode == 13){
					addSubmit();
				}
			};
			adder.domList['submit'].onclick = function(e){
				addSubmit();
			};
			adder.domList['cancel'].onclick = function(e){
				adder.show();
			};
//			adder.domList['input'].onblur = function(){
//				adder.domList['line'].style.display = '';
//				adder.domList['btnbox'].style.display = '';
//				adder.domList['inputbox'].style.display = 'none';
//				adder.domList['info'].style.display = 'none';
//			};
			adder.show = function(){
				adder.domList['line'].style.display = '';
				adder.domList['btnbox'].style.display = '';
				adder.domList['inputbox'].style.display = 'none';
				adder.domList['subox'].style.display = 'none';
				adder.domList['info'].style.display = 'none';
			};
			adder.hidd = function(){
				adder.domList['line'].style.display = 'none';
				adder.domList['btnbox'].style.display = 'none';
				adder.domList['inputbox'].style.display = 'none';
				adder.domList['subox'].style.display = 'none';
				adder.domList['info'].style.display = 'none';
			};
			return adder;
		};
		//结束下拉框添加分组
		
		
		that.start = function(data){
			document.body.appendChild(spec.box);
			//绑定表现对象
			for(var i = 0, len = data.length; i < len; i += 1){
				var item = proxy.dropItem(data[i]);
				spec.items.push(item);
				spec.box.appendChild(item.get('box'));
			}
			spec.adder = dropAddGroup();
			if(spec.items.length >= 20){
				spec.adder.hidd();
			}
			bindManage();
			return that;
		};
		that.moveTo = function(person){
			var position = Core.Dom.getXY(person.get('box'));
			position[1] += (person.get('box')).offsetHeight;
			spec.box.style.left = position[0] + 'px';
			spec.box.style.top = position[1] + 'px';
			spec.person = person;
			spec.renderData(spec.person.data(),spec.person.action);
			return that;
		};
		that.show = function(){
			spec.box.style.display = '';
			return that;
		};
		that.hidd = function(){
			spec.box.style.display = 'none';
			if(spec.items.length >= 20){
				spec.adder.hidd();
			}else{
				spec.adder.show();
			}
			return that;
		};
		
		that.get = function(key){
			return spec[key];
		};
		return that;
	})();
	
	
	
	
})(App.group_selector = {});

$registJob("group_select",function(){
	try{
		var box = document.body;
		var list = [];
		var l = box.getElementsByTagName('a');
		for(var i = 0,len = l.length; i < len; i += 1){
			if(l[i].getAttribute('action') == 'groupselector'){
				var b = App.group_selector.person(l[i]);
				(function(k){
					l[i].onclick = function(e){
						setTimeout(function(){
							App.group_selector.dropBox.moveTo(k).show();
						},10);
						//Core.Events.stopEvent(e);
					};
				})(b);
				
			}
		}
		App.group_selector.dropBox.start(App.group_manage.list());
		Core.Events.addEvent(document.body,function(e){
			var ev = e || window.event;
			var src = ev.srcElement || ev.target;
			while(src && src != document.body){
				if(src == App.group_selector.dropBox.get('box')){
					return true;
				}
				src = src.parentNode;
			}
			App.group_selector.dropBox.hidd();
		},'click');
	}catch(exp){}
});