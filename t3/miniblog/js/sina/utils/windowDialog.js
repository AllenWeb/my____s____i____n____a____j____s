/**
 * @fileview 封装各种提示对话框
 * 基于方超的 dialog.js 做封装
 * 对话框包括三种类型：alert()、confirm()、msgbox()，因为没有 prompt() 需求，故而未封装
 * 核心方法是 msgbox()，alert() 和 confirm() 只是对 msgbox() 的再次封装
 * 
 * 支持的参数：标题、图标、对话框内容、按钮的回调事件、按钮的文字、默认聚焦按钮、按钮CSS、宽度、高度等 
 * 
 * 调用示例1:
 * 		windowDialog.alert("HOHO！我弹", {
  				funcOk: myFunction,
  				textOk: "确定按钮",
  				title:	"友情提示",
  				icon:	"01",  // 可选值："01"、"02"、"03"、"04"、"05"
  				width:	500,  // 对话框宽度，默认 300px
  				height:	300   // 对话框高度，默认自适应
  			}); 
 * 调用示例2：
  		windowDialog.confirm("HOHO！我弹", {
  				funcOk: myFunction1,
  				textOk: "确定按钮",
  				funcCancel: myFunction2,
  				textCancel: "取消按钮",
  				defaultButton: 1,  // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
  				title:	"友情提示",
  				icon:	"01",  // 可选值："01"、"02"、"03"、"04"、"05"
  				width:	500,  // 对话框宽度，默认 300px
  				height:	300   // 对话框高度，默认自适应
  			}); 
 * 调用示例3：
  		windowDialog.msgbox("HOHO！我弹", {
  				title:	"友情提示",  // 对话框标题
  				icon:	"01",   // 可选参数，如果没有此参数表示对话框无图标；
  								// 如果有图标，参数可选值："01"、"02"、"03"、"04"、"05" 或者图标图片 URL
  				user_btn: [  // 按钮集合，可选参数。如果无参数默认是一个确定按钮。
  							{label: "",
  							 func: "",
  							 focus: true,
  							 css: ""
  							}
  							],	
  				width:	500,  // 对话框宽度，默认 300px
  				height:	300   // 对话框高度，默认自适应
  			});
  
 * @author L.Ming 2008.01.31
 * @shaomin 
 */
$import("sina/app.js");
$import("sina/utils/dialog.js");
$import("sina/utils/template.js");
$import("sina/core/string/expand.js");
$import("sina/core/events/addEvent.js");
$import('sina/core/function/bind3.js');

var windowDialog = {
	msgbox: function(op){
		op = op || {};
		op.type = op.type || "confirm";
		/**
		 * 此处不能使用this.tpl=this.tpl || new Utils.Template(this["struc_"+op.type]);
		 * 这样的单实例模式，如果在同一页面不刷新情况下，则当第一次弹出confirm框第二次再弹出alert框时，采用了
		 * 第一次confirm框的HTML模板，无法渲染第二次弹出的alert框模板，因此不使用该方法
		 * xy xinyu@staff.sina.com.cn 2008-11-08s
		 */
		/**
		 * 增加是否显示为宽版的confirm
		 * stan | chaoliang@staff.sina.com.cn
		 */
		var isWidth = typeof op.w != 'undefined' ? "_w" : "";
		this.tpl =  new Utils.Template(this["struc_"+op.type + isWidth]);
		var data = {};
		data.icon = this.icons[op.icon];
		data.msg1 = op.content || "";
		data.msg2 = op.content2 || "";
		var obj  = {};
		obj.title = op.title || "提示";
		obj.content = this.tpl.evaluate(data);
		obj.middle = op.middle || true;
		this.dialog = new Sina.Utils.dialog(obj, {});
		this.dialog.show();
		if(op.type=='alert'){
			var btn_con = Core.Dom.getElementsByClass(this.dialog.__body, "p", "CP_w_btns")[0];
		}else{
			var btn_con = Core.Dom.getElementsByClass(this.dialog.__body, "p", "CP_w_btns")[0];
		}
		Core.Array.foreach(op.btns || [], function(v, i){
			var b = $C("a");
			b.className = "CP_a_btn2";
			b.href = "javascript:void(0)";
			b.id="btn_" + parseInt(Math.random() * 10000);
			b.innerHTML = "<cite>" + v.text + "</cite>";
			Core.Events.addEvent(b, v.func || function(){});
			Core.Events.addEvent(b, this.dialog.hidden.bind2(this.dialog));
			btn_con.appendChild(b);
			if(v.focus){
				b.focus();
			}
			btn_con.appendChild(document.createTextNode(" "));
		}.bind2(this));
		
		return this.dialog;
	},
	icons : {
		"01" : "CP_ib_suce",	//成功
		"02" : "CP_ib_fail",	//失败
		"03" : "CP_ib_warn",	//警告
		"04" : "CP_ib_query",	//询问
		"05" : "",				//茶
		"06" : "CP_ib_priv"		//加密
	},
	struc_confirm :'\
		<div class="CP_layercon1">\
				<div class="CP_prompt"><img class="CP_ib #{icon}" src="http://simg.sinajs.cn/common/images/CP_ib.gif" align="absmiddle" alt="" title="" /><table class="CP_w_ttl"><tr><td>#{msg1}</td></tr></table>\
						<div class="CP_w_cnt">#{msg2}</div>\
						<p class="CP_w_btns">#{btns}</p>\
					</div>\
				</div>',
	struc_confirm_w :'\
		<div class="CP_layercon2">\
				<div class="CP_prompt"><img class="CP_ib #{icon}" src="http://simg.sinajs.cn/common/images/CP_ib.gif" align="absmiddle" alt="" title="" /><table class="CP_w_ttl"><tr><td>#{msg1}</td></tr></table>\
						<div class="CP_w_cnt">#{msg2}</div>\
						<p class="CP_w_btns">#{btns}</p>\
					</div>\
				</div>',
	struc_alert : '\
		<div class="CP_layercon1">\
			<div class="CP_prompt">\
				<img align="absmiddle" title="" alt="" src="http://simg.sinajs.cn/common/images/CP_ib.gif" class="CP_ib #{icon}"/>\
				<table class="CP_w_ttl"><tbody><tr><td>#{msg1}</td></tr></tbody></table>\
				<div class="CP_w_cnt">#{msg2}</div>\
				<p class="CP_w_btns">#{btns}</p>\
			</div>\
		</div>'
	,

/**
windowDialog.alert("HOHO！我弹", {
	funcOk: myFunction,
	textOk: "确定按钮",
	title:	"友情提示",
	icon:	"01"	  // 可选值："01"、"02"、"03"、"04"、"05"
}); 
 */
alert : function (content, op){
	var obj = {};
	op = op || {};
	obj.title = op.title || "提示";
	obj.content = content || "";
	obj.content2 = op.content2 || "";
	obj.icon = op.icon || "01";
	obj.type = op.type || "alert";
	var btns = [];
//	obj.btns = [ 
	var temobj = {
			text : op.textOk ||"确定",
			func : op.funcOk ||function(){}
		};
	
	btns.push(temobj);
	if(typeof op.textCancel != 'undefined'){
		var temobj = {
			text : op.textCancel ||"取消",
			func : function(){}
		};
		btns.push(temobj);
	}
	if(btns.length > 1){
		btns[1].focus = true;
	}else{
		btns[0].focus = true;
	}
	obj.btns = btns;
	return this.msgbox(obj);
},
/**
windowDialog.confirm("HOHO！我弹", {
	funcOk: myFunction1,
	textOk: "确定按钮",
	funcCancel: myFunction2,
	textCancel: "取消按钮",
	defaultButton: 1,  // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
	title:	"友情提示",
	icon:	"01"  // 可选值："01"、"02"、"03"、"04"、"05"
}); 
 */
confirm : function (content, op){
	var obj = {};
	op = op ||{};
	obj.title = op.title || "提示";
	obj.content = content || "";
	obj.content2 = op.content2 || "";
	obj.icon = op.icon || '04';
	obj.type="confirm";
	obj.w = op.w;
	obj.btns = [
		{
			text : op.textOk || "是",
			func : op.funcOk || function(){},
			focus : op.defaultButton == 1 ? true : false 
		},
		{
			text : op.textCancel || "否",
			func : op.funcCancel || function(){},
			focus : true
		}
	];
	return this.msgbox(obj);
}
};

App.showDialogContent = {
	init : function(content,settings){
		var c = content || '';
		settings = settings || {};
		var dialogCfg = {
	                    ad: true,
	                    title: settings.title || "提示！",
	                    drag: false,
						zindex:3000,
	                    shadow: settings.shadow,
	                    css: "Dialog",
	                    content: content || "",
	                    middle: settings.middle,
	                    resizable : settings.resizable
	                };
		var func = {};
		var btnContainer = settings.btnContainer ;
		var dialog = new Sina.Utils.dialog(dialogCfg, func);
		this.dialog = dialog;
		this.dialog.setContent(c);
		this.dialog.show();
		if(typeof settings.middle == 'undefined'){
			this.dialog.setMiddle();
		}
		if(typeof settings.top != 'undefined' 
			&& typeof settings.left != 'undefined')
			this.dialog.setPosition(settings.left,settings.top);
		var btns = [];
		if($E(btnContainer && typeof settings.textOk != 'undefined')){
			var but1 = {
					text : settings.textOk ,
					func : settings.funcOk || function(){},
					focus : settings.defaultButton == 1 ? true : false,
					isOpened : settings.isOpened 
					//用来判断点击此按钮是否立即关闭对话框,有时需要显示错误信息,不能立即关闭
				};
			btns.push(but1);
			if(typeof settings.textCancel != 'undefined'){
				var but2 = {
					text : settings.textCancel ,
					func : settings.funcCancel || function(){},
					focus : true
				};
				btns.push(but2);
			}
			Core.Array.foreach(btns || [], function(v, i){
					var b = $C("a");
					b.className = "CP_a_btn2";
					b.href = "javascript:void(0);";
					b.id="btn_"+parseInt(Math.random() * 10000);
					b.innerHTML = "<cite>" + v.text + "</cite>";
					Core.Events.addEvent(b, v.func || function(){});
					if(typeof v.isOpened == 'undefined' || v.isOpened)
						Core.Events.addEvent(b, dialog.hidden.bind2(dialog));
					$E(btnContainer).appendChild(b);
					if(v.focus){
						b.focus();
					}

				});
			}else{
				//alert(this.dialog.getDialogBody());
			 	this.dialog.__close.focus();
			}
		
		return this.dialog;
	},
	//initialized : false,
	dialog : null
	
};

