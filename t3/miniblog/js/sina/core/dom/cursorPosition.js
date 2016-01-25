/**
 * @id Core.Dom.cursorPosition
 * @fileoverview
 *	取得光标所在位置
 * @param {Object|String} textBox 	TEXTAREA对象或者它的ID
 * @return {Object} 返回的光标位置
 * 		start	起始位置
 * 		end		结束位置
 * @example
	// textarea1 是对象的 ID
	Core.Dom.cursorPosition($E("textarea1")); 	//return {"start" : 0, "end" : 0, "item" : [0, 0]}
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-18
 */
Core.Dom.cursorPosition = function (textBox) {
	textBox = $E(textBox);
    var start = 0, end = 0;
    //如果是Firefox(1.5)的话，方法很简单
    if(typeof(textBox.selectionStart) == "number"){
        start = textBox.selectionStart;
        end = textBox.selectionEnd;
    }
    //下面是IE(6.0)的方法，麻烦得很，还要计算上'\n'
    else if(document.selection) {
        var range = document.selection.createRange();
        if(range.parentElement().id == textBox.id) {
            // create a selection of the whole textarea
            var range_all = document.body.createTextRange();
            range_all.moveToElementText(textBox);
            //两个range，一个是已经选择的text(range)，一个是整个textarea(range_all)
            //range_all.compareEndPoints()比较两个端点，如果range_all比range更往左(further to the left)，则               
            //返回小于0的值，则range_all往右移一点，直到两个range的start相同。
            // calculate selection start point by moving beginning of range_all to beginning of range
            for (start = 0; range_all.compareEndPoints("StartToStart", range) < 0; start++) {
				range_all.moveStart('character', 1);
			}
            // get number of line breaks from textarea start to selection start and add them to start
            // 计算一下\n
            for (var i = 0; i <= start; i ++) {
                if (textBox.value.charAt(i) == '\n') {
					start++;
				}
            }
            // create a selection of the whole textarea
            range_all = document.body.createTextRange();
            range_all.moveToElementText(textBox);
            // calculate selection end point by moving beginning of range_all to end of range
            for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end ++) {
                range_all.moveStart('character', 1);
            }
            // get number of line breaks from textarea start to selection end and add them to end
            for (var j = 0; j <= end; j ++) {
                if (textBox.value.charAt(j) == '\n') {
					end++;
				}
            }
        }
    }
    //return [start, end]; // 包括选中区域的起始位置
    // modified to return as Object
    return {"start": start, "end": end, "item": [start, end]};
};