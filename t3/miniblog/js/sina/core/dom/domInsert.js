$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * @id Core.Dom.domInsert 
 * @description 以已知 Element 为参照进行 DOM 操作 如appendChild insertBefore innerHTML 等
 * 		不使用与有立即后续dom操作的环境，如有需要，须使用callback方法
 * @param {Element}  插入到的节点
 * @param {Element} 被插入的节点
 * @param {String} 插入位置，缺省为 beforeEnd，效果等同于appendChild，可选参数为 afterBegin afterEnd beforeBegin beforeEnd
 * @param {Function} 回调函数
 * @author MaDFoX | chenjie@staff.sina.com.cn
 * @eg Core.Dom.domInsert(
 *		document.getElementById("relativeNode"), // 参照结点
 *		document.createElement("div") // 被操作对象，可以是 Element TextNode innerHTML
 *		"afterBegin" // 缺省为 beforeEnd，效果等同于appendChild，可选参数为 afterBegin afterEnd beforeBegin beforeEnd
 * );
 */
Core.Dom.domInsert = function(pnode, param, pos, callback){
	pos = /^(afterBegin|afterEnd|beforeBegin|beforeEnd)$/.test(pos) ? pos : "beforeEnd";
	callback = (typeof callback == "function" ? callback : function(){});
	var args = arguments;
	if($IE){
		var ctype = "HTML";
		if(typeof param == "object"){
			if(param.nodeType == 1){
				ctype = "Element";
			}
			else if(param.nodeType == 3){
				ctype = "Text";
				param = param.data;
			}
			else{
				ctype = "HTML";
			}
		}
		(function(){
			try{
				pnode.doScroll("left");
				pnode["insertAdjacent" + ctype](pos, param);
				callback.call(args.caller);
				callback = param = null;
			}
			catch(e){
				window.setTimeout(arguments.callee, 0);
			}
		})();
	}
	else{
		if(typeof param == "object" && /^(1|3)$/.test(param.nodeType)){
			switch(pos){
				case "afterBegin" :
					pnode.insertBefore(param, pnode.firstChild);
					break;
				case "afterEnd" :
					if(pnode.parentNode.nodeType == 1){
						pnode.parentNode.insertBefore(param, pnode.nextSibling);
					}
					break;
				case "beforeBegin" :
					if(pnode.parentNode.nodeType == 1){
						pnode.parentNode.insertBefore(param, pnode);
					}
					break;
				case "beforeEnd" :
					pnode.appendChild(param);
					break;
			}
		}
		else{
			var tmp = document.createElement("div");
			tmp.innerHTML = param;
			switch(pos){
				case "afterBegin" :
					while(tmp.lastChild){
						pnode.insertBefore(tmp.lastChild, pnode.firstChild);
					}
					break;
				case "afterEnd" :
					if(pnode.parentNode.nodeType == 1){
						while(tmp.lastChild){
							pnode.parentNode.insertBefore(tmp.lastChild, pnode.nextSibling);
						}
					}
					break;
				case "beforeBegin" :
					if(pnode.parentNode.nodeType == 1){
						while(tmp.firstChild){
							pnode.parentNode.insertBefore(tmp.firstChild, pnode);
						}
					}
					break;
				case "beforeEnd" :
					while(tmp.firstChild){
						pnode.appendChild(tmp.firstChild);
					}
					break;
			}
			tmp = null;
		}
		callback.call(args.caller);
	}
};
