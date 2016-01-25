(function(ns){
	/**
	 * dom builder 3
	 * @param {Object} html   必选参数，html模板，使用 dd作为唯一标识返回对象，mm作为列表标识反回对象数组
	 * @param {Object} parent 必选参数，插入dom节点
	 * @author liusong@staff.sina.com.cn
	 * @example
	 * var dom = App.builder3('<div dd="aa"><ul><li mm="a"></li><li mm="a"></li><li mm="a"></li><li mm="b"></li></ul></div>',document.body);
	 * {domList:{aa:div},actList:{a:[li,li,li],b:[li]},box:document.body}
	 */
	ns.builder3 = function(html, parent, param){
		param = typeof param == "object" ? param : {};
		
		parent.innerHTML = html;
        
		var i = 0, domList = {}, actList = {}, nodes = parent.getElementsByTagName("*"), len = nodes.length, c, mm, dd, cv = param.clear||1, mk = param.mm||"mm", dk = param.dd||"dd";
		
		for(i; i<len; i++){
			c = nodes[i];
			dd = c.getAttribute(dk);
			mm = c.getAttribute(mk);
			dd && (domList[dd] = c) && (cv && c.removeAttribute(dk));
			mm && ((!actList[mm] && (actList[mm] = [c]))||(actList[mm] = actList[mm].concat([c])))&& (cv && c.removeAttribute(mk));
		}
        
        return {
            box: parent,
            domList: domList,
            actList: actList
        };
	}
})(App);
