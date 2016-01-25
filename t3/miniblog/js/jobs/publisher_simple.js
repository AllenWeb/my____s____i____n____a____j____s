/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('diy/dom.js');
$import('diy/tabs.js');
$import('diy/publisher.js');
$import('diy/publisher_image.js');
$import('diy/publisher_face.js');

//该job仅限用于简单的信息发布及跳转页或dialog的发布器使用，去出feed假查操作
$registJob('publisher_simple', function(){
	
	var defValue = scope.$content;
	
	var pub = App.miniblogPublisher({
		'editor'	: $E('publish_editor'),
		'submit'	: $E('publisher_submit'),
		'info'		: $E('publisher_info')
	},{
		'init' : function(pub){
			//预设发布器的初始值
			if(scope.$pid){
				pub.set('pic',[scope.$pid]);
			}
			pub.elements['editor'].value = scope.$content;
			
			return false;
		},
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
				var _src = 'src="'+ scope.$BASECSS + '/style/images/common/transparent.gif" ';
				var _num = $CLTMSG['CD0072'].replace(/#\{len\}/,(140 - len) * (-1));
				$E('publisher_info').innerHTML = '<div class="word_c"><img '+_src+' title="" alt="" class="tipicon tip2">'+_num+'</div><b class="rcorner"></b>';
            }
		},
		'onSuccess'	: function(json,params){
			$E('publish_editor').parentNode.className = 'inputsuccess';
			$E('publish_editor').style.display = 'none';
//			setTimeout(function(){
//			$E('publish_editor').parentNode.className = 'inputarea';
//				$E('publish_editor').style.display = '';
//				$E('publish_editor').focus();
//			}, 1000);
			//发布成功后操作
			setTimeout(function(){
				window.location.replace(scope.$href);
            }, 1000);
		},
		'onError'	: function(){},
		'limitNum'	: 140,
		'emptyStr'	: ['#请在这里输入自定义话题#'],
		'topic'		: '',
		'styleId'	: scope.styleid
	}).plugin(App.miniblogPublisherImage({
		'button'	: $E('publisher_image'),
		'form'		: $E('publisher_image_form'),
		'perch'		: $E('publisher_perch'),
		'file'		: $E('publisher_file'),
		'fname'		: $E('publisher_perch_name'),
		'del'		: $E('publisher_perch_delete'),
		'loading'	: $E('publisher_image_loading'),
		'preImage'	: $E('publisher_preimage'),
		'preBox'	: $E('publisher_imgpreview')
		
	})).plugin(App.miniblogPublisherFace({
		'button'	: $E('publisher_faces')
	}));
});

/*该job仅限用于简单的信息发布及跳转页或dialog的发布器使用，去出feed假查操作，并且不包含图片的处理
 * 
 * chibin add  
 * 请在注释中写明对应的模块及引用的conf文件，如有改动，需注意连带的模块影响
 * 1、tools_share_link.dev.js “工具”->“我的图标”，用于开心网、139邮箱绑定,增加特殊onsuccess的处理
 * 
 */

$registJob('publisher_simple1', function(){
    
    var defValue = scope.$content;
    //发布框都没有，那就滚好了
    if(!$E('publish_editor')){
        return false;
    }
    var pub = App.miniblogPublisher({
        'editor'    : $E('publish_editor'),
        'submit'    : $E('publisher_submit'),
        'info'      : $E('publisher_info')
    },{
        'init' : function(pub){
			if(scope.$norecover){ //如果一开始不需要对textarea进行recover操作，则php设置scope.$norecover = true;
                return false;
            }
            //预设发布器的初始值
            if(scope.$pid){
                pub.set('pic',[scope.$pid]);
            }
			if (scope.$content) {
				pub.elements['editor'].value = scope.$content;
			}
            
            return false;
        },
        'onDisable' : function(){
            $E('publisher_submit').parentNode.className = 'postBtnBg bgColorA_No';
        },
        'onEnable'  : function(){
            $E('publisher_submit').parentNode.className = 'postBtnBg';
        },
        'onLimit'   : function(len){
            if (len >= 0 && len <= 140) {
                $E('publisher_info').className = 'wordNumBg';
                $E('publisher_info').innerHTML = $CLTMSG['CD0071'].replace(/#\{cls\}/,"pipsLim").replace(/#\{len\}/,140 - len);
            } else {
                $E('publisher_info').className = 'wordNumBg error';
                var _src = 'src="'+ scope.$BASECSS + '/style/images/common/transparent.gif" ';
                var _num = $CLTMSG['CD0072'].replace(/#\{len\}/,(140 - len) * (-1));
                $E('publisher_info').innerHTML = '<div class="word_c"><img '+_src+' title="" alt="" class="tipicon tip2">'+_num+'</div><b class="rcorner"></b>';
            }
        },
        'onSuccess' : function(json,params){
			try {
				/*
				 * chibin add 绑定开心网等应用单独处理
				 */
				if (scope.$pageid === 'tools_share_link') {
					$E('publish_editor').style.display = 'none';
					$E('publish_cover').style.display = "";
					return false;
				}
				
				
				$E('publish_editor').parentNode.className = 'inputsuccess';
				$E('publish_editor').style.display = 'none';
				//          setTimeout(function(){
				//          $E('publish_editor').parentNode.className = 'inputarea';
				//              $E('publish_editor').style.display = '';
				//              $E('publish_editor').focus();
				//          }, 1000);
				//发布成功后操作
				setTimeout(function(){
					window.location.replace(scope.$href);
				}, 1000);
			}catch(e){}
        },
        'onError'   : function(){},
        'limitNum'  : 140,
        'emptyStr'  : ['#请在这里输入自定义话题#'],
        'topic'     : '',
        'styleId'   : scope.styleid
    }).plugin(App.miniblogPublisherFace({
        'button'    : $E('publisher_faces')
    }));
});