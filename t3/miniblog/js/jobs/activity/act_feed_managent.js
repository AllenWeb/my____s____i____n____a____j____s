/**
 * @author wangliang3@staff.sina.com.cn
 * @param {string} eid 非必选参数，活动id
 */
$import("sina/core/events/addEvent.js");
$import("diy/dialog.js");
$import("diy/builder2.js");
//top untop hide unhide
App.feedManagent = function(obj,id, act){
    Core.Events.stopEvent();
    var postUrl = '/event/aj_topmblog.php';
    var config = {
        eid: scope.$eid,
        id: id,
        act: act
    };
//	var pars = {
//		top : 'untop',
//		hide : 'unhide',
//		untop : 'top',
//		unhide : 'hide'
//	};
//	var text = {
//		top : '取消置顶',
//		hide : '隐藏',
//		untop : '置顶',
//		unhide : '取消隐藏'
//	};
//	var box = $C('span');
//	
//	var eventStr = 'App.feedManagent(this,"'+id+'","'+pars[act]+'")';
//	var conf ={};
//		conf['template']='<a id="btn" href="javascript:void(0);">'+text[act]+'</a>';
//		conf['box']= box;
//	var build = App.builder2(conf);
//	var tagObj = build.domList['btn'];
//	tagObj.setAttribute('onclick',eventStr);
//	
//	var pNode = obj.parentNode;
//	var callBack = function(json){
//		pNode.insertBefore(tagObj,obj.nextSibling);
//		pNode.removeChild(obj);
//	};
	var refreshPage = function(){
		var url = window.location.pathname;//得到当前页的路径名称。
		var search = window.location.search;//得到链接到当前路径时的参数列表。
		window.location=url+ search + "#fed";//页面feed去有固定的锚点设置刷新页面定位
		window.location.reload(true);
	}
	var scrollTop = '';
	var callback = function(json){
		 if (json.code == 'A00006') {
			refreshPage();
        }else if(json.code == 'E00022'){//已经有5条置顶的feed了
			var _dialog = App.alert($SYSMSG['E00022'],{
				ok: refreshPage
			});
			Core.Events.addEvent(_dialog._btn_close,function(){
				refreshPage();
			},'click');
		}
        else {
            App.alert($SYSMSG[json.code]);
        }
	};
    Utils.Io.Ajax.request(postUrl, {
        'POST': config,
        'onComplete': callback,
        'onException': function(){
            //callBack.error();
        },
        'returnType': 'json'
    });
};
