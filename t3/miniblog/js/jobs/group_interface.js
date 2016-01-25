/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import('jobs/base.js');

App.group_interface = {};

(function(proxy){
	/**
	 * 创建分组 return void
	 * @spec : {
	 * 		'name' : 创建分组的名字
	 * 		'onSuccess' : 成功后回调的函数
	 * 		'onError'	: 失败后回调的函数
	 * }
	 */
	proxy.create = function(spec){
		Utils.Io.Ajax.request('/attention/aj_group_create.php',{
			'POST'			: {'name':spec.name},
			'onComplete'	: function(json){
				if(json.code == 'A00006'){
					spec.onSuccess(json.data);
					return true;
				}
				spec.onError(json);
				return false;
			},
			'onException'	: function(){
//				spec.onError();
			},
			'returnType': 'json'
		});
	};
	/**
	 * 删除分组 return void
	 * @spec : {
	 * 		'id' : 删除分组的id
	 * 		'onSuccess' : 成功后回调的函数
	 * 		'onError'	: 失败后回调的函数
	 * }
	 */
	proxy.del = function(spec){
		Utils.Io.Ajax.request('/attention/aj_group_delete.php',{
			'POST'			: {'gid':spec.id},
			'onComplete'	: function(json){
				if(json.code == 'A00006'){
					spec.onSuccess(json.data);
					return true;
				}
				spec.onError(json);
				return false;
			},
			'onException'	: function(){
//				spec.onError();
			},
			'returnType': 'json'
		});
	};
	/**
	 * 修改分组名 return void
	 * @spec : {
	 * 		'id' : 修改分组的id
	 * 		'name' : 修改的名字
	 * 		'onSuccess' : 成功后回调的函数
	 * 		'onError'	: 失败后回调的函数
	 * }
	 */
	proxy.rename = function(spec){
		Utils.Io.Ajax.request('/attention/aj_group_rename.php',{
			'POST'			: {'name':spec.name,'gid':spec.id},
			'onComplete'	: function(json){
				if(json.code == 'A00006'){
					spec.onSuccess(json.data);
					return true;
				}
				spec.onError(json);
				return false;
			},
			'onException'	: function(){
//				spec.onError();
			},
			'returnType': 'json'
		});
	};
	/**
	 * 获得全部分组信息 return Array [{'id':'','name':'','count':''}]
	 */
	proxy.list	= function(){
		return scope.groupList;
	};
	
	/**
	 * 为组里添加关注者 void
	 * @spec : {
	 * 		'group_id' : 所添加组的id
	 * 		'person_id' : 被添加人的id
	 * 		‘person_name’ : 被添加人的名字
	 * 		'onSuccess' : 成功后回调的函数
	 * 		'onError'	: 失败后回调的函数
	 * }
	 */
	
	proxy.add = function(spec){
		if(spec.group_id instanceof Array){
			spec.group_id = spec.group_id.join(',');
		}
		
		//允许用名字来添加人，这个接口设计的并不好，需要从新设计
		var params = {
			'action'	: 'add',
			'gids'		: spec.group_id
		};
		if(spec.person_id){
			params['fuid'] = spec.person_id;
		}
		if(spec.person_name){
			params['pname'] = spec.person_name;
		}
		
		Utils.Io.Ajax.request('/attention/aj_group_update.php',{
			'POST'			: params,
			'onComplete'	: function(json){
				if(json.code == 'A00006'){
					spec.onSuccess(json.data);
					return true;
				}
				spec.onError(json);
				return false;
			},
			'onException'	: function(){
				spec.onError();
			},
			'returnType': 'json'
		});
	};
	
	/**
	 * 为组里添加关注者 void
	 * @spec : {
	 * 		'group_id' : 所添加组的id
	 * 		'person_id' : 被添加人的id
	 * 		‘person_name’ : 被添加人的名字
	 * 		'onSuccess' : 成功后回调的函数
	 * 		'onError'	: 失败后回调的函数
	 * }
	 */
	
	proxy.addAll = function(spec){
		if(spec.group_id instanceof Array){
			spec.group_id = spec.group_id.join(',');
		}
		
		//允许用名字来添加人，这个接口设计的并不好，需要从新设计
		var params = {
			'gids'		: spec.group_id
		};
		if(spec.person_id){
			params['fuid'] = spec.person_id;
		}
		if(spec.person_name){
			params['pname'] = spec.person_name;
		}
		
		Utils.Io.Ajax.request('/attention/aj_group_update.php',{
			'POST'			: params,
			'onComplete'	: function(json){
				if(json.code == 'A00006'){
					spec.onSuccess(json.data);
					return true;
				}
				spec.onError(json);
				return false;
			},
			'onException'	: function(){
				spec.onError();
			},
			'returnType': 'json'
		});
	};
	
	
	
	/**
	 * 将关注者从组内移出 void
	 * @spec : {
	 * 		'group_id' : 所在组的id
	 * 		'person_id' : 被删除人的id
	 * 		'onSuccess' : 成功后回调的函数
	 * 		'onError'	: 失败后回调的函数
	 * }
	 */
	proxy.remove = function(spec){
		if(spec.group_id instanceof Array){
			spec.group_id = spec.group_id.join(',');
		}
		Utils.Io.Ajax.request('/attention/aj_group_update.php',{
			'POST'			: {'fuid':spec.person_id,'gids':spec.group_id, 'action' : 'delete'},
			'onComplete'	: function(json){
				if(json.code == 'A00006'){
					spec.onSuccess(json.data);
					return true;
				}
				spec.onError(json);
				return false;
			},
			'onException'	: function(){
				spec.onError();
			},
			'returnType': 'json'
		});
	};
})(App.group_interface);
