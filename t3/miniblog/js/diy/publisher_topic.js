/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("diy/TextareaUtils.js");

(function(proxy){
	proxy.miniblogPublisherTopic = function(spec){
		var that = {};
		
		var setSelectTxt = function(input,hasSel,value,insertText){
			
			var cstar = input.value.split(value)[0].length;
			cstar = cstar==''?1:cstar+1;
			if (hasSel) {
				App.TextareaUtils.setCursor(input,cstar,insertText.length);
			}else{
				cstar += value.length - 1;
				App.TextareaUtils.setCursor(input,cstar);
			}
			
		};
		
		that.init = function(owner){
			Core.Events.addEvent(spec['button'], function(){
				//check user islogin
                if (!owner.checkLogin(arguments)) {
                    return;
                };
				var input = owner.getDom('editor');
				var defValue = '#' + $CLTMSG['CX0119'] + '#';
				var insertText = App.TextareaUtils.getSelectedText(input);
				var isSelectText = (insertText == '' || insertText == $CLTMSG['CX0119']);
				if(isSelectText){
					insertText = $CLTMSG['CX0119'];
				}else {
					defValue = '#' + insertText + '#';
				}
				if(input.value.indexOf(defValue)<0){
					owner.insertText(defValue,function(pub){
						setSelectTxt(input,isSelectText,defValue,insertText);
					});
				}
				setSelectTxt(input,isSelectText,defValue,insertText);
			}, 'click');
		};
		that.clear = function(){};
		return that;
	};
})(App);
