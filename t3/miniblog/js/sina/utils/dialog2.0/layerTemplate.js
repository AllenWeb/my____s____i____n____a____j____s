var LayerTemplate={
	/**
	 * 需配置模板的各个节点
	 * 		entity 整个dialog对象
	 * 		titleBar 标题栏区域
	 * 		titleName 标题名称
	 * 		btnClose 关闭按钮
	 * 		content 内容区域
	 * 		icon 图标
	 * 		text 文本区域
	 * 		subText 次级文本区域
	 * 		linkOk 确定按钮的焦点节点
	 * 		btnOk 确定按钮
	 * 		ok 确定按钮的文字节点
	 */
	"alert":'<table id="#{entity}"  class="gModLy">'+
			'<thead id="#{titleBar}">'+
				'<tr>'+
					'<td class="tbgleft"><div></div></td>'+
					'<td class="tdmain"><div class="gModLyHeader"><div class="gFl"><div class="gML_tit"><strong id="#{titleName}"></strong></div></div>'+
					'<div class="gFr"><ul><li><a href="javascript:;" id="#{btnClose}" class="iconClose"></a></li><li><a href="#" class="help" >帮助</a></li></ul></div></div></td>'+
					'<td class="tbgright"><div></div></td>'+
				'</tr>'+
			'</thead>'+
			'<tfoot>'+
				'<tr>'+
					'<td class="tbgleft"><div></div></td>'+
					'<td class="tdmain"></td>'+
					'<td class="tbgright"><div></div></td>'+
				'</tr>'+
			'</tfoot>'+
			'<tbody>'+
				'<tr>'+
					'<td class="tbgleft"><div></div></td>'+
					'<td class="tdmain" id="layer_2">'+
						'<div id="#{content}" class="gModLyCont">'+
							'<!-- 内容区域 -->'+
							'<div class="gDialogDoc">' +
								'<div class="diaBd">' +
									'<div class="gDiaC1"><img id="#{icon}" width="50" height="50" class="" src="http://simg.sinajs.cn/tiezi/images/icon/icon.gif" alt=""/></div>' +
									'<div class="gDiaC2">' +
										'<h5 id="#{text}"></h5>' +
										'<div id="#{subText}"></div>' +
										'<p/>' +
									'</div>' +
								'</div>' +
								'<div class="btnRow"><a class="gBtnb gBtnbClr" id="#{linkOk}" href="javascript:;"><cite id="#{btnOk}"><em id="#{ok}"></em></cite></a></div>' +
							'</div>'+
							'<!-- 内容区域 -->'+
						'</div>'+
					'</td>'+
					'<td class="tbgright"><div></div></td>'+
				'</tr>'+
			'</tbody>'+
		'</table>',
			
	/**
	 * 需配置模板的各个节点
	 * 		entity 整个dialog对象
	 * 		titleBar 标题栏区域
	 * 		titleName 标题名称
	 * 		btnClose 关闭按钮
	 * 		content 内容区域
	 * 		icon 图标
	 * 		text 文本区域
	 * 		subText 次级文本区域
	 * 		linkOk 确定按钮的焦点节点
	 * 		btnOk 确定按钮
	 * 		ok 确定按钮的文字节点
	 * 		linkCancel 取消按钮的焦点节点
	 * 		btnCancel 取消按钮
	 * 		cancel 取消按钮的文字节点
	 */
	"confirm":'<table id="#{entity}"  class="gModLy">'+
				'<thead id="#{titleBar}">'+
					'<tr>'+
						'<td class="tbgleft"><div></div></td>'+
						'<td class="tdmain"><div class="gModLyHeader"><div class="gFl"><div class="gML_tit"><strong id="#{titleName}"></strong></div></div>'+
						'<div class="gFr"><ul><li><a href="javascript:;" id="#{btnClose}" class="iconClose"></a></li><li><a href="#" class="help" >帮助</a></li></ul></div></div></td>'+
						'<td class="tbgright"><div></div></td>'+
					'</tr>'+
				'</thead>'+
				'<tfoot>'+
					'<tr>'+
						'<td class="tbgleft"><div></div></td>'+
						'<td class="tdmain"></td>'+
						'<td class="tbgright"><div></div></td>'+
					'</tr>'+
				'</tfoot>'+
				'<tbody>'+
					'<tr>'+
						'<td class="tbgleft"><div></div></td>'+
						'<td class="tdmain" id="layer_2">'+
							'<div id="#{content}" class="gModLyCont">'+
								'<!-- 内容开始 -->'+
									'<div class="gDialogDoc">' +
										'<div class="diaBd">' +
											'<div class="gDiaC1"><img id="#{icon}" width="50" height="50" class="" src="http://simg.sinajs.cn/tiezi/images/icon/icon.gif" alt=""/></div>' +
											'<div class="gDiaC2">' +
												'<h5 id="#{text}"></h5>' +
												'<div id="#{subText}"></div>' +
												'<p/>' +
											'</div>' +
										'</div>' +
										'<div class="btnRow">'+
											'<a class="gBtnb gBtnbClr" id="#{linkOk}" href="javascript:;"><cite id="#{btnOk}"><em id="#{ok}"></em></cite></a>'+
											'<a class="gBtnb gBtnbClr" id="#{linkCancel}" href="javascript:;"><cite id="#{btnCancel}"><em id="#{cancel}"></em></cite></a>'+
										'</div>' +
									'</div>'+
								'<!-- 内容结束 -->'+
							'</div>'+
						'</td>'+
						'<td class="tbgright"><div></div></td>'+
					'</tr>'+
				'</tbody>'+
			'</table>',
				
	/**
	 * 需配置模板的各个节点
	 * 		entity 整个dialog对象
	 * 		titleBar 标题栏区域
	 * 		titleName 标题名称
	 * 		btnClose 关闭按钮
	 * 		content 内容区域
	 * 		loadState 装载时要显示的内容
	 * 		iframe 框架对象
	 * 		iframeURL 框架的地址
	 */
	"iframe":'<table id="#{entity}"  class="gModLy">'+
				'<thead id="#{titleBar}">'+
					'<tr>'+
						'<td class="tbgleft"><div></div></td>'+
						'<td class="tdmain"><div class="gModLyHeader"><div class="gFl"><div class="gML_tit"><strong id="#{titleName}"></strong></div></div>'+
						'<div class="gFr"><ul><li><a href="javascript:;" id="#{btnClose}" class="iconClose"></a></li><li><a href="#" class="help" >帮助</a></li></ul></div></div></td>'+
						'<td class="tbgright"><div></div></td>'+
					'</tr>'+
				'</thead>'+
				'<tfoot>'+
					'<tr>'+
						'<td class="tbgleft"><div></div></td>'+
						'<td class="tdmain"></td>'+
						'<td class="tbgright"><div></div></td>'+
					'</tr>'+
				'</tfoot>'+
				'<tbody>'+
					'<tr>'+
						'<td class="tbgleft"><div></div></td>'+
						'<td class="tdmain" id="layer_2">'+
							'<div id="#{content}" class="gModLyCont">'+
								'<div id="#{loadState}">Loading...</div>'+
								'<iframe style="width:100%;height:500px;" id="#{iframe}" src="#{iframeURL}"></iframe>'+
							'</div>'+
						'</td>'+
						'<td class="tbgright"><div></div></td>'+
					'</tr>'+
				'</tbody>'+
			'</table>',
	
	 /** 
	 * 需配置模板的各个节点
	 *		entity 整个dialog对象
	 * 		titleBar 标题栏区域
	 * 		titleName 标题名称
	 * 		btnClose 关闭按钮
	 * 		content 内容区域 
	 */
	"customs":'<table id="#{entity}"  class="gModLy">'+
				'<thead id="#{titleBar}">'+
					'<tr>'+
						'<td class="tbgleft"><div></div></td>'+
						'<td class="tdmain"><div class="gModLyHeader"><div class="gFl"><div class="gML_tit"><strong id="#{titleName}"></strong></div></div>'+
						'<div class="gFr"><ul><li><a href="javascript:;" id="#{btnClose}" class="iconClose"></a></li><li><a href="#" class="help" >帮助</a></li></ul></div></div></td>'+
						'<td class="tbgright"><div></div></td>'+
					'</tr>'+
				'</thead>'+
				'<tfoot>'+
					'<tr>'+
						'<td class="tbgleft"><div></div></td>'+
						'<td class="tdmain"></td>'+
						'<td class="tbgright"><div></div></td>'+
					'</tr>'+
				'</tfoot>'+
				'<tbody>'+
					'<tr>'+
						'<td class="tbgleft"><div></div></td>'+
						'<td class="tdmain" id="layer_2">'+
							'<div id="#{content}" class="gModLyCont">'+
								'<!-- 内容区域 -->'+
								'<!-- 内容区域 -->'+
							'</div>'+
						'</td>'+
						'<td class="tbgright"><div></div></td>'+
					'</tr>'+
				'</tbody>'+
			'</table>'
};


