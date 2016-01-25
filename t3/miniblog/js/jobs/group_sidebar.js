/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import('jobs/base.js');
$import('jobs/group_manage.js');
$import('diy/builder.js');

$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
$import('sina/core/string/encodeHTML.js');
$import('sina/core/string/decodeHTML.js');

App.groupSideBar = {};


$registJob('group_sidebar',function(){
//	try {
		var defaultGroupName = $CLTMSG["CC1304"];
		var groupEditor = (function(){
			var spec = {};
			var that = {};
			var template = [
				{'tagName':'INPUT','attributes':{'type':'text','class':'lf PY_input','id':'input'}},
				{'tagName':'A','attributes':{'href':'javascript:void(0);','class':'btn_normal btnxs','id':'submit'}},
				{'tagName':'A','attributes':{'href':'javascript:void(0);','innerHTML':$CLTMSG["CC1103"],'id':'cancel'}},
				{'tagName':'P','attributes':{'id' : 'info', 'class' : 'error_color', 'innerHTML' : $CLTMSG["CC1303"],'style' : 'display:none'}}
			];
			var editor = new App.Builder(template);
			spec.type = 'add';
			spec.perch = null;
			spec.submit = function(){};
			spec.cancel = function(){};
			spec.lock	= false;
			editor.domList['input'].style.color = '#666666';
			Core.Events.addEvent(editor.domList['submit'],function(){
				if(spec.lock){
					return false;
				}
				spec.submit();
			},'click');
			Core.Events.addEvent(editor.domList['cancel'],function(){
				spec.lock = false;
				spec.cancel();
			},'click');
			Core.Events.addEvent(editor.domList['input'],function(e){
				if(e.keyCode === 13){
					if(spec.lock){
						return false;
					}
					spec.submit();
				}
			},'keypress');
			Core.Events.addEvent(editor.domList['input'],function(e){
				if(editor.domList['input'].value === ''){
					editor.domList['input'].value = $CLTMSG["CC1304"];
				}
			},'blur');
			Core.Events.addEvent(editor.domList['input'],function(e){
				if(editor.domList['input'].value === $CLTMSG["CC1304"]){
					editor.domList['input'].value = '';
				}
			},'focus');
			
			that.show = function(value){
				
				editor.box.style.display = '';
				spec.perch.style.display = 'none';
				editor.domList['input'].value = value || defaultGroupName;
				editor.domList['info'].style.display = 'none';
				spec.lock	= false;
				return that;
			};
			
			that.type = function(type){
				spec.type = type;
				if(type == 'add'){
					editor.box.className = 'packet3';
					editor.domList['submit'].innerHTML = '<em>'+$CLTMSG["CC1401"]+'</em>';
					return that;
				}
				if(type == 'rename'){
					editor.box.className = 'packet3';
					editor.domList['submit'].innerHTML = '<em>'+$CLTMSG["CC1402"]+'</em>';
					return that;
				}
				return that;
			};
			
			that.hidd = function(){
				editor.box.style.display = 'none';
				if(spec.perch){
					spec.perch.style.display = '';
				}
				spec.lock	= false;
				return that;
			};
			
			that.perch = function(perch){
				if(perch){
					perch.parentNode.insertBefore(editor.box,perch);
				}
				if(spec.perch){
					spec.perch.style.display = '';
				}
				if(perch && spec.perch){
					perch.style.display = spec.perch.style.display;
				}
				spec.perch = perch;		
				return that;		
			};
			
			that.get = function(key){
				if(key == 'value'){
					return editor.domList['input'].value;
				}
			};
			
			that.set = function(key,value){
				spec[key] = value;
				return that;
			};
			
			that.showError = function(key){
				editor.domList['info'].innerHTML = $SYSMSG[key];
				editor.domList['info'].style.display = '';
			};
			
			that.hiddError = function(){
				editor.domList['info'].style.display = 'none';
			};
			return that;
		})();
		
		/**
		 * 
		 * @param {Object} spec
		 * {
		 * 'name'	: '',//URLencode过的。
		 * 'gid'	: '',
		 * 'count'	: ''
		 * }
		 */
		
		var sidebarItem = function(spec){
			var that = {};
			var template = [
				{'tagName':'SPAN','attributes':{'class':'tagName'},'childList':[
					{'tagName':'A','attributes':{'id':'link'}},
					{'tagName':'SPAN','attributes':{'id':'count','class' : 'MIB_txtbr f10'}}
				]}/*,
				{'tagName':'SPAN','attributes':{'class':'opt','style':'display:none','id':'util'},'childList':[
					{'tagName':'A','attributes':{'href':'javascript:void(0);','innerHTML':$CLTMSG["CC1402"],'id':'edit'}}//,
//					{'tagName':'EM','attributes':{'class':'MIB_liner','innerHTML':'|'}},
//					{'tagName':'A','attributes':{'href':'javascript:void(0);','innerHTML':'删除','id':'delete'}}
				]}*/
			];
			var box  = document.createElement('LI');
			var item = new App.Builder(template,box);
			
			var showName = Core.String.decodeHTML(spec['name']);
			item.domList['link'].title = showName;
			if(Core.String.byteLength(showName) > 12){
				showName = Core.String.leftB(showName,12) + '…';
			}
			item.domList['link'].innerHTML = Core.String.encodeHTML(showName);
			
			
			item.domList['link'].href = '/attention/att_list.php?&gid=' + spec['id'];
			item.domList['count'].innerHTML = '(' + spec['count'] + ')';
			item.domList['edit'].onclick = function(){
				App.groupSideBar.rename(item.domList['edit'],spec['id'],Core.String.decodeHTML(spec['name']));
			};
//			item.domList['delete'].onclick = function(){
//				App.groupSideBar.del(item.domList['delete'],spec['id'],Core.String.decodeHTML(spec['name']));
//			};
//			box.onmouseover = function(){
//				item.domList['util'].style.display = '';
//			};
//			box.onmouseout = function(){
//				item.domList['util'].style.display = 'none';
//			};
			box.setAttribute('gid',spec['id']);
			that = item;
			return that;
		};
		
		var checkNewName = function(name){
			if(Core.String.byteLength(name) > 16){
				groupEditor.showError('M14010');
				return false;
			}
			if(name == defaultGroupName || name == ''){
				groupEditor.showError('M14014');
				return false;
			}
			for(var i = 0, len = scope.groupList.length; i < len; i += 1){
				if(Core.String.decodeHTML(scope.groupList[i]['name']) == name){
					groupEditor.showError('M14008');
					return false;
				}
			}
			groupEditor.hiddError();
			return true;
		};
		
		//添加组
		var createGroup = function(){
			var value = Core.String.trim(groupEditor.get('value'));
			if (checkNewName(value)) {
				if(!value){
					return false;
				}
				groupEditor.set('lock',true);
				App.group_manage.create({
					'name' : value,
					'success' : function(json){
						groupEditor.hidd();
						setTimeout(function(){
							window.location.href = '/attention/att_list.php?uid=' + scope.$uid + '&gid=' + json;
						},500);
						groupEditor.set('lock',false);
					},
					'onError' : function(json){
						groupEditor.set('lock',false);
						App.alert($SYSMSG[json['code']]);
					}
				});
				return true;
			}
			return false;
		};
		App.groupSideBar.add = function(){
			groupEditor.
				perch($E('group_sidebar_add_box')).
				type('add').
				show('').
				set('submit',createGroup).
				set('cancel',groupEditor.hidd);
		};
		//end添加组
		
		//修改组
		var renameGroup = function(dom,id){
			var value = Core.String.trim(groupEditor.get('value'));
			if (checkNewName(value)) {
				groupEditor.set('lock',true);
				App.group_manage.rename({
					'name' : value,
					'id' : id,
					'success' : groupEditor.hidd,
					'onerror' : function(){
						groupEditor.set('lock',false);
					}
				});
				return true;
			}
			return false;
		};
		App.groupSideBar.rename = function(dom,id,name){
			try{
				name = decodeURIComponent(name);
			}catch(e){
				//对含有%号的非法URI先替换再解码，解码后再复原%
				name = decodeURIComponent(name.toString().replace(/%/g,"#")).replace(/#/g,"%");
			}
			
			groupEditor.
				perch(dom.parentNode.parentNode).
				type('rename').
				show(name).
				set('submit',function(){
					if(Core.String.trim(groupEditor.get('value')) == name){
						groupEditor.hidd();
						return false;
					}
					renameGroup(dom,id);
				}).
				set('cancel',groupEditor.hidd);
		}; 
		//end修改组
		
		//删除分组 ** 删除分组挪到内容区了，这个控制转移到group_memeber.js **
//		App.groupSideBar.del = function(obj,id){
//			App.flyDialog('确定删除吗？','confirm',obj,{
//				'ok' : function(){
//					App.group_manage.del({
//						'id' : id,
//						'success' : function(json){
//							obj.
//								parentNode.
//								parentNode.
//								parentNode.
//								removeChild(obj.parentNode.parentNode);
//							if(id == scope.groupCurrentId){
//								window.location.replace('/' + scope.$uid + '/follow');
//							}
//							$E('group_sidebar_add_box').style.display = '';
//						},
//						'onerror' : function(){}
//					});
//				}
//			});
//		};
		//end删除分组
		
		
		//下面的东西写的就是坨屎，有时间再改吧
		//注册给manage
		App.group_manage.register('create', function(json, params){
			
//			var item = sidebarItem({
//				'id'	: json,
//				'name'	: Core.String.encodeHTML(params['name']),
//				'count' : 0
//			});
			//wangliang3 modify
			var _html = [];
			_html.push('<span class="tagName attMax">');
			_html.push('<a href="/attention/att_list.php?gid='+json+'" title="'+params['name']+'" class="attName">'+params['name']+'</a> <span class="attNum MIB_txtbr f10">(0)</span>');
			_html.push('</span>');
			var _item = $C('li');
			_item.setAttribute('gid',json);
			_item.innerHTML = _html.join('');
			$E('group_sidebar_list').appendChild(_item);
			if(scope.groupList.length >= 20){
				setTimeout(function(){
					$E('group_sidebar_add_box').style.display = 'none';
				},0);
			}
		}, {});
		
		App.group_manage.register('rename', function(json,params){
			var count = 0;
			for(var i = 0, len = scope.groupList.length; i < len; i += 1){
				if (scope.groupList[i]['gid'] == params['id']) {
					count = scope.groupList[i]['count'];
				}
			}
			var item = sidebarItem({
				'id'	: params['id'],
				'name'	: Core.String.encodeHTML(params['name']),
				'count' : count
			});
			var lis = $E('group_sidebar_list').getElementsByTagName('LI');
			for(var i = 0, len = lis.length; i < len; i += 1){
				if(lis[i].getAttribute('gid') == params['id']){
					var per = lis[i];
					$E('group_sidebar_list').insertBefore(item.box,per);
					$E('group_sidebar_list').removeChild(per);
					
					//如果修改的是选中的组名，做些特殊处理。
					if(params['id'] == scope.groupCurrentId){
						item.box.className = 'cur MIB_txtar';
						var groupName = document.createTextNode(params['name']);
						item.domList['link'].parentNode.insertBefore(groupName,item.domList['link']);
						item.domList['link'].parentNode.removeChild(item.domList['link']);
					}
					
					break;
				}
			}
		}, {});
		
		App.group_manage.register('add', function(json,params){
			var lis = $E('group_sidebar_list').getElementsByTagName('LI');
			for(var i = 0, len = lis.length; i < len; i += 1){
				if(lis[i].getAttribute('gid') == params['group_id']){
					var el = lis[i].getElementsByTagName('SPAN')[1];
					el.innerHTML = '(' + (parseInt(el.innerHTML.slice(1,-1)) + 1) + ')';
				}
			}
		},{});
		
		App.group_manage.register('remove', function(json,params){
			var lis = $E('group_sidebar_list').getElementsByTagName('LI');
			for(var i = 0, len = lis.length; i < len; i += 1){
				if(lis[i].getAttribute('gid') == params['group_id']){
					var el = lis[i].getElementsByTagName('SPAN')[1];
					el.innerHTML = '(' + (parseInt(el.innerHTML.slice(1,-1)) - 1) + ')';
				}
			}
		},{});
		//end manage
		
		//鼠标划过效果的绑定
		if($E('group_sidebar_list')){
			var lis = $E('group_sidebar_list').getElementsByTagName('LI');
			for(var i = 1, len = lis.length; i < len; i += 1){
				lis[i].onmouseover = (function(box){
					return function(){
//						box.getElementsByTagName('SPAN')[2].style.display = '';
						//box.getElementsByTagName('SPAN')[1].style.display = 'none';
					};
				})(lis[i]);
				lis[i].onmouseout = (function(box){
					return function(){
//						box.getElementsByTagName('SPAN')[2].style.display = 'none';
						//box.getElementsByTagName('SPAN')[1].style.display = '';
					};
				})(lis[i]);
//				lis[i].getElementsByTagName('SPAN')[2].style.display = 'none';
			}
		}
		//end鼠标效果
//	}catch(exp){}
});
