/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @FileOverview 用户接口对话框的配置模板
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 * @Description 不同的显示模式配置不同的模板
 */
var windowDialogTemplate={
	"alert": {
		"alert1": {
			/**
			 * titleName [标题显示的文字]
 			 * btnCloseId [关闭按钮的Id]
 			 */
			"title": '<div class="titLeft"><strong class="ttName">#{titleName}</strong></div>' +
						'<div class="titRight">' +
							'<ul>' +
								'<li class="liclose"><a onclick="return false;" href="javascript:;"><img id="#{btnCloseId}" alt="" src="http://simg.sinajs.cn/tiezi/images/icon/icon.gif" class="gFunA03_a" height="15" width="15"></a></li>' +
							'</ul>' +
					 '</div>',
			
			
			
			/**
			 * iconClass [图标的class名称]
			 * iconAlt [图标的alt文字]
			 * text1 [文本内容]
			 * btnOkId ["确定"按钮的Id]
			 * ok ["确定"按钮的文字]
			 */
			"content":  '<div class="gDialogDoc">' +
							'<div class="diaBd">' +
								'<div class="gDiaC1"><img width="50" height="50" class="#{iconClass}" src="http://simg.sinajs.cn/tiezi/images/icon/icon.gif" alt="#{iconAlt}"/></div>' +
								'<div class="gDiaC2">' +
									'<h5>#{text1}</h5>' +
									'<p/>' +
								'</div>' +
							'</div>' +
							'<div class="btnRow"><a class="gBtnb gBtnbClr" onclick="return false;" href="javascript:;"><cite id="#{btnOkId}"><em>#{ok}</em></cite></a></div>' +
						'</div>'
		}
	},
	"confirm": {
		"confirm1": {
			/**
			 * titleName [标题显示的文字]
 			 * btnCloseId [关闭按钮的Id]
 			 */
			"title":'<div class="titLeft"><strong class="ttName">#{titleName}</strong></div>'+
			 		'<div class="titRight">'+
						'<ul>'+
							'<li class="liclose"><a onclick="return false;" href="javascript:;"><img id="#{btnCloseId}" alt="" src="http://simg.sinajs.cn/tiezi/images/icon/icon.gif" class="gFunA03_a" height="15" width="15"></a></li>'+
						'</ul>'+
					'</div>',
			
			
			
			/**
			 * iconClass [图标的class名称]
			 * iconAlt [图标的alt文字]
			 * text1 [主文本内容]
			 * text2 [次文本内容]
			 * btnOkId ["确定"按钮的Id]
			 * btnCancelId ["取消"按钮的Id]
			 * ok ["确定"按钮的文字]
			 * cancel ["取消"按钮的文字]
			 */
			"content":    '<div class="gDialogDoc">' +
							'<div class="diaBd">' +
								'<div class="gDiaC1"><img width="50" height="50" class="#{iconClass}" src="http://simg.sinajs.cn/tiezi/images/icon/icon.gif" alt="#{iconAlt}"/></div>' +
								'<div class="gDiaC2">' +
									'<h5>#{text1}</h5>' +
									'<p>#{text2}</p>' +
								'</div>' +
							'</div>' +
							'<div class="btnRow">' +
								'<a class="gBtnb gBtnbClr" onclick="return false;" href="javascript:;"><cite id="#{btnOkId}"><em>#{ok}</em></cite></a>' +
								'<a class="gBtnb" onclick="return false;" href="javascript:;"><cite id="#{btnCancelId}"><em>#{cancel}</em></cite></a>' +
							'</div>' +
						'</div>'
		}
	},
	"iframe":{
		"iframe1":{
			/**
			 * titleName [标题显示的文字]
 			 * btnCloseId [关闭按钮的Id]
 			 */
			"title":'<div class="titLeft"><strong class="ttName">#{titleName}</strong></div>'+
			 		'<div class="titRight">'+
						'<ul>'+
							'<li class="liclose"><a onclick="return false;" href="javascript:;"><img id="#{btnCloseId}" alt="" src="http://simg.sinajs.cn/tiezi/images/icon/icon.gif" class="gFunA03_a" height="15" width="15"></a></li>'+
						'</ul>'+
					'</div>',
			
			"content":'<div id="#{loadStateId}">Loading...</div>'+
					'<iframe style="width:100%;height:500px;" id="#{iframeId}" src="#{iframeUrl}"></iframe>'
		}
	}
};
