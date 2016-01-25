/**
 * @author stan | chaoliang@staff.sina.com.cn
 * @desc 应用程序根节点
 */
if (typeof App == 'undefined') {
	var App = {};
}
/*
App.define = function(ns, func) {
    if (!ns || !ns.length){
		return null;	
	}
    var levels = ns.split(".");
    var nsobj = App;
    for (var i= (levels[0] == "App") ? 1 : 0; i< levels.length; ++ i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }
	nsobj = func;
	return nsobj;
};

*/