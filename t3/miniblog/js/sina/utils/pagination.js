/**
 * @fileoverview
 *	新的分页程序，完全支持产品目前的三种需求：普通分页、小区域分页、简化分页
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008.12.22
 * @update 2009.04.14 by Random | YangHao@staff.sina.com.cn
 * 		增加各节点className的前缀配置功能，默认还是CP。
 *
 */
$import("sina/utils/utils.js");
/**
 * @example
 * 
	// 创建一个最大 20 页的普通分页
	Utils.Pagination.init({
		"pageNode" : "bencalie",							// 用于写入分页的节点,class="XX_page"的div
		"maxPage" : 20,										// 最大页码数
		"pageTpl" : "http://www.sina.com.cn/@page@.html"	// 跳转的页面规则
	}).show();
	
	// 创建一个最大 20 页的小区域翻页
	Utils.Pagination.init({
		"pageNode" : "bencalie",
		"curPage" : 8,										// 当前所在页码
		"maxPage" : 20,
		"pageTpl" : "@page@.html",
		"type" : 2											// 指定类型为小区域翻页
	}).show();
	
	// 创建一个最大 20 页的简化翻页
	Utils.Pagination.init({
		"pageNode" : "bencalie",
		"maxPage" : 20,
		"pageTpl" : "@page@.html",
		"type" : 3											// 指定类型为简化翻页
	}).show();
	
	更多的参数说明请参考 Utils.Pagination.init() 方法的注释
 */
Utils.Pagination = {
	// 选项默认值
	"config" : {
		"pageNode"		: null,
		"nodeClassNamePrefix" :"CP",	// 默认的节点className前缀为CP
		"curPage"		: 1,			// 默认当前为第一页
		"maxPage"		: 1,			// 最大页码
		"minPage"		: 1,			// 默认最小页码为第一页
		"pageTpl"		: "@page@.html",			// 模板
		"type"			: 1,			// 默认为普通的分页模式
		"showPrevNext"	: true,			// 默认显示上一页下一页按钮
		"viewSize"		: 5,			// 默认当前页左右可以同时显示最多5个分页
		"dotIsPage"		: false,		// 默认省略号不可点击
		"dotRate"		: 5,			// 默认默认省略号向前跳5页
		"showGoto"		: false,		// 默认不显示跳转到功能
		"countTpl"		: "",			// 计算的模板
		"language"		: "zh-cn",		// 默认使用中文做Tips
		"theme"			: 1 			// 默认使用第一套皮肤
	},
	// 分页数据缓存
	"_list": {},
	// 支持的语言
	"_resource" : {
		"en-us": ["Pages (@data@): ", "Go to First Page", "Go to Previous Page (@data@)", "Go to Page @data@", "Go to Next Page (@data@)", "Go to Last Page", "Current Page in View"],
		"zh-cn": ["共 @data@ 页", "跳转至第一页", "跳转至前 @data@ 页", "跳转至第 @data@ 页", "跳转至后 @data@ 页", "跳转至最后一页", "当前所在页"]
	},
	//	分页的 HTML 模板
	"_template" : '<li class="#{class}" title="#{title}">#{link}</li>',
	/**
	 * 初始化分页参数
	 * @param {Object} oOption	分页信息的选项
	 * 	{
	 * 		pageNode		[必选参数]要写入的 HTML 节点，可以是 ID 或者对象
	 * 		nodeClassNamePrefix [可选参数] 默认的节点className前缀，比如:设为"CP"，则className="CP_page"
	 *		curPage			[可选参数]当前页码，默认是1
	 * 		maxPage			[必选参数]最大页码，无默认值
	 * 		minPage			[可选参数]最小页码，默认是1
	 * 		pageTpl			[必选参数]分页模板(字符串或者函数)
	 * 							如果是字符串，应该包含 "@page@" 在字符串中作为替换模板，例如
	 * 							"http://www.sina.com.cn/@page@.html"
	 * 							如果是函数，应该在函数执行完提供一个返回值。返回值为false，表示不自动跳页；否则将自动跳到选择的分页。例如
	 * 							function (nPage){
	 * 								alert("跳转到页面" + nPage);
	 * 								return false;
	 * 							}
	 * 		type			[可选参数]分页的类型，默认是1
	 * 							1		普通分页
	 * 							2		小区域翻页
	 * 							3		简化版翻页
	 * 		showPrevNext	[可选参数]上一页下一页按钮状态
	 *							true	默认显示
	 *							false	不显示
	 * 		viewSize		[可选参数]当前页左右可同时显示的最大页码，默认是 5
	 * 		dotIsPage		[可选参数]省略号可否被点击，默认不可以被点击
	 * 		dotRate			[可选参数]省略号可被点击时，省略号跳转页码相对当前页增减幅度，默认是 5，只有当 dotIsPage 为 true 才生效
	 * 		showGoto		[可选参数]是否显示跳转到按钮，默认不显示，此功能目前暂不开放
	 * 		countTpl		[可选参数]统计信息模板，默认不显示
	 * 		language		[可选参数]分页的语言，默认是简体中文
	 * 		theme			[可选参数]分页的模板，此功能目前不开放
	 * 	}
	 */
	"init" : function (oOption) {
		var node = $E(oOption.pageNode);
		if(node == null) {
			$Debug("父容器不存在");	return;
		}
		Utils.Pagination._list[node.id] = {};
		var hash = Utils.Pagination._list[node.id];
		for(var key in this.config) {
			hash[key] = oOption[key] || this.config[key];
		}
		if(hash.type == 2){
			hash.viewSize = 4;
		}
		hash.minPage = Math.min(hash.minPage, hash.maxPage) * 1;
		hash.maxPage = Math.max(hash.minPage, hash.maxPage) * 1;
		hash.curPage = (hash.curPage > hash.maxPage) ? hash.minPage : hash.curPage;
		hash.curPage = hash.curPage * 1;
		this._cache_node = hash;
		return this;
	},
	/**
	 * 根据提供的参数显示分页
	 */
	"show" : function (oNode, nCurPage) {
		nCurPage = nCurPage * 1;
		var hash = this._cache_node;
		if(oNode != null) {
			this._cache_node = hash = Utils.Pagination._list[oNode.id];
			hash.curPage = nCurPage;
		}
		var ambit = [];
		if(hash.viewSize * 2 + 1 >= hash.maxPage){
			ambit[1] = hash.minPage;
			ambit[2] = hash.maxPage;
		}
		else if(hash.curPage <= hash.minPage + hash.viewSize){
			ambit[1] = hash.minPage;
			ambit[2] = hash.minPage + (hash.viewSize * 2 - 1);
			ambit[3] = hash.maxPage;
		}
		else if(hash.curPage >= hash.maxPage - hash.viewSize){
			ambit[0] = hash.minPage;
			ambit[1] = hash.maxPage - (hash.viewSize * 2 - 1);
			ambit[2] = hash.maxPage;
		}
		else{
			ambit[0] = hash.minPage;
			ambit[1] = hash.curPage - (hash.viewSize -1);
			ambit[2] = hash.curPage + (hash.viewSize -1);
			ambit[3] = hash.maxPage;
		}

		var result = [];
		// 分页起始部分的统计信息
		if(hash.countTpl != null){
			result.push(this._createPage("", "", "", "", hash.countTpl));
		}
		// 上一页按钮
		if(hash.type != 2 && hash.curPage != hash.minPage){
			result.push(this._createPage(hash.nodeClassNamePrefix+"_pgprev", hash.curPage - 1, 3, hash.curPage - 1, "< 上一页"));
		}

		// 中部的分页信息
		if(hash.type != 3){
			if(ambit[0] != null){
				var str = (ambit[0] == hash.curPage) ? this._createPage(hash.nodeClassNamePrefix+"_pgon", 1, 6, "", ambit[0])
					: this._createPage("", 1, 1, ambit[0], ambit[0]);
				result.push(str);
			}

			if(hash.type == 1 && ambit[0] != null){
				result.push(this._createPage(hash.nodeClassNamePrefix+"_pgelip", "", "", "", "..."));
			}

			for(var i = ambit[1]; i <= ambit[2]; i ++){
				if(i == ambit[1] && i != hash.minPage && hash.type == 2){
					var LS = hash.curPage - hash.dotRate;
					LS = LS < hash.minPage ? hash.minPage : LS;
					result.push(this._createPage(hash.nodeClassNamePrefix+"_pgelip", hash.viewSize + 1, 2, hash.curPage - hash.viewSize - 1, "..."));
				}
				else if(i == ambit[2] && i != hash.maxPage && hash.type == 2){
					var RS = hash.curPage + hash.dotRate;
					RS = RS > hash.maxPage ? hash.maxPage : RS;
					result.push(this._createPage(hash.nodeClassNamePrefix+"_pgelip", hash.viewSize + 1, 4, hash.curPage + hash.viewSize + 1, "..."));
				}
				else{
					str = (i == hash.curPage) ? this._createPage(hash.nodeClassNamePrefix+"_pgon", 1, 6, "", i)
						: this._createPage("", i, 3, i, i);
					result.push(str);
				}
			}
			if(hash.type == 1 && ambit[3] != null){
				result.push(this._createPage(hash.nodeClassNamePrefix+"_pgelip", "", "", "", "..."));
			}
			if(ambit[3] != null){
				str = (ambit[3] == hash.curPage) ? this._createPage(hash.nodeClassNamePrefix+"_pgon", hash.curPage - 1, 3, "", ambit[3])
						: this._createPage("", 1, 5, ambit[3], ambit[3]);
				result.push(str);
			}
		}
		else{
			result.push(this._createPage("", "", "", "", hash.curPage + "/" + hash.maxPage));
		}
		// 下一页按钮
		if(hash.type != 2 && hash.curPage != hash.maxPage){
			result.push(this._createPage(hash.nodeClassNamePrefix+"_pgnext", hash.curPage + 1, 3, hash.curPage + 1, "下一页 >"));
		}
		/*	跳转到某页的输入框，此功能暂不开启
		if(hash.showGoto == true){
			result.push("<li>Goto[]</li>");
		}
		*/				
		$E(hash.pageNode).innerHTML = '<ul class="'+hash.nodeClassNamePrefix+'_pages">' + result.join("") + '</ul>';
	},
	/**
	 *	根据 HTML 模板生成指定的分页
	 *	@param {String}	sClass		分页样式
	 *	@param {String}	sTipPage	提示中页码
	 *	@param {String}	nTipIndex	提示编号
	 *	@param {String}	nHrefPage	分页跳转页码
	 *	@param {String}	sHrefText	分页文字
	 */
	"_createPage" : function(sClass, sTipPage, nTipIndex, nHrefPage, sHrefText) {
		if(sHrefText == ""){ return "";}
		var sTitle = (sTipPage === "" || nTipIndex == "") ? "" : this._getTips(sTipPage, nTipIndex);
		var sLink = (nHrefPage !== "") ? ('<a ' + this._getUrl(nHrefPage) + '>' + sHrefText + '</a>') : sHrefText;
		return this._template.replace(/(#\{\w+\})/g, function (a, b){
			switch (b){
				case "#{class}":
					return sClass;
				case "#{title}":
					return sTitle;
				case "#{link}":
					return sLink;
			}
		});
	},
	/**
	 *	显示指定的页码
	 *	@param {String}	sParentNodeID	分页显示的父节点ID
	 *	@param {Number}	nCurPage		要跳转到的页码
	 */
	"showPage": function (sParentNodeID, nCurPage) {
		this._cache_node = Utils.Pagination._list[sParentNodeID];
		var _autoShowPage = this._cache_node.pageTpl(nCurPage);
		if(_autoShowPage != false){
			Utils.Pagination.show($E(sParentNodeID), nCurPage);
		}
	},
	/**
	 * 取得要跳转的页面规则
	 * @param {Number} idx 跳转到的页码
	 */
	"_getUrl" : function (idx) {
		if(typeof this._cache_node.pageTpl == "string"){
			return 'href="' + this._cache_node.pageTpl.replace(/@page@/, idx) + '"';
		}
		else{
			return 'href="javascript:Utils.Pagination.showPage(\'' + this._cache_node.pageNode + '\',' + idx + ');"';
		}
	},
	/**
	 * 取得当前的 Tips
	 * @param {Number} nPage 页码
	 * @param {Number} nIndex 在资源数组中的位置
	 */
	"_getTips" : function (nPage, nIndex){
		return (this._resource[this._cache_node.language][nIndex]).replace(/@data@/g, nPage);
	}
};