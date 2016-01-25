/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
(function(proxy){
	proxy.history = function(cfg){
		this.funList = [];
		this.url = cfg.url;
		this.trans = doucment.createElement("IFRAME");
		this.cpage = 0;
	};
	(function(){
		this.init = function(){
			
		};
		this.disp = function(){};
		this.add = function(fun,params){
			var fun = fun;
			var par = cloneJson(params);
			return fun(par);
		};
	})(proxy.history.prototype);
})(App);