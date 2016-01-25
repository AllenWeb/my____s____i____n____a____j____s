/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @将特定格式的json对象转化成dom对象并检查dom的嵌套格式是否符合规范。
 * @attributes里的特殊属性。
 *  id:会将该元素放到对象的domList里，键值是id的值。
 *  class:在js里是className;
 *  style:样式的对象，基于setStyle的。
 *  action：动作，会讲该元素放到actList里，以便之后帮定事件，同样的action会组成一个数组。
 *  innerHTML：给该元素添加innerHTML内容。
 * @对外可用，App.Builder | 类，可以new出来使用。
 * @对外可用，App.domBuilder | 静态方法集合，是从Builder中实例化出来的，所创建的对象如需要句柄，都可在domBuilder的属性中找到。
 * @方法：
 *  create:建立单个节点。
 *  makeTree：建立节点树。
 * @@未测试，待修正。
 * json数据的例子：
[{
	"tagName"    : "DIV",
	"attributes" : {"name" : "divs", "id" : "test", "class" : "build", "action" : "nextpage", "style" : "display : block;width : 200px"},
	"childList"  : [
		{
			"tagName"    : "UL",
			"attributes" : {"name" : "ul1", "id" : "ultest" },
			"childList"  : [
				{
					"tagName"    : "LI",
					"attributes" : {"name" : "li1", "id" : "ultest1", "innerHTML" : "<p>第一个</p>" }
				},
				{
					"tagName"    : "LI",
					"attributes" : {"name" : "li2", "id" : "ultest2" }
				},
				{
					"tagName"    : "LI",
					"attributes" : {"name" : "li3", "id" : "ultest3" }
				}
			]
		},
		{
			"tagName"    : "UL",
			"attributes" : {"name" : "ul2", "id" : "ultestb" },
			"childList"  : [
				
			]
		},
		{
			"tagName"    : "UL",
			"attributes" : {"name" : "ul3", "id" : "ultestc" }
		}
	]
		
}]
*/
(function(proxy){
	var Builder = function(domJson,box){
		this.box = null;
		this.domList = {};
		this.actList = {};
		if(box){
			this.box = box;
		}else{
			this.box = document.createElement("DIV");
		}
		if(domJson){
			this.makeTree(this.box, domJson);
		}
	};
	(function(_p){
		_p.init = function(){};
		_p.disp = function(){};
		_p.NODEMAP = {
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
		_p.create = function(tagName,attributes){
			var dom = null;
			tagName = tagName.toUpperCase();
			if(tagName == "TEXT"){
				dom = document.createTextNode(attributes);
			}else{
				dom = document.createElement(tagName);
			}
			if(typeof attributes == "object"){
				for(var k in attributes){
					switch(k){
						case "class"  :
							dom.className = attributes[k];
							break;
						
						case "id"     : 
							this.domList[attributes[k]] = dom;
							break;
						
						case "action" : 
							if(this.actList[attributes[k]]){
								this.actList[attributes[k]] = [dom].concat(this.actList[attributes[k]]);
							}else{
								this.actList[attributes[k]] = dom;
							}
							break;
						case "style"  :
							dom.style.cssText = attributes[k];
							break;
							
						case "innerHTML" :
							dom.innerHTML = attributes[k];
							break;
							
						case "nodeValue" : 
							dom.nodeValue = attributes[k];
							break;
							
						default :
							dom.setAttribute(k,attributes[k]);
					}
				}
			}
			return dom;
		};
		_p.check  = function(parent,childObj){
			var tnames = this.NODEMAP[childObj.tagName];
			if(this.NODEMAP[childObj.tagName]){
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
		_p.append = function(parent,childObj){
			childObj.tagName = childObj.tagName.toLocaleUpperCase();
			if(!this.check(parent,childObj)){
				return false;
			}
			var returnDom = this.create(childObj.tagName, childObj.attributes);
			parent.appendChild(returnDom);
			return returnDom;
		};
		_p.makeTree  = function(parent, objList){
			for(var i = 0, len = objList.length; i < len; i++){
				var Leaves = this.append(parent,objList[i]);
				if(!Leaves){
					alert("tree wrong!!!");
					return false;
				}
				if(objList[i].childList && objList[i].childList.length){
					this.makeTree(Leaves,objList[i].childList);
				}
			}
		};
	})(Builder.prototype);
	
	proxy.Builder = Builder;
	proxy.domBuilder = new Builder();
})(App);