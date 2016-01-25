$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");
$import("diy/mb_dialog.js");
$import("diy/check.js");
$import("diy/htmltojson.js");
$import("sina/core/string/trim.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/base/detect.js");
$import("sina/core/function/bind3.js");

$registJob('addPrivateSkin', function(){
	/**
	 * 非模板库中的模板添加
	 * @author by xiongping1 2010-06-03
	 */
	//需要返回代码、模板有效期、页面上需有模板的名称
	App.skinManage = {};
	App.skinManage.privateSkin = function(privateSkinName){
			var message = scope.$skin !== 'skin_110' ? $CLTMSG['CD0157'].replace(/#\{name\}/,privateSkinName) : $CLTMSG['CD0179'].replace(/#\{name\}/,privateSkinName);
			App.confirm(message,{
				icon:4,
				ok:function(){
					Utils.Io.Ajax.request( "/person/changeskin.php",{
						'onComplete' : function(json){
							if(json.code === 'A00006'){
								var _deadline = json.data.deadline.split('-');
								var _dialog = App.confirm($CLTMSG['CD0121'].replace(/#\{year\}/,_deadline[0]).replace(/#\{month\}/,_deadline[1]).replace(/#\{date\}/,_deadline[2]),{
									icon:3,
									ok:function(){
										_dialog.close();
										//window.open(window.location.protocol+"//"+window.location.host+"/"+scope.$uid,"newwindow","")
										window.location.href = window.location.protocol+"//"+window.location.host+"/"+scope.$uid;
									}
								});
								setTimeout(function(){
									_dialog.close();
									//window.open(window.location.protocol+"//"+window.location.host+"/"+scope.$uid,"newwindow","");
									window.location.href = window.location.protocol+"//"+window.location.host+"/"+scope.$uid;
								},3000);
							}
						},
						'onException':function(){},
						'returnType' :'json',
						'POST'       :{
							skin   : scope.$skin,
							oid    : scope.$oid
						}
					})
				},
				cancel:function(){}
			})
		};
    App.skinManage.hash = {
		'skin_103':$CLTMSG['CC5301'],
		'skin_105':$CLTMSG['CC5302'],
		'skin_110':$CLTMSG['CC5303']
	};
	Core.Events.addEvent($E("link1"),Core.Function.bind3(function(){
		if (App.skinManage.hash[scope.$skin]) {
			App.skinManage.privateSkin(App.skinManage.hash[scope.$skin]);
		}
	}),"click");
})