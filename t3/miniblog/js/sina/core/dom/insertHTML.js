/**
 * @fileoverview
 * 给指定对象增加 HTML，等同于 IE 中的 insertAdjacentHTML 方法 
 * @id Core.Dom.insertHTML
 * @param {Object|String} el 必选参数，被操作的节点对象
 * @param {String} html 必选参数，被插入的 HTML 内容
 * @param {String} where 可选参数，插入的位置，默认是 BeforeEnd，
 * 						  备选值：BeforeBegin、AfterBegin、BeforeEnd、AfterEnd
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 * @global Core.Dom.insertHTML
 * @example
		Core.Dom.insertHTML(document.body, "<input/>", "AfterBegin");
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
Core.Dom.insertHTML = function (el, html, where){
	el = $E(el) || document.body;
	where = where.toLowerCase() || "beforeend";
	if(el.insertAdjacentHTML){
		switch(where){
			case "beforebegin":
				el.insertAdjacentHTML('BeforeBegin', html);
				return el.previousSibling;
			case "afterbegin":
				el.insertAdjacentHTML('AfterBegin', html);
				return el.firstChild;
			case "beforeend":
				el.insertAdjacentHTML('BeforeEnd', html);
				return el.lastChild;
			case "afterend":
				el.insertAdjacentHTML('AfterEnd', html);
			return el.nextSibling;
		}
		throw 'Illegal insertion point -> "' + where + '"';
	}
	var range = el.ownerDocument.createRange();
	var frag;
	switch(where){
		case "beforebegin":
			range.setStartBefore(el);
			frag = range.createContextualFragment(html);
			el.parentNode.insertBefore(frag, el);
			return el.previousSibling;
		case "afterbegin":
			if(el.firstChild){
				range.setStartBefore(el.firstChild);
				frag = range.createContextualFragment(html);
				el.insertBefore(frag, el.firstChild);
				return el.firstChild;
			}else{
				el.innerHTML = html;
				return el.firstChild;
			}
			break;
		case "beforeend":
			if(el.lastChild){
				range.setStartAfter(el.lastChild);
				frag = range.createContextualFragment(html);
				el.appendChild(frag);
				return el.lastChild;
			}else{
				el.innerHTML = html;
				return el.lastChild;
			}
			break;
		case "afterend":
			range.setStartAfter(el);
			frag = range.createContextualFragment(html);
			el.parentNode.insertBefore(frag, el.nextSibling);
			return el.nextSibling;
	}
	throw 'Illegal insertion point -> "' + where + '"';
};