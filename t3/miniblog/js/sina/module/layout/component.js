/*
 * Copyright (c) 2008, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 能够拖动的组件
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/utils/drag2.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/removeNode.js");
$import("sina/module/layout/forbiddenList.js");


/**
 * @author stan | chaoliang@staff.sina.com.cn
 */
Sina.pkg('Module.Layout');

Module.Layout.Component = Core.Class.create();

Module.Layout.Component.prototype = {
    initialize: function(ins, cid){
        this.c = ins;
        this.c.cid = this.cid = cid;
        this.t = Core.Dom.getElementsByClass(this.c, "div", "componentBar")[0];
		this.c.y = Core.Dom.getElementsByClass(this.c, "div", "componentContent")[0];
        //		this.c.n = Core.Dom.getElementsByClass(this.c, "div", "CP_li")[0];
        this.t.style.cursor = "move";
        Utils.Drag2.init(this.c, this.t);
        this.c.onDragStart = this.onDragStart.bind2(this.c);
        this.c.onDrag = this.onDrag.bind2(this.c);
        this.c.onDragEnd = this.onDragEnd.bind2(this.c);
        this.c.resignPosition = this.resignPosition.bind2(this.c);
        Module.Layout.Layout.resignBorder(this.c);
    },
    onDragStart: function(){
        //在音乐模块拖动的时候调用音乐的JS方法
        if (this.id.split("_")[1] == 8) {
            try {
                mHtml = $E("musicPlayer").innerHTML;
                MUSICBMP.move();
            } 
            catch (e) {
                $Debug("音乐播放器拖动出错");
            }
        }
        this.resignPosition();
        //this.style.display = "block";
		//debugger;
		var _width=this.offsetWidth>this.parentNode.offsetWidth?this.parentNode.offsetWidth:this.offsetWidth;
        this.style.width = _width + "px";
        this.style.position = "absolute";
        var __replace = $C("div");
        __replace.id = "__replace_box";
        __replace.style.cssText = "border:2px dashed #AAAAAA; margin-bottom:8px;";
        __replace.style.width = (parseInt(this.offsetWidth) - 4) + "px";
        __replace.style.height = (parseInt(this.offsetHeight) - 4) + "px";
        Core.Dom.insertAfter(__replace, this);
        Core.Dom.opacity(this, 60);
		//用于遮挡iframe flash的div
		var __cover = $C("div");
		__cover.id = "__cover_box";
		__cover.style.background = "";
		__cover.style.position = "absolute";
		__cover.style.width = this.y.offsetWidth + "px";
		__cover.style.height = this.y.offsetHeight + "px";
        Core.Dom.insertAfter(__cover, this.y.firstChild);
		Module.Layout.Layout.resignBorder(this);
    },
    onDrag: function(left, top){
        Module.Layout.Layout.move(this, left, top);
    },
    onDragEnd: function(){
        if (this.id.split("_")[1] == 8) {
            $E("musicPlayer").innerHTML = mHtml;
        }
        while (replace = $E("__replace_box")) {
            Core.Dom.removeNode(replace);
        }
		while (cover = $E("__cover_box")) {
            Core.Dom.removeNode(cover);
        }
        this.style.position = "static";
        this.resignPosition();
        Module.Layout.Layout.save();
    },
    resignPosition: function(){
        Core.Dom.opacity(this, 100);
        this.style.left = Core.Dom.getLeft(this) + "px";
        this.style.top = Core.Dom.getTop(this) + "px";
    }
};
