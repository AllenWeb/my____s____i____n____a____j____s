/**
 * @author Robin Young | yonglin@staff.sina.com.cn
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
    var succHTML = '<span class="iswhat isok"><img class="tipicon tip3" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" alt="" title=""></span>';
    var errorHTML = '<span class="iswhat iserro"><img class="tipicon tip2" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" alt="" title=""><em></em></span>';
    proxy.checkFormUI3 = function(key, noError, affect, errorPos){
		if (affect.errorKey && affect.errorKey !== key && noError) {
            return false;
        }
        else {
            try {
                if (noError) {
                    //正确提示
                    if (!(affect.tagName == 'INPUT' && (affect.type == 'hidden'|| affect.getAttribute('type')=='hidden'))) {
//                        if (affect.tagName === 'SELECT' || affect.length || affect.type == 'checkbox' || affect.getAttribute('type') == 'checkbox') {
                            //affect.style.borderColor = '';
                            //affect.style.backgroundColor = '';
//                            if (affect.tagName === 'SELECT') {
//                                affect.parentNode.parentNode.className = "fakesel"
//                            }
//                        }
//                        else {
//                            affect.parentNode.parentNode.className = "jh_yanzheng"
                        //                      affect.style.borderColor = '#999 #c9c9c9 #c9c9c9 #999';
                        //                      affect.style.backgroundColor = '#FFFFFF';
    //                    }
                    }
                    affect.errorKey = false;
                    errorPos.style.display = '';
                    errorPos.innerHTML = succHTML;
                    //                  errorPos.className = 'cudTs4';
                    //errorPos.getElementsByTagName('SPAN')[0].innerHTML = ' ';
                    if (affect.value !== undefined && (!affect.value.length || affect.noRightIcon)) {
                        errorPos.style.display = 'none';
                        return false;
                    }
                }
                else {
                    //错误提示
//                    if (affect.tagName === 'SELECT' || affect.length || affect.type == 'checkbox' || affect.getAttribute('type') == 'checkbox') {
//                        //affect.style.borderColor = '';
//                        //affect.style.backgroundColor = '';
//                        if(affect.tagName === 'SELECT'){
//                            affect.parentNode.parentNode.className = "fakesel"
//                        }
//                    }
//                    else {
//                        affect.parentNode.parentNode.className = "jh_yanzheng"
//                        
//                        //                      affect.style.borderColor = '#FF0000';
//                        //                      affect.style.backgroundColor = '#FFCCCC';
//                    }
                    affect.errorKey = key;
                    errorPos.style.display = ''
                    errorPos.innerHTML = errorHTML;
                    //errorPos.className = 'cudTs3';
                    //chibin add 为邮箱注册单独处理逻辑
//                    if (key == "MR0001") {
//                        // if (scope.$inviteCode && scope.$inviteCode != '') {
//                        //     errorPos.getElementsByTagName('SPAN')[0].innerHTML = $CLTMSG['CL0401'] + "<a href=\"/reg_sinamail.php?inviteCode=" + scope.$inviteCode + "\">" + $CLTMSG['CL0402'] + "</a>";
//                        // }
//                        // else {
//                        //     errorPos.getElementsByTagName('SPAN')[0].innerHTML = $CLTMSG['CL0401'] + "<a href=\"/reg_sinamail.php\">" + $CLTMSG['CL0402'] + "</a>";
//                        // }
//                        errorPos.getElementsByTagName('SPAN')[0].innerHTML = $CLTMSG['CL0401'];
//                    }
//                    else {
                        errorPos.getElementsByTagName('EM')[0].innerHTML = $SYSMSG[key];
                    //}
                    
                }
            } 
            catch (exp) {
            }
        }
    };
    proxy.bindFormTips = function(els){
        document.body.appendChild(tips.box);
        for (var i = 0, len = els.length; i < len; i += 1) {
        
            (function(k){
                Core.Events.addEvent(els[k]['el'], function(){
                    //                    els[k]['el'].style.borderColor = '#A5C760';
                    //                    els[k]['el'].style.backgroundColor = '#F4FFD4';
                    //为注册页邮箱名称
                    //                  if(els[k]['key']=='MR0105'&&els[k]['el'].parentNode.parentNode.tagName=='DIV'){
                    //                      els[k]['el'].parentNode.className="inputhover"
                    //                  }
                    //                    els[k]['el'].parentNode.className="inputhover"
                    var posEl = els[k]['el'].parentNode;
//                    if(els[k]['el'].tagName=='SELECT'){
//                        posEl.className = "fakeselhover";
//                    }else{
//                        posEl.className = "jh_yanzhenghover"
//                    }
//                    if (scope.$pageid !== 'full_info1') {
                        var pos = Core.Dom.getXY(els[k]['el']);
                        if (!els[k]['el'].value.length && els[k]['key'] && $SYSMSG[els[k]['key']]) {
                            tips.domList['content'].innerHTML = $SYSMSG[els[k]['key']];
                            tips.box.style.top = (pos[1] + 0) + 'px';
                            var posLeft = parseInt(posEl.getAttribute('positionLeft'));
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
//                    }
                    //els[k]['error'].style.display="none"
                }, 'focus');
                Core.Events.addEvent(els[k]['el'],function(){
//                    if(els[k]['el'].tagName=='SELECT'){
//                        els[k]['el'].parentNode.parentNode.className = "fakesel";
//                    }else{
//                        els[k]['el'].parentNode.parentNode.className = "jh_yanzheng";
//                    }
                    tips.box.style.display = 'none';
                },'blur');
            })(i);
            
        }
    };
})(App);
