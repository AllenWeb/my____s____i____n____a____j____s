/**
 * @fileoverview 记录微博广场随便看看和同城微博页面的过滤器区域展开状态
 * @author yuwei
 */
$import("jobs/request.js");

$registJob('filter_status', function(){	
	var toggle_filter = $E("filter_btn");
	if(toggle_filter){
		Core.Events.addEvent(toggle_filter,function(){
			var oData = {
				'types':$E("changearea")?"2":"1", //type=1随便　看看 2同城微博,
				'is_show':toggle_filter.className ? "1" : "2" //is_show=1显示 2隐藏
			};
			var sUrl = "http://t.sina.com.cn/pub/aj_mblogfilter.php";
			App.doRequest(oData,sUrl,function(data,result){
				
			},function(result){
				
			},"get");
		},'click');
	}
});
//抢沙发需要单独处理，不合上面掺和
$registJob('filter_status_sofa', function(){	
	var toggle_filter = $E("filter_btn");
	var changesofa = $E("changesofa");//换个沙发
	if(toggle_filter){
		Core.Events.addEvent(toggle_filter,function(){
			var oData = {
				'types':"3", //type=3 抢沙发
				'is_show':toggle_filter.className ? "1" : "2" //is_show=1显示 2隐藏
			};
			var sUrl = "http://t.sina.com.cn/pub/aj_mblogfilter.php";
			App.doRequest(oData,sUrl,function(data,result){
				
			},function(result){
				
			},"get");
		},'click');
		Core.Events.addEvent(changesofa,function(){
			scope.square_commentfresh('sofapage','filter');
		},'click');
	}
});