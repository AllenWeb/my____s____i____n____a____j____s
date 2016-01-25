$import("sina/sina.js");
$import("sina/app.js");


/**
 * 选择TextArea中的某段文字仅对IE有效
 * @param {HTMLElement} oElement 必选参数,TextArea对像
 * @param {Object}      pos      必选参数，选择起始位置
 * @param {Object}      len      必选参数，选择结束位置
 */

App.setCursor = function(oElement,pos,len){
	var range = oElement.createTextRange();
	range.collapse(true);
	range.moveStart('character',pos+1);
	range.moveEnd('character',len-2);
	range.select();
};


/**
 * 插入@及话题
 * @param {HTMLElement} oElement 必选参数,TextArea对像
 * @param {Object}      sValue   必选参数，插入@及话题的默认文字
 * @param {Function}    sValue   可选参数，焦点处理
 * @param {Boolean} allowRepeat  可选参数, 是否允许重复（默认不允许）
 */

App.insertTextArea = function(oElement, sValue, fFocus,allowRepeat){
	try{
		var fFocus = fFocus || function(){oElement.focus()};
		var textIndex = oElement.value.indexOf(sValue);
		//如果已插入话题或@则选中已插入内容
		if(!allowRepeat && textIndex != -1){
			fFocus();
			if($IE){
				App.setCursor(oElement,textIndex,sValue.length);
			}else{
				oElement.setSelectionRange(textIndex+1,textIndex + sValue.length - 1);
			}
			return false;
		}
		//在用户未插入话题时,在用户光标位置或选取区插入默认文本
		if ($IE) {
			try {
				if (oElement.createTextRange && oElement.caretPos) {
					
					var caretPos = oElement.caretPos;
					caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? sValue + ' ' : sValue;
				}
				else {
					oElement.value += sValue;
				}
				fFocus();
				App.setCursor(oElement,oElement.value.indexOf(sValue),sValue.length);
			}catch(exp){}
		} else {
			if (oElement.setSelectionRange) {
				var rangeStart = oElement.selectionStart;
				var rangeEnd = oElement.selectionEnd;
				var tempStr1 = oElement.value.substring(0, rangeStart);
				var tempStr2 = oElement.value.substring(rangeEnd);
				oElement.value = tempStr1 + sValue + tempStr2;
				//console.log(oElement.careSelectionStart,oElement.careSelectionStart + sValue.length);
				oElement.setSelectionRange(tempStr1.length+1,tempStr1.length + sValue.length - 1);
			}
			else {
				oElement.value += sValue;
			}
			fFocus();
		}
	}catch(exp){
		oElement.value += sValue;
		fFocus();
	}
};

