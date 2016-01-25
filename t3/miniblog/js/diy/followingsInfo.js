$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import('jobs/group_manage.js');

(function(proxy){
	proxy.followingsInfo = (function(){
		var that = {};
		var uidList = [];
		var gidList = [];
		var userInfo = {};
		var groupInfo = {};
		var callback = function(){};
		var errortime = 0;
		that.init = function(cb){
			callback = cb;
			Utils.Io.Ajax.request('/attention/aj_group_attuidlist.php',{
				'GET'			: {},
				'onComplete'	: function(json){
					try{
						gidList = json.gidmap;
						for(var i = 0, len = gidList.length; i < len; i += 1){
							groupInfo[gidList[i]['gid']] = [];
						}
						for(var i = 0, len = json.ulist.length; i < len; i += 1){
							var p = json.ulist[i].split('|');
							uidList[i] = p[0];
							var g = p[1].split(',');
							for(var j = 0, l = g.length; j < l; j += 1){
								if(g[j] == ''){
									continue;
								}
								groupInfo[gidList[parseInt(g[j])]['gid']].push(p[0]);
							}
						}
						for(var i = 0, len = gidList.length; i < len; i += 1){
							for(var j = i + 1; j < len; j += 1){
								if(groupInfo[gidList[i]['gid']].length < groupInfo[gidList[j]['gid']].length){
									var p = gidList[i];
									gidList[i] = gidList[j];
									gidList[j] = p;
								}
							}
						}
						callback();
					}catch(exp){
					}
				},
				'onException'	: function(){
					errortime += 1;
					if(errortime < 3){
						that.init();
					}
				},
				'returnType'	: 'json'
			});
		};
		App.group_manage.register('create',function(json,params){
			gidList.push({'gid':json,'name':params['name']});
			groupInfo[json] = [];
		});
		
		App.group_manage.register('del',function(json,params){
			
		});
		
		App.group_manage.register('rename',function(json,params){
			for(var i = 0, len = gidList.length;i < len;i += 1){
				if(gidList[i]['gid'] == params['id']){
					gidList[i]['name'] = params['name'];
				}
			}
		});
		
		App.group_manage.register('add',function(json,params){
			groupInfo[params['group_id']].push(params['person_id']);
		});
		
		App.group_manage.register('remove',function(json,params){
			for(var i = 0, len = groupInfo[params['group_id']].length; i < len; i += 1){
				if(groupInfo[params['group_id']][i] == params['person_id']){
					groupInfo[params['group_id']].splice(i,1);
				}
			}
		});
		that.getUidsByIndex = function(start,length){
			var ret = [];
			for(var i = 0, len = length; i < len; i += 1){
				ret[i] = uidList[start + i];
			}
			return ret;
		};
		
		that.setUidInfo = function(uid,info){
			if(!userInfo[uid]){
				userInfo[uid] = info;
			}
		};
		
		that.refresh = function(){
			that.init();
		};
		
		that.getGroupList = function(){
			return gidList;
		};
		
		that.getGroupInfo = function(gid){
			return gid ? groupInfo[gid] : uidList;
		}
		return that;
	})();
})(App);