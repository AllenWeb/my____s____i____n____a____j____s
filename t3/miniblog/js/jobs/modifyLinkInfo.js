/*
 *@fileoverview : 编辑已有友情链接 
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/dom/setStyle.js");
$import("diy/dom.js");
$import("sina/core/dom/byId.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/trim.js");

function editLink () {
	
	//点击编辑按钮，则创建一个P标签
	var oP = $C("p");
	//设置p标签的背景色
	//Core.Dom.setStyle(oP, "backgroundColor", "#FFFF66");
	//设置p的样式
	App.Dom.addClass( oP, "editP" );
	//创建一个链接名称文本框
	var oText1 = $C( "input" );
	oText1.setAttribute("value" , "SINA微博");
	//设置链接名称文本框的样式
	App.Dom.addClass(oText1, "editLinkName");
	//将链接名称文本框放入p中
	oP.appendChild(oText1);
	//创建一个链接地址文本框	
	var oText2 = $C( "input" );
	//设置链接地址文本框的样式
	App.Dom.addClass( oText2, "editLinkURL" );
	oText2.setAttribute( "value", "http://t.sina.com.cn" );
	//将链接地址文本框放入P中
	oP.appendChild(oText2);
	//创建确定、取消两个按钮
	var oBtn1 = $C( "button" ),
		oTextNode1 = document.createTextNode( "确定" ),
		oBtn2 = $C( "button" )
		oTextNode2 = document.createTextNode( "取消" );
	 App.Dom.addClass(oBtn1, "btnOk");
	 oBtn1.appendChild(oTextNode1);
	 App.Dom.addClass(oBtn2, "btnCancel");
	 oBtn2.appendChild(oTextNode2);
	 //将两个按钮放入p中
	 oP.appendChild(oBtn1);
	 oP.appendChild(oBtn2);
	//将p标签追加到 id为 modi 的div中
	oModi = $E( "modi" );
	oModi.appendChild( oP );
}

function addNewLink () {
	var name = $E( "newLinkName" ).value,
		url = $E( "newLinkURL" ).value;
	name = Core.String.trim( name );
	url = Core.String.trim( url );
	if ( !name )
		alert( "链接地址不能为空！" );
	else if ( url == "http://" )
		    alert( "请填写完整的地址！" );
	else {
		
		Utils.Io.Ajax.request( "http://127.0.0.1/test.php",{
				"onComplete"  : function (oResult){
                   alert( "complete" );
                },
                "onException" : function(e){ alert("error"); },
                "returnType"  : "json",
                "POST"        : {
                   'linkName' : name,
				   'linkUrl' : url
                }
		});
	}
}

function showSetLink () {
	Core.Dom.setStyle( $E( "linkOption" ), "display" , "block" );
}

function manageLink () {
	Core.Dom.setStyle( $E( "operationLink" ), "display", "block" );
}
function startEdit () {
	Core.Events.addEvent( $E( "setLink" ), showSetLink, 'click' );
	Core.Events.addEvent( $E( "hideLink" ), function () {
		Core.Dom.setStyle( $E( "rela" ), "display", "none" );
	}, 'click' );
	Core.Events.addEvent( $E( "closeSetLink" ), function () {
		Core.Dom.setStyle( $E( "operationLink" ), "display", "none" );
	}, 'click' );
	Core.Events.addEvent( $E( "editLink"), manageLink, 'click' );
	Core.Events.addEvent( $E( "toEdit" ), editLink, 'click' );
	Core.Events.addEvent( $E( "addBtn" ), addNewLink, 'click' );
}

$registJob( "edit", startEdit );
