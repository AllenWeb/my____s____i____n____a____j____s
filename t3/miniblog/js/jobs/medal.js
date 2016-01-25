$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/system/winSize.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/dom/opacity.js');
$import("sina/core/string/decodeHTML.js");
$import("diy/smoothscroll.js");


$registJob('medal', function(){
    var box = $E('medal_box');
    if (box) {
        var listBox = $E('medal_list_box');
        var more = $E('medal_list_more');
        var items;
        var state = 'hidd';
        var setState = function(newState){
            if (newState === 'hidd') {
                more.className = 'popbtn_off';
            }
            if (newState === 'show') {
                more.className = 'popbtn_on';
            }
            state = newState;
        };
		//首页加载时要显示
        App.doRequest({pageid:scope.$pageid,uid:scope.$oid||''}, '/plugins/aj_medalmore.php', function(data, result){
            box.innerHTML = data;
			listBox = $E('medal_list_box');
			more = $E('medal_list_more');
            items = listBox.getElementsByTagName('LI');//重新去items
            loadMedal();
			initHover();
        }, function(){
        });
        var loadMedal = function(){
            if (items.length > 4) {
                Core.Events.addEvent(more, function(){
                    if (state === 'hidd') {
                        if (items.length > 5) {
                            for (var i = 0, len = items.length; i < len; i += 1) {
                                items[i].style.display = '';
                            }
                        }
                        setState('show');
                        return;
                    }
                    if (state === 'show') {
                        for (var i = 5, len = items.length; i < len; i += 1) {
                            items[i].style.display = 'none';
                        }
                        setState('hidd');
                        return;
                    }
                }, 'click');
                Core.Events.addEvent(box, function(){
                    //more.style.display = '';
                }, 'mouseover');
                Core.Events.addEvent(box, function(){
                    if (state === 'hidd') {
                        //more.style.display = 'none';
                    }
                }, 'mouseout');
            }
        }
    }
	var hover = function(spec){
		var delay = spec.delay || 100;
		var isover = spec.isover || false;
		var act = spec.act;
		var ext = spec.ext || [];
		var timer = null;
		var showAct = function(e) {
			if(isover) {
				spec['fun'].apply(spec.act,[isover]);
			}
		};
		var hiddAct = function(e) {
			if(!isover) {
				spec['fun'].apply(spec.act,[isover]);
			}
		};
		var hoverAct = function(e) {
			isover = true;
			if(timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function(){showAct(e);},delay);
		};
		var msoutAct = function(e) {
			isover = false;
			if(timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function(){hiddAct(e);},delay);
		};
		Core.Events.addEvent(act, hoverAct, 'mouseover');
		Core.Events.addEvent(act, msoutAct, 'mouseout');
		for(var i = 0, len = ext.length; i < len; i += 1) {
			Core.Events.addEvent(ext[i], hoverAct, 'mouseover');
			Core.Events.addEvent(ext[i], msoutAct, 'mouseout');
		};
	};
    var cardBox = $C('DIV');
	var bIframe = $C('IFRAME');
    var loaded = false;
    cardBox.className = 'PopLayer';
    cardBox.style.width = '332px';
    cardBox.style.zIndex = "1000";
    bIframe.style.zIndex = "800";
	bIframe.style.position = 'absolute';
	Core.Dom.opacity(bIframe,0);
    cardBox.innerHTML = '<table class="mBlogLayer">\
	   <tr>\
	      <td class="top_l"></td>\
	      <td class="top_c"></td>\
	      <td class="top_r"></td>\
	   </tr>\
	   <tr>\
	      <td class="mid_l"></td>\
	      <td class="mid_c"><div class="layerBox">\
	            <div class="layerBoxCon1" style="width:320px;">\
	               <div class="closecontain"><a class="close" href="javascript:void(0);" onclick="App.closeMedalCard();" style="visibility:hidden"></a></div>\
	               <div class="commonLayer3" id="medal_card_introduction">\
				   </div>\
	            </div>\
	         </div></td>\
	      <td class="mid_r"></td>\
	   </tr>\
	   <tr>\
	      <td class="bottom_l"></td>\
	      <td class="bottom_c"></td>\
	      <td class="bottom_r"></td>\
	   </tr>\
	</table>';
    /**
     * add by zhaobo 201010131455
     * 预加载loading图片。
     */
    (new Image()).src="http://timg.sjs.sinajs.cn/t3/style/images/common/loading.gif";
    App.medalCard = function(medalid, el, type){
		el = el.getElementsByTagName('A')[0];
        var pos = Core.Dom.getXY(el);
        var typeLeft = '<div class="honor1_ly">{content}</div>';
        var typeMidd = '<div class="honor_ly">{content}</div>';
        cardBox.style.display = '';
		bIframe.style.display = '';
        bIframe.style.left = cardBox.style.left = (pos[0] - (parseInt(cardBox.offsetWidth) - el.offsetWidth) / 2) + (type == 'left' ? 100 : 0) + 'px';
        bIframe.style.top = cardBox.style.top = pos[1] + el.offsetHeight + 5 + 'px';
        /**
         * add by zhaobo 201010131455 fix begin
         * loading结构html字符串  
         */
        var _loading_html_Str = '<div class="layerArrow"></div>\
              <div class="ldcontent">\
               	<p>'+$CLTMSG["ZB0005"]+'</p>\
              </div>\
              <div class="clearit"></div>';

		$E("medal_card_introduction").innerHTML = ((type == 'left') ? typeLeft.replace('{content}', _loading_html_Str) : typeMidd.replace('{content}', _loading_html_Str));
        bIframe.style.width = cardBox.offsetWidth + 'px';
        bIframe.style.height = cardBox.offsetHeight + 'px';
        /**
         * 201010131455 fix end
         */
        Utils.Io.Ajax.request('/plugins/aj_popmedal.php', {
            'GET': {
                /**
                 * add by zhaobo 201010131455 
                 * 增加pageid参数
                 */
                'pageid' : scope.$pageid,
                'medalid': medalid,
                'uid': scope.$oid
            },
            'onComplete': function(json){
                if (json.code === 'A00006') {
                    $E('medal_card_introduction').innerHTML = ((type == 'left') ? typeLeft.replace('{content}', json.data) : typeMidd.replace('{content}', json.data));
                    cardBox.style.display = '';
					//if(pos[1] + el.offsetHeight + cardBox.offsetHeight > (Core.System.winSize())['height'] + document.documentElement.scrollTop){
					//	try{
					//		scroller( cardBox,200,-1*((Core.System.winSize())['height'] - cardBox.offsetHeight) ,0,true,true);
					//	}catch(exp){
					//		
					//	}
					//	
					//}
					bIframe.style.width = cardBox.offsetWidth + 'px';
					bIframe.style.height = cardBox.offsetHeight + 'px';
                }
                else {
                    App.alert($SYSMSG[json['code']]);
                }
                
            },
            'onException': function(){
            },
            'returnType': 'json'
        });
        //if (!loaded) {
        //    setTimeout(function(){
        //        Core.Events.addEvent(document.body, App.closeMedalCard, 'click');
        //        Core.Events.addEvent($E('medal_card_introduction'), function(){
        //            Core.Events.stopEvent();
        //        }, 'click');
        //    }, 25);
        //    loaded = true;
        //}
    };
    App.closeMedalCard = function(){
        cardBox.style.display = 'none';
		bIframe.style.display = 'none';
		$E('medal_card_introduction').innerHTML = '';
    };
    
    App.medalNewClose = function(){
        var tips = $E('medal_new_tips');
        if (tips) {
            tips.style.display = 'none';
            Utils.Io.Ajax.request('/medal/aj_clean.php', {
                'POST': {},
                'onComplete': function(json){
                },
                'onException': function(){
                },
                'returnType': 'json'
            });
        }
    };
	var blist = [];
	var marking = null;
	cardBox.medaltype = null;
	var initHover = function(){
		if(listBox){
			blist = listBox.getElementsByTagName('LI');
		}
		if($E('medal_manage_box')){
			blist = $E('medal_manage_box').getElementsByTagName('LI');
		}
		try{
			for(var i = 0, len = blist.length; i < len; i += 1){
				(function(k){
					hover({
						'act' : blist[k],
						'ext' : [cardBox],
						'fun' : function(b){
							if(b){
								var type = blist[k].getAttribute('medaltype');
								if(cardBox.medaltype === null){
									App.medalCard(type,blist[k],'midd');
									cardBox.medaltype = type;
								}
							}else{
								App.closeMedalCard();
								cardBox.medaltype = null;
							}
						}
					});
				})(i);
			}
		}catch(e){
			
		}
		
	};
	if($E('medal_manage_box')){
		initHover();
	}
	document.body.appendChild(cardBox);
	document.body.appendChild(bIframe);
	App.closeMedalCard();
});

