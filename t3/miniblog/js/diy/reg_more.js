/**
 * @author chibin
 * 
 * 二次注册页查看更多
 * 
 */

scope.reg_more = function(el,id){
	var hidd = $E(id);
	var btn = el
	if(!hidd) return false;
	var url = '/person/aj_change_catlist.php';
	if (hidd.style.display == "none") {
		//要显示
		hidd.style.display = ''
		btn.className='off'
		btn.innerHTML = $CLTMSG['CC4002']
	}
	else {
		//要隐藏
		hidd.style.display = "none";
		btn.className='on';
		btn.innerHTML = $CLTMSG['CC4001']
	}
	var type = hidd.style.display == "none"?'close':'open';
	Utils.Io.Ajax.request(url, {
                'GET': {type:type},
                'onComplete': function(json){
                },
                'onException': function(){
                },
                'returnType': 'json'
            });
};
