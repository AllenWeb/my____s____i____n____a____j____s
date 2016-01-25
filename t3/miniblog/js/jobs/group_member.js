/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import('jobs/base.js');
$import('jobs/group_manage.js');
$import("diy/dom.js");
$import('diy/fansfind.js');
$import('diy/getTextAreaHeight.js');
$import('diy/followingselector.js')

$registJob('group_member',function(){
	try{
		App.groupMember = {};
		App.groupMember.delGroup = function(obj,id){
			var name = '';
			for(var i = 0, len = scope.groupList.length; i < len; i += 1){
				if(scope.groupList[i]['gid'] == id){
					name = scope.groupList[i]['name'];
					break;
				}
			}
			//迟斌 modify
			var str=$CLTMSG['CC1201'];
			var tmp = new Utils.Template(str);
			var title = tmp.evaluate({name:name});
			//App.flyDialog('确定要删除"' + name + '"分组吗？<br />此分组下的人不会被取消关注。','confirm',obj,{
			App.flyDialog(title,'confirm',obj,{
				'ok' : function(){
					App.group_manage.del({
						'id' : id,
						'success' : function(json){
							if(id == scope.groupCurrentId){
								setTimeout(function(){
									window.location.replace('/' + scope.$uid + '/follow');
								},500);
							}
						},
						'onerror' : function(json){
							App.alert($SYSMSG[json.code]);
						}
					});
				}
			});
		};
		
		//-----------------------------------------------------------------------------------
		var _trim = Core.String.trim;
		var textArea = $E('group_member_add_input');
		var fSelectObj = null;
		var CurrentGroupNum = 0;
		if(textArea){
			for(var i = 0, len = scope.groupList.length; i < len; i += 1){
				if(scope.groupList[i]['gid'] == scope.groupCurrentId){
					CurrentGroupNum = parseInt(scope.groupList[i]['count']);
				} 
			}
			if(CurrentGroupNum){
				fSelectObj = App.getFollowingSelector({
					'perchElement' : textArea,
					'inputWidth': 310,
					'limitNumber' : 2000
				});
				fSelectObj.show();
				fSelectObj.get('box').style.cssText = 'float:left;margin-right:8px;width:300px';
			}else{
				fSelectObj = App.getFollowingSelector({
					'perchElement' : textArea,
					//'staticSelectorPanel' : true,
					//'selectorPanelBox':$E('follow_box'),
					'autoShowPanel': true,
					'panelLeft' : -150,
					'panelTop' : 10,
					'inputWidth': 310,
					'limitNumber' : 2000
				});
				fSelectObj.show();
				fSelectObj.get('box').style.cssText = 'float:left;margin-right:8px;width:310px';
			}
		}
		if($E('group_member_add_btton')){
			$E('group_member_add_btton').onclick = function(){
				Utils.Io.Ajax.request('/attention/aj_group_batchupdate.php',{
					'POST':{
						'uids':fSelectObj.getSelected().join(','),
						'gids':scope.groupCurrentId
					},
					'onComplete':function(json){
						var list = [],alreadyAdded=[];
						for(var k in json){
							if(json[k] === 'A00006'){//有一个成功即触发
								list.push(k);
							}
							if(json[k] === 'M14016'){//重复
								alreadyAdded.push(k);
							}
						}
						if(list.length>0){
							if(typeof succCallback === "function"){
								succCallback(json,list,alreadyAdded);
							}else{
								window.location.reload();
							}
						}
						if(typeof errorCallback === "function"){
							errorCallback(json,alreadyAdded);
						}
					},
					'onException':function(json){
						if(typeof errorCallback === "function"){
							errorCallback(json);
						}
					},
					'returnType':'json'
				});
			}
		}
		//限制字符长度（1000），定高定宽，自动滚动条。
		/*App.autoHeightTextArea(textArea,null, 50);
		if(textArea){textArea.focus()}
		function onAddPersonsToGroup(){
			if(App.group_manage.validateNames(textArea.value)){
				var names =  Core.String.trim(textArea.value);
				textArea.value = names = names.replace(App.group_manage.separator_regexp," ");
				if(names){
					if(names.split(/\s/).length === 1){//单个
						addMemeber();
					}else{//多个
						App.group_manage.batchAdd(names,scope.groupCurrentId,function(json,list,alreadyAdded){
							//去掉成功的名称，保留添加失败的名称
							if(list.length>0){
								for(var i=0,len = list.length;i<len;i++){
									textArea.value = _trim(textArea.value.replace(eval("/"+list[i]+"/g"),""));
								}
								window.location.reload();
							}
							if(alreadyAdded && alreadyAdded.length>0){
								for(var j=0,length = alreadyAdded.length;j<length;j++){
									textArea.value = _trim(textArea.value.replace(eval("/"+alreadyAdded[j]+"/g"),""));
								}
							}
						},function(json,alreadyAdded){//有添加成功的则去除，添加失败的保留
							textArea.title = $CLTMSG['CC1202'];
							function resetTitle(){
								textArea.title = "";
							}
							if(alreadyAdded && alreadyAdded.length>0){
								for(var j=0,length = alreadyAdded.length;j<length;j++){
									textArea.value = _trim(textArea.value.replace(eval("/"+alreadyAdded[j]+"/g"),""));
								}
							}
							Core.Events.addEvent(textArea, resetTitle, "focus");
							Core.Events.removeEvent(textArea, resetTitle, "blur");
						});
					}
				}
			}
		}
		//-------------------------------------------------------------------------------------
		
		var addMemeber = function(){
			App.group_manage.add({
				'group_id' : scope.groupCurrentId,
				'person_name' : textArea.value,
				'success' : function(){
					window.location.reload();
				},
				'onError' : function(json){
					if(json){
						if(json.code == 'M14016'){
							var d = App.alert($SYSMSG[json.code].replace('\#\{name\}', textArea.value));
							setTimeout(function(){
								if(!d._distory){
									d.close();
								}
							},3000);
							textArea.value = "";
						}else{
							App.alert($SYSMSG[json.code]);
						}
					}
				}
			});
		};
		var inputKey = true;
		if(textArea){
			var spec = {
		        input: textArea,
		        searchtype: 0,
				select: function(value,text){
					inputKey = false;
					setTimeout(function(){
						inputKey = true;
						textArea.focus();
					},10);
				},
				emptyInfo:'输入昵称，多个使用空格分隔',
				emptyStyle:'border:1px solid #ccc;width:194px;background-color:#fff',
				noBlur : true
		    };
		    
		    //自动完成仅联想最后一个名称------------------------------------------------------
		    spec["formatKey"]=function(key){
				key = key.replace(/,|;|\uFF0C|\uFF1B|\u3001|\s/g," ");
				var arr = key.split(/\s/);
				return arr[arr.length-1];
			}
		    //----------------------------------------------------------------------------
		    
	    	var fansfind = App.fansfind(spec);
		}
		
		if($E('group_member_add_btton')){
			$E('group_member_add_btton').onclick = onAddPersonsToGroup
		}*/
		
		if($E('group_member_title')){
//			App.group_manage.register('rename', function(json, params){
//				if(scope.groupCurrentId == params['id']){
//					for(var i = 0, len = scope.groupList.length; i < len; i += 1){
//						if(scope.groupList[i]['gid'] == params['id']){
//							$E('group_member_title').innerHTML = scope.groupList[i]['name'] + '&nbsp;(' + scope.groupList[i]['count'] + ')';
//						}
//					}
//				}
//			},{});
//			
//			App.group_manage.register('add', function(json, params){
//				if(scope.groupCurrentId == params['group_id']){
//					for(var i = 0, len = scope.groupList.length; i < len; i += 1){
//						if(scope.groupList[i]['gid'] == params['group_id']){
//							$E('group_member_title').innerHTML = scope.groupList[i]['name'] + '&nbsp;(' + scope.groupList[i]['count'] + ')';
//						}
//					}
//				}
//			},{});
			
			App.group_manage.register('remove', function(json, params){
				if(scope.groupCurrentId == params['group_id']){
					for(var i = 0, len = scope.groupList.length; i < len; i += 1){
						if(scope.groupList[i]['gid'] == params['group_id']){
							App.Dom.getBy(function(el){
								if(el.getAttribute('act')||el.getAttribute('act')=='number'){
									el.innerHTML = '(' + scope.groupList[i]['count'] + ')'
								}
							},'em',$E('group_member_title'));
						}
					}
				}
			},{});
		}
	}catch(exp){
		
	}
	
});
//------------------------------------------------------------------------------------------
/**
 * 批量添加关注的人到某个分组
 * @param{String}names
 * @param{String}gids
 * @param{Function}succCallback 默认刷新页面
 * @param{Function}errorCallback　默认不报错(因为批量添加时错误数量和类型不可预知)
 * */
App.group_manage.batchAdd = function(names,gids,succCallback,errorCallback){
	names = App.group_manage._SBC_2_DBC_case(names);
	names = names.split(App.group_manage.separator_regexp);
	var pnames = [];
	for(var i=0,len=names.length;i<len;i++){
		names[i] = names[i].replace(/\(.*\)/g,"");//去掉备注名称
		if(names[i]){
			pnames.push(names[i]);
		}
		
	}
	Utils.Io.Ajax.request('/attention/aj_group_batchupdate.php',{
		'POST':{
			'pname':pnames,
			'gids':gids
		},
		'onComplete':function(json){
			var list = [],alreadyAdded=[];
			for(var k in json){
				if(json[k] === 'A00006'){//有一个成功即触发
					list.push(k);
				}
				if(json[k] === 'M14016'){//重复
					alreadyAdded.push(k);
				}
			}
			if(list.length>0){
				if(typeof succCallback === "function"){
					succCallback(json,list,alreadyAdded);
				}else{
					defaultCallback();
				}
			}
			if(typeof errorCallback === "function"){
				errorCallback(json,alreadyAdded);
			}
		},
		'onException':function(json){
			if(typeof errorCallback === "function"){
				errorCallback(json);
			}
		},
		'returnType':'json'
	});
	
	function defaultCallback(){
		window.location.reload();
	}
};

//空格和,;，；、视为分隔符
App.group_manage.separator_regexp = /,|;|\uFF0C|\uFF1B|\u3001|\s/g;
/**
 * @param{String}names
 * @return{Boolean} true or false
 * */
App.group_manage.validateNames = function(names){
	//中英文、数字(空格和,;，；、视为分隔符,()可能为备注包括符号，也要支持)
	var regexp = /^(,|;|\uFF0C|\uFF1B|\u3001|\(|\)|\s|\w|[\u4E00-\u9FA5\uFF00-\uFFFF])*$/;
	var _trim = Core.String.trim;
	
	if(!regexp.test(names)){
		App.alert($CLTMSG["CC1203"],{icon:2,width:380,height:120});
		return false;
	}
	var v = _trim(names.replace(App.group_manage.separator_regexp,""));
	if(!v && _trim(names).length !== 0){
		return false;
	}
	if(v && Core.String.byteLength(v) > 1000){
		App.alert($CLTMSG["CC1204"],{icon:2,width:380,height:120});
		return false;
	}
	return true;
};
//全角转半角
App.group_manage._SBC_2_DBC_case = function(str){
	return str.replace(/[\uff01-\uff5e]/g,function(a){
		return String.fromCharCode(a.charCodeAt(0)-65248);
	}).replace(/\u3000/g," ");
};