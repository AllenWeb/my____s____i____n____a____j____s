/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('diy/dom.js');
$import('diy/tabs.js');
$import('diy/publisher.js');
$import('diy/publisher_image.js');
$import('diy/publisher_topic.js');
$import('diy/publisher_video.js');
$import('diy/publisher_music.js');
$import('diy/publisher_face.js');
//$import('diy/publisher_vote.js');
//$import('diy.rollOut');
$import("diy/Wipe.js");
$import("diy/TextareaUtils.js");

$registJob('publisher3', function(){
	var _addFeed = function(feedStr, extinfo){
		if($E('emptydata_msg')){
			$E('emptydata_msg').style.display = 'none';
		}
		
		var feedList = $E('feed_list');
		if (feedList&&feedStr!=null) {
			if (App.refurbishUpdate) {
			    App.refurbishUpdate.add(1);
			}
			var ul = $C("ul"), li, fstc = feedList.getElementsByTagName('li')[0];
			ul.className = "MIB_feed";
			with(ul.style){
				overflow = "hidden";
				visibility = "hidden";
				position = "relative";
				clear = "both";
				height = "0px";
			}
			ul.innerHTML = feedStr;
			feedList.parentNode.insertBefore(ul, feedList);
			li = ul.getElementsByTagName("li")[0];
			li && (li.style[$IE? "styleFloat": "cssFloat"] = "left");
			try{
				App.bindMedia(ul);
			}catch(e){}
			setTimeout(function(){
				App.Wipe(ul, li).wipe("down",false, function(){
					if(scope.$eid){
						var betops = App.Dom.getByClass('betop','img',feedList);
						var len = betops.length;
						if(len>0){
							var tmp = betops[len-1];
							while(!App.Dom.hasClass(tmp,'MIB_linedot_l')){
								tmp = tmp.parentNode;
							}
							fstc = tmp.nextSibling;
						}
					}
					feedList.insertBefore(li, fstc);
					ul.parentNode.removeChild(ul);
					li.style.cssText = "";
				}, true);
			},1500)
		}
    };
	var pub = App.miniblogPublisher({
		'editor'	: $E('publish_editor'),
		'submit'	: $E('publisher_submit'),
		'info'		: $E('publisher_info')
	},{
		'init' : function(pub){
			//首页刷新发布器获得焦点功能，改善用户体验取消
			//App.TextareaUtils.setCursor($E('publish_editor'));
		    if(scope.$no_cookie_cache){
		        return false;
		    }
			//预设发布器的初始值
			if(scope.$eid){//区分活动页面，如果是活动页面发布器不获得焦点及缓存光标位置
				return false;
			}
			return true;
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
				var _src = 'src="'+ scope.$BASECSS + 'style/images/common/transparent.gif" ';
				var _num = $CLTMSG['CD0072'].replace(/#\{len\}/,(140 - len) * (-1));
				$E('publisher_info').innerHTML = '<div class="word_c"><img '+_src+' title="" alt="" class="tipicon tip2">'+_num+'</div><b class="rcorner"></b>';
            }
		},
		'onSuccess'	: function(json,params){
			$E('publish_editor').parentNode.className = 'inputsuccess';
			$E('publish_editor').style.display = 'none';
			setTimeout(function(){
			$E('publish_editor').parentNode.className = 'inputarea';
				$E('publish_editor').style.display = '';
				$E('publish_editor').focus();
			}, 1000);
			
			//自定义回调
			if(typeof scope.$publishCallback === "function"){
			    try{
			        scope.$publishCallback(json,params);
			    }catch(e){}
			}
			
			if (scope['$feedtype'] === 'ispic' && !params.pic) {
				return false;
			}
			if (scope['$feedtype'] === 'islink' && json.islink != 1) {
				return false;
			}
			if (scope['$feedtype'] === 'isrt') {
				return false;
			}
			if (scope['$feedtype'] === 'favorite') {
				return false;
			}
			if (scope['$feedtype'] === 'isat') {
				if (scope.$uname) {
				    if (!(new RegExp('(@|＠)' + scope.$uname + '([^a-zA-Z0-9\u4e00-\u9fa5_]|$)')).test(params.content)) {
				        return false;
				    }
				}
			}
			
			//写入页面
			setTimeout(function(){
				_addFeed(json['html'], json['extinfo']);
            }, 10);
		},
		'onError'	: function(){},
		'limitNum'	: 140,
		'emptyStr'	: ['#请在这里输入自定义话题#'],
		'topic'		: '',
		'styleId'	: scope.styleid
		
	}).plugin(App.miniblogPublisherImage({
		'button'	: $E('publisher_image')
	})).plugin(App.miniblogPublisherTopic({
		'button'	: $E('publisher_topic')
		
	})).plugin(App.miniblogPublisherVideo({
		'button'	: $E('publisher_video')
		
	})).plugin(App.miniblogPublisherMusic({
		'button'	: $E('publisher_music')
		
	})).plugin(App.miniblogPublisherFace({
		'button'	: $E('publisher_faces')
		
	}));
	/*.plugin(App.miniblogPublisherVote({
		'button'	: $E('publisher_vote')
		
	}));*/
});