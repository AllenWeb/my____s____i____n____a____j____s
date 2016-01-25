$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("jobs/mod_login.js");
$import("sina/utils/io/ajax.js");
$import("diy/delDialog.js");

/**
 * 通知管理
 * @fileoverview
 *  App.deleteNotice         删除单条通知
 *  App.deleteSelectedNotice 删除所有已选中通知
 * @author Liusong liusong@staff.sina.com.cn
 */

$registJob('noticeHandler',function(){

	//初始化接口
	//delText,nullText在$SYSMSG中未定义错误信息时，起用临时报错信息
	
	var c = {
		delApi   : "/message/delnotice.php",
		delText  : $SYSMSG["M08003"],
		nullText : $SYSMSG["M08004"]
	};

	//初始化页面元素
	
	var n = {
		tCheckbox : $E("notice_top_checkbox"),
		bCheckbox : $E("notice_bottom_checkbox"),
		checkboxs : document.getElementsByName('notice_checkbox')
	};
	
	//初始化赋值
	
	var selected = 0;
	var checkboxLen = n.checkboxs.length;
	
	/**
	 * 获取所有已选择的复选框value
	 * return Array
	 */
	
	var getSelectedRid = function(){
		var aSelected = [];
		var i = 0;
		for( i; i<checkboxLen; i++){
			if(n.checkboxs[i].checked){
				aSelected.push( n.checkboxs[i].value );
			}
		}
		return aSelected;
	};

	/**
	 * 删除操作
	 * @param {String} rid 非必选参数，如果没有则取所有被选中的副选框
	 */
	
	App.deleteNotice = function(rid){
		//如果没有登陆，则先登陆
		if(scope.$uid==""){
			App.ModLogin(function(){
					window.location.reload(true);
			});
			return;
		}
		var aRids = rid;
		var oPost = { "rid" : rid };
		App.delDialog(c.delText, c.delApi, oPost, function(oResult){
			//成功后刷新通知管理页
			if( oResult.code == "A00006" ){
				window.location.reload(true);
			}
			//如果没有登陆，则先登陆，登陆成功后自动提交
			else if( oResult.code == "M00003" ){
				App.ModLogin(function(){
					App.deleteNotice(rid);	
				});
			}
			//其它情况则挖$SYSMSG
			else{
				App.flyDialog( $SYSMSG[oResult.code], "alert", null);
			}
		},
		function(){
			
		},null);
		
	};
	
	/**
	 * 使所有多选框选中或取消选中
	 * @param {Boolean} b 必选参数 true/false
	 */
	
	var validAll = function(b){
		var i = 0;
		for( i; i<checkboxLen; i++ ){
			n.checkboxs[i].checked = b;
		}
		n.tCheckbox.checked = b;
		n.bCheckbox.checked = b;
		selected = b?checkboxLen:0;
	}
	
	/**
	 * 批量删除
	 */
	
	App.deleteSelectedNotice = function(){
		var aRids = getSelectedRid();
		if( aRids.length > 0 ){
			if(aRids instanceof Array){
				aRids = aRids.join(",");
			}
			App.deleteNotice(aRids);
		}else{
			App.flyDialog( c.nullText, "alert", null);
		}
	};
	
	//事件绑定
	
	if( checkboxLen > 0 ){
		for( var i = 0; i < checkboxLen; i++){
			(function( c ){
				Core.Events.addEvent(c,function(){
					selected += c.checked?1:-1;
					n.tCheckbox.checked = n.bCheckbox.checked = selected == checkboxLen? true: false;
				},"click");
			})( n.checkboxs[i] );
		}
	}
	
	if( n.tCheckbox && n.bCheckbox){
		Core.Events.addEvent(n.tCheckbox,function(){validAll(n.tCheckbox.checked)},"click");
		Core.Events.addEvent(n.bCheckbox,function(){validAll(n.bCheckbox.checked)},"click");
	}
});