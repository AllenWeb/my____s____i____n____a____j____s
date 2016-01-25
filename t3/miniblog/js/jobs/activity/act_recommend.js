/**
 * @author wangliang3@staff.sina.com.cn
 * @param {string} eid 非必选参数，活动id
 */

$import("sina/core/events/addEvent.js");
$import("diy/dialog.js");
$import("diy/imgURL.js");
$import("jobs/publisher_dialog.js");
//以弹出发布器窗口的方式发布推荐活动给粉丝
App.act_recommend = function(eid){
	
	//获取URL参数
	var getArgs = function(parstr){
		parstr = parstr || window.location.search;
		var args = {};
        var query = parstr.substring(1); 
        var pairs = query.split("&"); 
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); 
            if (pos == -1) 
                continue; 
            var argname = pairs[i].substring(0, pos); 
            var value = pairs[i].substring(pos + 1); 
            value = decodeURIComponent(value); 
            args[argname] = value; 
        }
        return args; 
	};
	var pubInit = function(items){
		if (scope.$pid && scope.$pid != '') {
	        items['preImage'].innerHTML = '<img src="' + App.imgURL(scope.$pid, 'small') + '" />';
			items['imgName'].innerHTML = '活动封面图';
			items['editor'].value = scope.$content;
	        items['imgPerch'].style.display = '';
	        items['preBox'].style.display = '';
	        items['image'].style.display = 'none';
	        items['imgLoading'].style.display = 'none';
			/*默认不显示活动封面，当鼠标移至“活动封面图”文字上方才显示
			 * *  By xiongping1@staff.sina.com.cn
			 */
			items['preBox'].style.display = 'none';
			if(items['imgName']){
				Core.Events.addEvent(items['imgName'],function(){
					items['preBox'].style.display = '';
				},'mouseover');
				Core.Events.addEvent(items['imgName'],function(){
					items['preBox'].style.display = 'none';
				},'mouseout');
			}
	    }
	};
	
	App.publisherDialog.submitUrl = '/event/aj_publishmblog.php';
	//将活动默认的封面图片id传入到默认发布器
	App.publisherDialog.options = {
		pic: scope.$pid,
		eid: eid ? eid : scope.$eid,
		comd: true
	};
	App.publisherDialog.show(scope.$content,pubInit);
};
//confrim的方式推荐活动
App.act_recommend2 = function(eid){
	var config = {
        postUrl : '/event/aj_recommendevent.php',
		eid : eid ? eid : scope.$eid
    };
	var submit = function(){
		Core.Events.stopEvent();
	    Utils.Io.Ajax.request(config.postUrl, {
	        'POST': {eid: config.eid},
	        'onComplete': function(json){
				popWin.distory();
	            if (json.code == 'A00006') {
					var tip = App.alert($CLTMSG['CX0032'],{icon:3,hasBtn:false});
					setTimeout(function(){
			            tip.close();
			        }, 1000);
	            }
	            else {
	                App.alert($SYSMSG[json.code]);
	            }
	        },
	        'onException': function(){
	            //callBack.error();
	        },
	        'returnType': 'json'
	    });
	};

    //dialog show
	var popWin = App.confirm($CLTMSG['CW0101'],{ok:submit});
};
