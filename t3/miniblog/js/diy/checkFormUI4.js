/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/builder.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/events/addEvent.js');

(function(proxy){
	var common = [{'tagName':'SPAN','attributes':{'class':'zhuolu_isnote','id':'box','style':'width: 170px; position: absolute; z-index: 251; top: 73px; left: 320px;'}}];
	var tips   = new App.Builder(common);
	tips.box = tips.domList['box'];
    tips.box.style.display = 'none';
    tips.box.style.position = 'absolute';
    tips.box.style.zIndex = 1251;
    var succHTML = '<span class="iswhat isok"><img class="tipicon tip3" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" alt="" title=""></span>';
    var errorHTML = '<span class="iswhat iserro"><img class="tipicon tip2" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" alt="" title="" /><em>${error}</em></span>';
    proxy.checkFormUI4 = function(key, noError, affect, errorPos){
        if (affect.errorKey && affect.errorKey !== key && noError) {
            return false;
        }
        else {
            try {
                if (noError) {
                    //正确提示
                    affect.errorKey = false;
                    errorPos.style.display = '';
                    errorPos.innerHTML = succHTML;
                    if (affect.value !== undefined && (!affect.value.length || affect.noRightIcon)) {
                        errorPos.style.display = 'none';
                        return false;
                    }
                }
                else {
                    //错误提示
                    affect.errorKey = key;
                    errorPos.style.display = ''
                    errorPos.innerHTML = errorHTML.replace('${error}',$SYSMSG[key]);
                }
            } 
            catch (exp) {
            }
        }
    };
    proxy.bindFormTips4 = function(els){
		document.body.appendChild(tips.box);
        for (var i = 0, len = els.length; i < len; i += 1) {
        
            (function(k){
                Core.Events.addEvent(els[k]['el'], function(){
					var posEl = els[k]['el'].parentNode;
					var pos = Core.Dom.getXY(posEl);
					if (!els[k]['el'].value.length && els[k]['key'] && $SYSMSG[els[k]['key']]) {
						tips.domList['box'].innerHTML = '<em>' + $SYSMSG[els[k]['key']] + '</em>';
						tips.box.style.top = (pos[1] + 10) + 'px';
						var posLeft = parseInt(posEl.getAttribute('positionLeft')) || ($IE?7:9);
						if (posLeft) {
							tips.box.style.left = pos[0] + posEl.offsetWidth + posLeft + 'px';
						}
						else {
							tips.box.style.left = pos[0] + posEl.offsetWidth + 'px';
						}
						tips.box.style.display = '';
						if(els[k]['errorPos']){
							els[k]['errorPos'].style.display='none';
						}
					}
                }, 'focus');
				Core.Events.addEvent(els[k]['el'],function(){
					tips.box.style.display = 'none';
                },'blur');
            })(i);
            
        }
    };
})(App);
