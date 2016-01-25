$import("sina/utils/dialog2.0/windowDialog.js");
$import("sina/utils/dialog2.0/backShadow.js");
$import("sina/core/events/addEvent.js");

/**
 * 模板配置
 */
var DialogTemplate={
	/**
	 * 需配置模板的各个节点：
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
	"alert":'<table id="#{entity}" class="CP_w">'+
				'<thead id="#{titleBar}">'+
					'<tr>'+
						'<th><strong id="#{titleName}"></strong><cite id="#{btnClose}"><a href="javascript:;" class="CP_w_shut" title="关闭">关闭</a></cite></th>'+
					'</tr>'+
				'</thead>'+
				'<tbody>'+
					'<tr>'+
						'<td>'+
							'<div id="#{content}" class="CP_layercon1">'+
								'<div class="CP_prompt">'+
									'<img id="#{icon}" class="" src="http://simg.sinajs.cn/common/images/CP_ib.gif" align="absmiddle" alt="" title="" />'+
									'<table class="CP_w_ttl"><tr><td id="#{text}"></td></tr></table>'+
									'<div class="CP_w_cnt" id="#{subText}"></div>'+
									'<p class="CP_w_btns"><a id="#{linkOk}" href="javascript:;" class="CP_a_btn2"><cite id="#{btnOk}">&nbsp;<span id="#{ok}"></span>&nbsp;</cite></a></p>'+
								'</div>'+
							'</div>'+
						'</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>',
			
			
	/**
	 * 需配置模板的各个节点：
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
	"confirm":'<table id="#{entity}" class="CP_w">'+
				'<thead id="#{titleBar}">'+
					'<tr>'+
						'<th><strong id="#{titleName}"></strong><cite id="#{btnClose}"><a href="javascript:;" class="CP_w_shut" title="关闭">关闭</a></cite></th>'+
					'</tr>'+
				'</thead>'+
				'<tbody>'+
					'<tr>'+
						'<td>'+
							'<div id="#{content}" class="CP_layercon1">'+
								'<div class="CP_prompt">'+
									'<img id="#{icon}" class="" src="http://simg.sinajs.cn/common/images/CP_ib.gif" align="absmiddle" alt="" title="" />'+
									'<table class="CP_w_ttl"><tr><td id="#{text}"></td></tr></table>'+
									'<div class="CP_w_cnt" id="#{subText}"></div>'+
									'<p class="CP_w_btns">'+
										'<a id="#{linkOk}" href="javascript:;" class="CP_a_btn2"><cite id="#{btnOk}">&nbsp;<span id="#{ok}"></span>&nbsp;</cite></a>'+
										'<a id="#{linkCancel}" href="javascript:;" class="CP_a_btn2"><cite id="#{btnCancel}">&nbsp;<span id="#{cancel}"></span>&nbsp;</cite></a>'+
									'</p>'+
								'</div>'+
							'</div>'+
						'</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>',
	
	/**
	 * 需配置模板的各个节点：
	 * 		entity 整个dialog对象
	 * 		titleBar 标题栏区域
	 * 		titleName 标题名称
	 * 		btnClose 关闭按钮
	 * 		content 内容区域
	 * 		loadState 装载时要显示的内容
	 * 		iframe 框架对象
	 * 		iframeURL 框架的地址
	 */
	"iframe":'<table id="#{entity}" class="CP_w">'+
					'<thead id="#{titleBar}">'+
						'<tr>'+
							'<th>'+
								'<strong id="#{titleName}"></strong>'+
								'<cite>'+
									'<a target="_blank" id="#{btnHelp}" class="CP_w_help" href="javascript:;" style="display: none;">帮助</a>'+
									'<a title="关闭" id="#{btnClose}" class="CP_w_shut" href="javascript:;" style="display: block;">关闭</a>'+
								'</cite>'+
							'</th>'+
						'</tr>'+
					'</thead>'+
					'<tbody>'+
						'<tr>'+
							'<td id="#{content}" style="vertical-align: top;">'+
								'<div id="#{loadState}">Loading...</div>'+
								'<iframe style="width:100%;height:500px;" id="#{iframe}" src="#{iframeURL}"></iframe>'+
							'</td>'+
						'</tr>'+
					'</tbody>'+
				'</table>',

	 /** 
	 * 需配置模板的各个节点：
	 *		entity 整个dialog对象
	 * 		titleBar 标题栏区域
	 * 		titleName 标题名称
	 * 		btnClose 关闭按钮
	 * 		content 内容区域 
	 */
	"customs": '<table id="#{entity}" class="CP_w">'+
					'<thead id="#{titleBar}">'+
						'<tr>'+
							'<th>'+
								'<strong id="#{titleName}"></strong>'+
								'<cite>'+
									'<a target="_blank" id="#{btnHelp}" class="CP_w_help" href="javascript:;" style="display: none;">帮助</a>'+
									'<a title="关闭" id="#{btnClose}" class="CP_w_shut" href="javascript:;" style="display: block;">关闭</a>'+
								'</cite>'+
							'</th>'+
						'</tr>'+
					'</thead>'+
					'<tbody>'+
						'<tr>'+
							'<td id="#{content}" style="vertical-align: top;">'+
							'</td>'+
						'</tr>'+
					'</tbody>'+
				'</table>'
};

/**
 * 显示图标配置
 * "01":[!]
 * "02":[×]
 * "03":[√]
 * "04":[?]
 */
var	iconSet={
	"01":{"class":"CP_ib CP_ib_warn","alt":"警告"},
	"02":{"class":"CP_ib CP_ib_fail","alt":"失败"},
	"03":{"class":"CP_ib CP_ib_suce","alt":"成功"},
	"04":{"class":"CP_ib CP_ib_query","alt":"询问"}
};

var dialogBackShadow;
var winDialog={},_winDialog;

winDialog.alert=function(text,cfg,name){
	if(!_winDialog){
		initDialog();
		_winDialog.alert(text,cfg,name);
	}else{
		_winDialog.alert(text,cfg,name);
	}
};

winDialog.confirm=function(text,cfg,name){
	if(!_winDialog){
		initDialog();
		_winDialog.confirm(text,cfg,name);
	}else{
		_winDialog.confirm(text,cfg,name);
	}
};

winDialog.showIframe=function(cfg,name){
	if(!_winDialog){
		initDialog();
		_winDialog.showIframe(cfg,name);
	}else{
		_winDialog.showIframe(cfg,name);
	}
};

winDialog.createCustomsDialog=function(cfg,name){
	if(!_winDialog){
		initDialog();
		return _winDialog.createCustomsDialog(cfg,name);
	}else{
		return _winDialog.createCustomsDialog(cfg,name);
	}
};

function initDialog(){
	dialogBackShadow = new BackShadow(0.4);
	_winDialog = new Sina.Utils.WindowDialog(dialogBackShadow, {
		"alert": DialogTemplate.alert,
		"confirm": DialogTemplate.confirm,
		"iframe": DialogTemplate.iframe,
		"customs": DialogTemplate.customs
	});
	_winDialog.iconSet=iconSet;
}
			
