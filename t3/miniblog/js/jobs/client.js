/**
 * @author chibin
 *
 * 手机客户端版
 *
 */
$registJob('client', function(){
    var index = 3;
    var seperatorLocation = document.location.hash.indexOf('#');
    if (seperatorLocation != -1) {
        index = document.location.hash.substr(seperatorLocation + 1);
    }
    if (index > 2) {
        index = index - 2;
    }
    else 
        if (index < 3) {
            index = index - 0 + 2;
        }
    App.HoverLi(index);
});
App.HoverLi = function(n){
    //如果有N个标签,就将i<=N;
    //本功能非常OK,兼容IE7,FF,IE6
    //alert(n);
	try {
		for (var i = 1; i <= 4; i++) {
			$E('tb_' + i).className = 'normaltab';
			$E('tbc_0' + i).className = 'undis';
			
//			$E('tb_' + i).style.backgroundImage = 'url(http://i0.sinaimg.cn/dy/wbkhd/images7/img_' + i + '_' + '1.gif)';
		}
		$E('tbc_0' + n).className = 'dis';
		$E('tb_' + n).className = 'hovertab';
//		$E('tb_' + n).style.backgroundImage = 'url(http://i0.sinaimg.cn/dy/wbkhd/images7/img_' + n + '_' + '0.gif)';
	}catch(e){}
};

