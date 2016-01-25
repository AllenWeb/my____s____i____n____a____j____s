/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import('diy/tabs.js');
$import('diy/publisher2.js');
$import('diy/publisher_image.js');
$import('diy/publisher_topic.js');
$import('diy/publisher_video.js');
$import('diy/publisher_music.js');
$import('diy/publisher_face.js');
$import('sina/core/dom/insertHTML.js');
$import("sina/core/dom/getElementsByClass.js");
$import("diy/forbidrefresh_dialog.js");

$registJob('publisher2', function(){
	try{
		var pub = App.miniblogPublisher({
			'editor'	: $E('publish_editor'),
			'submit'	: $E('publisher_submit'),
			'info'		: $E('publisher_info')
		},{
			'onDisable'	: function(){
				$E('publisher_submit').getElementsByTagName('IMG')[0].className = 'submit_notclick';
			},
			'onEnable'	: function(){
				$E('publisher_submit').getElementsByTagName('IMG')[0].className = 'submit';
			},
			'onLimit'	: function(len){
				if (len >= 0 && len <= 140) {
					$E('publisher_info').innerHTML = $CLTMSG['CD0071'].replace(/#\{cls\}/,"pipsLim").replace(/#\{len\}/,140 - len);
	            } else {
					$E('publisher_info').innerHTML = $CLTMSG['CD0159'].replace(/#\{cls\}/,"pipsLim").replace(/#\{style\}/,"color:#FF3300").replace(/#\{len\}/,(140 - len) * (-1));
	            }
			},
			'onSuccess'	: function(json,params){
				$E('publish_editor').style.display = 'none';
				$E('publish_success').style.display = '';
				setTimeout(function(){
					$E('publish_editor').style.display = '';
					$E('publish_success').style.display = 'none';
				}, 2000);
				
				//数据假写
				var _write2page = function(feedStr, extinfo){
					if ($E('feed_list')) {
						if (App.refurbishUpdate) {
							App.refurbishUpdate.add(1);
						}
						var feedBox = document.createElement('UL');
						$E('feed_list').parentNode.insertBefore(feedBox, $E('feed_list'));
						feedBox.innerHTML = feedStr;
						$E('feed_list').insertBefore((feedBox.getElementsByTagName('LI'))[0], ($E('feed_list').getElementsByTagName('LI'))[0]);
						feedBox.parentNode.removeChild(feedBox);
						// 对内容作展示和绑定
						try{
							App.bindMedia(($E('feed_list').getElementsByTagName('LI'))[0]);
						}catch(e){
							//console.log(e);
						}
					}
				};
				
				//假写到页面
				_write2page(json['html'], json['extinfo']);
			},
			'onError'	: function(){},
			'limitNum'	: 140,
			'emptyStr'	: ['#'+ $CLTMSG['CD0069'] +'#'],
			'topic'		: (decodeURIComponent(scope.$search).split('~'))[0],
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
		
		var handler = {
			searchInputFocus : function(){//set search input focus
				var input = null,
					panel = null,
					nPanel = $E('normal_search');
					aPanel = $E('tig_adv_search');
					
				if(nPanel.style.display == 'block'){
					panel = nPanel;
				}else if(aPanel.style.display == 'block'){
					panel = aPanel;
				}
				input = Core.Dom.getElementsByClass(panel,'input','inputTxtE')[0];
				App.TextareaUtils.setCursor(input);
			},
			cashCur : function(){//cash publish cursor
				var panel = $E('editor_panel');
				if(panel.style.display == 'none'){return;}
				var textarea = $E('publish_editor');
				App.TextareaUtils.setCursor(textarea);
				var selValue = App.TextareaUtils.getSelectedText(textarea);
				var slen = (selValue == '' || selValue == null) ? 0 : selValue.length;
				var start = App.TextareaUtils.getCursorPos(textarea);
				
				var curStr = start + '&' + slen;
				textarea.setAttribute('range',curStr);
			}
		}
		
		var tabs = App.tabs({
			data : [
				{'tab':$E('search_tab'),'panel':$E('search_panel')},
				{'tab':$E('editor_tab'),'panel':$E('editor_panel')}
			],
			'current' : 0,
			'lightAction' : function(item,index){
				item.tab.parentNode.parentNode.className = 'cur';
				item.panel.style.display = '';
				try {
					handler.cashCur();
					handler.searchInputFocus();
				}catch(e){
					
				}
			},
			'darkAction' : function(item,index){
				item.tab.parentNode.parentNode.className = '';
				item.panel.style.display = 'none';
				if(scope.$extdialog){
					scope.$extdialog.close();
				}
			}
		});
		var img = $E('publisher_submit').getElementsByTagName('IMG')[0];
		if(img){
			img.className = 'submit';
		}
		scope.iWantToSay = function(){
			tabs.fire(1);
//			$E('publish_editor').focus();
			App.TextareaUtils.setCursor($E('publish_editor'));
		};
	}catch(exp){}
	
	
});
