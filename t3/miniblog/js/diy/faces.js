/**
 * @fileoverview 允许用户输入表情、动漫图标
 * @author yuwei@staff.sina.com.cn
 * 
 * @requires 约定页面需要配置表情映射(图片src属性要以子文件目录开头):
 * scope.$faceIcons = [{icon:"高兴",value:":)",src:"basic/joy.gif"},{icon:"生气",value:":(",src:"basic/unhappy.gif"}];
 */
$import("sina/sina.js");
$import("sina/app.js");
$import('sina/core/events/addEvent.js');
$import("sina/core/dom/getXY.js");
$import("sina/core/base/detect.js");
$import("sina/core/dom/contains.js");
//$import("diy/insertText.js");
$import("diy/TextareaUtils.js");

(function(proxy){
	var iniTarget,srcInput,iconLayer,iconText,callback;
	/**
	 * 显示表情层
	 * @param{HTML Element}target 定位相对元素（如某按钮）
	 * @param{HTML Element}input 输入目标(用于设置返回表情值)
	 * 
	 * @param{Number}dX 可选参数 微调left值
	 * @param{Number}dY 可选参数 微调top值
	 * @param{String}layerWidth 可选参数 表情层宽度值（默认360px）
	 * @param{String}callback 可选参数 插入表情完毕后回调函数
	 * */
	proxy.showFaces = function(target,input,dX,dY,layerWidth, cb){
		if(!iconLayer){
			iconLayer = makeFaces(layerWidth);
		}
		if(cb){
			callback = cb;
		}
		
		var position = Core.Dom.getXY(target);
		position[1] += target.offsetHeight ;
		if(Core.Base.detect.$IE){
			position[0] += -10;
		}
		if(!isNaN(dX)){
			position[0] += dX;
		}
		if(!isNaN(dY)){
			position[1] += + dY;
		}
		//add "zoom:1" hack to enable IE haslayout,透明边框效果
		iconLayer.style.cssText = "left:" + position[0] + "px;top:" + position[1] + "px;" + 
		"position:absolute;z-index:1700;display:'';zoom:1;";
		
		iniTarget = target;		
		srcInput = input;
		iconText = null;
		
		Core.Events.addEvent(document.body,hideFace,'click',false);
		
		return iconLayer;
	};
	
	/**
	 * 隐藏表情
	 * */
	proxy.hideFaces = function(){
		iconLayer && (iconLayer.style.display = "none");
		Core.Events.removeEvent(document.body,hideFace,'click');
		return iconLayer;
	};
	
	/**
	 * 获得选中的表情符号(转译文字)
	 * */
	proxy.getFace = function(){
		return iconText;
	};
	
	
	//private----------------------------------------------------------------------------------
	function hideFace(e){
		var t = e.target||e.srcElement;
		if(t != iniTarget && !Core.Dom.contains(iconLayer, t)){
			proxy.hideFaces();
		}
	}
	
	function makeFaces(layerWidth){
		layerWidth = layerWidth || "360px";
		var faces = scope.$faceIcons||[], list=[];
		var imgURI = scope.$BASEIMG+'style/images/common/face/';
		var len = faces.length;
		//IE使用逐个加载表情图片的办法，其它浏览器批量加载----------------------------------------------------
		if(Core.Base.detect.$IE){
			setTimeout(function(){
				var oContainer = $E("face_icons");
				for(var i=0;i<len;i++){
					(function(i){
						var oImg = new Image();
						oImg.onload = function(){
							var oLi = $C("LI");
							oLi.innerHTML = '<a href="javascript:void(0)" onclick="App._onFaceIconClicked_(this)" ' +
								'value="' + faces[i].value + '" title="' + faces[i].icon + '">' +
								'<img src="'+ imgURI + faces[i].src +'" alt="'+ faces[i].icon +'" /></a>';
							oContainer.appendChild(oLi);
							
							oImg.onload = null;//gc!
							oImg = null;
						};
						oImg.src = imgURI + faces[i].src;
					})(i);
				}
			},100);
		}else{
			for(var i=0;i<len;i++){
				list.push('<li><a href="javascript:void(0)" onclick="App._onFaceIconClicked_(this)" ' +
				'value="' + faces[i].value + '" title="' + faces[i].icon + '">' +
				'<img src="'+ imgURI + faces[i].src +'" alt="'+ faces[i].icon +'" /></a></li>');
			}
		}
		//-----------------------------------------------------------------------------------------
		
		var icons = '<table class="mBlogLayer">\
		    <tbody>\
		        <tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr>\
		        <tr><td class="mid_l"></td>\
		            <td class="mid_c">\
		                <div class="layerBox">\
		                    <div class="layerBoxCon1" style="width:'+ layerWidth +'">\
		                        <div class="faceItem clearFix">\
		                            <div class="layerArrow"></div>\
		                            <div class="layerMedia_close">\
		                            	<a class="close" href="javascript:void(App.hideFaces())" title="'+$CLTMSG['CL0701']+'" ></a></div>\
		                            <div class="faceItemPicbg">\
		                                <ul id="face_icons">'
		                                	+ list.join('') +
		                                '</ul>\
		                            </div>\
		                        </div>\
		                    </div>\
		                </div>\
		            </td>\
		            <td class="mid_r"></td>\
		        </tr>\
		        <tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr>\
		    </tbody>\
		</table>';
		var box = $C("div");
		box.innerHTML = icons;
		box.style.display = "none";//避免IE下表情图片定位错误
		document.body.appendChild(box);
		return box;
	};
	
	App._onFaceIconClicked_ = function(el){
		iconText = el.getAttribute("value");
		if(iconText){
			iconLayer.style.display = "none";
			if(srcInput){
				//在光标位置插入表情文本
				srcInput.focus();
				setTimeout(
					function(){
						//App.insertText({'dom':srcInput});//key point
						var range = srcInput.getAttribute('range');
						if (range == null) {//评论表情处理
							insertText(srcInput,iconText);
						}
						else {//发布器表情处理
							var pos = range.split('&');
							App.TextareaUtils.unCoverInsertText(srcInput,iconText,{'rcs':pos[0],'rccl':pos[1]});
							//reset
							var newPos = App.TextareaUtils.getCursorPos(srcInput,iconText);
							srcInput.setAttribute('range',newPos+'&0');
						}
						if(callback){
							callback();
						}
					},10
				);
			}
		}
	};
	
	/**
	 * 在光标位置插入文本
	 * @param{Object}oInput
	 * @param{String}text
	 * */
	function insertText(oInput,text){
		if($IE){
			var range = oInput.createTextRange();
			range.collapse(true);
			if(oInput.caretPos){
				var caretPos = oInput.caretPos;
				caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? text + ' ' : text;
				range.moveStart('character',oInput.value.indexOf(text)+1);
				range.moveEnd('character',text.length-2);
			}else{
				var sel = document.selection.createRange();
				document.selection.empty();
				sel.text = text;
				// oInput.value += text;
				// range.moveStart('character',oInput.value.length);
				// range.moveEnd('character',oInput.value.length);
				// range.select();//key point
			}
		}else if(oInput.setSelectionRange){
			var start = oInput.selectionStart;
			var end = oInput.selectionEnd;
			var str1 = oInput.value.substring(0, start);
			var str2 = oInput.value.substring(end);
			var v = str1 + text,len = v.length;
			oInput.value =  v + str2 ;
			oInput.setSelectionRange(len,len);
		}else{
			oInput.value += text;
		}
	}
})(App);
