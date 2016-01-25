/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/builder.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/events/addEvent.js');

(function(proxy){
//	var common = [
//		{'tagName':'DIV', 'attributes':{'class':'co_k_t'}},
//		{'tagName':'DIV', 'attributes':{'class':'co_k_m'},'childList':[
//			{'tagName':'DIV','attributes':{'class':'co_conn','id':'content'}}
//		]},
//		{'tagName':'DIV', 'attributes':{'class':'co_k_b'}}
//	];
	var common = [{'tagName':'TABLE', 'attributes':{'class':'cudTs','id':'box','style':'width:270px'},'childList':[
		{'tagName':'TBODY', 'attributes':{},'childList':[
			{'tagName':'TR', 'attributes':{},'childList':[
				{'tagName':'TD', 'attributes':{'class':'topL'}},
				{'tagName':'TD', 'attributes':{}},
				{'tagName':'TD', 'attributes':{'class':'topR'}}
			]},
			{'tagName':'TR', 'attributes':{},'childList':[
				{'tagName':'TD', 'attributes':{}},
				{'tagName':'TD', 'attributes':{'class':'tdCon','id':'content'}},
				{'tagName':'TD', 'attributes':{}}
			]},
			{'tagName':'TR', 'attributes':{},'childList':[
				{'tagName':'TD', 'attributes':{'class':'botL'}},
				{'tagName':'TD', 'attributes':{}},
				{'tagName':'TD', 'attributes':{'class':'botR'}}
			]}
		]}
	]}];
	var tips	= new App.Builder(common);
	tips.box = tips.domList['box'];
	tips.box.style.display = 'none';
	tips.box.style.position = 'absolute';
	tips.box.style.zIndex = 251;
	proxy.checkFormUI = function(key,noError,affect,errorPos){
		if(affect.errorKey && affect.errorKey !== key && noError){
			return false;
		}else{	
			try {
				if (noError) {
					if (affect.tagName === 'SELECT' || affect.length || affect.type == 'checkbox' || affect.getAttribute('type') == 'checkbox') {
						//affect.style.borderColor = '';
						//affect.style.backgroundColor = '';
					}
					else {
						affect.style.borderColor = '#999 #c9c9c9 #c9c9c9 #999';
						affect.style.backgroundColor = '#FFFFFF';
					}
					affect.errorKey = false;
					errorPos.style.display = '';
					errorPos.className = 'cudTs4';
					errorPos.getElementsByTagName('TD')[4].innerHTML = ' ';
					if (affect.value !== undefined && (!affect.value.length || affect.noRightIcon)) {
						errorPos.style.display = 'none';
						return false;
					}
				}
				else {
					if (affect.tagName === 'SELECT' || affect.length || affect.type == 'checkbox' || affect.getAttribute('type') == 'checkbox') {
						//affect.style.borderColor = '';
						//affect.style.backgroundColor = '';
					}
					else {
						affect.style.borderColor = '#FF0000';
						affect.style.backgroundColor = '#FFCCCC';
					}
					affect.errorKey = key;
					errorPos.style.display = '';
					errorPos.className = 'cudTs3';
					//chibin add 为邮箱注册单独处理逻辑
					if(key=="MR0001"){
						if(scope.$inviteCode && scope.$inviteCode !=''){
							errorPos.getElementsByTagName('TD')[4].innerHTML = $CLTMSG['CL0401']+"<a href=\"/reg_sinamail.php?inviteCode="+scope.$inviteCode+"\">"+$CLTMSG['CL0402']+"</a>";
						}
						else{
							errorPos.getElementsByTagName('TD')[4].innerHTML =$CLTMSG['CL0401']+"<a href=\"/reg_sinamail.php\">"+$CLTMSG['CL0402']+"</a>";
						}
						
					}else{
						errorPos.getElementsByTagName('TD')[4].innerHTML = $SYSMSG[key];	
					}
					
				}
			}catch(exp){}
		}
	};
	proxy.bindFormTips = function(els){
		document.body.appendChild(tips.box);
		for(var i = 0, len = els.length; i < len; i+=1){
			(function(k){
				Core.Events.addEvent(els[k]['el'],function(){
					var pos = Core.Dom.getXY(els[k]['el']);
					if ((!els[k]['el'].value.length || (typeof els[k]['default-fun']==='function')&&els[k]['default-fun'](els[k]['el'])) && els[k]['key'] && $SYSMSG[els[k]['key']]) {
						tips.domList['content'].innerHTML = $SYSMSG[els[k]['key']];
						tips.box.style.top = (pos[1] + 0) + 'px';
						if(els[k]['el'].getAttribute('positionleft')){
							tips.box.style.left = (pos[0] + els[k]['el'].offsetWidth + els[k]['el'].getAttribute('positionleft')*1) + 'px';
						}else{
							tips.box.style.left = pos[0] + els[k]['el'].offsetWidth + 'px';
						}
						tips.box.style.display = '';
					}
					els[k]['el'].style.borderColor = '#A5C760';
					els[k]['el'].style.backgroundColor = '#F4FFD4';
				},'focus');
				Core.Events.addEvent(els[k]['el'],function(){
					tips.box.style.display = 'none';
				},'blur');
			})(i);
		}
		return tips;
	};
})(App);
