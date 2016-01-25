/**
 * @desc 微博工具绑定成功页的发布器，只有表情功能
 * @author dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import('diy/publisher.js');
$import('diy/publisher_face.js');
$registJob('bind_publisher', function(){
	var pub = App.miniblogPublisher({
		'editor'	: $E('publish_editor'),
		'submit'	: $E('publisher_submit'),
		'info'		: $E('publisher_info')
	},{
		'onDisable'	: function(){
			$E('publisher_submit').parentNode.className = 'postBtnBg bgColorA_No';
		},
		'onEnable'	: function(){
			$E('publisher_submit').parentNode.className = 'postBtnBg';
		},
		'onLimit'	: function(len){
			if (len >= 0 && len <= 140) {
				$E('publisher_info').className = 'wordNumBg';
				$E('publisher_info').innerHTML = $CLTMSG['CD0071'].replace(/#\{cls\}/,"pipsLim").replace(/#\{len\}/,140 - len);
            } else {
				$E('publisher_info').className = 'wordNumBg error';
				var _src = 'src="'+ scope.$BASECSS  + 'style/images/common/transparent.gif" ';
				var _num = $CLTMSG['CD0072'].replace(/#\{len\}/,(140 - len) * (-1));
				$E('publisher_info').innerHTML = '<div class="word_c"><img '+_src+' title="" alt="" class="tipicon tip2">'+_num+'</div><b class="rcorner"></b>';
            }
		},
		'onSuccess'	: function(json,params){
			//TODO 发布成功之后
			$E('publish_editor').style.display = 'none';
			$E('publish_cover').style.display = '';
		},
		'onError'	: function(){},
		'limitNum'	: 140,
		'emptyStr'	: ['#请在这里输入自定义话题#'],
		'topic'		: '',
		'styleId'	: scope.styleid
	}).plugin(App.miniblogPublisherFace({
		'button'	: $E('publisher_faces')		
	}));
	
	//$E('publish_editor').value = $E('publish_editor').value;
});