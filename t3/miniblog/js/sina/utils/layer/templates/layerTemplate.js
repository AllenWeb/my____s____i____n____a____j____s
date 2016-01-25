/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @FileOverview 基础层的配置模板
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 * @NodeName：
 * 		layerId [基础层的Id]
 * 		contentId [内容容器的Id]
 */

var LayerTemplate={
	"normal":'<div id="#{layerId}" style="position: absolute; left: 50px; top: 170px;" class="gModLayerBox">'+
				'<table cellspacing="0" cellpadding="0" border="0" class="twrap noY">'+
					'<tbody>'+
						'<tr>'+
							'<td/>'+
							'<td class="fixSize"/>'+
						'</tr>'+
						'<tr>'+
							'<td>'+
								'<div class="layerDoc">'+
									'<div id="#{contentId}" class="midLayer">'+
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
	"grayBorder":'',
	"blueBorder":'',
	"normalShadow":'',
	"grayBorderShadow":'',
	"blueBorderShadow":'',
	"红色诱惑":"",
	"风情万种":"",
	"似水柔情":""	
};


