/**
 * @author Pjan|peijian@staff.sina.com.cn
 * 在线状态和最近更新
 */
/**
 * @lastmodified L.Ming | 移植到平台的module 下
 * @since 2008-10-10
 */
$import("sina/sina.js");
$import("sina/module/module.js");
$import("sina/interface.js");
/**
 * 用户在线：userOnline
 * 最近更新：recentUpdate
 */
Module.Status = {
/**
 * objs是数组类型，数组内容是包括在线状态图片的dom，甚至于body都可以
 * 在php打印的时候需要在将在线状态图片打印成：
 * <img align="absmiddle" title="不在线" icon="online" src="http://simg.sinajs.cn/common/images/CP_i.gif" uid="{$info.uid}" class="CP_i CP_i_off" />
 * 其中uid就是用户uid，其他的保持不变
 * 使用方法是在body加载完毕后执行userOnline(objs);
 */
	userOnline : function(objs){
		var allImg = [];
		var onlineImg = [];
		var onlineUid = [];
		for (var i = 0; i < objs.length; i++) {
			var child = $E(objs[i]).getElementsByTagName("img");
			for (var j = 0; j < child.length; j++) {
				if (child[j].getAttribute("icon") == "online" && child[j].getAttribute("uid") != "0") {
					onlineUid.push(child[j].getAttribute("uid"));
					onlineImg.push(child[j]);
				}
			}
		}
		if(onlineImg.length>0){
			new Interface("http://v.space.sina.com.cn/person/online.php?u=" + onlineUid, "jsload").request({
				onSuccess: function(data){
					for (var i = 0; i < onlineImg.length; i ++) {
						if (data[onlineUid[i]] != 0) {
							onlineImg[i].className = "CP_i CP_i_on";
							onlineImg[i].title = "当前用户在线";
						}
					}
				}
			});
		}
	},
/**
 * objs是数组类型，数组内容是包括在线状态图片的dom，甚至于body都可以
 * 在php打印的时候需要在将在线状态图片打印成：
 * <img align="absmiddle" title="最近有更新" src="http://simg.sinajs.cn/common/images/CP_i.gif" icon="new" uid="{$info.uid}"/>
 * 其中uid就是用户uid，其他的保持不变
 * 使用方法是在body加载完毕后执行recentUpdate(objs);
 */
	recentUpdate : function(objs){
		var allImg = [];
		var recentImg = [];
		var recentUid = [];
		for (var i = 0; i < objs.length; i ++) {
			var child = $E(objs[i]).getElementsByTagName("img");
			for (var j = 0; j < child.length; j++) {
				if (child[j].getAttribute("icon") == "new" && child[j].getAttribute("uid") != "0") {
					recentUid.push(child[j].getAttribute("uid"));
					recentImg.push(child[j]);
				}
			}
		}
		if(!scope.$severtime){
			scope.$severtime = parseInt((new Date()).getTime()/1000);
		}
		if(recentUid.length>0){
//			new Interface("http://v.space.sina.com.cn/personinfo/updatetimes.php?uids=" + recentUid, "jsload").request({
			new Interface("http://test.sina.com.cn/person/v3/updatetimes.php?uids=" + recentUid, "jsload").request({
				onSuccess: function(json){
					if (json) {
						for (var i = 0; i < recentImg.length; i ++) {
							var _uid = recentImg[i].getAttribute("uid");
							if (scope.$severtime - json[_uid] <= 86400) {
								recentImg[i].className = "CP_i CP_i_new";
								recentImg[i].title = "最近有更新";
							}
						}
					}else {
						return;
					}
				}
			});
		}
	}
};