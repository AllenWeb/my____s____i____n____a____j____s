/**
 * @fileoverview
 *	限制单行文本框的输入和内容
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008.12.03
 */
$import("sina/utils/form/_form.js");
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/byteLength.js");
/**
 * 限制指定文本框(INPUT type="text")的长度
 * @param {HtmlElement} el		[必选参数]需要监听的单行文本框对象
 * @param {Number} nLength		[必选参数]限制输入的长度，这里默认指的是字节，中文算两个字节
										  如果希望中文算一个字符，请把可选参数doubleByte 设置为 false
 * @param {Object}				[可选参数] 以下参数均为可选
 *		{
 *			limitRe : /a|b/,	//禁止输入的字符，用正则表达式表示，比如/a|b/表示限制输入字母a和b
 			doubleByte : true	//字符计算规则，默认为true表示中文算两字符长度，false表示中文算一个字符长度
 *		}
 * @example
	// 限制myinput文本框只能输入10字符，中文算2字符
	Utils.Form.inputListen($E("myinput"), 10);
	
	// 限制myinput文本框只能输入10字符，中文算1字符
	Utils.Form.inputListen($E("myinput"), 10, {
			doubleByte : false
		});

	// 限制myinput文本框只能输入10字符，中文算2字符且不允许输入字符a
	Utils.Form.inputListen($E("myinput"), 10, {
			limitRe : /a/,
			doubleByte : false
		});
	
	//错误的实例：
	Utils.Form.inputListen($E("myinput"), "abc");		//请不要把长度设置成非数字类型
	Utils.Form.inputListen($E("myinput"));			//请不要遗漏输入长度限制参数
 */
Utils.Form.inputListen = function(el, nLen, oOption){

		el = $E(el);
		if (typeof nLen != "undefined") {
			nLen = isNaN(nLen) ? null : nLen * 1;
		}
		// 如果必选参数不足或者参数el不是HTML节点，则返回
		if (el == null || nLen == null || el.nodeType != 1) {
			return false;
		}

		oOption = oOption || {};
		var limitRe = oOption.limitRe;
		var doubleByte = oOption.doubleByte;
		doubleByte = doubleByte == null ? true : doubleByte;
		
		var userinput = function(){
			var nLength = el.max;
			// 如果有受限字符，就替换掉
			while (limitRe != null && limitRe.test(el.value)) {
				el.value = el.value.replace(limitRe, "");
			}
			// 如果中文算双字节，就每次计算 maxLength
			if (doubleByte == true) {
				if (Core.String.byteLength(el.value) > nLength) {
					var str = el.value.substr(0, nLength);
					while (Core.String.byteLength(str) > nLength) {
						str = str.replace(/.$/, "");
					}
					el.value = str;
					el.maxLength = str.length;
				}
				else {
					el.maxLength = nLength - el.value.replace(/[\x00-\xff]/g, "").length;
				}
			}
			else {
				el.maxLength = nLength;
			}
			if(nLength < el.value){
					el.value = el.value.substr(0, nLength);
			}
		};
		// 文本框失去焦点的时候过滤受限字符
		var Blur = function(){
			if (limitRe != null && limitRe.test(el.value)) {
				el.value = el.value.replace(limitRe, "");
			}
		};
		
		// 用自定义属性来记录当前文本框允许输入的长度
		el.max = nLen;
		el.maxLength = nLen;
		userinput();
		// 如果被绑定过监听事件，就不再绑定
		if (el.beWatched == null) {
			el.beWatched = true;
			// 给对象绑定监听事件
			if ($MOZ) {
				Core.Events.addEvent(el, userinput, "input");
			}
			else {
				Core.Events.addEvent(el, userinput, "keyup");
				Core.Events.addEvent(el, userinput, "keypress");
				Core.Events.addEvent(el, userinput, "mouseout");
			}
			Core.Events.addEvent(el, Blur, "blur");
		}		
};