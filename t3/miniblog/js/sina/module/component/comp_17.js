/**
 * @fileoverview
 *	定义好友组件类
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-08
 */
$import("sina/module/component/_component.js");
// 引入接口
$import("sina/interface.js");
$import("sina/core/function/bind2.js");
$import("sina/core/string/expand.js");
$import("sina/core/string/shorten.js");
$import("sina/utils/template.js");
$import("sina/module/component/registComp.js");
$import("sina/utils/uic.js");
/**
 * 定义好友组件类
 */
$registComp("17", {
	template : '<li class="CP_litem">\
			<p class="CP_avt"><a class="CP_avt_a" href="http://blog.sina.com.cn/u/#{uid}" target="_blank"><img alt="#{fullname}" title="#{fullname}" class="CP_brd" src="#{head}"/></a></p>\
			<p class="CP_pf_nm"><a href="http://blog.sina.com.cn/u/#{uid}" title="#{fullname}" target="_blank">#{name}</a></p>\
			#{update}\
		</li>',
	load : function () {
//		$Debug("load has been overwrote.");
		var _friend = new Interface("http://icp.cws.api.sina.com.cn/friend/GetFriendListFromModule.php", "jsload");
		_friend.request({
			GET : {
				uid : scope.$uid
			},
			//接口传输正常，且状态码为A00006,(可选)
			onSuccess : (function(result){
				this.loadUic(result);
			}).bind2(this),
			
			//接口传输正常，且状态码不是A00006,(可选)
			onError : (function(result){
				this.showError();
			}).bind2(this),
			
			//接口传输异常,(可选)
			onFail : (function(){
				this.showError();
			}).bind2(this)
		});
	},
	loadUic : function (result) {
		this._data = result;
		var _record = result.record;
		var _uids = [];
		for(var i = 0; i < _record.length; i ++){
			_uids.push(_record[i].uid);
		}
		if (_uids.length > 0) {
			Utils.Uic.getNickName(_uids, Core.Function.bind2(this.parse, this),12);
		}
		else{
			this.showEmpty();
		}
	},
	parse : function (arrData, result) {
//		$Debug("parse has been overwrote.");
		var _allData = this._data.record;
		if(_allData.length == 0){
			this.showEmpty();
		}
		else{
			for(var i = 0; i < _allData.length; i ++){
				var _nick = arrData[_allData[i].uid];
				var _imgSvr = (_allData[i].uid % 8)+1;
				//_imgSvr = _imgSvr == 0 ? 8 : _imgSvr;
				_allData[i].fullname = _nick;
				_allData[i].name = Core.String.expand(_nick).length > 8 ? Core.String.shorten(_nick, 6, "...") : _nick;
				_allData[i].head = "http://portrait" + _imgSvr + ".sinaimg.cn/" + _allData[i].uid + "/blog/50";
				if(_allData[i].isblogupdate || _allData[i].isphotoupdate || _allData[i].isvblogupdate || _allData[i].isbbsupdate || _allData[i].ismusicupdate){
					_allData[i].update = '<p class="CP_pf_new"><img align="absmiddle" title="有内容更新，赶快去看一下" alt="" src="http://simg.sinajs.cn/common/images/CP_i.gif" class="CP_i CP_i_new"/></p>';
				}
			}
			var _template = this.template || '<div><b>#{name}</b></div><div>#{url}</div>';
			_template = new Utils.Template(_template);
			var str = _template.evaluateMulti(_allData);
			str = '<div class="CP_li3">	<ul class="CP_lis">' + str + '</ul><div class="clear"></div>' + ((this._data.ismore == 1 && $isAdmin) ? '<p class="CP_more CP_more2"><a href="http://icp.api.sina.com.cn/friend/myfriends.php">更多好友>></a></p>' : '') + '</div>';
			this.show(str);
		}
	},
	showEmpty : function () {
		this.getContent().innerHTML = '<div class="nodata2">暂无好友。</div>';
	},
	show : function (sResult) {
		$Debug("show has been overwrote.");
		this.getContent().innerHTML = sResult;
		this.finalize();
	}
});
