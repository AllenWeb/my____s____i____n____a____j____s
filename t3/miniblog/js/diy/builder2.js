/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 例：
 *  var spec = {};
	spec['template'] = '<div id="bbb" style="width:200px;height:200px;background:#ff0000"><div style="width:200px;height:100px;background:#00ff00"></div></div>';
	spec['box'] = document.body;//非必填
	var test = App.builder(spec);
	或者
	var spec = {};
	spec['template'] = [{'tag':'div','attr':{},'list':[
		{'tag':'div'}
	]}];
	spec['box'] = document.body;//非必填
	var test = App.builder(spec);
 */
$import('sina/core/string/trim.js');
$import('sina/core/string/decodeHTML.js');
$import('sina/core/string/encodeHTML.js');
(function(){
	var NODEMAP = {
		'AREA'     : 'MAP',
		'CAPTION'  : 'TABLE',
		'COL'      : 'TABLE|COLGROUP',
		'COLGROUP' : 'TABLE',
		'LEGEND'   : 'FIELDSET',
		'OPTGROUP' : 'SELECT',
		'OPTION'   : 'SELECT',
		'PARAM'    : 'OBJECT',
		'TBODY'    : 'TABLE',
		'TD'       : 'TR',
		'TFOOT'    : 'TABLE',
		'TH'       : 'TABLE|TR',
		'THEAD'    : 'TABLE',
		'TR'       : 'TBODY|THEAD|TH|TFOOT'
	};
	var trim = Core.String.trim;
	var create = function(tagName,attributes,that){
		var dom = null;
		if(tagName.toUpperCase() == 'TEXT'){
			dom = document.createTextNode(tagName);
		}else{
			dom = $C(tagName);
		}
		if(typeof attributes === "object"){
			for(var k in attributes){
				switch(k){
					case "class"  :
						dom.className = attributes[k];
						break;
						
					case "id"     : 
						that.domList[attributes[k]] = dom;
						break;

					case "action" : 
						if(that.actList[attributes[k]]){
							that.actList[attributes[k]] = that.actList[attributes[k]].concat([dom]);
						}else{
							that.actList[attributes[k]] = [dom];
						}
						break;
						
					case "style"  :
						dom.style.cssText = attributes[k];
						break;

					case "innerHTML" :
						if(dom.nodeType === 3){
							dom.nodeValue = Core.String.decodeHTML(attributes[k]);
						}else{
							dom.innerHTML = attributes[k];
						}
						break;

					case "nodeValue" : 
						if(dom.nodeType === 3){
							dom.nodeValue = attributes[k];
						}else{
							dom.innerHTML = Core.String.encodeHTML(attributes[k]);
						}
						break;

					default :
						dom.setAttribute(k,attributes[k]);
				}
			}
		}
		return dom;
	};
	
	var check  = function(parent,childObj){
		var tnames = NODEMAP[childObj.tag];
		if(tnames){
			var pList = tnames.split('|');
			for(var i = 0, len = pList.length; i < len; i ++){
				if(parent.tagName == pList[i]){
					return true;
				}
			}
			return false;
		}
		return true;
	};
	
	var append = function(parent,childObj, that){
		childObj.tag = childObj.tag.toLocaleUpperCase();
		if(!check(parent,childObj)){
			return false;
		}
		var returnDom = create(childObj.tag, childObj.attr, that);
		parent.appendChild(returnDom);
		return returnDom;
	};
	
	var makeTree  = function(parent, objList, that){
		for(var i = 0, len = objList.length; i < len; i++){
			var Leaves = append(parent, objList[i], that);
			if(!Leaves){
				alert("tree wrong!!!");
				return false;
			}
			if(objList[i].list && objList[i].list.length){
				makeTree(Leaves, objList[i].list, that);
			}
		}
	};
	
	var parseAttribute = function(attrStr){
		var ret = {};
		var buff = [];
		if(attrStr){
			var re = new RegExp('(?:([^\\\s=]+)\\\s*=\\\s*[\\\"\\\']([^=\\\"\\\']*)[\\\"\\\'])','ig');
			while(buff = re.exec(attrStr)){
				ret[buff[1]] = buff[2];
			}
		}
		return ret;
	};

	var htmlToTemplate = function(htmlStr){
		var so = parseHTML(htmlStr);
		var ret = [];
		var point = ret;
		var pointList = [];
		for(var i = 0, len = so.length; i < len; i += 1){
			if(so[i][1] === undefined){
				var a = buildItem(['','','text','innerHTML="'+so[i][0]+'"','']);
				point.push(a);
			}

			if(so[i][1] === ''){
				if(trim(so[i][0]) == ''){
					continue
				}else if(/^\<[^\>]+\>$/.test(so[i][0])){
					var a = buildItem(so[i]);
					point.push(a);
					if(!/\/\s*>$/.test(so[i][0])){
						a.list = [];
						point = a.list;
						pointList.push(point);
					}

				}else{
					var a = buildItem(['','','text','innerHTML="'+so[i][0]+'"','']);
					if(trim(so[i][0]).replace(/\r|\n/ig,'')){
						point.push(a);
					}
				}
			}

			if(so[i][1] === '/'){
				pointList.pop();
				if(pointList.length === 0){
					point = ret;
				}else{
					point = pointList[pointList.length - 1];
				}
			}
		}
		return ret;
	};
	
	var buildItem = function(args){
		var ret = {};
		ret.tag = args[2];
		ret.attr = parseAttribute(args[3]);
		return ret;
	};
	
	var parseHTML = function(htmlStr){
		var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
		var a,i;
		var ret = [];
		while ((a = tags.exec(htmlStr))) {
			var n = [];
			for(i = 0; i < a.length; i += 1){
				n.push(a[i]);
			}
			ret.push(n);
		}
		return ret;
	};
	App.builder2 = function(spec){
		var that = {};
			that.box = null;
			that.domList = {};
			that.actList = {};
		if(spec.box){
			that.box = spec.box;
		}else{
			that.box = $C('DIV');
		}
		if(spec.template){
			if(typeof spec.template === 'string'){
				spec.template = htmlToTemplate(spec.template);
			}
			makeTree(that.box, spec.template, that);
		}
		return that;
	};
})();