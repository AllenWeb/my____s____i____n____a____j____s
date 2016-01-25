/*
 * @author pjan | peijian@staff.sina.com.cn
 * @title 插入投票功能
 */
$import('diy/addvote.js');

(function(proxy){
	proxy.miniblogPublisherVote = function(spec){
		var that = {};
		var owner = {};
		var _suc = function(json){
			if (json) {
				owner.getDom('editor').value += " " + json['shorturl'] + " ";
				owner.getDom('editor').focus();
				owner.getDom('editor').value = Core.String.decodeHTML(owner.getDom('editor').value);
				owner.limit();
			}
			vote.hidden();
        }
		var _err = function(json){
			App.alert(json);
		};
		
		var vote = new App.addVote(spec['button'], _suc, _err);

		that.init = function(_owner){
			Core.Events.addEvent(spec['button'], function(){
				//check user islogin
	            if (!owner.checkLogin(arguments)) {
	                return;
	            };
				vote.show(spec['button']);
	        }, "click");
			owner = _owner;
		};
		that.clear = function(){
			vote.reset();
		};
		return that;
	};
})(App);