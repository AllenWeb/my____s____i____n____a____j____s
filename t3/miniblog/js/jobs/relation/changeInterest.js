/**
 * @author zhangjinlong		jinlong1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/request.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/dom/getElementsByClass.js");


/* 可能感兴趣的人（换一换）功能
 * @param {Object}
 */
App.changeInterest = function(oChangeBtn,oInterestCon,url,param){
	var _addEvent = Core.Events.addEvent;
	var interestCon = $E(oInterestCon);
	param = param || {};
	_addEvent(changeBtn,function(){
		Utils.Io.Ajax.request(url,{
			'POST': params,
			'onComplete': function(data){
				interestCon.innerHTML = data;
			},
			'onException': function(){
				
			},
			'returnType': 'json' 
		});
	},'click');
}

$registJob('changeInterest',function(){
	Utils.Io.Ajax.request(url,{
		'GET': {},
		'onComplete': function(data){
			$E('interestedPerson').innerHTML = data;
		},
		'onException': function(){
			
		},
		'returnType': 'json' 
	});

	//App.changeInterest('changeInterest','interestedPerson',url,{});
	
});