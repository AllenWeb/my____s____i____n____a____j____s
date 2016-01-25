/**
 * @author liusong@staff.sina.com.cn
 */
$import("jobs/insertTextArea.js");
$import("diy/copy.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/leftB.js");
$import("jobs/widget/widget_method.js");
$import("diy/scrollToTarget.js");
$import("diy/scrollToTarget.js");
$import("sina/core/dom/getElementsByClass.js");
$registJob('tools_share_link', function(){
	var leftB = Core.String.leftB;
	var trim = Core.String.trim;
	var param = {
		color : "red",
		size  : "m",
		text  : "分享到新浪微博",
		baseCss : scope.$BASECSS,
		projectName : $CONFIG.$product
	};
	
	var e = {
		text    : $E("tools_share_text"),
		color   : $E("tools_share_color_list"),
		size    : $E("tools_share_size_list"),
		code    : $E("tools_share_code"),
		view    : $E("tools_share_view"),
		success : $E("tools_copy_success"),
		copy    : $E("tools_share_copy")
	};
	
	var flush = (function(){
		var reg = /#\{(.*?)\}/g;
		var typeArray = {
			color : ["red","org", "blue", "purple"],
			size  : ["s", "m", "b"]
		};
		var temp = viewTmp = '<div style=" cursor:pointer;">\
            <img src="#{baseCss}style/images/toolbar/#{size}_#{color}.gif" style="#{block}margin:0 auto 4px;border:0;vertical-align:middle;"/>\
            <span style="text-align:center;">#{text}</span>\
        </div>';
		return function(type, value){
			param[type] = (typeof value=="number")?typeArray[type][value]:String(value);
			param["block"] = (param["size"]=="s")?"":"display:block;";
			var html = temp.replace(reg,function(){
				return param[arguments[1]]||"";
			});
			html = "<a style=\"color:#333333;text-align:center;font-size:12px;\" href=\"javascript:void((function(s,d,e){try{}catch(e){}var f='http://v.t.sina.com.cn/share/share.php?',u=d.location.href,p=['url=',e(u),'&title=',e(d.title),'&appkey=2924220432'].join('');function a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=620,height=450,left=',(s.width-620)/2,',top=',(s.height-450)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent)){setTimeout(a,0)}else{a()}})(screen,document,encodeURIComponent));\">" + html + "</a>";
			e["view"].innerHTML = html;
			e["code"].value = html;
		};
	})();
	
	var htmlEncode = function(value){
		var hach = {
			"<":"&lt;",
			">":"&gt;",
			"\"":"&quot;",
			"\\":"&#92;",
			"&":"&amp;",
			"'":"&#039;",
			"\n":"",
			"\r":""
		}
		var r = /\<|\>|\"|\\|&|\'|\n|\r/gi;
		var s = value.replace(r,function(){
			return hach[arguments[0]];
		});
		return s;
	};
	
	e.text && (function(){
		var t = e.text;
		Core.Events.addEvent(t,(function(t){
			return function(){
				var value = leftB(trim(t.value),30);
				flush("text",htmlEncode(value));
			};
		})(t),"keyup");
		t.value = param.text;
	})();
	
	//初始化颜色选择器
	e.color && (function(){
		var list = e.color.getElementsByTagName("li");
		var len = list.length;
		len && (function(){
			var i=0;
			var currentSelected;
			var setSelected = function(li){
				if(currentSelected){
					currentSelected.className = "";
				}
				li.className = "cur";
				currentSelected = li;
			};	
			for (i; i < len; i++) {
				(function(li, index){
					Core.Events.addEvent(li, function(){
						flush("color",index);
						setSelected(li)
						return false;
					}, "click");
				})(list[i], i);
			}
			setSelected(list[0]);
		})();
	})();
	
	//绑定大小选择
	e.size && (function(){
		var list = e.size.getElementsByTagName("input");
		var len = list.length;
		len && (function(){
			var i=0;
			var currentSelected;
			for (i; i < len; i++) {
				(function(input, index){
					Core.Events.addEvent(input, function(){
						flush("size",index);
						currentSelected = input;
					}, "click");
				})(list[i], i);
			}
			list[1].checked = true;
		})();
	})();
	
	//代码复制及双击选择
	e["code"] && (function(){
		var c = e["code"];
		//绑定双击选择
		Core.Events.addEvent(c, (function(c){
			return function(){
				if ($IE && c.createTextRange) {
                	App.setCursor(c, -1, c.value.length + 2);
	            }
	            else if (c.setSelectionRange) {
					c.setSelectionRange(0, c.value.length);
	            }
			};
		})(c), "dblclick");
		//绑定复制
		e["copy"] && e["success"] && (function(){
			var b = e["copy"];
			Core.Events.addEvent(b,(function(c){
				return function(){
					if (App.copyText(c.value || "")) {
					    e["success"].style.display = "";
						setTimeout(function(){e["success"].style.display="none"},3000)
					}else{
					    App.alert("你的浏览器不支持脚本复制或你拒绝了浏览器安全确认，请双击全选文本框中的代码，手动[Ctrl+C]复制。");
					};
					return false;
				};
			})(c),"click")
		})();
	})();
	try {
		flush();
		setTimeout(function(){App.scrollToTarget(Core.Dom.getElementsByClass(document.body,"div","sharebutton")[0])},1000);
	}catch(e){}
});
