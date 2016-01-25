/**
 * @fileoverview 顶部导航
 * @author xy xinyu@staff.sina.com.cn
 */
$import("sina/app.js");
$import("sina/sina.js");
$import("sina/module/floatmenu.js");
$import('sina/core/events/addEvent.js');
$import("sina/utils/io/jsload.js");
$import("sina/msg/navMSG.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/module/setNick.js");
Module.Nav = {
    _elementNick: null,
    _elementIcon: null,
    _isFriend: null,
    This: this,
    init: function(){
		var productUrl={
		blog:"http://blog.sina.com.cn/u/",
		photo:"http://photo.sina.com.cn/u/",
		music:"http://music.sina.com.cn/m/",
		vblog:"http://you.video.sina.com.cn/m/"
		};
		$Debug("begin nav");
//        This = this;
        _elementNick = $E("nav_name");
        _elementIcon = $E("nav_icon");
        //读取昵称
        if (_elementNick) {
			Module.setNick.get(function(){
				if (scope.nick[scope.$uid] != null && scope.nick[scope.$uid] != "") {
					//_elementNick.innerHTML = '<a href="'+productUrl[$CONFIG.$product]+scope.$uid+'">'+scope.nick[scope.$uid]+'</a>';
					_elementNick.innerHTML = scope.nick[scope.$uid];
				}
				else {
					//_elementNick.innerHTML = '<a href="'+productUrl[$CONFIG.$product]+scope.$uid+'">'+scope.$uid+'</a>';
					_elementNick.innerHTML = scope.$uid;
				}
	        });
        }
	
		var userhead=Core.Dom.getElementsByClass($E("headpic100"),"div","userhead");
		var productAlt={
			blog:"博客个人首页",
			photo:"相册个人首页",
			music:"音乐个人首页",
			vblog:"播客个人首页",
			icp:"个人中心首页",
			tiezi : "帖子页"
		};
		
		if (userhead.length>0) {
			Module.setNick.get(function(){
				var imgobj = userhead[0].getElementsByTagName('img')[0];
				imgobj.title = "返回" + (scope.nick[scope.$uid] || scope.$uid) + "的"+productAlt[$CONFIG.$product];
				imgobj.alt = "返回" + (scope.nick[scope.$uid] || scope.$uid) + "的"+productAlt[$CONFIG.$product];
			});
		}
       
        var productMap={
//			201:"space",
			202:"blog",
			203:"photo",
			204:"vblog",
//			205:"tiezi",
//			206:"tiezi",
//			207:"quanzi",
			1224:"music"
		};
        //读取各个产品更新信息
        option = {
            onComplete: function(txt){
				$Debug("txt.retcode="+txt.RetCode);
                if (txt.RetCode == "0") {
					scope.$online_update=txt;
					var resultArr=txt.UserInfos;
                    for (var i = 0; i <resultArr.length; i++) {
						$Debug(resultArr[i][0]);
//						var servertime=txt.data[i]["servertime"];
//						var updatatime=txt.data[i]["updatatime"];
//                      if (( servertime- updatatime) / (60 * 60) < 24&&$CONFIG.$product!=txt.data[i]["productname"]) {
						if(resultArr[i][1]==1){
							$Debug(">>>>>>>>>>>>>>>"+productMap[resultArr[i][0]]);
                            objEm = document.createElement("em");
							if($E("nav_" + productMap[resultArr[i][0]]))
							$E("nav_" + productMap[resultArr[i][0]]).appendChild(objEm);
                        }
                    }
                }
             },
            onException: function(txt, txt2){
                $Debug(txt + ";");
            }//,
            //timeout: 1000
        };
        Utils.Io.JsLoad.request("http://online2.sso.sina.com.cn/status/Query.php?UID=" + scope.$uid+"&ProductType=0&Check="+scope.$key+"&ProductVersion=1.0&entry=platform", option);
    }
};

$registJob("nav", Module.Nav.init);


