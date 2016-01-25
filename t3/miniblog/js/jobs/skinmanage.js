/*
* @author Pjan | peijian@staff.sina.com.cn
* @title 换肤功能
*/
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/dom/getXY.js");
$import("diy/swfobject.js");
$import("diy/builder.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/removeNode.js");
$import("sina/utils/io/ajax.js");
$import("diy/mb_dialog.js");
$import("diy/imgURL.js");
$import("diy/pub_sub.js");
$import("sina/core/dom/contains.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fireEvent.js");
$import("jobs/publisher_dialog.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/system/pageSize.js");

/*
 * 建立skin manage程序
 */
App.skinManage = {};

/*
 * @title 颜色选择器对象列表
 * @remark 由于这里只需要每次出现一个颜色选择器，那么
 */
App.skinManage.colorPicker;
/*
 * dom创建的内容列表
 */
App.skinManage.customDom = {};
/*
 * 颜色管理
 */
App.skinManage.skinList = {};

/*
 * 最终提交皮肤的数据
 */
scope.postSkinId = 1; //这个是模板提交

scope.customSkin = {}; //这个是自定义模板数据

scope.customSkinStyle =  //这个是写入页面的css代码对应表
    'body{background-color:#backgroundColor;background-image:url(#url);\
        background-repeat:#repeat;\
        background-position:#position;\
		background-attachment:#attachment;\
		}\
    /* A类-左-文字 */\
    .MIB_txtal,.MIB_txtbl{color:#color0;}\
    /* A类-左-链接 */\
    .MIB_linkal a:link,\
    .MIB_linkal a:visited,\
    .MIB_linkal a:hover,\
    a.MIB_linkal:link,\
    a.MIB_linkal:visited,\
    a.MIB_linkal:hover,\
    .MIB_linkbl a:link,\
    .MIB_linkbl a:visited,\
    .MIB_linkbl a:hover,\
    a.MIB_linkbl:link,\
    a.MIB_linkbl:visited,\
    a.MIB_linkbl:hover{color: #color1}\
	/*顶部导航广场*/\
	   .topSquLayer .arrows span,\
    .topSquLayer .bgs{ background-color:#color4}\
    /* A类-右-文字 */\
    .MIB_txtar,.MIB_txtbr{color:#color2;}\
    /* A类-右-链接 */\
    .MIB_linkar a:link,\
    .MIB_linkar a:visited,\
    .MIB_linkar a:hover,\
    a.MIB_linkar:link,\
    a.MIB_linkar:visited,\
    a.MIB_linkar:hover,\
    .MIB_linkbr a:link,\
    .MIB_linkbr a:visited,\
    .MIB_linkbr a:hover,\
    a.MIB_linkbr:link,\
    a.MIB_linkbr:visited,\
    a.MIB_linkbr:hover,\
    .MIB_linkcr a:link,\
    .MIB_linkcr a:visited,\
    .MIB_linkcr a:hover,\
    a.MIB_linkcr:link,\
    a.MIB_linkcr:visited,\
    a.MIB_linkcr:hover\
    {color: #color3}\
    /*内容的背景颜色 feed*/\
    .MIB_mbloglist{background-color:#color4;}\
    ';

scope.customStyleSheet; //写在页面上的css对应的全局变量
scope.backgroundImage = {}; //背景对应的变量
scope.deadTime = ''; //模板死亡时间
App.skinManage.saved = false; //设置是否保存

/**
 * 创建边框背景选择区域
 * */
App.skinManage.createBorderPad = function(){
    var  imgURI = scope.$BASEIMG+"style/images/skinsetup/bgbtn.gif";
    var dom = $C("div");
    dom.id = "borderBgBox";
    var html = '\
        <ul>\
            <li class="black" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
            <li class="gray" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
            <li class="pink" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
            <li class="purple" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
            <li class="blue" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
            <li class="white" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
            <li class="red" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
            <li class="orange" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
            <li class="yellow" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
            <li class="green" onclick="App.skinManage.getBorderBg(this);return false;"><div></div></li>\
        </ul>\
        <div class="clear btn">\
            <a href="javascript:void(0);" onclick="App.skinManage.setBorderBg();return false;"><img src="#{imgURI}"/></a>\
        </div>';
   
    dom.innerHTML = html.replace(/#\{imgURI\}/,imgURI);
    dom.style.display = "none";
    document.body.appendChild(dom);
    
    Core.Events.addEvent(document.body,function(e){
        var t = e.target||e.srcElement;
        if(!Core.Dom.contains(dom, t) && !Core.Dom.contains(App.skinManage.customDom.domList.borderBG, t)){
            App.skinManage.hideBorderPad();
        }
    },'click',false);
    
    return dom;
};

App.skinManage.hideBorderPad = function(){
    var box ;
    if(box = $E("borderBgBox")){
        box.style.display = "none";
    }
};

App.skinManage.getBorderBg = function(el){
    App.skinManage._borderBg_ = el.className;
    var nodes = el.parentNode.getElementsByTagName("div");
    for(var i=0,len= nodes.length;i<len;i++){
        nodes[i].className = "";
    }
    el.getElementsByTagName("div")[0].className = "on";
};

App.skinManage.setBorderBg = function(){
    var bg;		
	App.skinManage._borderBg_ = App.skinManage._borderBg_||App.skinManage._borderBg
    if(bg = App.skinManage._borderBg_){
        App.skinManage._borderBg = App.skinManage._borderBg_;        
        App.skinManage.customDom.domList.borderBgColor.style.backgroundColor = bg;
        App.skinManage.hideBorderPad();
		$E("rightborder").className = "MIB_mblogbgr #{bg}Bg".replace(/#\{bg\}/,bg);
        $E("bottomborder").className = "bottomLinks #{bg}Bg".replace(/#\{bg\}/,bg);
    }
};
/*
 * 顶部tips切换功能
 */
App.skinManage.switchTopTips = function(_this, _main){
	if($E("skin_display_main").style.display === "none"){
        App.skinManage.toggle($E("toggle"));
    }
    
    if(scope._pubSub){
        scope._pubSub.publish("switchTab",[_main]);
    }
    try{
        App.skinManage.colorPicker.hideColorPicker();
    }catch(e){}
    var lis = _this.parentNode.getElementsByTagName("LI");
    for(var i=0;i<lis.length;i++){
        lis[i].className = "";
        if($E('t' + i)){
			$E('t' + i).style.display = "none";
		}
		var paging = $E('paging'+i);
		if(paging){
			if(('t'+i) != _main){
				paging.style.display = 'none';
			}else{
				paging.style.display = '';
			}	
		}		
    }
    _this.className = "activeMenu";
    $E(_main).style.display = "";
    //选择自定义的时候，变化为无皮肤状态
    if(_main == 't6'){
        App.skinManage.clearSelectSkin();
        var trans = $E('skin_transformers');
		if(trans){
			var head = document.getElementsByTagName('head')[0];
			var skin_tw = $E('skin_tw');
			var first= scope.$BASEIMG+"skin/skin_diy/"+ $CLTMSG['CD0164'] +".css";			
			trans.href = first;
			
			if(skin_tw){
				skin_tw.href = scope.$BASEIMG+"skin/skin_diy/skin.css";
				head.appendChild(skin_tw);
			}
			head.appendChild(trans);	
			// ie6的渲染问题
            try{
                Core.Events.fireEvent(App.skinManage.customDom.domList.tip0, 'click');
                if(scope.backgroundImage.useBackground == 1){
                    Core.Events.fireEvent(App.skinManage.customDom.domList.setBackgroundImg, 'click');
                }else{
                    Core.Events.fireEvent(App.skinManage.customDom.domList.setnoBackgroundImg, 'click');
                }
                App.skinManage.delStyle();
//                App.skinManage.renderPage();
            }catch(e){
                setTimeout(function(){
					scope._pubSub.publish("switchTab",[_main]);//隐藏翻页工具栏	                 
                },100);
            }
            scope.postSkinId = 'diy';
            App.skinManage.saved = true;	
		}     
        $E("container").className = "set_interface set_expand set_zdybg";
        $E("innerContainer").className = "set_innerDiv set_zdy";
		$E('pagingContainer').style.display = 'none';
		if(trans){
			App.skinManage.renderPage();
		}
    }else{
        $E("container").className = "set_interface set_expand";
        $E("innerContainer").className = "set_innerDiv";
		$E('pagingContainer').style.display = '';
		App.skinManage.clearLocking();	
//		App.skinManage.renderPage();
    }
};
/*
 * 隐藏显示模块
 */
App.skinManage.toggle = function(t){
    var b = t.parentNode.parentNode;
    if(b.className.indexOf("set_expand") !== -1){
        b.className = b.className.replace(/set_expand/,"set_shrink");
        $E("skin_display_main").style.display = "none";
		App.skinManage.renderPage();
        return false;
    }
    $E("skin_display_main").style.display = "";
    b.className = b.className.replace(/set_shrink/,"set_expand");
	App.skinManage.renderPage();
    return false;
};

/*
 * 清除所有的皮肤选择
 */
App.skinManage.clearSelectSkin = function(){
    var selectedLi = $E("skin_display_main").getElementsByTagName("li");
    for(var i=0;i<selectedLi.length;i++){
        selectedLi[i].className = '';
    }
};

/*
 * 自定义功能模板初始化
 */
App.skinManage.initModule = function(_dom){
    var _addE = Core.Events.addEvent;
    var _delE = Core.Events.removeEvent;
    var module = 
    [
        //tips
        {'tagName' : 'div', 'attributes' : {'class' : 'set_subMenu lf'}, 'childList': [
            {'tagName' : 'ul', 'attributes' : {}, 'childList': [
                    {'tagName' : 'li', 'attributes' : {'class':'activeSubMenu','id':'tip0', 'innerHTML':'<a href="#">' + $CLTMSG['CD0096'] + '</a>'}},
                    {'tagName' : 'li', 'attributes' : {'innerHTML':'<a href="#">' + $CLTMSG['CD0097'] + '</a>','id':'tip1'}}
                ]
            }]
        },
        //第一个模块
        {'tagName' : 'div', 'attributes' : {'class' : 'set_settingPage set_uploadSuccess lf','id':'backgroundImg'}, 'childList': [
            {'tagName' : 'div', 'attributes' : {'class' : 'set_setBackground lf'}, 'childList': [
                {'tagName' : 'div', 'attributes' : {'id':'setBackgroundImg','class' : 'set_bg set_border'}, 'childList': [
                    {'tagName' : 'div', 'attributes' : {'class' : 'set_isUsing'}, 'childList': [
                        {'tagName':'div', 'attributes':{'class' : 'imgBox'}, 'childList':[
                            {'tagName' : 'img', 'attributes' : {'id':'microBackgroundImage', 'src' : $CLTMSG['CD0100'],'alt' :  $CLTMSG['CD0098']}}
                        ]},
                        {'tagName': 'p','attributes': {'innerHTML': $CLTMSG['CD0099']}}
                    ]
                    }
                ]},
                {'tagName' : 'div', 'attributes' : {'id':'setnoBackgroundImg','class' : 'set_nobg set_noborder'}, 'childList': [
                    {'tagName':'div','attributes':{'innerHTML':' <p>'+ $CLTMSG['CD0101']+'</p>','class':'set_notUse'}}
                ]}
            ]},
            {'tagName' : 'div', 'attributes' : {'class' : 'set_otherSettings lf'}, 'childList': [
                {'tagName' : 'div', 'attributes' : {}, 'childList': [
                    {'tagName' : 'form', 'attributes' : 
                        {
                            'target' : 'Upfiler_file_iframe',
                            'method' : 'post',
                            'id'    : 'uploadImageForm'
                        }, 'childList': [
                        {'tagName' : 'input', 'attributes' : {'type' : 'file','class' : 'MIB2_input','id': 'uploadInput', 'name': 'pic1'}},
                        {'tagName' : 'strong', 'attributes' : {'style':'display:none','id':'uploadSuccessText','innerHTML' :  $CLTMSG['CD0102']}},
                        {'tagName' : 'a' , 'attributes' : {'style':'display:none', 'id' : 'reUploadImage','href' : '#','class' : 'btn_normal marginLeft5', 'innerHTML' : '<em>'+ $CLTMSG['CD0103'] +'</em>'}}
                    ]},
                    {'tagName' : 'p', 'attributes' : {'class' : 'set_gray','innerHTML':'<iframe frameborder="0" width="1" height="1" id="Upfiler_file_iframe" name="Upfiler_file_iframe" src="about:blank" style="display:none"></iframe>' + $CLTMSG['CD0104']}}
                ]},
                {'tagName' : 'div', 'attributes' : {'class' : 'marginTop15'}, 'childList': [
                    {'tagName' : 'strong', 'attributes' : {'innerHTML':$CLTMSG['CD0105']}},
					{'tagName' : 'span', 'attributes' : {'class' : 'toInlineBlock','style':'margin-right:5px'}, 'childList': [
                        {'tagName' : 'input', 'attributes' : {'id': 'backgroundFix','type' : 'checkbox'}},
                        {'tagName' : 'TEXT', 'attributes' : $CLTMSG['CC5201']}
                    ]},
                    {'tagName' : 'select', 'attributes' : {'id': 'backgroundRepeatType'}},
                    {'tagName' : 'span', 'attributes' : {'class' : 'toInlineBlock marginLeft20'}, 'childList': [
                        {'tagName' : 'strong', 'attributes' : {'innerHTML':$CLTMSG['CD0106']}},
						{'tagName' : 'select', 'attributes' : {'id': 'backgroundAlignType'}}
                    ]}
                ]}
            ]}
        ]},
        //第二个模块
        {
            'tagName' : 'div', 'attributes' : {'class' : 'set_pageBack lf','id':'backgroundColor'}, 'childList': [
                    {'tagName' : 'div', 'attributes' : {'class' : 'set_backColor'}},
                    {'tagName' : 'p', 'attributes' : {'innerHTML':$CLTMSG['CD0096']}}]
        },
        //第3个模块
        {'tagName' : 'div', 'attributes' : {'class' : 'set_changeColor','id':'fontColor','style' : 'display:none'}, 'childList': [
            {'tagName' : 'ul', 'attributes' : {'style' : 'display:inline'}, 'childList': [
                {'tagName' : 'li', 'attributes' : {'id' : 'color0'}, 'childList': [
                    {'tagName' : 'div', 'attributes' : {'class' : 'set_backColor1'}},
                    {'tagName' : 'p', 'attributes' : {'innerHTML':$CLTMSG['CD0107']}}
                ]},
                {'tagName' : 'li', 'attributes' : {'id' : 'color1'}, 'childList': [
                    {'tagName' : 'div', 'attributes' : {'class' : 'set_backColor2'}},
                    {'tagName' : 'p', 'attributes' : {'innerHTML':$CLTMSG['CD0108']}}
                ]},
                {'tagName' : 'li', 'attributes' : {'id' : 'color2'}, 'childList': [
                    {'tagName' : 'div', 'attributes' : {'class' : 'set_backColor3'}},
                    {'tagName' : 'p', 'attributes' : {'innerHTML':$CLTMSG['CD0109']}}
                ]},
                {'tagName' : 'li', 'attributes' : {'id' : 'color3'}, 'childList': [
                    {'tagName' : 'div', 'attributes' : {'class' : 'set_backColor4'}},
                    {'tagName' : 'p', 'attributes' : {'innerHTML':$CLTMSG['CD0110']}}
                ]},
                {'tagName' : 'li', 'attributes' : {'id' : 'color4'}, 'childList': [
                    {'tagName' : 'div', 'attributes' : {'class' : 'set_backColor5'}},
                    {'tagName' : 'p', 'attributes' : {'innerHTML':$CLTMSG['CD0111']}}
                ]},
                {'tagName' : 'li', 'attributes' : {'id' : 'borderBG'}, 'childList': [
                    {'tagName' : 'div', 'attributes' : {id:'borderBgColor','class' : 'set_backColor6'}},
                    {'tagName' : 'p', 'attributes' : {'innerHTML':$CLTMSG['CD0152']}}
                ]}
            ]},
            {'tagName' : 'div', 'attributes' : {'class' : 'defaultColor'}, 'childList': [
                {'tagName' : 'a', 'attributes' : {'href' : '#', 'id' : 'resetcolor', 'innerHTML':$CLTMSG['CD0112']}}
            ]},
            {'tagName' : 'div', 'attributes' : {'class' : 'clear','style' : 'margin-bottom:-79px;'}}
        ]}
    ];
    //show content显示内容
    App.skinManage.customDom = new App.Builder(module,$E("t6"));
    var _dom = App.skinManage.customDom.domList;
    
    //绑定切换tag
    var switch2ImageTip = function(){
        _dom.backgroundImg.style['display'] = "";
        _dom.backgroundColor.style['display'] = "";
        _dom.fontColor.style['display'] = "none";
        _dom.tip0.className = "activeSubMenu";
        _dom.tip1.className = "";
        return false;
    };
    var switch2ColorTip = function(){
        _dom.backgroundImg.style['display'] = "none";
        _dom.backgroundColor.style['display'] = "none";
        _dom.fontColor.style['display'] = "";
        _dom.tip0.className = "";
        _dom.tip1.className = "activeSubMenu";
        return false;
    };
    _addE(_dom.tip0,switch2ImageTip,"click");
    _addE(_dom.tip1,switch2ColorTip,"click");
    
	
	//绑定选择背景
    _addE(_dom.setBackgroundImg,App.skinManage.setBackgroundImg.bind2(_dom.setBackgroundImg),"click");
    _addE(_dom.setnoBackgroundImg, App.skinManage.setNoBackground.bind2(_dom.setnoBackgroundImg),"click");
    _addE(_dom.uploadInput,function(e){
		if(uploadRight == 0 || uploadRight == null || !uploadRight){
			Core.Events.stopEvent(e);
			App.alert(App.getMsg({code:"R01502"}),{
				icon : 1
			})
		}else if(uploadRight == 1){
		}
		getUpLoadRights();
	},"click");
	
	var uploadRight = null;  //是否拥有上传权限
	Utils.Io.Ajax.request('/person/aj_skinused.php', {
		'returnType': 'json',
		'onComplete': function(json){
			if (json.code === "A00006") {
				uploadRight = json.data;
				//uploadRight = 1;
			}
		},
		'onException': function(e){
			Core.Events.stopEvent(e);
		},
		"POST": {}
	})
	function getUpLoadRights(){
		Utils.Io.Ajax.request('/person/aj_skinused.php', {
			'returnType': 'json',
			'onComplete': function(json){
				if (json.code === "A00006") {
					uploadRight = json.data;
					//uploadRight = 1;
					//alert(uploadRight);
				}
			},
			'onException': function(e){
				//App.alert("请求异常，请稍后再试");
				Core.Events.stopEvent(e);
			},
			"POST": {}
		})
	}
    //背景颜色绑定颜色选择器
    App.skinManage.colorPicker = new App.skinManage.colorBox(_dom.backgroundColor,'App.skinManage.colorCallBack');
    App.skinManage.colorPicker.initColorPicker();
    
	_addE(document.body,function(event){
		 var target = Core.Events.getEventTarget(event);	
		 if(!Core.Dom.contains($E('picker_container'),target)){
		 	App.skinManage.colorPicker.hideColorPicker()
		 }		
	}.bind2(document.body),'click');
	
    _addE(_dom.backgroundColor, function(e){
        App.skinManage.colorClick(e,'backgroundColor');
        App.skinManage.hideBorderPad();
		Core.Events.stopEvent(e);
    }, "click");
	
    _addE(_dom.backgroundColor, function(e){
		App.skinManage.colorPicker.hideColorPicker();
		Core.Events.stopEvent(e);
	}, "dblclick");
    
	
    //给剩下的4个颜色选择绑定事件
    for(var i=0;i<=4;i++){
        (function(t){
            _addE(_dom['color' + t], function(e){
                App.skinManage.colorClick(e, 'color'+t);
                App.skinManage.hideBorderPad();
				Core.Events.stopEvent(e);
            }, "click");
        })(i);
        _addE(_dom['color'+i], function(e){
			 App.skinManage.colorPicker.hideColorPicker();
			 Core.Events.stopEvent(e);
		}, "dblclick");
    } 	   
    //绑定边框点击事件
    var binded = false;
    _addE(_dom.borderBG,function(){
        App.skinManage.colorPicker.hideColorPicker();
        
        var dom = $E("borderBgBox") ? $E("borderBgBox") : App.skinManage.createBorderPad();
        var position = Core.Dom.getXY(_dom.borderBG);
        position[1] += _dom.borderBG.offsetHeight + 20;
        dom.style.cssText = "left:" + position[0] + "px;top:" + position[1] + "px;" + 
        "position:absolute;z-index:1000;display:'';";
        
        if(!binded){
           if(!_dom.borderBgColor.style.backgroundColor){
				_dom.borderBgColor.style.backgroundColor = 'black';
			}
		   var nodes = dom.getElementsByTagName("div");		   
           if(scope.$myskin){
               for(var i=0,len= nodes.length;i<len;i++){
                   if(nodes[i].parentNode.className === "black"){
                       nodes[i].className = "on";
                   }
                } 
           }else{				
               for(var i=0,len= nodes.length;i<len;i++){			   
                    if(_dom.borderBgColor.style.backgroundColor && nodes[i].parentNode.className === _dom.borderBgColor.style.backgroundColor){
                        nodes[i].className = "on";
                    }
                } 
           }
           binded = true;
        }
    },"click");
    
    //渲染选色块背景色
    App.skinManage.initBoxColor();
    //初始化每个色块的背景色
    App.skinManage.initColorBoxBackgroundColor();
    
    //建立option
    var _option1 = [new Option($CLTMSG['CD0113'],'repeat'),new Option($CLTMSG['CD0114'],'no-repeat')];
    _dom.backgroundRepeatType.options[0] = _option1[0];
    _dom.backgroundRepeatType.options[1] = _option1[1];
    
    var _option2 = [new Option($CLTMSG['CD0115'],'top left'),new Option($CLTMSG['CD0116'],'top center'),new Option($CLTMSG['CD0117'],'top right')];
    _dom.backgroundAlignType.options[0] = _option2[0];
    _dom.backgroundAlignType.options[1] = _option2[1];
    _dom.backgroundAlignType.options[2] = _option2[2];
    
    //绑定select方法
    _addE(_dom.backgroundRepeatType, App.skinManage.backgroundImageStyle.bind2(_dom.backgroundRepeatType), "change");
    _addE(_dom.backgroundAlignType, App.skinManage.backgroundImageStyle.bind2(_dom.backgroundAlignType), "change");
	_addE(_dom.backgroundFix, App.skinManage.backgroundImageStyle.bind2(_dom.backgroundFix), "click");
    //_addE(_dom.backgroundValignType, App.skinManage.backgroundImageStyle.bind2(_dom.backgroundValignType), "change");
    
    App.skinManage.initBackgroundImageAttribute();
    
    //绑定上传方法
    _addE(_dom.uploadInput, App.skinManage.upLoadImage.bind2(_dom.uploadInput), "change");
    _dom.uploadImageForm.setAttribute('action', 'http://picupload.t.sina.com.cn/interface/pic_upload.php?marks=0&s=rdxt&app=miniblog&cb=http://t.sina.com.cn/upimgback.html');
    _dom.uploadImageForm.setAttribute('enctype', 'multipart/form-data');
    _dom.uploadImageForm.setAttribute('encoding', 'multipart/form-data');
    _dom.uploadInput.setAttribute('name', 'pic1');
    
    //重新上传绑定方法
    _addE(_dom.reUploadImage, function(){
        _dom.uploadSuccessText.style.display = 'none';
        _dom.reUploadImage.style.display = 'none';
        _dom.uploadInput.style.display = '';
        return false;
    },'click');
    
    _addE(_dom.resetcolor, App.skinManage.resetColor, "click");
};

/*
 * 绑定上传图片方式
 */
var isChecked = 1;
App.skinManage.upLoadImage = function(e){
    var _dom = App.skinManage.customDom.domList;
    scope.addImgSuccess = function(cfg){
        if (cfg['ret'] == '1') {
            scope.backgroundImage.imageid = cfg['pid'];
            _dom.microBackgroundImage.src = App.imgURL(cfg['pid'], 'thumbnail');
            Core.Events.fireEvent(_dom.setBackgroundImg, 'click');
            //显示成功提示
            _dom.uploadSuccessText.style.display = '';
            _dom.uploadSuccessText.innerHTML = $CLTMSG['CD0102'];
            _dom.reUploadImage.style.display = '';
            _dom.uploadInput.style.display = 'none';
			isChecked = 0;
			scope.newPid = cfg['pid'];
			setTimeout(function(){
			    Utils.Io.Ajax.request( "/person/skin_uploadpic.php",{
	                "onComplete"  : function (json){
	
	                }			                    
	            }); 				
			},500);						
        } else {
            _dom.uploadSuccessText.style.display = '';
            _dom.uploadSuccessText.innerHTML = '<span class="set_failedTips">'+ $CLTMSG['CD0118'] +'</span>';
            _dom.reUploadImage.style.display = '';
            _dom.uploadInput.style.display = 'none';
            scope.backgroundImage.imageid = scope.backgroundImage.imageid?scope.backgroundImage.imageid:'';
        }
    };
    //检验图片格式
    var browseFile = function(file){
        if(/^.+\.(jpg|gif|png|jpeg)$/.test(file.value.toLowerCase())){
            return true;
        }
        return false;
    };
    if(browseFile(_dom.uploadInput)){
        _dom.uploadImageForm.submit();
        _dom.uploadInput.style.display = 'none';
        _dom.uploadSuccessText.innerHTML = $CLTMSG['CD0119'] + ' <img src="'+scope.$BASEIMG+'style/images/common/loading.gif" height="16" width="16" />';
        _dom.uploadSuccessText.style.display = '';
    } else {
        App.alert($CLTMSG['CD0120']);
    }
};

/*
 * 选择自定义图片或者是皮肤
 */
App.skinManage.setBackgroundImg = function(e){
    scope.backgroundImage.useBackground = 1;
    var _dom = App.skinManage.customDom.domList;
    this.className = "set_bg set_border";
    _dom.setnoBackgroundImg.className = "set_nobg set_noborder";
    
    _dom.backgroundRepeatType.disabled = false;
    _dom.backgroundAlignType.disabled = false;
	_dom.backgroundFix.disabled = false;
	
    _dom.uploadInput.disabled = false;
    App.skinManage.renderPage();
};
App.skinManage.setNoBackground = function(e){
    scope.backgroundImage.useBackground = 0;
    
    var _dom = App.skinManage.customDom.domList;
    this.className = "set_nobg set_border";
    _dom.setBackgroundImg.className = "set_bg";
    
    _dom.backgroundRepeatType.disabled = true;
    _dom.backgroundAlignType.disabled = true;
	_dom.backgroundFix.checked = false;
	_dom.backgroundFix.disabled = true;
    _dom.uploadInput.disabled = true;
    App.skinManage.renderPage();
};
App.skinManage.setLocking = function(){
	var ua = navigator.userAgent, r = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(ua),ie6;
        if (r && (r = parseFloat(RegExp.$1)) && r <= 6) {
           ie6 = true;
        };
	clearInterval(App.skinManage.lockLoop);
	ie6?$E('container').style.position='absolute':$E('container').style.position='fixed';
	$E('container').style.width='100%';
    $E('container').style.zIndex=900;
	var a = Core.Dom.getElementsByClass(document,'div','MIB_bloga')[0];
	a.style.paddingTop=$E('container').offsetHeight+'px';
	var b = document.body;
	if (ie6) {
		App.skinManage.lockLoop = setInterval(function(){
			var _s = Core.System.getScrollPos();
			$E('container').style.top = _s[0] + "px";
		}, 10);
//		b.style.backgroundAttachment='fixed';
	}
		var p = scope.backgroundImage.positon.match(/left|right|center/);
        var pos = scope.backgroundImage.positon?scope.backgroundImage.positon.replace('top '+p||'center',p+' '+$E('container').offsetHeight+'px'):'center '+$E('container').offsetHeight+'px'
		b.style.backgroundPosition=pos;
		b.style.backgroundAttachment='fixed';
};
App.skinManage.clearLocking = function(){
	var ua = navigator.userAgent, r = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(ua),ie6;
        if (r && (r = parseFloat(RegExp.$1)) && r <= 6) {
           ie6 = true;
        };
    
	$E('container').style.position = "static";
	$E('container').style.top = "0px";
	var a = Core.Dom.getElementsByClass(document,'div','MIB_bloga')[0];
    a.style.paddingTop='';
	var b = document.body;
	if(ie6){
		clearInterval(App.skinManage.lockLoop);
		b.style.backgroundAttachment='scroll'
	}else{
		var p = scope.backgroundImage.positon.match(/left|right|center/);
        
        var pos = scope.backgroundImage.positon?scope.backgroundImage.positon.replace('top '+p||'center',p+' '+$E('container').offsetHeight+'px'):'center '+$E('container').offsetHeight+'px'
		b.style.backgroundPosition=pos;
		b.style.backgroundAttachment='scroll';
	}
	App.skinManage.lockLoop=null;
	
};

/*
 * 选择图片摆放方式
 */
App.skinManage.backgroundImageStyle = function(e){
    var _dom = App.skinManage.customDom.domList;
    scope.backgroundImage.repeat = _dom.backgroundRepeatType.value;
    scope.backgroundImage.positon = _dom.backgroundAlignType.value;
	scope.backgroundImage.fix = _dom.backgroundFix.checked?'fixed':'scroll';
    App.skinManage.renderPage();
};


/*
 * 点击颜色选择模块执行函数
 */
App.skinManage.colorClick = function(_ev, _who){
    //获取dom位置
    var _target = Core.Events.getEventTarget(_ev);
    if(_target.nodeName == "P"){
        _target = _target.parentNode;
    }
    _color = App.skinManage.skinList[_who][1]?App.skinManage.skinList[_who][1]:App.skinManage.skinList[_who][0];
    
    App.skinManage.colorPicker.showColorPicker(Core.Dom.getXY(_target), _color, _who);
};

/*
 * 给每个模块设置背景色
 */
App.skinManage.initColorBoxBackgroundColor = function(){
    var _dom = App.skinManage.customDom.domList;
    for(var i=0;i<=4;i++){
        _dom['color' + i].childNodes[0].style.backgroundColor = App.skinManage.skinList['color' + i][0];
    }
	_dom.borderBG.childNodes[0].style.backgroundColor = App.skinManage.skinList['color5'][0];
    _dom.backgroundColor.childNodes[0].style.backgroundColor = App.skinManage.skinList['backgroundColor'][0];
};
/*
 * 初始化背景属性模块
 */
App.skinManage.initBackgroundImageAttribute = function(){
    var _dom = App.skinManage.customDom.domList;
    _dom.microBackgroundImage.src = scope.backgroundImage.imageid?App.imgURL(scope.backgroundImage.imageid, 'thumbnail'):$CLTMSG['CD0100'] ;
    
    for(var i=0;i < _dom.backgroundRepeatType.options.length;i++){
        if(scope.backgroundImage.repeat == _dom.backgroundRepeatType.options[i].value){
            _dom.backgroundRepeatType.selectedIndex = i;
            break;
        }
    }
    for(var i=0;i < _dom.backgroundAlignType.options.length;i++){
        if(scope.backgroundImage.positon == _dom.backgroundAlignType.options[i].value){
            _dom.backgroundAlignType.selectedIndex = i;
            break;
        }
    }
	if(scope.backgroundImage.fix=="fixed"){
		_dom.backgroundFix.checked=true;
	}else{
		_dom.backgroundFix.checked=false;
	}
    return;
};
 
/*
 * 这个是给flash绑定的返回事件
 */
App.skinManage.colorCallBack = function(_e, _who){
    var _dom = App.skinManage.customDom.domList;
    _dom[_who].childNodes[0].style.backgroundColor = "#"+_e;
    App.skinManage.skinList[_who][1] = "#"+_e;
    App.skinManage.colorPicker.hideColorPicker();
    App.skinManage.renderPage();
};

/*
 * 页面渲染：每个模块颜色渲染
 */
App.skinManage.initBoxColor = function(){
    var _dom = App.skinManage.customDom.domList;
    //对应的第一项是初始颜色，第二项是选择颜色
    App.skinManage.skinList = {
        //'backgroundColor'   : [scope.$bkcolor?scope.$bkcolor:Core.Dom.getStyle(_dom.backgroundColor.childNodes[0], 'backgroundColor'),''],
		'backgroundColor'   : [scope.$bkcolor?scope.$bkcolor:Core.Dom.getStyle(_dom.backgroundColor.childNodes[0], 'backgroundColor'),''],
        'color0'            : [scope.$color0?scope.$color0:Core.Dom.getStyle(_dom.color0.childNodes[0], 'backgroundColor'),''],
        'color1'            : [scope.$color1?scope.$color1:Core.Dom.getStyle(_dom.color1.childNodes[0], 'backgroundColor'),''],
        'color2'            : [scope.$color2?scope.$color2:Core.Dom.getStyle(_dom.color2.childNodes[0], 'backgroundColor'),''],
        'color3'            : [scope.$color3?scope.$color3:Core.Dom.getStyle(_dom.color3.childNodes[0], 'backgroundColor'),''],
        'color4'            : [scope.$color4?scope.$color4:Core.Dom.getStyle(_dom.color4.childNodes[0], 'backgroundColor'),''],
		'color5'            : [scope.$color5?scope.$color5:Core.Dom.getStyle(_dom.borderBG.childNodes[0], 'backgroundColor'),'']
    };	
    //初始化其他数据
    if(scope.$usebkpic!="0"){
        scope.backgroundImage.useBackground = 1;
    } else {
        if(scope.$usebkpic===''){
            scope.backgroundImage.useBackground = 1;
        }else{
            scope.backgroundImage.useBackground = 0;
        }
    }
    scope.backgroundImage.imageid = scope.$background?scope.$background:'';
    scope.backgroundImage.repeat = scope.$imgrepeat?scope.$imgrepeat:'no-repeat';
    scope.backgroundImage.positon = scope.$imgpos?scope.$imgpos:'top center'; 
    scope.backgroundImage.fix = scope.$imgfixed?scope.$imgfixed:'scroll';
};

/*
 * 重新设定颜色值
 */
App.skinManage.resetColor = function(){
    for(var i in App.skinManage.skinList){
        App.skinManage.skinList[i][1] = App.skinManage.skinList[i][0];
    }
    App.skinManage.initColorBoxBackgroundColor();
    App.skinManage.renderPage();
	(function(){
        var borderBg;
    	borderBg = scope.$borderBg;
        App.skinManage.customDom.domList.borderBgColor.style.backgroundColor = borderBg.replace("Bg","");
        if($E("rightborder")){
			$E("rightborder").className = "MIB_mblogbgr " + borderBg;				
		}
		if($E("bottomborder")){
            $E("bottomborder").className = "bottomLinks " + borderBg;				
		}
    })();
    return false;
};
/*
 * 功能模块2：色块选择
 */
App.skinManage.colorBox = function(_dom/*dom*/, _callBack/*function*/){
    this.self = this;
    this._call = _callBack;
    this._box = _dom;
    this._who;
};
App.skinManage.colorBox.prototype = {
    initColorPicker : function(){ //初始化颜色选择器容器
        this._picker_container = $C("div");
		this._picker_container.id = 'picker_container';
        this._picker = $C("div");
        this._picker_container.appendChild(this._picker);
        this._picker.id = "color_picker";
        this._picker_container.style.position = "absolute";
        this._picker_container.style.display = "none";
        this._picker_container.style.zIndex = "1000";
        this._picker_container.style.backgroundColor = '#fff';
        document.body.appendChild(this._picker_container);
    },
    colorPicker :function(_pos, _c, _cb/*string*/, _who){ //生成选择器
        var _flashParams = {
            quality: "high",
            allowScriptAccess: "always",
            wmode: "Opaque",
            allowFullscreen: true
        };
        var _flashVars = {
            callback: _cb,
            color : _c?_c:"#ffffff",
            who : _who?_who:''
        };
        swfobject.embedSWF(scope.$BASESTATIC+"miniblog/static/swf/ColorPicker.swf", "color_picker", "251", "264", "9.0.0", "#ffffff", _flashVars, _flashParams);
        this._picker_container.style.left = _pos[0] - 60 +"px";
        this._picker_container.style.top = _pos[1] + 92 + "px";
    },
    showColorPicker : function(pos, _col, who){ //显示颜色选择器
        if(!this._picker_container){
            this.initColorPicker();
        }
        
        this._picker_container.style.display = "";
        this.colorPicker(pos, _col, this._call, who);
    },
    hideColorPicker : function(){ //隐藏颜色选择器
        this._picker_container.style.display = "none";
    }
};

/*
 * 给页面写入自定义css
 */ 
App.skinManage.renderPage = function(){
    if(scope.customStyleSheet){
        App.skinManage.delStyle();
    }
    var write2Page = function(styCss){
        //if(!scope.customStyleSheet){
        scope.customStyleSheet = document.createElement('STYLE'); 
        scope.customStyleSheet.setAttribute("type", "text/css"); 
        //}
        if (scope.customStyleSheet.styleSheet) { 
            scope.customStyleSheet.styleSheet.cssText = styCss;  
        } else {  
            scope.customStyleSheet.appendChild(document.createTextNode(styCss));  
        }
        document.getElementsByTagName("head")[0].appendChild(scope.customStyleSheet); 
    };
    var renderStyle = function(obj){
        var style = scope.customSkinStyle,exp;
        for(var i in obj){
			exp = new RegExp('#'+i,'g')
            style = style.replace(exp, obj[i]);
        }
        return style;
    };
    //生成需要渲染的数据
    var _url = scope.backgroundImage.imageid?App.imgURL(scope.backgroundImage.imageid, 'orignal'):'';
    if(!scope.backgroundImage.useBackground){
        _url = '';
		scope.backgroundImage.fix = 'scroll'
    }	
	if (scope.backgroundImage.fix != 'fixed') {
	    App.skinManage.clearLocking();
		window.scrollTo(0, 0);
	}else{
		App.skinManage.setLocking();
	}
	var renderData = {
        'url'               : _url,
        'repeat'            : scope.backgroundImage.repeat?scope.backgroundImage.repeat:'repeat',
		'attachment'        : scope.backgroundImage.fix?scope.backgroundImage.fix:'scroll',
        'position'          : scope.backgroundImage.positon?scope.backgroundImage.positon:'top center',
        'backgroundColor'   : App.skinManage.skinList['backgroundColor'][1]?App.skinManage.skinList['backgroundColor'][1]:App.skinManage.skinList['backgroundColor'][0],
        'color0'            : App.skinManage.skinList['color0'][1]?App.skinManage.skinList['color0'][1]:App.skinManage.skinList['color0'][0],
        'color1'            : App.skinManage.skinList['color1'][1]?App.skinManage.skinList['color1'][1]:App.skinManage.skinList['color1'][0],
        'color2'            : App.skinManage.skinList['color2'][1]?App.skinManage.skinList['color2'][1]:App.skinManage.skinList['color2'][0],
        'color3'            : App.skinManage.skinList['color3'][1]?App.skinManage.skinList['color3'][1]:App.skinManage.skinList['color3'][0],
        'color4'            : App.skinManage.skinList['color4'][1]?App.skinManage.skinList['color4'][1]:App.skinManage.skinList['color4'][0]
    };
    write2Page(renderStyle(renderData));
};

/*
 * 删除写入的css
 */
App.skinManage.delStyle = function(){
    if(!scope.customStyleSheet){
        return;
    }
    scope.customStyleSheet.disabled = 'disabled';
    if(scope.customStyleSheet.parentNode){
        Core.Dom.removeNode(scope.customStyleSheet);
    }
};

App.skinManage.changeSkin = function(_skinId, _t, _deadTime){
    App.skinManage.delStyle();
	/**
	try{	
		var skin_transformers = $E('skin_transformers');
		Core.Dom.removeNode(skin_transformers);
    }catch(e){}
	*/
    setTimeout(
        function(){			
			var skin_transformers = $E('skin_transformers');
			Core.Dom.removeNode(skin_transformers);
			var v = Math.random();            
			var path = scope.$BASEIMG+'skin/';
            var c = document.createElement("link");
            var h = document.getElementsByTagName("head")[0];
            c.rel="stylesheet";
            c.type="text/css";
            c.href = path + _skinId + "/skin.css?version="+v;
            c.id="skin_transformers";
            h.appendChild(c);
			
			var skin_tw = $E('skin_tw');
			if(skin_tw){
				var clone = skin_tw.cloneNode(false);
				Core.Dom.removeNode(skin_tw);
				clone.href = path + _skinId + "/tw_skin.css?version="+v;
				h.appendChild(clone);
			}		
			
            scope.postSkinId = _skinId; 
			  
			var selectedLi = $E("skin_display_main").getElementsByTagName("li");
            for(var i=0;i<selectedLi.length;i++){
                selectedLi[i].className = '';
            }
            if(_t){
                _t.className = "set_chosedTemp onborder";
                var _p;
                if(_p = _t.getElementsByTagName("P")[0]){
                    scope._skinName_ = _p.innerHTML;
                }
                
            }
            App.skinManage.saved = true;
			App.skinManage.clearLocking();
        },
        10
    );
	
    scope.deadTime = _deadTime.split('-');
	/******统计*********/
	setTimeout(function(){
		var url = "/person/skin_view.php";
       Utils.Io.Ajax.request( url,{
            "onComplete"  : function (){              
            },			                    
            "POST"        : {			
                'skin' : _skinId
            }
        }); 
	},500);
};

App.skinManage.skinOver = function(_t){
    if(_t.className == 'set_chosedTemp onborder'){return;}
    _t.className = "onborder";
};
App.skinManage.skinOut = function(_t){
    if(_t.className == 'set_chosedTemp onborder'){return;}
    _t.className = '';
};

//提交皮肤
App.skinManage.submit = function(t){
    if(t.locked){
        return;
    }
    if(scope.postSkinId == 'diy'){ //提交自定义模板
        //获取提交数据集合
        var _gather = {};
		_gather.isChecked = isChecked;
        _gather.background = scope.backgroundImage.imageid?scope.backgroundImage.imageid:null;
        _gather.bkcolor = App.skinManage.skinList['backgroundColor'][1]?App.skinManage.skinList['backgroundColor'][1]:App.skinManage.skinList['backgroundColor'][0];
        _gather.imgpos = scope.backgroundImage.positon?scope.backgroundImage.positon:'top center';
        _gather.repeat = scope.backgroundImage.repeat?scope.backgroundImage.repeat:'repeat';
		_gather.fix = scope.backgroundImage.fix==='fixed'?'1':'0';
        _gather.color = [
            App.skinManage.skinList['color0'][1]?App.skinManage.skinList['color0'][1]:App.skinManage.skinList['color0'][0],
            App.skinManage.skinList['color1'][1]?App.skinManage.skinList['color1'][1]:App.skinManage.skinList['color1'][0],
            App.skinManage.skinList['color2'][1]?App.skinManage.skinList['color2'][1]:App.skinManage.skinList['color2'][0],
            App.skinManage.skinList['color3'][1]?App.skinManage.skinList['color3'][1]:App.skinManage.skinList['color3'][0],
            App.skinManage.skinList['color4'][1]?App.skinManage.skinList['color4'][1]:App.skinManage.skinList['color4'][0]
        ];
        _gather.usebkpic = scope.backgroundImage.useBackground?scope.backgroundImage.useBackground:0;
        _gather.color = _gather.color.join('|');
        if(App.skinManage._borderBg){
            _gather.borderBg = App.skinManage._borderBg + "Bg";
        }
        App.skinManage.saved = true;
        t.locked = true;
        Utils.Io.Ajax.request( "/person/aj_userskin.php",
            {
                "onComplete"  : function (oResult){
                    App.skinManage.saved = false;
                    t.locked = false;
                    if(oResult.code == "A00006"){
						scope.oldPid = scope.newPid;
                        var dialog = App.alert($CLTMSG['CD0165'],{icon:3,width:370,height:120});
                        setTimeout(function(){
                            try{
								dialog.close();
							}catch(e){
								
							}
							window.location.href="/" + scope.$uid;
                        }, 3000);
                    }else{
                        App.alert(oResult,{
							ok:function(){
								isChecked = 1;
								 Utils.Io.Ajax.request('/person/aj_skinused.php', {
									'returnType': 'json',
									'onComplete': function(json){
										if (json.code === "A00006") {
											uploadRight = json.data;
										}
									},
									'onException': function(e){
										Core.Events.stopEvent(e);
									},
									"POST": {}
								})
								scope.backgroundImage.imageid = scope.oldPid?scope.oldPid:'';
								//scope.backgroundImage.imageid = scope.backgroundImage.imageid?scope.backgroundImage.imageid:'';
								var _microurl = scope.backgroundImage.imageid?App.imgURL(scope.backgroundImage.imageid, 'thumbnail'):'';
								var _dom = App.skinManage.customDom.domList;
   								 _dom.microBackgroundImage.src = _microurl;
								 App.skinManage.setBackgroundImg(_dom.backgroundImg);
								 //App.skinManage.renderPage();
								}
							});
						
                    }
                },
                "onException" : function(e){
                    App.skinManage.saved = false;
                    t.locked = false;
                },
                "returnType"  : "json",
                "POST"        : _gather
            });
    }else{		
        if(scope.postSkinId === 1){
            return window.location.href = "http://t.sina.com.cn/";
        }
        if(scope.postSkinId){
            t.locked = true;
            App.skinManage.saved = true;
            Utils.Io.Ajax.request( "/person/skin_post.php",
            {
                "onComplete"  : function (oResult){
                    t.locked = false;
                    App.skinManage.saved = false;
                    if(oResult.code == "A00006"){   
					   var msg = scope.deadTime.length === 3 ?($CLTMSG['CD0121'].replace(/#\{year\}/,scope.deadTime[0]).replace(/#\{month\}/,scope.deadTime[1]).replace(/#\{date\}/,scope.deadTime[2])):$CLTMSG['CD0165'];
					   var itv = null;
					   var html= '<div class="commonLayer2">\
					   				<div class="layerL">\
										<img align="absmiddle" title="" alt="" src="'+scope.$BASEIMG+'style/images/common/PY_ib.gif" class="PY_ib PY_ib_3"/>\
									</div>\
									<div class="layerR" style="width:auto;">\
										<strong>{html}\
									    </strong>\
									<div class="MIB_btn">\
										<a class="btn_normal" id="ok_{id}" href="javascript:;">\
											<em>{ok_text}</em>\
										</a>\
										<a class="btn_notclick" id="cancel_{id}" href="javascript:;">\
											<em>{cancel_text}</em>\
										</a>\
									</div>\
									</div>\
										<div class="clear"></div>\
									</div>';
					   var id = Math.ceil(Math.random() *1000);
					   
					   html  = html.replace(/\{html\}/,msg+"<br/>"+$CLTMSG["CD0156"]).replace(/\{id\}/g,id).replace(/\{ok_text\}/,$CLTMSG['CL0602']).replace(/\{cancel_text\}/,$CLTMSG['CL0603']);
					   var confirm = new App.Dialog.BasicDialog($CLTMSG['CL0601'],html,{
					   						width:360,
											zIndex:1000											
										});
						var closeBtn = confirm._btn_close;
						Core.Events.addEvent(closeBtn,function(){
							itv = true;
                            window.location.href="/" + scope.$uid;						
						},'click');
						
						var confirm_ok = function(){
								confirm.close();
							 	itv = true;
								//聊聊你的新模板，推荐给你的粉丝吧 O(∩_∩)O
	                            //弹出对话框让用户自己发微博推荐模板---------------------------------
								App._hidePic_ = undefined;
								delete App._hidePic_;
	                            
								App.publisherDialog.submitUrl = "/person/recommend_skin.php";
	                            App.publisherDialog.options = {
	                                'recommend' : '1',
	                                'skin':scope.postSkinId
	                            };
								
	                            App.publisherDialog.success = function(){
	                                App.publisherDialog.close();
	                                var dialog = App.alert($CLTMSG['CX0032'],{icon:3,ok:function(){
	                                    window.location.href="/" + scope.$uid;
	                                }});
	                                setTimeout(function(){
	                                    if(dialog && !dialog._distory){
	                                        dialog.close();
	                                    }
	                                    location.href="/" + scope.$uid;
	                                },2000);
	                                
	                            };
	                            App.publisherDialog.show($CLTMSG["CD0166"].replace(/#\{skin_name\}/,"“"+scope._skinName_+"”"));
								var pdialog = App.publisherDialog.publisherDialog()._btn_close;
								if(pdialog){
									Core.Events.addEvent(pdialog,function(){
										location.href = "/"+ scope.$uid;
									},'click');
								}								
								$E("publisher_image2").style.display = "none";
								//-----------------------------------------------------------------
								return false;
						 };
						 var confirm_cancel = function(){
						 		confirm.close();
						 	    itv = true;
                                window.location.href="/" + scope.$uid;
								return false;
						 };
						 
						 var ok = $E('ok_'+id);
						 var cancel= $E('cancel_'+id);
						 
						 Core.Events.addEvent(ok,confirm_ok,'click');
						 Core.Events.addEvent(cancel,confirm_cancel,'click');			
                        setTimeout(function(){
                            if(confirm && !confirm._distory){
	                                confirm.close();
	                            }
                            if(!itv){
                                window.location.href="/" + scope.$uid;  
                            } 					                         
                        }, 5000);
                        
                    } else {
                        App.alert(oResult);
                    }
                },
                "onException" : function(e){
                    App.skinManage.saved = false;
                    t.locked = false;
                },
                "returnType"  : "json",
                "POST"        : {
                    skin : scope.postSkinId
                }
            });
        } else {
            App.alert($CLTMSG['CD0122']);
        }
    }
};

/*
 * 将初始化做成job
 */
$registJob('init_skin', function(){
    scope._pubSub = new App.PubSub();
    
    var newContainer = $C("DIV");
    newContainer.id = "pagingContainer";
    $E("paging").parentNode.replaceChild(newContainer, $E("paging")); 
    
    var ad = {},pager = {},pagerContainer = {},tabID;
    for(var i=0;i<=5;i++){
        tabID = "t" + i;
        ad[tabID] = new App.skinManage.ad(tabID);
        if(ad[tabID].parse() === 0){
            pager[tabID] = new App.skinManage.pager();
            pagerContainer[tabID] = pager[tabID].create(12,tabID);
            newContainer.appendChild(pagerContainer[tabID]);
        }
    }
    
    var bLoaded = false;
	for(var i=0;i<=5;i++){
		var listShowTemp = $E("t"+i).getElementsByTagName("LI");
		for(var j = 14,length = listShowTemp.length; j < length; j++){
			if(listShowTemp[j]){
                    listShowTemp[j].style.display = "none";
                }
		}
	}
    if(pagerContainer['t0']){
        pagerContainer['t0'].style.display = "";
        if(!bLoaded){
            bLoaded = true;
            var list = $E("t0").getElementsByTagName("LI");
            for (var j = 12,length = list.length; j < length; j++) {
                if(list[j]){
                    list[j].style.display = "none";
                }
            }
        }
    }
    scope._pubSub.subscribe("adSkinHandled",null,function(){
        var tabID = arguments[0][0];
        pager[tabID] = new App.skinManage.pager();
        pagerContainer[tabID] = pager[tabID].create(12,tabID);
        newContainer.appendChild(pagerContainer[tabID]);
        if(pagerContainer['t0']){
            pagerContainer['t0'].style.display = "";
            if(!bLoaded){
                bLoaded = true;
                var list = $E("t0").getElementsByTagName("LI");
                for (var j = 12,length = list.length; j < length; j++) {
                    if(list[j]){
                        list[j].style.display = "none";
                    }
                }
            }
        }
    });
    
    scope._pubSub.subscribe("switchTab",null,function(){
        var tabID;
        for(var i=0;i<=5;i++){
            tabID = "t" + i;
            pagerContainer[tabID].style.display = arguments[0][0] === tabID?"":"none";
        }
    });
    
    scope._pubSub.subscribe("gotoPage",null,function(){
        var page = arguments[0][0],tabID = arguments[0][1] ,link = arguments[0][2];
        pager[tabID].gotoPage(page,tabID,link);
    });
	App.skinManage.initModule();
    
    //初始化处理边框背景
    (function(){
        var borderBg;
        if(!scope.$myskin){//仅自定义样式时
            borderBg = scope.$borderBg||'black';
            App.skinManage.customDom.domList.borderBgColor.style.backgroundColor = borderBg.replace("Bg","");
            App.skinManage._borderBg =  App.skinManage.customDom.domList.borderBgColor.style.backgroundColor; //提交背景颜色
			if($E("rightborder")){
				$E("rightborder").className = "MIB_mblogbgr " + borderBg;				
			}
			if($E("bottomborder")){
	            $E("bottomborder").className = "bottomLinks " + borderBg;				
			}
        }
    })();
	//非引导进入和自定义皮肤
	if(!scope.$isSkin && !scope.$changeSkin){
			App.skinManage.renderPage();		
	}	
	
});

App.skinManage.pager = function(){};

App.skinManage.pager.prototype = {
    /**
     * @param{Number}pageSize
     * @param{Number}tabID
     * */
    create:function(pageSize,tabID){
        var total = $E(tabID).getElementsByTagName("LI").length;
        this.current = 1;
        var me = this;
        
        var size = (typeof pageSize === "number") ? pageSize:12;
        var container = $C("DIV");
        container.id = "paging" + tabID.match(/\d/)[0];
        container.className = "skinPage2";
        if(total > pageSize){
            container.style.display = "";
            var num = Math.floor(total/size) + (total%size?1:0);
            var link = [];
            link.push('<div class="fanye MIB_txtbl">');
            link.push('<a href="javascript:void(0);" onclick="scope._pubSub.publish(\'gotoPage\',[#{pre},#{tab},this]);return false;" class="btn_num btn_numWidth" style="display:none;"><em>#{prePage}</em></a>'.replace(/#\{prePage\}/,$CLTMSG['CX0076']).replace(/#\{pre\}/,me.current-1));
            link.push('<span>1</span>');
            for(var i=2;i<=num;i++){
                link.push('<a href="javascript:void(0);" class="btn_num" \
                        onclick="scope._pubSub.publish(\'gotoPage\',[#{i},#{tab},this]);return false;" ><em>#{i}</em></a>'
                        .replace(/#\{i\}/g,i));
            }
            link.push('<a href="javascript:void(0);" onclick="scope._pubSub.publish(\'gotoPage\',[#{next},#{tab},this]);return false;" class="btn_num btn_numWidth"><em>#{nextPage}</em></a>'.replace(/#\{nextPage\}/,$CLTMSG['CX0077']).replace(/#\{next\}/,me.current+1));
            link.push("</div>");
            var html  = link.join("").replace(/#\{tab\}/g,"'"+tabID+"'");
            
            container.innerHTML = html;
        }
        this.maxPage = Math.ceil(total/pageSize);
        container.style.display = "none";
        return container;
    },
    getPage:function(page){
        page = Math.max(1,page);
        page = Math.min(page,this.maxPage);
        return page;
    },
    /**
     * 翻页（数据为一次性加载的，翻页只是动态显隐皮肤）
     * @param{Number/String}page
     * @param{String}tabID
     * @param{HTMLElment}link
     * bold 
     * */
    gotoPage:function(page,tabID,link){
        page = this.getPage(page);
        var pre =  this.getPage(page-1);
        var next=  this.getPage(page+1);
        
        var dom = $E("paging" + tabID.match(/\d/)[0]);
        var nodes = dom.getElementsByTagName("A");
        nodes[0].style.display = (page===1||page===0) ? "none" : "";
        nodes[nodes.length-1].style.display = (page === nodes.length-2+1) ? "none" : "";
        
        nodes[0].onclick = function(e){
            scope._pubSub.publish('gotoPage',[pre,tabID,this]);
			Core.Events.stopEvent(e);
        }
        
        nodes[nodes.length-1].onclick =function(e){
            scope._pubSub.publish('gotoPage',[next,tabID,this]);
			Core.Events.stopEvent(e);
        }
        
        var span = dom.getElementsByTagName("SPAN")[0];
        var tagA = $C("A");
        tagA.href="javascript:void(0);";
        var num = parseInt(span.innerHTML);
        tagA.onclick = function(){
            scope._pubSub.publish('gotoPage',[num,tabID,tagA]);
            return false;
        };
        tagA.className = "btn_num";
        tagA.innerHTML = "<em>i</em>".replace("i",span.innerHTML);
        span.parentNode.replaceChild(tagA,span);
        
        if(link.className.indexOf("btn_numWidth")===-1){
            span.innerHTML = page;
            link.parentNode.replaceChild(span,link);
        }else{
            if(this.current > page){//pre
               var newSpan = $C("SPAN");
               newSpan.innerHTML = this.current - 1 ;
               nodes[pre].parentNode.replaceChild(newSpan,nodes[this.current - 1]);
            }else{//next
               var newSpan = $C("SPAN");
               newSpan.innerHTML = this.current + 1 ;
               nodes[next].parentNode.replaceChild(newSpan,nodes[this.current + 1]);
            }
        }
        
        //隐藏或者显示模板-------------------------------------------------------------
        var tab = $E(tabID);
        if (tab.className.indexOf("set_controlDiv") !== -1) {
            var list = tab.getElementsByTagName("LI");
            if (typeof page === "number") {
                var length = list.length
                for (var i = 0; i < length; i++) {
                    list[i].style.display = "none";
                }
                //一次最多显示12个模板
                var n = page * 12 - 1;
                var range = Math.min(n,length);
                for (var k = n - 11; k <= range; k++) {
                    if (list[k]) {
                        list[k].style.display = "";
                    }
                }
            }
        }
        //--------------------------------------------------------------------------
        
        this.current = page;
    }
};

/*
 * 离开时给用户提示
 */
window.onbeforeunload = function(){
    if(!App.skinManage.saved){
        return;
    }else{
        return $CLTMSG['CD0123'];
    }
};

//取消按钮使用自定义提示
scope.onbeforeunload = function(){
    if(!App.skinManage.saved){
        return window.location.href = "http://t.sina.com.cn/";
    }
    App.skinManage.saved = false;
    App.confirm($CLTMSG['CD0123'],{
        icon:4,
        width:360,
        ok:function(){
            window.location.href = "http://t.sina.com.cn/";
        },
        cancel:function(){
            App.skinManage.saved = true;
        }
    });
};

/**
 *一键切换皮肤
 * @param{String} skinID
 * @param{String} skinName
 * */
scope.changeSkin = function(skinID,skinName){	
    App.confirm($CLTMSG['CD0157'].replace(/#\{name\}/,skinName),{
        icon:4,
        width:360,
        ok:function(){
			var obj = {};
			scope.postSkinId = skinID;
			scope._skinName_ = skinName;
    		App.skinManage.submit(obj);
        },
        cancel:function(){
			if(skinID == scope.$skin){
				return;
			}		
			var head = document.getElementsByTagName("head")[0];		
			var skin_transformers = $E("skin_transformers");
			var skin_tw = $E('skin_tw');
			var v = conf.js; 
			if(scope.$myskin){							
				var path = scope.$BASEIMG+"skin/";
				skinID = scope.$skin;
				if(skin_transformers){
					var node = skin_transformers.cloneNode(true);
					Core.Dom.removeNode(skin_transformers);
					node.href = path+skinID + "/skin.css?version="+v;
					head.appendChild(node);
				}
				if(skin_tw){
					skin_tw.href = path + skinID + "/tw_skin.css?version="+v;
					h.appendChild(skin_tw);
				}	
			}else{																	
				skin_transformers.href = "http://t.sina.com.cn/person/getskincss.php?ouid=" + scope.$uid+"&version="+v;				
				head.appendChild(skin_transformers);					
				if(skin_tw){				
					skin_tw.href = scope.$BASEIMG+"skin/skin_diy/skin.css";
					head.appendChild(skin_tw);
				}
				App.skinManage.renderPage();
			}			
		}
    });
};


$registJob('changeSkinDial',function(){
	if(scope.$changeSkin){
		var skinId = scope.$changeSkin[0];
		var skinName=scope.$changeSkin[1];
		var id     = scope.$changeSkin[2];
		var expire = scope.$changeSkin[3];
		if(expire==1){
			var dialog = App.alert($CLTMSG['CD0168']);
			setTimeout(function(){
				if(dialog && !dialog._distory){
	                  dialog.close();
	             }
			},3000);
			return;
		}
		var el     = $E(id);
		scope.changeSkin(skinId,skinName);
		if(el){
			App.skinManage.switchTopTips(el,'t'+id.replace(/[^\d]+/,''));	
		}
		
	}
scope.oldPid = scope.$background?scope.$background:'';
scope.newPid = '';
});

/**
 * 处理广告模板
 * @param{String}tabID :各个tab页模板容器id
 * */
App.skinManage.ad = function(tabID){
    this.tabID = tabID;
    
    this.adSkinNum = 0;//该tab页内所有广告模板数量
    this.handledNum = 0;//handledNum用来指明是否已经处理完该tab页内所有广告模板（包括成功和失败的）

};
App.skinManage.ad.prototype = {
    /**
     * 解析模板中广告模板
     * 根据是否存在广告（mb_skinpos）来解析
     * @param{String}tabID
     * */
    parse: function(){
        var List = $E(this.tabID).getElementsByTagName("LI"), adList = [], ad,index;
        for (var i = 0, len = List.length; i < len; i++) {
            ad = List[i].getAttribute("mb_skinpos");
            if (ad) {
                adList.push(List[i]);
				
                index = i;
                this.get(List[i],ad,i);
            }
        }
        if(adList.length===2 && List[index+1]){
            this._referenceNode = List[index];//参考节点
            this._alternateNode = List[index+1];//替补节点
        }
        return this.adSkinNum = adList.length;
    },
    /**
     * 以jsonp方式（script标签）加载广告模板
     * @requires 返回js形如 : var tmpl_id_微博广告位置id = '1';
     * @param{HTMLElment}li:微博广告占位li
     * @param{String}mb_skinpos:微博广告位置id
     * @param{Number}index
     * */
    get: function(li,mb_skinpos,index){
        var me = this;
        var url = "http://dcads.sina.com.cn/html.ng/pos=mbskinsel&site=sina&mb_skinpos=" + mb_skinpos;  //正常代码
        url += "&request_id=" + new Date().getTime().toString();
        var script = document.createElement("script");
        script.charset = "UTF-8";
        script.setAttribute("type", "text/javascript");
        var loaded = false, skinID;
        script[document.all ? "onreadystatechange" : "onload"] = function(){
            if (this.onload || this.readyState.toLowerCase() == 'complete' || this.readyState.toLowerCase() == 'loaded') {
                skinID = window["tmpl_id_" + mb_skinpos];
                loaded = true;
                if (skinID) {
                    me.succ(li,skinID,mb_skinpos,index);
                }else {
                    me.fail(li,index);
                }
            }
        };
        script.setAttribute("src", url);
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(script);
        
        setTimeout(function(){
            if (!loaded) {
                script.onload = null;
                script.onreadystatechange = null;
                head.removeChild(script);
                me.fail(li,index);
            }
        }, 2000);
    },
    /**
     * 加载成功回调,显示对应的广告模板缩略图,绑定点击事件.<b>显示分页工具栏</b>
     * 返回的tmpl_id_微博广告位置id即相当于skinID
     * @requires scope.$adSkinNames内含广告模板占位id和名称映射,形如scope.$adSkinNames = {mb_skinpos":"skin_name",...};
     * @param{HTMLElment}li:微博广告占位li
     * @param{String}skin_id
     * @param{String}mb_skinpos
     * */
    succ: function(li,skin_id,mb_skinpos,index){
		if (scope.$adSkinNames && scope.$adSkinNames[skin_id] && scope.$adSkinNames[skin_id][2]) {
			this.handledNum++;
			li.onclick = function(){
				App.skinManage.changeSkin(skin_id, this, scope.$adSkinNames[skin_id][2] || "");
			};
			li.onmouseout = function(){
				App.skinManage.skinOut(this);
			};
			li.onmouseover = function(){
				App.skinManage.skinOver(this);
			};
			li.innerHTML = '\
		        <a class="noborder" onclick="return false;" href="#">\
		             <img class="set_templateTH" src="'+scope.$BASEIMG+'skin/#{skin_id}/styleimg.gif">\
		            <p class="name">#{skin_name}</p>\
		        </a>'.replace(/#\{skin_id\}/, skin_id).replace(/#\{skin_name\}/, scope.$adSkinNames[skin_id][1] || "");
			if(this.adSkinNum === 2 && mb_skinpos === "promotion_6"){
				li.parentNode.removeChild(li);
				Core.Dom.insertAfter(li,$E(this.tabID).getElementsByTagName("LI")[5]);
				var tempArr = [];
				for(var i in scope.$adSkinNames){
					tempArr.push(i);
				}
				if(scope.$skin == tempArr[1]){
					li.className = "set_chosedTemp onborder";
				}else{
					li.className = "";
				}
			}
			li.style.display = "";
		}else{
			return this.fail(li,index);
		}
        this._check();
    },
    /**
     * 加载失败或者超时删除预定广告模板占位元素（<li></li>）
     * @param{HTMLElment}li:微博广告占位li
     * @param{Number}index :广告模板在模板列表中的位置索引
     * */
    fail: function(li,index){
        this.handledNum++;
        if(index === 0 && this._alternateNode){
            /**
             * fucked hack!如果投放广告模板过期等，则顺补位置，保证下个广告模板位置不变
             * 一个Tab页中最多2个广告模板，0，6位两位置
             * */
            var me = this;
            try{
                li.parentNode.insertBefore(me._alternateNode, me._referenceNode||null);
            }catch(e){
            }
            li.parentNode.removeChild(li);
        }else{
            li.parentNode.removeChild(li);
        }
        
        this._check();
    },
    /**
     * 检查是否已经处理完该tab页内所有广告模板
     * */
    _check:function(){
        if(this.adSkinNum === this.handledNum){
            scope._pubSub.publish("adSkinHandled",[this.tabID]);
        }
    }
};