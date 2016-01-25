/**
 * @author chibin
 */
$import('sina/core/dom/getElementsByClass.js');
App.changehelp = function(index){
	if(!$E('helpTabs')){
		return false;
	}
	!App.helpIndex&&(function(){App.helpIndex=1;})()
	if(App.helpIndex==index){
		return false;
	}
	App.helpIndex = index;
	var ul = $E('helpTabs');
	var lis = ul.getElementsByTagName('LI');
	var contain = $E('helpContainer');
	var helps = Core.Dom.getElementsByClass(contain,'div','noviceB');
	for(var i = 0,len = lis.length;i<len;i++){
		if(i+1 == index){
			lis[i].className = 'PY_tago';
			helps[i].style.display='';
			continue;
		}
		lis[i].className = 'PY_tagn';
		helps[i].style.display='none';
	}
}
