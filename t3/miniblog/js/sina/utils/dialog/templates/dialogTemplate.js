/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @FileOverview 基础对话框容器的配置模板(将会覆盖掉Layer层的模板)
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 * @NodeName：
 * 		layerId [基础层的Id]
 * 		titleBarId [标题栏的Id]
 * 		contentId [内容容器的Id]
 */

var DialogTemplate={
	"normal":'<div id="#{layerId}" style="position: absolute; left: 50px; top: 1070px; width:310px;" class="gModLayerBox">'+
				'<table cellspacing="0" cellpadding="0" border="0" class="twrap">'+
					'<tbody>'+
						'<tr>'+
							'<td/>'+
							'<td class="fixSize"/>'+
						'</tr>'+
						'<tr>'+
							'<td>'+
								'<div class="layerDoc">'+
									'<div class="layerBD">'+
										'<div id="#{titleBarId}" class="topLayer">'+
										'</div>'+
										'<div id="#{contentId}" class="midLayer">'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</td>'+
							'<td class="tBg"/>'+
						'</tr>'+
						'<tr>'+
							'<td><div class="tBg"/></td>'+
							'<td class="tBg fixSize"/>'+
						'</tr>'+
					'</tbody>'+
				'</table>'+
			'</div>',
	"happy":'',
	"lalala":''
};
