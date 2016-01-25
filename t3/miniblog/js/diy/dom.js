/**
 * @author wangliang3@staff.sina.com.cn
 */
App.Dom = (function(){
    var documentElement = document.documentElement, CLASS = (!documentElement.hasAttribute) ? 'className' : 'class';
    var dom = {
        trim: function(s){
            try {
                return s.replace(/^\s+|\s+$/g, '');
            } 
            catch (e) {
                return s;
            }
        },
        hasClass: function(el, className){
            var ret = false, current;
            if (el && className) {
                current = el.getAttribute(CLASS) || '';
                if (className.exec) {
                    ret = className.test(current);
                }
                else {
                    ret = className && (' ' + current + ' ').indexOf(' ' + className + ' ') > -1;
                }
            }
            else {
            }
            return ret;
        },
        addClass: function(el, className){
            var ret = false, current;
            if (el && className) {
                current = el.className || '';
                if (!this.hasClass(el, className)) {
                    current += ' ' + className;
                    el.setAttribute(CLASS, current.replace(/^\s+|\s+$/g, ''));
                    ret = true;
                }
            }
            else {
            }
            return ret;
        },
        removeClass: function(el, className){
            var ret = false, current, newClass, attr;
            if (el && className) {
                current = el.getAttribute(CLASS) || '';
                el.setAttribute(CLASS, dom.trim((current + ' ').replace(className + ' ', '')));
                newClass = el.getAttribute(CLASS);
                if (current !== newClass) { // else nothing changed
                    el.setAttribute(CLASS, dom.trim(newClass)); // trim after comparing to current class
                    ret = true;
                    if (el.getAttribute(CLASS) === '') { // remove class attribute if empty
                        el.removeAttribute(CLASS);
                    }
                }
            }
            else {
            }
            return ret;
        },
        replaceClass: function(el, newClass, oldClass){
            dom.removeClass(el, oldClass);
            dom.addClass(el, newClass);
        },
        getByClass: function(className, tag, root){
            className = dom.trim(className);
            tag = tag || '*';
            if (!root) {
                return [];
            }
            var nodes = [], elements = root.getElementsByTagName(tag);
            for (var i = 0, len = elements.length; i < len; ++i) {
                if (dom.hasClass(elements[i], className)) {
                    nodes[nodes.length] = elements[i];
                }
            }
            return nodes;
        },
        getBy: function(method, tag, root){
            tag = tag || '*';
            if (!root) {
                return [];
            }
            var nodes = [], elements = root.getElementsByTagName(tag);
            for (var i = 0, len = elements.length; i < len; ++i) {
                if (method(elements[i])) {
                    nodes[nodes.length] = elements[i];
                }
            }
            return nodes;
        },
        getXY: function(el, config){
            config = config ||
            {};
            config.abs = config.abs || false;
            var pos = {};
            var _base = function(obj){
                var x = 0, y = 0;
                if (obj.getBoundingClientRect) {
                    var box = obj.getBoundingClientRect();
                    var D = documentElement;
                    x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
                    y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;
                }
                else {
                    for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) 
                        ;
                }
                return {
                    'x': x,
                    'y': y
                };
            };
            pos = _base(el);
            if (config.abs) {
                while (el = el.offsetParent) {
                    if (App.Dom.getStyle(el, 'position') == 'absolute') {
                        var tpos = _base(el);
                        pos.x -= tpos.x;
                        pos.y -= tpos.y;
                    }
                };
                            }
            return pos;
        },
        getScreen: function(){
            var screen = {};
            if ($IE) {
                screen.w = documentElement.clientWidth;
                screen.h = documentElement.clientHeight;
            }
            else {
                screen.w = window.innerWidth;
                screen.h = window.innerHeight;
            }
            return screen;
        },
        getStyle: function(el, property){
            if ($IE) {
				var value = el.currentStyle ? el.currentStyle[property] : null;
                switch (property) {
                    case "opacity":
                        var val = 100;
                        try {
                            val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                        } 
                        catch (e) {
                            try {
                                val = el.filters('alpha').opacity;
                            } 
                            catch (e) {
                            }
                        }
                        return val / 100;
                    case "float":
                        property = "styleFloat";
					case 'height':
						return (value=='auto')?'0px':el.style[property];
					case 'width':
						return (value=='auto')?'0px':el.style[property];
                    default:
						var value = el.currentStyle ? el.currentStyle[property] : null;
                        return (el.style[property] || value);
                }
            }
            else {
                if (property == "float") {
                    property = "cssFloat";
                }
                try {
                    var computed = document.defaultView.getComputedStyle(el, '');
                } 
                catch (e) {
                    traceError(e);
                }
                return el.style[property] || computed ? computed[property] : null;
            }
        },
        setStyle: function(el, property, val){
            if ($IE) {
                switch (property) {
                    case "opacity":
                        el.style.filter = "alpha(opacity=" + (val * 100) + ")";
                        if (!el.currentStyle || !el.currentStyle.hasLayout) {
                            el.style.zoom = 1;
                        }
                        break;
                    case "float":
                        property = "styleFloat";
                }
            }
            else {
				if (property == "float") {
                    property = "cssFloat";
                }
            }
            el.style[property] = val;
        },
        insertAfter: function(obj, target){
            var parentEl = target.parentNode;
            if (parentEl.lastChild == target) {
                parentEl.appendChild(obj);
            }
            else {
                parentEl.insertBefore(obj, target.nextSibling);
            }
        },
        getScroll: function(){
            var de = document.documentElement, db = document.body;
            var t, l, w, h;
            if (de && de.scrollTop) {
                t = de.scrollTop;
                l = de.scrollLeft;
                w = de.scrollWidth;
                h = de.scrollHeight;
            }
            else 
                if (db) {
                    t = db.scrollTop;
                    l = db.scrollLeft;
                    w = db.scrollWidth;
                    h = db.scrollHeight;
                }
            return {
                t: t,
                l: l,
                w: w,
                h: h
            };
        },
        domClick: function(obj){
            if ($IE) {
                obj.click();
            }
            else {
                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                obj.dispatchEvent(evt);
            }
        },
		contains: function(parent, node){
			if(!$IE){
				do {
					if (parent == node) return true;
				}
				while (node = node.parentNode);
				return false;
			}else{
				return parent.contains(node);
			}
		}
    };
    return dom;
    
})();
