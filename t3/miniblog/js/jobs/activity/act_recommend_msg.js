/**
 * @author wangliang3@staff.sina.com.cn
 */
$import('diy/imgURL.js');

$registJob('actRecomMsg', function(){
    var items = {
        'editor': $E('publish_editor'),
        'imgtd': $E('publisher_preimage'),
        'imgname': $E('publisher_perch_name'),
        'perch': $E('publisher_perch'),
        'imgbtn': $E('publisher_image'),
        'loading': $E('publisher_image_loading'),
        'preview': $E('publisher_imgpreview')
    };
    
	//获取url的参数
    var getArgs = function(parstr){
        var args = {};
        var query = parstr.substring(1); 
        var pairs = query.split("&"); 
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); 
            if (pos == -1) 
                continue; 
            var argname = pairs[i].substring(0, pos); 
            var value = pairs[i].substring(pos + 1); 
            value = decodeURIComponent(value); 
            args[argname] = value; 
        }
        return args; 
    };
    
    if (scope.$pid && scope.$pid != '') {
		items['perch'].style.display = '';
        items['preview'].style.display = '';
        items['imgbtn'].style.display = 'none';
        items['loading'].style.display = 'none';
		items['imgname'].innerHTML = getArgs(window.location.search)['pname'];
		items['editor'].value = scope.$content;
        items['imgtd'].innerHTML = '<img src="' + App.imgURL(scope.$pid, 'small') + '" />';
		
    }
});
