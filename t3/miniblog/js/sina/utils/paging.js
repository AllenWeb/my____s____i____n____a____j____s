/**
 * @fileoverview 针对现有的分页设计，使用ul和css控制按钮，和原来的table控制不同，
 * 因此保留了原来blogv5的分页方法,但重新写了其中的某些方法，对外接口不变
 * @former author FlashSoft
 * @author xy xinyu@staff.sina.com.cn
 */
/**
 * 原作者注释:
 //1.请使用『PagingLine.Create()』方法创建『分页条』。
 //  PagingLine.Create(<Current Page>, <Count of Pages>, <Href Template for Page Link>)
 //  ::链接模板中用于指定页数的标记为『@page@』。例如：『?page=@page@』
 //2.创建的『分页条』使用『Render()』方法即时写入HTML！
 //  PagingLine.Create().Render(<Language>)
 //  ::语种数据应符合浏览器的习惯，如『zh-cn』；而非Unix习惯的『zh_CN』。
 //  ::目前仅支持『英文』和『简体中文』，需要更多支持请按照现有格式于『PagingLine._resource』处添加。
 //3.『分页条』在『Render()』前还支持以下方法：
 //  PagingLine.Create().SetStyle(<Style Name>)
 //                     .MarkDistance(<True or False>)
 //                     .ToggleEndpoint(<True or False>)
 //                     .SetViewSize(<View Range Pages Number>)
 //                     .SetRangeSize(<View Range Pages Number>)
 //                     .Render()
 //  ::『SetStyle()』方法设置输出样式，默认样式为『default』。要增加样式必须修改『PagingLineRender._avStyles』，并增加相应的样式。
 //  ::『MarkDistance()』方法决定是否输出『第一页』和『上一页』之间的小点。默认为支持。
 //  ::『ToggleEndpoint()』方法决定是否输出『第一页』和『最后一页』。默认为支持。
 //  ::『SetViewSize()』方法决定输出的可视页面数量。默认为『9』。
 //  ::『SetRangeSize()』方法为『SetViewSize()』方法的别名方法。
 //4.『分页条』的样式设定：
 //  『paging-line』类和『paging-line.style-<Style Name>』类定义全局样式。
 //  『paging-line.label』类和『paging-line.style-<Style Name>.label』类定义左侧『页数统计』的样式。
 //  『paging-line.link』类和『paging-line.style-<Style Name>.link』类定义分页链接的样式。
 //  『paging-line.current』类和『paging-line.style-<Style Name>.current』类定义『当前页』的样式。
 */
/**
 * xy xinyu@staff.sian.com.cn
 * 新版使用ul来实现，css在_getStyle()方法中可以得到
 * @param totalNum 代表文章、或者评论的总数，而不是页面总数量
 * @param headName 前面显示总共有多少条时的名字，比如20条评论，400条留言
 * @example
 * 		var currentPage=10;
 * 		var totalPages=100;
 * 		var pageURL = "http://blog.sina.com.cn/s/indexlist_" + $uid + "_@page@.html";
 * 		var page = PagingLine.Create(currentPage, totalPages, pageURL);
 *		if ($E("obj")) { obj代表需要将翻页添加到哪个DOM对象中
 *			page.Render("zh-cn", $E("obj"));
 *		}
 * @example
 * 		var currentPage=10;
 * 		var totalPages=100;
 * 		var totalNum=1000;
 * 		var pageURL = "http://blog.sina.com.cn/s/indexlist_" + $uid + "_@page@.html";
 * 		var page = PagingLine.Create(currentPage, totalPages, pageURL,totalNum，"评论");
 *		if ($E("obj")) { obj代表需要将翻页添加到哪个DOM对象中
 *			page.Render("zh-cn", $E("obj"));
 *		}
 *
 *
 */
PagingLine = {
	"_instances": {},
	"_language": "",
	"_resource": {
		"en": ["Pages (@data@): ", "Go to First Page", "Go to Previous Page (@data@)", "Go to Page @data@", "Go to Next Page (@data@)", "Go to Last Page", "Current Page in View"],
		"zh-cn": ["共 @data@ 页", "跳转至第一页", "跳转至第 @data@ 页", "跳转至第 @data@ 页", "跳转至第 @data@ 页", "跳转至最后一页", "当前所在页"]
	},
	"Create": function PagingLine_Create(curPage, maxPage, lnkTpl,totalNum,headName){
		//$Debug("creat page");
		function PagingLineRender(curPage, maxPage, lnkTpl,totalNum,headName){
			this._curPage = curPage;
			this._maxPage = maxPage;
			this._flag = false;
			this._lnkTpl = lnkTpl;
			this._totalNum=totalNum;
			this._headName=headName;
			this._style = "default";
			this._avStyles = ["default"];
			this._distance = true;
			this._endpoint = true;
			this._viewSize = 4;
			this._viewLsPage = 0;//左边省略号后第一个页码
			this._viewRsPage = 0;//右边省略号前第一个页码
			this._rndID = parseInt(Math.random() * 100);
			if (arguments[3] != null && arguments[4] != null) {
				this._flag = true;
			}
			//$Debug("arguments.length="+(arguments[4]==null));
			this.SetStyle = function PagingLineRender_SetStyle(style){
				for (var i = 0; i < this._avStyles.length; i++) {
					if (style == this._avStyles[i]) {
						this._style = style;
						return this;
					}
				}
				return this;
			};
			this.MarkDistance = function PagingLineRender_MarkDistance(yn){
				this._distance = yn;
				return this;
			};
			this.ToggleEndpoint = function PagingLineRender_Toggle(yn){
				this._endpoint = yn;
				return this;
			};
			this.SetViewSize = function PagingLineRender_SetViewSize(size){
				size = parseInt(size);
				if (4 > size) {
					size = 4;
				}
				else 
					if (size % 2) {
						size--;
					}
				this._viewSize = Math.floor(size / 2);
				return this;
			};
			this.SetRangeSize = function PagingLineRender_SetRangeSize(size){
				return this.SetViewSize(size);
			};
			this.Render = function PagingLineRender_Render(lang, oParentNode){
				if (!arguments.length || !arguments[0].length) {
					lang = PagingLine.GetBrowserLanguage();
				}
				else {
					lang = lang.toLowerCase().replace(/_/g, "-");
				}
				/*
				 * 根据平台1.0UE修正左右能显示页码的范围
				 * 不是所有页码都显示前后4个页码
				 */
				this._viewLsPage = Math.max(1, this._curPage - this._viewSize);
				this._viewRsPage = Math.min(this._maxPage, this._curPage + this._viewSize);
				if (this._maxPage > 11 && this._curPage <= 6) {
					this._viewLsPage = 1;
					this._viewRsPage = 10;
					
				}
				if (this._maxPage > 11 && this._curPage > (this._maxPage - 6)) {
					this._viewLsPage = this._maxPage - 9;
					this._viewRsPage = this._maxPage;
				}
				if (this._maxPage <= 11) {//总页数小于11页时，全部页码显示
					this._viewLsPage = 1;
					this._viewRsPage = this._maxPage;
				}
				var sHTML ="<ul" + this._getStyle("ul") + " id='Paging_" + this._rndID + "'>";
				
				if(this._flag){
					sHTML+=this._getTotalNum();
				}
				//$Debug("this._viewRsPage="+this._viewRsPage+":this._viewLsPage="+this._viewLsPage);
				sHTML+= 
				this._getPrevBtn(lang) +
				this._getFirstBtn(lang) +
				this._getContexts(lang) +
				this._getLastBtn(lang) +
				this._getNextBtn(lang) +
				"</ul>";
				if (oParentNode) {
					oParentNode.innerHTML = sHTML;
				}
//                else {2008-12-09关闭此无用功能
//                    document.write(sHTML);
//                }
				(function(self){
					var links = document.getElementById("Paging_" + self._rndID).getElementsByTagName("a");
					var len = links.length;
					if ((typeof self._lnkTpl).toLowerCase() == "object") {
						if ((typeof self._lnkTpl.click).toLowerCase() == "function") {
							for (var i = 0; i < len; i++) {
								links[i].onclick = function(){
									var page = this.getAttribute("page");
									self._lnkTpl.click(page);
								};
							}
						}
					}
				})(this);
				
			};
			this._getTotalNum = function PagingLineRender__getTotalNum(){
				return "<li class=\"CP_pgttl\">共"+this._totalNum+"条"+this._headName+"</li>";
			};
			this._getSummary = function PagingLineRender__getSummary(lang){
				if (!this._endpoint) {
					return "";
				}
				return "<LABEL" + this._getStyle("label") + ">" +
				this._getMeta(this._maxPage, 0, lang) +
				"</LABEL>";
			};
			this._getFirstBtn = function PagingLineRender__getFirstBtn(lang){
				if (!this._endpoint) {
					return "";
				}
				if (this._curPage > 6 && this._maxPage > 11) {
					return "<li><A" + this._getURL(1) +
					" title='" +
					this._getMeta("", 1, lang) +
					"'>" +
					1 +
					"</A></li>" +
					(this._distance ? "<li" + this._getStyle("dots") + ">...</li>" : "");
				}
				return "";
			};
			this._getLastBtn = function PagingLineRender__getFirstBtn(lang){
				if (!this._endpoint) {
					return "";
				}
				if (this._maxPage > 11 && this._curPage < (this._maxPage - 5)) {
					return (this._distance ? "<li" + this._getStyle("dots") + ">...</li>" : "") +
					"<li><A" +
					this._getURL(this._maxPage) +
					" title='" +
					this._getMeta("", 5, lang) +
					"'>" +
					maxPage +
					"</A></li>";
				}
				return "";
			};
			this._getPrevBtn = function PagingLineRender__getPrevBtn(lang){
				if (1 < this._curPage) {
					return "<li" + this._getStyle("preview") + "><A" + this._getURL(this._curPage - 1) +
					" title='" +
					this._getMeta(this._curPage - 1, 2, lang) +
					"'>&lt;&nbsp;上一页" +
					"</A></li>";
				}
				return "";
			};
			this._getNextBtn = function PagingLineRender__getNextBtn(lang){
			   // $Debug(this._getStyle("next"));
				if (this._curPage < this._maxPage) {
					return "<li" + this._getStyle("next") + "><A" + this._getURL(this._curPage + 1) +
					" title='" +
					this._getMeta(this._curPage + 1, 4, lang) +
					"'>下一页&nbsp;&gt;" +
					"</A></li>";
				}
				return "";
			};
			this._getContexts = function PagingLineRender__getContexts(lang){
				var sHTML = "";
				for (var i = this._viewLsPage; i <= this._viewRsPage; i++) {
					if (i == this._curPage) {
						sHTML += "<li" + this._getStyle("current") +
						" title='" +
						this._getMeta("", 6, lang) +
						"'>" +
						this._curPage +
						"</li>";
					}
					else {
						sHTML += "<li><A" + this._getURL(i) +
						" title='" +
						this._getMeta(i, 3, lang) +
						"'>" +
						i +
						"</A></li>";
					}
				}
				//$Debug("shtml="+sHTML);
				return sHTML;
			};
			this._getMeta = function PagingLineRender__getMeta(data, idx, lang){
				return PagingLine.GetResource(idx, lang).replace(/@data@/g, data);
			};
			this._getStyle = function PagingLineRender__getStyle(name){
				var clz;
				switch (name) {
					case "preview":
						clz = "CP_pgprev";
						break;
					case "ul":
						clz = "CP_pages";
						break;
					case "next":
						clz = "CP_pgnext";
						break;
					case "current":
						clz = "CP_pgon";
						break;
					case "dots":
						clz = "CP_pgelip";
						break;
				}
				return " class=" + clz;
			};
			this._getURL = function PagingLineRender__getURL(lnkPage, quote){
				if (1 > arguments.length) {
					lnkPage = this._maxPage;
				}
				if (2 > arguments.length) {
					quote = "'";
				}
				return " href=" + quote +
				this._lnkTpl.replace(/@page@/g, lnkPage) +
				quote +
				" target=" +
				quote +
				"_self" +
				quote;
			};
			function PagingLineRender__getURL2(lnkPage, quote){
				if (1 > arguments.length) {
					lnkPage = this._maxPage;
				}
				if (2 > arguments.length) {
					quote = "'";
				}
				return " href=" + quote + "javascript: " + this._lnkTpl.click + "(" + lnkPage + ");" + quote;
			}
			function PagingLineRender__getURL3(lnkPage, quote){
				if (1 > arguments.length) {
					lnkPage = this._maxPage;
				}
				if (2 > arguments.length) {
					quote = "'";
				}
				return " href=" + quote +
				"#" +
				quote +
				" page=" +
				quote +
				lnkPage +
				quote;
			}
			if ((typeof this._lnkTpl).toLowerCase() == "object") {
				if ((typeof this._lnkTpl.click).toLowerCase() == "string") {
					this._getURL = PagingLineRender__getURL2;
				}
				else {
					this._getURL = PagingLineRender__getURL3;
				}
			}
		}
		curPage = parseInt(curPage);
		maxPage = parseInt(maxPage);
		if (1 > maxPage) {
			maxPage = 1;
		}
		if (1 > curPage) {
			curPage = 1;
		}
		else 
			if (curPage > maxPage) {
				curPage = maxPage;
			}
		return new PagingLineRender(curPage, maxPage, lnkTpl, totalNum, headName);
	},
	"GetBrowserLanguage": function PagingLine_GetBrowserLanguage(){
		if (!this._language.length) {
			this._language = (document.all ? navigator.browserLanguage : navigator.language).toLowerCase();
		}
		return this._language;
	},
	"GetResource": function PagingLine_GetResource(idx, lang){
		if (!lang.indexOf("en")) {
			lang = "en";
		}
		if (!this._resource[lang] || this._resource[lang].length <= idx) {
			return "";
		}
		return this._resource[lang][idx];
	}
};
