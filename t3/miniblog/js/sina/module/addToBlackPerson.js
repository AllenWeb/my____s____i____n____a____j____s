/**
 * 将某个人添加到黑名单的操作
 * @author xy xinyu@staff.sina.com.cn
 */
$import("sina/interface.js");
$import("sina/msg/blackMSG.js");
$import("sina/msg/systemMSG.js");
$import("sina/utils/windowDialog.js");
function addToBlackPersion(uid, callback){
	
    if (arguments.length == 2) {
        var func = {};
        func.onSuccess = callback.onSuccess ||
        function(){
        };
        var _inter = new Interface("http://icp.cws.api.sina.com.cn/friend/AddBlack.php?black_uid=" + uid, $IE6?"ijax":"jsload");
        _inter.request({
            onSuccess: function(){
                func.onSuccess();
            },
            onError: function(e){
                showError(e.code);
            }
        });
    }
    else 
        if (arguments.length == 1) {
            window.windowDialog.confirm("确实要将此人加入黑名单吗？", {
                funcOk: function(){
                    var _inter = new Interface("http://icp.cws.api.sina.com.cn/friend/AddBlack.php?black_uid=" + uid, $IE6?"ijax":"jsload");
                    _inter.request({
                        onSuccess: function(e){
							//showError(e.code);
							window.windowDialog.alert("成功将\""+sUnick+"\"加入黑名单。",{icon:"01"});
                        },
                        onError: function(e){
                            showError(e.code);
                        }
                    });
                },
				content2:"被加入黑名单的用户，不能给你发纸条、不能加你为好友、不能加你为关注，不会在你的访客中留下访问记录。",
                textOk: "是",
                textCancel: "否",
                defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
                title: "提示",
                icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
            });
        }
}
