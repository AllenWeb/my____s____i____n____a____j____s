/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/builder.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/events/addEvent.js');

(function(proxy){
    var common = [
        {'tagName':'SPAN','attributes':{'class':'zhuolu_isnote','id':'box'},'childList':[
        {'tagName':'EM', 'attributes':{'id':'content'}}]}];
    var tips   = new App.Builder(common);
    tips.box = tips.domList['box'];
    tips.box.style.display = 'none';
    tips.box.style.position = 'absolute';
    tips.box.style.zIndex = 251;
    var succHTML = '<img class="tipicon tip3" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" alt="" title="">';
    var errorHTML = '<img class="tipicon tip2" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" alt="" title=""><em></em>';
    proxy.checkFormUI_unlogin = function(key, noError, affect, errorPos){
        if (affect.errorKey && affect.errorKey !== key && noError) {
            return false;
        }
        else {
            try {
                if (noError) {
                    //正确提示
                    if (!(affect.tagName == 'INPUT' && (affect.type == 'hidden'|| affect.getAttribute('type')=='hidden'))) {
						
					}
                    affect.errorKey = false;
                    errorPos.style.display = '';
                    errorPos.innerHTML = succHTML;
                    if (affect.value !== undefined && (!affect.value.length || affect.noRightIcon)) {
                        errorPos.style.display = 'none';
                        return false;
                    }
					errorPos.className = 'isok';
                }
                else {
                    affect.errorKey = key;
                    errorPos.style.display = ''
                    errorPos.innerHTML = errorHTML;
                    errorPos.getElementsByTagName('EM')[0].innerHTML = $SYSMSG[key];
					errorPos.className = 'iswhat iserro';
                    
                }
            } 
            catch (exp) {
            }
        }
    };
    proxy.bindFormTips_unlogin = function(els){
        document.body.appendChild(tips.box);
        for (var i = 0, len = els.length; i < len; i += 1) {
        
            (function(k){
                Core.Events.addEvent(els[k]['el'], function(){
                    setTimeout(function(){
						var posEl = els[k]['el'];
	                    var pos = Core.Dom.getXY(posEl);
	                    if (!els[k]['el'].value.length && els[k]['key'] && $SYSMSG[els[k]['key']]) {
	                        tips.domList['content'].innerHTML = $SYSMSG[els[k]['key']];
	                        var posLeft = 260;
							var posTop = $IE ? 0 : (els[k]['key'] == 'MR0003') ? 0 : (($E('red_reg_username').style.display == 'none') ? 30 : 55);
	                        tips.box.style.left = pos[0]  - posLeft + 'px';
	                        tips.box.style.top = pos[1] + posTop + 'px';
	                        tips.box.style.display = '';
	                        /*if(els[k]['errorPos']){
	                            els[k]['errorPos'].style.display='none';
	                        }*/
	                    }
					},10);
                }, 'focus');
                Core.Events.addEvent(els[k]['el'],function(){
                    tips.box.style.display = 'none';
                },'blur');
            })(i);
            
        }
    };
})(App);
