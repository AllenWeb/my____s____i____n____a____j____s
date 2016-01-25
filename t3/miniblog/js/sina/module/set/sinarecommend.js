/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview SinaRecommend 新浪推荐页签，存在于博客个首的页面设置中
 * @author xy xinyu@staff.sina.com.cn
 * @version 1.0 | 2009-07-09
 */
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/foreach.js");
$import("sina/core/array/uniq.js");
$import("sina/core/array/findit.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/tab/tabs.js");
$import("sina/msg/systemMSG.js");
$import("sina/msg/customMSG.js");
$import("sina/utils/template.js");
$import("sina/module/set/sinarecommendconfig.js");
$import("sina/utils/tab/tabs.js");
$import("sina/module/set/leftrightfunc.js");
$import("sina/utils/flash/swf.js");
$import("sina/interface.js");

//如果页面内有SINAPRO这个cookie，将其存入scope
if (typeof __SINAPRO__=="undefined") {
	scope.__SINAPRO__ = "";
}
else {
	scope.__SINAPRO__ = __SINAPRO__;
}

function resultFunc(code){
    if (code == "A00006") {
        window.windowDialog.alert($SYSMSG["A00006"], {
            funcOk: function(){
                window.location.reload();
            },
            icon: "01"
        });
    }
    else {
        window.windowDialog.alert($SYSMSG["A00001"], {
            funcOk: function(){
                scope.recommend.resetData();
                scope.recommend.cancel();
            },
            icon: "02"
        });
    }
}

/**
 * 将json对象转换为数组
 * @param {Object} obj
 */
function j2a(obj){
    var arr = [];
    for (var k in obj) {
        if (obj[k]) 
            arr.push(obj[k]);
    }
    return arr;
};
var SinaRecommend = Core.Class.create();
SinaRecommend.prototype = {
    /**
     * 关闭时是否需要提示保存
     */
    isSave: true,
    
    /**
     * 进入页面时初始化的值
     */
    activeSelectHead: undefined,//进入页面时用户拥有的头像，如果没有用这些头像，则为空。目前进入时，不进行选择，因为卫东那里没有传入的参数
    activeSelectBg: config.common.t,//进入页面时用户拥有的背景
    activeselectedWidget: config.component.c1.concat(config.component.c3),//进入页面时用户已经拥有的widget
    activeTag: undefined,//用户原来选择的分类
    activeWidget: [],//记录在“新浪推荐”页签内用户拥有的widget,主要用于在关闭页签时，用户不保存的情况下resetData页签使用
    activeLength: 0,//初始化时拥有的widget的个数
    activeImgSrc: "",//初始化时头像的地址，用来在取消操作时重置头像
    customHead: undefined,//自定义头像，如果有的话进行赋值
    customBg: undefined,//自定义背景，如果有的话进行赋值
    swf_url: "http://simg.sinajs.cn/common/swf/upload.swf",
    /**
     * 点击后选中的头像，背景，widget
     */
    selectedTag: undefined,//选择第几个分类
    selectedHead: "",
    selectedBg: "",
    selectedWidget: [],//用户选择的widget;
    selectedLength: 0,//用户操作后的widget长度，初始值为原有widget长度
    data: Biz_Package_Config,//配置文件读入
    variables: {},
    
    initialize: function(dialog){
        var _this = this;
        this.activeLength = this.activeselectedWidget.length;
        this.selectedHead = this.activeSelectHead;
        this.selectedBg = this.activeSelectBg;
        this.selectedLength = this.activeLength;
        this.activeImgSrc = $E('blogInfoImage').src;
        this.customHead = $E('diy_banner');
        this.customBg = $E('diy_bg');
        this.dialog = dialog;
        
        //不管用户选择的什么头像、背景已经widget,进入新浪推荐这个页签时，都先显示第一个元素内的东西
        for (var k in this.data) {
            for (var i = 0; i < this.data[k].tpl.length; i++) {
                if (this.data[k].tpl[i].id == this.activeSelectBg) {
                    this.activeTag = k;
                    break;
                }
            }
        }
        if (!this.activeTag) {
            for (var k in this.data) {
                this.activeTag = k;
                break;
            }
        }
        
        this.initTags();
        this.showTabs(this.activeTag);
        this.initEvent();
        if (!$E('sinarecommendswf')) {
            var html = '<object width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="uploadHead">\
						<param name="quality" value="high"/>\
						<param name="bgcolor" value="#000"/>\
						<param name="allowScriptAccess" value="always"/>\
						<param name="movie" value="http://simg.sinajs.cn/common/swf/upload.swf"/>\
						<embed width="1" height="1"  pluginspage="http://www.macromedia.com/go/getflashplayer" src="http://simg.sinajs.cn/common/swf/upload.swf" type="application/x-shockwave-flash" bgcolor="#000" allowscriptaccess="always" id="uploadHead_f"/>\
						</object>';
            Core.Dom.addHTML(document.body, '<div id="sinarecommendswf">' + html + '</div>');
        }
        //		if(!$E('sinarecommendswf')){
        //			Core.Dom.addHTML(document.body, '<div id="sinarecommendswf"></div>');
        //			Utils.Flash.swfView.Add(this.swf_url, "sinarecommendswf", "uploadHead", "100", "120", "8.0.0.0", "#000", {}, {
        //	            scale: "noscale",
        //	            allowScriptAccess: "always",
        //	            wmode: "transparent"
        //       		 });
        //       		Utils.Flash.swfView.Init();
        //		}
    
    },
    /**
     * 初始化
     */
    initTags: function(){
        var _this = this;
        var vtabs = new Tabs($E("sina_re_vtabs"));
        for (var name in this.data) {
            var op = {
                className: "CP_setsbon",
                onabort: Core.Function.bind3(_this.hiddenTag, _this, [name]),
                onfocus: Core.Function.bind3(_this.showTag, _this, [name])
            };
            var title = '<span class="moodicon"><img src="' + this.data[name].logo + '"/></span><a href="javascript:;" id="srvtab_em_' + name + '">' + this.data[name].name + '</a>';
            //			$Debug("this.whichNum="+_this.whichNum);
            if (name == this.activeTag) {
                op.isFocus = true;
                this.initItems(name);
            }
            
            this[name + "_tab"] = new Tab(title, op);
            vtabs.add(this[name + "_tab"]);
            
            
        }
        
        
    },
    /**
     * 初始化各个页签
     * @param {Object} name 代表传入的是第几个分类，对应左侧竖直的选择页签
     */
    initItems: function(name){
        //		alert("init");
        //右边具体内容
        var div = $C('div');
        div.className = "CP_setstys";
        div.id = "sr_right_" + name;
        $E('sina_re_right').appendChild(div);
        
        //右边三个种类的template
        
        var dl = '<dl class="#{classname}">\
					<dt><em>#{title}</em></dt>\
						<dd>\
							<div class="CP_sinaIntr_mid">\
							<ul class="CP_chos" style="width:2000px;" value="#{width}">#{lihtml}</ul></div>\
							<div class="CP_siArro_l" onclick="toLeft();"><a href="javascript:;"></a></div>\
							<div class="CP_siArro_r" onclick="toRight();"><a href="javascript:;"></a></div>\
						</dd>\
				</dl>';
        
        var dltmp = new Utils.Template(dl);
        
        //生成三个种类的li的内容,然后将这三个种类通过模板方法加入到容器中
        
        //head头像的li
        var headli = "";
        //头像的li总共的长度，每次移动时，需要计算这个长度，判断是否可以左移或者右移
        this.headwidth = 0;
        for (var i = 0; i < this.data[name].head.length; i++) {
            this.headwidth += 66;
            var tmp = this.data[name].head[i];
            
            //			if(tmp.id==this.activeSelectHead){//由于卫东不想多传参数，所以进入时头像不选择
            //				headli+='<li class="CP_choson"><a href="javascript:;" id="item_head_'+tmp.id+'"><span alt="选择'+tmp.name+'头像" title="选择'+tmp.name+'头像"><img src="'+tmp.img_preview+'"/></span>\
            //						<img align="absmiddle" class="CP_i CP_i_ok" src="http://simg.sinajs.cn/common/images/CP_i.gif" /></a>\
            //						<cite>'+tmp.name+'</cite></li>';
            //			}else{
            headli += '<li class="CP_choson"><a href="javascript:;" id="item_head_' + tmp.id + '"><span alt="选择' + tmp.name + '头像" title="选择' + tmp.name + '头像"><img src="' + tmp.img_preview + '"/></span></a>\
					<cite>' +
            tmp.name +
            '</cite></li>';
            //			}
        
        }
        //背景的li
        var bgli = "";
        //背景的li总共的长度，每次移动时，需要计算这个长度，判断是否可以左移或者右移
        this.bgwidth = 0;
        for (var i = 0; i < this.data[name].tpl.length; i++) {
            this.bgwidth += 66;
            var tmp = this.data[name].tpl[i];
            
            if (tmp.id == this.activeSelectBg) {
                bgli += '<li class="CP_choson"><a href="javascript:;" id="item_tpl_' + tmp.id + '"><span alt="选择' + tmp.name + '模板" title="选择' + tmp.name + '模板"><img src="' + tmp.img_preview + '"/></span>\
						<img align="absmiddle" class="CP_i CP_i_ok" src="http://simg.sinajs.cn/common/images/CP_i.gif" /></a>\
						<cite>' +
                tmp.name +
                '</cite></li>';
            }
            else {
                bgli += '<li class="CP_choson"><a href="javascript:;" id="item_tpl_' + tmp.id + '"><span alt="选择' + tmp.name + '模板" title="选择' + tmp.name + '模板"><img src="' + tmp.img_preview + '"/></span></a>\
						<cite>' +
                tmp.name +
                '</cite></li>';
            }
            
        }
        //widget的li
        var widgetli = "";
        //widget的li总共的长度，每次移动时，需要计算这个长度，判断是否可以左移或者右移
        this.widgetwidth = 0;
        //		$Debug("activeselectedWidget="+this.activeselectedWidget);
        var havedwidget = this.activeselectedWidget.join(",");
        for (var i = 0; i < this.data[name].widget.length; i++) {
            this.widgetwidth += 66;
            var tmp = this.data[name].widget[i];
            
            if (havedwidget.indexOf(tmp.id) > -1) {
                this.activeWidget.push(tmp.id);
                this.selectedWidget.push(tmp.id);
                widgetli += '<li class="CP_choson"><a href="javascript:;" id="item_widget_' + tmp.id + '" ><span alt="选择' + tmp.name + 'widget" title="选择' + tmp.name + 'widget"><img src="' + tmp.img_preview + '"/></span>\
						<img align="absmiddle" class="CP_i CP_i_ok" src="http://simg.sinajs.cn/common/images/CP_i.gif" /></a>\
						<cite>' +
                tmp.name +
                '</cite></li>';
            }
            else {
                widgetli += '<li class="CP_choson"><a href="javascript:;" id="item_widget_' + tmp.id + '" ><span alt="选择' + tmp.name + 'widget" title="选择' + tmp.name + 'widget"><img src="' + tmp.img_preview + '"/></span></a>\
						<cite>' +
                tmp.name +
                '</cite></li>';
            }
            
        }
        
        
        var arr = [];
        var o1 = {};
        o1.classname = "CP_setchg0707 CP_setchg0707_bg1";
        o1.title = "更换博客动漫头像";
        o1.lihtml = headli;
        o1.width = this.headwidth;
        arr.push(o1);
        var o2 = {};
        o2.classname = "CP_setchg0707 CP_setchg0707_bg2";
        o2.title = "更换博客模板";
        o2.lihtml = bgli;
        o2.width = this.bgwidth;
        arr.push(o2);
        var o3 = {};
        o3.classname = "CP_setchg0707 CP_setchg0707_bg3";
        o3.title = "添加Widget到博客";
        o3.lihtml = widgetli;
        o3.width = this.widgetwidth;
        arr.push(o3);
        $E('sr_right_' + name).innerHTML = dltmp.evaluateMulti(arr);
        
        this.clickEvent(name);
        
    },
    /**
     * 给每个右边的div内的三种ul中的li绑定事件
     * @param {Object} id
     */
    clickEvent: function(name){
        var _this = this;
        //得到每个种类内的三个ul
        var uls = $E('sr_right_' + name).getElementsByTagName("ul");
        if (uls.length != 3) 
            return;
        //得到头像的a标签们
        var headlanchor = uls[0].getElementsByTagName('a');
        for (var i = 0; i < headlanchor.length; i++) {
            var anchor = headlanchor[i];
            Core.Events.addEvent(anchor, Core.Function.bind3(_this.headEvent, _this, [anchor, name]), 'click');
        }
        //得到背景的a标签们
        var bganchor = uls[1].getElementsByTagName('a');
        for (var i = 0; i < bganchor.length; i++) {
            var anchor = bganchor[i];
            Core.Events.addEvent(anchor, Core.Function.bind3(_this.bgEvent, _this, [anchor, name]), 'click');
        }
        //得到widget的li们,由于widget需要鼠标移动上去产生大图，所以在li上进行事件绑定
        var widgetlis = uls[2].childNodes;
        
        //给widget的li绑定事件
        for (var i = 0; i < widgetlis.length; i++) {
            var widgetobjs = widgetlis[i];
            Core.Events.addEvent(widgetobjs, Core.Function.bind3(_this.widgetEvent, _this, [widgetobjs, name]), 'mouseover');
            Core.Events.addEvent(widgetobjs, Core.Function.bind3(_this.widgetEvent, _this, [widgetobjs, name]), 'click');
            Core.Events.addEvent(widgetobjs, function(){
                $E('sina_re_preview').innerHTML = '';
                $E('sina_re_preview').style.display = "none";
            }, "mouseout");
        }
    },
    /**
     * 头像点击事件
     * @param {Object} anchor
     */
    headEvent: function(anchor, name){
        var e = Core.Events.fixEvent(Core.Events.getEvent());
        var hid = anchor.id.split("_")[2];
        if (e.type == "click") {
            $Debug("this.selectedHead=" + this.selectedHead + ";hid=" + hid);
            if (this.selectedHead && (this.selectedHead == hid)) {
                //说明该头像已经点击过，是进行取消操作
                //						if(this.activeSelectHead&&(this.activeSelectHead!=this.selectedHead)){
                //							//如果取消一个选中的头像，而该头像又不是刚进入时选中的，则将刚进入的头像重新选中
                //							var orignalanchor=$E('item_head_'+this.activeSelectHead);
                //							var img=$C('IMG');
                //							img.align="absmiddle";
                //							img.className="CP_i CP_i_ok"; 
                //							img.src="http://simg.sinajs.cn/common/images/CP_i.gif";
                //							orignalanchor.appendChild(img);
                //							this.selectedHead=this.activeSelectHead;
                //							var img2=anchor.lastChild;
                //							anchor.removeChild(img2);
                //							$E('blogInfoImage').src=this.activeImgSrc;
                //						}else if(this.activeSelectHead&&(this.activeSelectHead==this.selectedHead)){
                //							//如果点击的是刚进入时选中的头像，则不能取消掉该头像
                //							
                //							
                //						}else{
                this.selectedHead = undefined;
                var img = anchor.lastChild;
                anchor.removeChild(img);
                $E('blogInfoImage').src = this.activeImgSrc;
                //						}
            
            
            
            }
            else 
                if (this.selectedHead && (this.selectedHead != hid)) {
                    //点击不同的头像时，将原来选中的头像的选中状态取消
                    var orignalanchor = $E('item_head_' + this.selectedHead);//得到原来选中的widget
                    var img = orignalanchor.lastChild;
                    orignalanchor.removeChild(img);
                    var img = $C('IMG');
                    img.align = "absmiddle";
                    img.className = "CP_i CP_i_ok";
                    img.src = "http://simg.sinajs.cn/common/images/CP_i.gif";
                    anchor.appendChild(img);
                    this.selectedHead = hid;
                    for (var j = 0; j < this.data[this.selectedTag].head.length; j++) {
                        if (this.data[this.selectedTag].head[j].id == hid) {
                            $E('blogInfoImage').src = this.data[this.selectedTag].head[j].img;
                            this.selectedHead = hid;
                            break;
                        }
                    }
                }
                else {
                    //进入时没有选中过一个头像的情况
                    this.selectedHead = hid;
                    var img = $C('IMG');
                    img.align = "absmiddle";
                    img.className = "CP_i CP_i_ok";
                    img.src = "http://simg.sinajs.cn/common/images/CP_i.gif";
                    anchor.appendChild(img);
                    for (var j = 0; j < this.data[this.selectedTag].head.length; j++) {
                        if (this.data[this.selectedTag].head[j].id == hid) {
                            $E('blogInfoImage').src = this.data[this.selectedTag].head[j].img;
                            this.selectedHead = hid;
                            break;
                        }
                    }
                }
        }
    },
    /**
     * 背景点击事件
     * @param {Object} anchor
     */
    bgEvent: function(anchor, name){
        var _this = this;
        var e = Core.Events.fixEvent(Core.Events.getEvent());
        var hid = anchor.id.split("_")[2] + "_" + anchor.id.split("_")[3];
        if (e.type == "click") {
            $Debug("this.selectedBg=" + this.selectedBg + ";hid=" + hid);
            if (this.selectedBg && (this.selectedBg == hid)) {
                $Debug("1");
                //说明该头像已经点击过，是进行取消操作
                if (this.activeSelectBg && (this.activeSelectBg != this.selectedBg)) {
                    //如果取消一个选中的背景，而该背景又不是刚进入时选中的，则将刚进入的背景重新选中
                    var orignalanchor = $E('item_tpl_' + this.activeSelectBg);
                    var img = $C('IMG');
                    img.align = "absmiddle";
                    img.className = "CP_i CP_i_ok";
                    img.src = "http://simg.sinajs.cn/common/images/CP_i.gif";
                    if (orignalanchor) 
                        orignalanchor.appendChild(img);
                    this.selectedBg = this.activeSelectBg;
                    var img2 = anchor.lastChild;
                    anchor.removeChild(img2);
                    this.dwThemeCss(this.activeSelectBg.split('_'));
                    
                    if (this.customHead) {
                        setTimeout(function(){
                            document.getElementsByTagName('head')[0].appendChild(_this.customHead);
                        }, 3);
                    }
                    
                    if (this.customBg) {
                        setTimeout(function(){
                            document.getElementsByTagName('head')[0].appendChild(_this.customBg);
                        }, 3);
                    }
                }
                else 
                    if (this.activeSelectBg && (this.activeSelectBg == this.selectedBg)) {
                    //如果点击的是刚进入时选中的背景，则不能取消掉该背景
                    
                    }
                
                
            }
            else 
                if (this.selectedBg && (this.selectedBg != hid)) {
                    $Debug(2);
                    //点击不同的背景时，将原来选中的背景的选中状态取消
                    var orignalanchor = $E('item_tpl_' + this.selectedBg);//得到原来选中的背景
                    if (orignalanchor) {
                        var img = orignalanchor.lastChild;
                        orignalanchor.removeChild(img);
                    }
                    var img = $C('IMG');
                    img.align = "absmiddle";
                    img.className = "CP_i CP_i_ok";
                    img.src = "http://simg.sinajs.cn/common/images/CP_i.gif";
                    anchor.appendChild(img);
                    this.selectedBg = hid;
                    for (var j = 0; j < this.data[this.selectedTag].tpl.length; j++) {
                        if (this.data[this.selectedTag].tpl[j].id == hid) {
                            this.selectedBg = hid;
                            this.dwThemeCss(this.selectedBg.split('_'));
                            if (this.selectedBg == this.activeSelectBg) {
                            
                                if (this.customHead) {
                                    setTimeout(function(){
                                        document.getElementsByTagName('head')[0].appendChild(_this.customHead);
                                    }, 5);
                                }
                                
                                if (this.customBg) {
                                    setTimeout(function(){
                                        document.getElementsByTagName('head')[0].appendChild(_this.customBg);
                                    }, 5);
                                }
                            }
                            else {
                                if ($E('diy_banner')) {
                                    document.getElementsByTagName('head')[0].removeChild($E('diy_banner'));
                                }
                                if ($E('diy_bg')) {
                                    document.getElementsByTagName('head')[0].removeChild($E('diy_bg'));
                                }
                            }
                            break;
                        }
                    }
                }
                else {
                    $Debug(3);
                    //进入时没有选中过一个背景的情况
                    this.selectedBg = hid;
                    var img = $C('IMG');
                    img.align = "absmiddle";
                    img.className = "CP_i CP_i_ok";
                    img.src = "http://simg.sinajs.cn/common/images/CP_i.gif";
                    anchor.appendChild(img);
                    for (var j = 0; j < this.data[this.selectedTag].tpl.length; j++) {
                        if (this.data[this.selectedTag].tpl[j].id == hid) {
                            this.selectedBg = hid;
                            this.dwThemeCss(this.selectedBg.split('_'));
                            if ($E('diy_banner')) {
                                document.getElementsByTagName('head')[0].removeChild($E('diy_banner'));
                            }
                            if ($E('diy_bg')) {
                                document.getElementsByTagName('head')[0].removeChild($E('diy_bg'));
                            }
                            break;
                        }
                    }
                }
        }
    },
    /**
     * widget的事件
     * @param {Object} liobj 被点击的那个li
     */
    widgetEvent: function(liobj){
        var _this = this;
        var e = Core.Events.fixEvent(Core.Events.getEvent());
        //$Debug(e.type);
        var anchor = liobj.firstChild;//被选中的li的第一个孩子节点，即a标签
        var wid = anchor.id.split("_")[2];
        if (e.type == "mouseover") {
            for (var j = 0; j < this.data[this.selectedTag].widget.length; j++) {
                //				$Debug(this.data[this.selectedTag].widget[j].id + ":" + wid);
                if (this.data[this.selectedTag].widget[j].id == wid) {
                    imgsrc = this.data[this.selectedTag].widget[j].img;
                    text = this.data[this.selectedTag].widget[j].description;
                    break;
                }
            }
            $E('sina_re_preview').innerHTML = '<img src="' + imgsrc + '" /><p>' + text + '</p>';
            $E('sina_re_preview').style.display = "block";
        }
        else 
            if (e.type == "click") {
            
                if (Core.Array.findit(_this.selectedWidget, wid) > -1) {
                    $Debug("应该取消对号！");
                    //点击同一个widget时，取消原来的选中状态
                    var img = anchor.lastChild;
                    anchor.removeChild(img);
                    _this.selectedWidget = Core.Array.ArrayWithout(_this.selectedWidget, [wid]);//将该分类下selectedWidget去掉
                    this.selectedLength--;
                }
                else {
                    if (this.selectedLength >= 20) {
                        windowDialog.alert("你的页面模块已超过20个，不能继续添加。过多的模块会影响页面的打开速度。", {
                            "icon": "03"
                        });
                        return;
                    }
                    //该分类下没有选中的widget时
                    _this.selectedWidget.push(wid);
                    
                    var img = $C('IMG');
                    img.align = "absmiddle";
                    img.className = "CP_i CP_i_ok";
                    img.src = "http://simg.sinajs.cn/common/images/CP_i.gif";
                    anchor.appendChild(img);
                    this.selectedLength++;
                }
            }
        $Debug(_this.selectedWidget.join(','));
    },
    /**
     * 推荐分类之间切换，某个推荐分类的隐藏。
     * @param {String} id 推荐分类号
     */
    hiddenTag: function(id){
        $Debug("execute hiddentag " + id);
        var item = $E("sr_right_" + id);
        if (item) {
            item.style.display = "none";
        }
    },
    /**
     * 推荐分类之间切换，某个推荐分类的显示。
     * @param {String} id 推荐分类号
     */
    showTag: function(id){
        $Debug("execute showtag " + id);
        var item = $E("sr_right_" + id);
        if (!item) {
            this.initItems(id);
            item = $E("sr_right_" + id);
        }
        item.style.display = "block";
        this.selectedTag = id;
    },
    showTabs: function(name){
        this[name + "_tab"].setFocus();
    },
    initEvent: function(){
        Core.Events.addEvent("sina_recommend_save", Core.Function.bind2(this.save, this), "click");
        Core.Events.addEvent("sina_recommend_cancel", Core.Function.bind2(this.cancel, this), "click");
    },
    /**
     * 导入css文件
     * @param {Array} ids 模板号
     */
    dwThemeCss: function(ids){
    
        if ($IE) {
            var links = SwapLink2.getThemeLinks();
            SwapLink2.loading = true;
            SwapLink2.appendLink(ids, Core.Function.bind3(SwapLink2.deleteTLink, SwapLink2, [links]));
        }
        else {
            $E("themeLink").href = scope.$BASECSS + "tpl/" + ids[0] + "_" + ids[1] + "/t.css";
        }
    },
    save: function(){
        var _this = this;
        
        $Debug("selectedWidget=" + _this.selectedWidget.length);
        $Debug("activeWidget=" + _this.activeWidget.length);
        
        //将初始化时页签有的widget从总的widget中去掉，然后再将选中的widget合并进来，就是需要提交的widget结果数组
        var tmparr = Core.Array.ArrayWithout(_this.activeWidget, _this.selectedWidget);
        var tmparr2 = Core.Array.ArrayWithout(_this.selectedWidget, _this.activeWidget);
        //有变化，需要调用接口
        if (tmparr.length != 0 || tmparr2.length != 0 || (_this.selectedBg != _this.activeSelectBg)) {
        
            var req = new Interface("http://icp.cws.api.sina.com.cn/pfconf/sale_tp.php", "jsload");
            req.request({
                GET: {
                    tp: _this.selectedBg,
                    uid: scope.$uid,
                    productid: scope.pid_map[$CONFIG.$product],
                    moduleid: _this.selectedWidget.join(',')
                
                },
                onSuccess: function(res){
                    //成功后操作
                    //用户选中了一个头像
                    if (_this.selectedHead) {
                    
                        var headurl;
                        for (var k in _this.data) {
                            for (var i = 0; i < _this.data[k].head.length; i++) {
                                if (_this.data[k].head[i].id == _this.selectedHead) {
                                    headurl = _this.data[k].head[i].img;
                                    break;
                                }
                            }
                        }
                        if ($IE) 
                            var swfo = $E('uploadHead');
                        else 
                            var swfo = $E('uploadHead_f');
                        $Debug(headurl);
                        try {
                            swfo.upLoad(scope.$uid, scope.__SINAPRO__, headurl, "resultFunc");
                        } 
                        catch (e) {
                            window.windowDialog.alert("该浏览器不支持该上传头像方法！", {
                                icon: "01"
                            });
                        }
                    }
                    else {
                        window.windowDialog.alert($SYSMSG["A00006"], {
                            funcOk: function(){
                                window.location.reload();
                            },
                            icon: "02"
                        });
                    }
                    
                },
                onError: function(res){
                    showError(res.code);
                    _this.resetData();
                }
                
            });
        }
        else {
            if (_this.selectedHead) {
                var headurl;
                for (var k in _this.data) {
                    for (var i = 0; i < _this.data[k].head.length; i++) {
                        if (_this.data[k].head[i].id == _this.selectedHead) {
                            headurl = _this.data[k].head[i].img;
                            break;
                        }
                    }
                }
                if ($IE) 
                    var swfo = $E('uploadHead');
                else 
                    var swfo = $E('uploadHead_f');
                $Debug(headurl);
                try {
                    swfo.upLoad(scope.$uid, scope.__SINAPRO__, headurl, "resultFunc");
                } 
                catch (e) {
                   window.windowDialog.alert("该浏览器不支持该上传头像方法！", {
                                icon: "02"
                            });
                }
            }
        }
        
    },
    cancel: function(){
        this.isSave = false;
        this.dialog.hidden();
        this.isSave = true;
    },
    isChanged: function(){
        var _this = this;
        //头像变化时
        if (this.activeSelectHead != this.selectedHead) 
            return true;
        //背景变化时
        if (this.selectedBg && (this.selectedBg != this.activeSelectBg)) 
            return true;
        //widget变化时
        var arr = this.activeselectedWidget;
        var arr2 = this.activeWidget;
        var len = 0;//用户操作后该页签内被选中的widget的数量
        if (this.selectedWidget.length != this.activeWidget.length) 
            return true;
        var tmparr = Core.Array.ArrayWithout(_this.activeWidget, _this.selectedWidget);
        if (tmparr.length != 0) 
            return true;
        
        return false;
    },
    resetData: function(){
        var _this = this;
        //重置头像操作
        if (this.activeSelectHead != this.selectedHead) {
        
            $E('blogInfoImage').src = this.activeImgSrc;
            var selectedanchor = $E('item_head_' + this.selectedHead);
            var img2 = selectedanchor.lastChild;
            selectedanchor.removeChild(img2);
            $E('blogInfoImage').src = this.activeImgSrc;
            this.selectedHead = this.activeSelectHead;
        }
        
        //重置背景操作
        if (this.activeSelectBg != this.selectedBg) {
            //将选择的去掉
            var selectedanchor = $E('item_tpl_' + this.selectedBg);
            if (selectedanchor) {
                var img = selectedanchor.lastChild;
                selectedanchor.removeChild(img);
            }
            //将原来应该选中的选中
            var orignalanchor = $E('item_tpl_' + this.activeSelectBg);
            if (orignalanchor) {
                var img = $C('IMG');
                img.align = "absmiddle";
                img.className = "CP_i CP_i_ok";
                img.src = "http://simg.sinajs.cn/common/images/CP_i.gif";
                orignalanchor.appendChild(img);
                this.selectedBg = this.activeSelectBg;
            }
            else {
                this.selectedBg = undefined;
            }
            this.dwThemeCss(this.activeSelectBg.split('_'));
            if (this.customHead) {
                setTimeout(function(){
                    document.getElementsByTagName('head')[0].appendChild(_this.customHead);
                }, 3);
            }
            //			$Debug(">>>>>>>this.customBg="+this.customBg.innerHTML);
            if (this.customBg) {
                setTimeout(function(){
                    document.getElementsByTagName('head')[0].appendChild(_this.customBg);
                }, 3);
            }
        }
        
        //重置widget操作
        var arr = this.activeWidget;
        var delarr = Core.Array.ArrayWithout(_this.selectedWidget, _this.activeWidget);
        for (var i = 0; i < delarr.length; i++) {//将后来选中的widget都清空
            var id = delarr[i];
            var orignalanchor = $E('item_widget_' + id);//得到原来选中的widget
            var img = orignalanchor.lastChild;
            orignalanchor.removeChild(img);
        }
        var addarr = Core.Array.ArrayWithout(_this.activeWidget, _this.selectedWidget);
        for (var i = 0; i < addarr.length; i++) {
            //将后来选中的widget都清空
            var id = addarr[i];
            var orignalanchor = $E('item_widget_' + id);//得到原来选中的widget
            var img = $C('IMG');
            img.align = "absmiddle";
            img.className = "CP_i CP_i_ok";
            img.src = "http://simg.sinajs.cn/common/images/CP_i.gif";
            orignalanchor.appendChild(img);
        }
        
        this.selectedWidget = this.activeWidget;
        //将那些初始化时存在但却在后来被用户点掉的widget重新选中
        for (var k in this.activeWidget) {
            var id = this.activeWidget[k];
            var anchor = $E('item_widget_' + id);
            if (anchor.getElementsByTagName('IMG').length < 2) {
                var img = $C('IMG');
                img.align = "absmiddle";
                img.className = "CP_i CP_i_ok";
                img.src = "http://simg.sinajs.cn/common/images/CP_i.gif";
                anchor.appendChild(img);
                this.selectedWidget[k] = id;
            }
        }
        this.selectedLength = this.activeselectedWidget.length;
        //		$Debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        //		$Debug("activeTag="+this.activeTag+";selectedTag="+this.selectedTag);
    
        //		this[this.selectedTag+"_tab"].setAbort();此处在ie6下有问题，需将来时间充裕时解决
        //		this[this.activeTag+"_tab"].setFocus();
    }
};

if ($IE) {
    var SwapLink2 = {
        getThemeLinks: function(){
            //			if(!this.tip){
            //				this.tip=new $ProcessTip();
            //				this.tip.setTipText("正在读取中...");
            //			}
            //			this.tip.onProgress();
            //$E("blogname").innerHTML+=this.tip.tip.style.display+"-*-";
            var cssLinks = document.getElementsByTagName("link"), length = cssLinks.length, d_links = [];
            for (var i = 0; i < length; i++) {
                var href = cssLinks[i].href;
                if (href.indexOf("/t.css") != -1) 
                    d_links.push(cssLinks[i]);
            }
            return d_links;
        },
        appendLink: function(ids, onloadFunc){
            var themeLink = this.$CLink(scope.$BASECSS + "tpl/" + ids[0] + "_" + ids[1] + "/t.css");
            themeLink.onload = onloadFunc;
            
            //加延迟执行，避免在IE下背景为空白
            setTimeout(function(){
                document.getElementsByTagName("head")[0].appendChild(themeLink);
            }, 1);
            
        },
        deleteTLink: function(links){
            for (var i = 0; i < links.length; i++) {
                links[i].disabled = "disabled";
                Core.Dom.removeNode(links[i]);
            }
            this.loading = false;
        },
        $CLink: function(href){
            var link = $C("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = href;
            return link;
        },
        loading: false
    };
}


