$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/dom/getStyle.js");

/**
 * @fileoverview
 *  获取TextArea的实际内容高度
 *  App.getTextAreaHeight  获取传入的TextArea内容实际高度
 *  App.autoHeightTextArea 绑定传入的TextArea对像，令其自动适应文本高度
 * @example 
 * 		<TextArea id="textAreaExample" style="width:200px,height:100px;overflow:hidden;line-height:18px;font-size:14px;">
 * 		</TextArea>
 * 		<script>
 * 			//获取textAreaExample对像
 *			var oNode = $E("textAreaExample");
 *			 //限制输入文字最大可输入2000个字符
 *			var sLength = 2000;
 *			var limit = function(sLength){
 *				var snapLength = Core.String.byteLength(this.value);
 *				if( snapLength > sLength ){
 *					this.value = Core.String.leftB(this.value, sLength);
 *				}
 *			}；
 *			//绑定textAreaExample，使其最多输入2000个字符，并且最大高度不能高于200
 *			//参数1，传入TextArea对像
 *			//参数2，传入用户输入时需触发的函数
 *			//参数3，传入最大高度
 *			App.autoHeightTextArea( oNode, Core.Function.bind3( limit, oNode, [sLength] ), 200 );
 * 		</script>
 * @author liusong | liusong@staff.sina.com.cn
 */

/**
 * 绑定传入的TextArea对像，令其自动适应文本高度
 * @param {HTMLElement} oNode          必选参数，需要自适应高度的TextArea对像
 * @param {Function}    fInputListener 可选参数，当触发输入事件时调用的函数
 * @param {Number}      nMaxHeight     可选参数，TextArea对像最大高度，如果没有最大高度则应用内容高度，超过最大高度时会显示滚动条
 */

App.autoHeightTextArea = function(oNode, fInputListener, nMaxHeight){
	//参数初始化
	oNode = $E( oNode );
	fInputListener = fInputListener || function(){};
	//当用户输入时，改变TextArea对像高度
	var listener = function(nMaxHeight){
		if (fInputListener) { fInputListener();	}
		var nViewHeight;
		var sScrollStyle;
		var nSnapHeight = App.getTextAreaHeight(this);
		nMaxHeight = nMaxHeight || nSnapHeight;
		//如果内容高度大于最大高度，则显示最大高度，并显示滚动条
		if( nSnapHeight > nMaxHeight ){
			nViewHeight = nMaxHeight;
			if(this.style.overflowY === 'hidden'){
				this.style.overflowY = "auto";
			}
		}
		//如果内容高度小于最大高度，则显示内容高度，不显示滚动条
		else{
			nViewHeight = nSnapHeight;
			if(this.style.overflowY === 'auto'){
				this.style.overflowY = "hidden";
			}
		}
		this.style.height = Math.min( nMaxHeight, nSnapHeight ) + "px";
		
	};
	//对TextArea进行事件绑定
	if( oNode.binded == null ){
		Core.Events.addEvent(oNode, Core.Function.bind3(listener,oNode,[nMaxHeight]), "keyup");
		Core.Events.addEvent(oNode, Core.Function.bind3(listener, oNode, [nMaxHeight]), "focus");
		Core.Events.addEvent(oNode, Core.Function.bind3(listener,oNode,[nMaxHeight]), "blur");
		oNode.binded = true;
		oNode.style.overflowY = 'hidden';
		oNode.style.overflowX = "hidden";
	}
	
};

/**
 * 获取传入的TextArea内容实际高度
 * @param {HTMLElement} oNode 必选参数，TextArea对像
 * @return {Number} snapHeight TextArea内容高度
 */

App.getTextAreaHeight = function(oNode){
	//参数初始化
	oNode = $E( oNode );
	//获取传入对像的默认高度
	if( oNode.defaultHeight == null){
		oNode.defaultHeight = window.parseInt(Core.Dom.getStyle(oNode,"height"));
	}
	var snapHeight;
	//如果是ie则直接通过scrollHeight来获取高度
	if( $IE ){
		snapHeight = Math.max( oNode.scrollHeight, oNode.defaultHeight );
	}
	//如果不是ie则需要先创建一个对像的副本
	else{
		var textArea = $E("_____textarea_____");
		if( textArea == null ){
			textArea = document.createElement("textarea");
			textArea.id = "_____textarea_____";
			document.getElementsByTagName("body")[0].appendChild(textArea);
		}
		//如果传入对像改变了，则需要重新对副本的样式进行设置
		if( textArea.currentTarget != oNode ){
			textArea.style.top           = "-1000px";
			textArea.style.height        = "0px";
			textArea.style.position      = "absolute";
			textArea.style.overflow      = "hidden";
			textArea.style.width         = Core.Dom.getStyle(oNode,"width");
			textArea.style.fontSize      = Core.Dom.getStyle(oNode,"fontSize");
			textArea.style.fontFamily    = Core.Dom.getStyle(oNode,"fontFamily");
			textArea.style.lineHeight    = Core.Dom.getStyle(oNode,"lineHeight");
			textArea.style.paddingLeft   = Core.Dom.getStyle(oNode,"paddingLeft");
			textArea.style.paddingRight  = Core.Dom.getStyle(oNode,"paddingRight");
			textArea.style.paddingTop    = Core.Dom.getStyle(oNode,"paddingTop");
			textArea.style.paddingBottom = Core.Dom.getStyle(oNode,"paddingBottom");
		}
		textArea.value = oNode.value;
		snapHeight = Math.max( textArea.scrollHeight, oNode.defaultHeight );
		textArea.currentTarget = oNode;
	}
	return snapHeight;
};