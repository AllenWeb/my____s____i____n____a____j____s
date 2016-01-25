/**
 * @id Core.Base.detect
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * 浏览器类型检测
 */
$import("sina/core/base/_base.js");
/**
 * @for Core.Base.detect
 * @method Sina.base.detect
 * @author Random | YangHao@staff.sina.com.cn
 * @update 2009-03-12
 */
(function(){
    var Detect = function(){
        var ua = navigator.userAgent.toLowerCase();
        this.$IE = /msie/.test(ua);
        this.$OPERA = /opera/.test(ua);
        this.$MOZ = /gecko/.test(ua);
        this.$IE5 = /msie 5 /.test(ua);
        this.$IE55 = /msie 5.5/.test(ua);
        this.$IE6 = /msie 6/.test(ua);
        this.$IE7 = /msie 7/.test(ua);
        this.$SAFARI = /safari/.test(ua);
        this.$winXP = /windows nt 5.1/.test(ua);
        this.$winVista = /windows nt 6.0/.test(ua);
        this.$FF2 = /Firefox\/2/i.test(ua);
        this.$IOS = /\((iPhone|iPad|iPod)/i.test(ua);
    };
    Core.Base.detect = new Detect();
})();
