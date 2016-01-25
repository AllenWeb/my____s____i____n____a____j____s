/*
 *@fileoverview : 选择操作日志的下拉列表 
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/dom.js");
$import("sina/core/dom/byId.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");

$registJob( "diaryJob" , function () {
	var _addEvent = Core.Events.addEvent;
	
	//操作类型
	(function () {
		_addEvent( $E("operType"), function () {
			alert( this.value );
		}, 'change' );
	})();
	
	//选择管理员
	(function () {
		_addEvent( $E("manager"), function () {
			alert( this.value );
		}, 'change' );
	})();
	
	//获取查找关键字
	(function () {
		_addEvent( $E("keyword"), function () {
			alert( this.value );
		}, 'click' );
	})();
	
	//开始时间
	(function () {
		_addEvent( $E("beginTime"), function () {
			$E( "bt" ).value = "2011-1-10";
		} , 'click' );
	})();
	
	//结束时间
	(function () {
		_addEvent( $E("endTime"), function () {
			$E( "et" ).value = "2011-1-15";
		});
	})();
	
	//执行搜索
	(function () {
		_addEvent( $E( "search" ), function () {
			(function () {
				var _config = {
					onComplete : function () {
						alert( "ok" );
					},
					onException : function () {
						alert( $E( "operType" ).value + $E( "manager" ).value + $E( "keyword" ).value + $E( "bt" ).value + $E( "et" ).value);
					},
					returnType : "json",
					"POST" : {
						//操作类型
						"operType" : $E( "operType" ).value,
						//选定的管理员
						"OperManager" : $E( "manager" ).value,
						//查找关键字
						"keyValue" : $E( "keyword" ).value,
						//开始时间
						"begin" : $E( "bt" ).value,
						//结束时间
						"end" : $E( "et" ).value
					}
				}
				
				Utils.Io.Ajax.request( "diary.php" , _config );
			})();
		}, 'click' );
	})()
} );
