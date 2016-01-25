/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('jobs/base.js');
$import('jobs/group_interface.js');

(function(proxy){
    var actionList = {};
    proxy.group_manage = {};
    
    var register = function(key, onSuccess, params){
        actionList[key].push({
            'onSuccess': onSuccess,
            'params': params
        });
    };
    var action = function(key, data, spec){
        for (var i = 0, len = actionList[key].length; i < len; i += 1) {
            try {
                var act = actionList[key][i];
                act['onSuccess'](data, spec, act['params']);
            } 
            catch (exp) {
            }
        }
    };
    
    //绑定每个方法
    for (var k in App.group_interface) {
        actionList[k] = [];
        proxy.group_manage[k] = (function(p){
            return function(spec){
                spec = spec ||
                {};
                spec.onSuccess = function(data){
                    try {
                        action(p, data, spec);
                    } 
                    catch (e) {
                    }
                    spec.success(data);
                };
                return App.group_interface[p](spec);
            };
        })(k);
    }
    proxy.group_manage['register'] = register;
})(App);


//对数据源的修改（scope.groupList有些耦合，要在inter_face中提供接口？）

App.group_manage.register('create', function(json, params){
    scope.groupList.push({
        'gid': json,
        'name': Core.String.encodeHTML(params['name']),
        'count': 0
    });
}, {});

App.group_manage.register('del', function(json, params){
    for (var i = 0, len = scope.groupList.length; i < len; i += 1) {
        if (scope.groupList[i]['gid'] == params['id']) {
            scope.groupList.splice(i, 1);
            return false;
        }
    }
}, {});

App.group_manage.register('rename', function(json, params){
    for (var i = 0, len = scope.groupList.length; i < len; i += 1) {
        if (scope.groupList[i]['gid'] == params['id']) {
            scope.groupList[i]['name'] = Core.String.encodeHTML(params['name']);
        }
    }
}, {});

App.group_manage.register('add', function(json, params){
    for (var i = 0, len = scope.groupList.length; i < len; i += 1) {
        if (scope.groupList[i]['gid'] == params['group_id']) {
            scope.groupList[i]['count'] = parseInt(scope.groupList[i]['count']) + 1;
        }
    }
}, {});


App.group_manage.register('remove', function(json, params){
    for (var i = 0, len = scope.groupList.length; i < len; i += 1) {
        if (scope.groupList[i]['gid'] == params['group_id']) {
            scope.groupList[i]['count'] = parseInt(scope.groupList[i]['count']) - 1;
        }
    }
}, {});

App.group_manage.register('addAll', function(json, params){
    for (var i = 0, len = scope.groupList.length; i < len; i += 1) {
        if (scope.groupList[i]['gid'] == params['group_id']) {
            scope.groupList[i]['count'] = parseInt(scope.groupList[i]['count']) + 1;
        }
    }
}, {});
