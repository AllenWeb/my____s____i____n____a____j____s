/**
 * @fileoverview 添加/删除/显示用户自定义标签功能
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/core/class/extend.js");
$import("jobs/request.js");
$import("sina/core/events/fireEvent.js");
//$import("msg/msg.js");
//$import("msg/clientmsg.js");
$import("diy/dialog.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/trim.js");
$import('sina/core/dom/getXY.js');
$import("diy/autocomplate.js");
$import("sina/core/array/findit.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/system/winSize.js");
$import("sina/core/system/getScrollPos.js");
$import("diy/enter.js");
$registJob('set_tag',function(){
	scope.arrTags = [];
	for(var t in scope.$tags){
		if(!(t  in {})){//防止原型污染
			scope.arrTags.push(scope.$tags[t].tag);
		}
	}
	var initTagValue;
	if($E("tag_input")){
		initTagValue = $E("tag_input").value;
	}
	function addTag(oButton,oInput,oError){

		scope._submit_tag_btn = oButton;
		scope._error = oError;
		//自动联想输入提示功能
		var ac = scope.autoSuggestTags({"input":oInput},"http://t.sina.com.cn/person/aj_tagchooser.php");
		var initHtml = oError.innerHTML;
		var initBtnCalss = (scope.$pageid==="set_tag") ? "btn_normal":"btn_normal btnxs";
		var valid = false;
		var validateTag = function(){
			initTagValue = initTagValue==null?'':initTagValue;
			if(oInput.value.replace(/^\s+|\s+$/g, '')==''){
				oInput.value = initTagValue;
				oInput.style.cssText = '';
				return false;
			}
			
			if(oInput.value === initTagValue){
				oError.innerHTML = initHtml;
				return false;
			}
			if(oInput) {
				if (!Core.String.trim(oInput.value)) {
					oInput.value = initTagValue;
					oInput.style.cssText = "color:#CCCCCC;";
					return false;
				}
				else {
					oInput.style.cssText = "color:black;";
				}
			}
			var v = Core.String.trim(oInput.value.replace(/,|;|\uFF0C|\uFF1B|\u3001|\s/g,""));
			
			if(scope.arrTags.length >= 10 && v.length > 0 ){
				oError.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0019'] + '</span>';
				valid = false;
				return valid;
			}else{
				oError.innerHTML = initHtml;
				valid = true;
			}
			
			var valid = false;
			if (!(/^(,|;|\uFF0C|\uFF1B|\u3001|\s|\w|[\u4E00-\u9FA5\uFF00-\uFFFF])*$/.test(Core.String.trim(scope._dbc2sbc(oInput.value))))){
				//可以输入中英文、数字(空格和,;，；、视为分隔符)。
				oError.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0020'] + '</span>';
			    valid = false;
				return valid;
			}else{
				oError.innerHTML = initHtml;
				valid = true;
			}

			var arr = Core.String.trim(oInput.value).split(/,|;|\uFF0C|\uFF1B|\u3001|\s/);
			for(var i=0,length=arr.length;i<length;i++){
				if(Core.String.byteLength(arr[i]) > 14){
					oError.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0021'] + '</span>';
					return false;
				}
			}
			
			if((v && (Core.String.byteLength(v + scope.arrTags.join("")) > 140))|| ((arr.length+scope.arrTags.length)>10 && v.length > 0)){
				oError.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0022'] + '</span>';
				return false;
			}
			
            if(!v && len==0){
				oError.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0023'] + '</span>';
				valid = false;
				return valid;
			}
			return valid;
		};
		Core.Events.addEvent(oInput,validateTag, "blur");
		
		function submit(){
			if(scope.arrTags.length < 10){
				var tagName = Core.String.trim(oInput.value);
				if(validateTag()){
					Core.Events.fireEvent(oInput,'blur');
					setTimeout(function(){
						scope.addTag(tagName, function(){
							if (oInput) {
								oInput.value = "";
							}
						});
					},10)
				}else if(tagName === initTagValue){
					oError.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0023'] + '</span>';
					oInput.focus();
				}
			}else{
				oError.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0012'] + '</span>';
				oInput.focus();
			}
		}
		
		Core.Events.addEvent(oButton,submit,"click");
		
		//回车亦提交
		App.enterSubmit({
			parent : oButton.parentNode,
			action : function(){
				//延时以便于提交enter选中的自动完成组件值
				var index = ac.get('index');
				setTimeout(function(){
					//相同即均为-1，表明无自动完成组件的enter事件(为普通enter提交)
					if(index === ac.get('index')){
						submit();
					}else{
						oInput.focus();
					}
				},200);
			}
		});
	}
	
	if(scope.$pageid==="set_tag"){//标签设置页
		$E("tip_or_error").style.display = "block";
		var input = $E("tag_input");
		if(scope.arrTags.length!= 10){
			//不延时则自动联想输入功能第一次输入后没有反应
//			setTimeout(function(){
////				input.focus(); chibin comment
//			},0);	
		}
		Core.Events.addEvent(input,function(){
			if(input.value === initTagValue){
				input.value = "";
			}
			input.style.cssText = "color:black;";
		},"click",false);
		
		addTag($E("add_tag"),$E("tag_input"),$E("tip_or_error"));
	}
	if($E("module_tags")){
		scope.showTag();
		Core.Events.addEvent($E("addUserTag"),function(e){
			if(scope.arrTags.length >= 10){
				return;
			}
			scope.showTagEditor(e);
			if(!scope._binded){
				addTag($E("add_tag"),$E("tag_input"),$E("tag_error"));
				scope._binded = true;
			}
		},"click",false);
	}
	if(scope.$pageid === "square_tag" || scope.$pageid === "tag_search"){
	 	Core.Events.addEvent($E("insert_tag"),function(e){
			if(scope.arrTags.length >= 10){
				return App.alert($CLTMSG['CX0012'],{icon:2,width:380,height:120});
			}
			scope.showTagEditor(e);
			if(!scope._binded){
				addTag($E("add_tag"),$E("tag_input"),$E("tag_error"));
				scope._binded = true;
			}
			
		},"click",false);
		
		Core.Events.addEvent($E("add_tag_btn"),function(e){
			if(scope.arrTags.length >= 10){
				return App.alert($CLTMSG['CX0012'],{icon:2,width:380,height:120});
			}
			scope.showTagEditor(e);
			if(!scope._binded2){
				addTag($E("add_tag"),$E("tag_input"),$E("tag_error"));
				scope._binded2 = true;
			}
			
		},"click",false);
	}
	
	//发布我的所有标签,推荐给朋友
	Core.Events.addEvent($E("recommendtag"),function(e){
		var dialog = App.confirm($CLTMSG['CX0024'],{
			icon:4,
			width:370,
			ok:function(){
				scope.publishTag(scope.arrTags);
			},
			cancel:function(){}
		});
		
	},"click",false);
	
	//看别人标签层内加关注
	App.tagAddFollow = function(uid, el){
		var url = "/attention/aj_addfollow.php";
        function cb(json){
           el.parentNode.innerHTML = '<span class="concernBtn_Yet">' + $CLTMSG['CX0025'] + '</span>';
        }
        App.followOperation({
            uid: uid,
            fromuid: scope.$uid
        }, url, cb);
	};
});

Core.Class.extend(scope,{
	_afterTagsAdded:function(tags){
		$E("recommendtag") && ($E("recommendtag").style.display = "");
		
		var html = [],arr = [];
		var url = "/pub/tags/";
		html.push('<p class="txt font_14" id="added_tips"> ' + $CLTMSG['CX0026']);
		for(var i=0,len=tags.length;i<len;i++){
			arr.push('<a href="' + url + encodeURIComponent(tags[i]) + '">'+ tags[i] +'</a>');
		}
		if(arr.length > 4){
			html.push(arr[0] + "、" + arr[1] + "、"+ arr[2] + "、" + arr[3] + " ... ");
		}else{
			html.push(arr.join("、"));
		}
		
		html.push($CLTMSG['CX0027'] + '</p>');
		var dialog = App.confirm(html.join(""),{
			icon:3,
			width:420,
			ok_label:$CLTMSG['CX0028'],
			cancel_label:$CLTMSG['CX0029'],
			ok:function(){
				scope.publishTag(tags);
			},
			cancel:function(){}
		});
		$E("added_tips").parentNode.parentNode.style.width = '300px';
	},
	/**
	 * 发布标签到feed列表，推荐给朋友
	 * @param{Array}tags
	 * */
	publishTag:function(tags){
		scope._lock = false ;
		var content=""; 
		if(scope._lock){
			return ;
		}
		if(tags&&tags.length>0){
			for(var i=0;i<tags.length;i++){
			    content += '[TAG]' + tags[i] + '[TAG]';
				if(i!=tags.length-1){
					content+='、';
				}
			}
			content = $CLTMSG['CX0030']+content+$CLTMSG['CX0031'];
		}
		var oData = {
			content:content
		}
		var sUrl = "http://t.sina.com.cn/mblog/publish.php";
		scope._lock = true;
		var dialog;
		App.doRequest(oData,sUrl,function(data,result){
			if(result.code === "A00006"){
				dialog = App.alert($CLTMSG['CX0032'],{icon:3});
				setTimeout(function(){
					if(!dialog._distory){
						dialog.close();
					}
				},3000);
			}
			scope._lock = false;
		},function(result){
			if(result && result.code){
				if(result.code === "M14018"){
					dialog = App.alert($CLTMSG['CX0033'],{icon:2,width:370,height:120,ok:function(){
						window.location.reload(true);
					}});
				}else{
					dialog = App.alert($SYSMSG[result.code],{icon:2,width:370,height:120});
				}
			}else{
				dialog = App.alert($CLTMSG['CX0018'],{icon:2,width:370,height:120});
			}
			setTimeout(function(){
				if(!dialog._distory){
					dialog.close();
				}
				if(result.code === "M14018"){
					window.location.reload(true);
				}
			},3000);
			scope._lock = false;
		});				
	},
	//全角转半角
	_dbc2sbc:function(str){
		return str.replace(/[\uff01-\uff5e]/g,function(a){
			return String.fromCharCode(a.charCodeAt(0)-65248);
		}).replace(/\u3000/g," ");
	},
	//添加tag之前处理
	_beforeAddTag:function(rawValue){
		rawValue = Core.String.trim(this._dbc2sbc(rawValue));
		var tags = rawValue.split(/,|;|\uFF0C|\uFF1B|\u3001|\s/);
		var arrTag = [];
		for(var i=0,len=tags.length;i<len;i++){
			if(tags[i] !== "" && Core.Array.findit(arrTag,tags[i]) === -1){
				arrTag.push(tags[i]);
			}
		}
		
		return arrTag.join(";");
	},
	//添加tag
	addTag:function(tagName,callback){
		if(scope._on_submiting){
			return;
		}
		tagName = this._beforeAddTag(tagName);
		//点击推荐标签时提醒
		if(scope.$oid === scope.$uid && scope.arrTags.length >= 10){
			$E('tip_or_error').innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0019'] + '</span>';
			return;
//			return App.alert($CLTMSG['CX0019'],{icon:2,width:380,height:120});
		}
		var sUrl = "http://t.sina.com.cn/person/aj_addusertag.php";
		var oData = {"tag":tagName};
		
		var tags = tagName.split(";"), newTags = [];
		for(var i=0,len=tags.length;i<len;i++){
			if(Core.Array.findit(scope.arrTags,tags[i]) != -1){
				//高亮显示已经添加的tag标签
				var cssText = "background-color:yellow;font-size:20px;font-weight:bold;"
				if(scope.$pageid==="set_tag"){
					var a_list = $E("tag_list").getElementsByTagName("A");
					for(var k=0,length = a_list.length ;k<length;k++){
						if(a_list[k].getAttribute("tagid")){
							if(a_list[k].previousSibling.innerHTML == tags[i]){
								(function(index){
									var a_tag = a_list[index];
									var li = a_tag.parentNode;
									a_tag.style.display = "none";
									li.style.cssText = cssText;
									setTimeout(function(){
										li.style.cssText = "";
										a_tag.style.display = "";
									},666);
								})(k);
							}
						}
					}
				}else{
					var a_list = $E("module_tags").getElementsByTagName("A");
					for(var m=0,length = a_list.length ;m<length;m++){
						if(a_list[m].innerHTML == tags[i]){
							(function(index){
								var a_tag = a_list[m];
								a_tag.style.cssText = cssText;
								setTimeout(function(){
									a_tag.style.cssText = "";
								},666);
							})(m);
						}
					}
				}
			}else{
				newTags.push(tags[i]);
			}
		}
		if(newTags.length===0){
			$E("tag_input").focus();
			return;
		}
		oData = {tag:newTags.join(";")};
		if(scope._submit_tag_btn){
			scope._submit_tag_btn.disabled = true;
		}
		scope._on_submiting = true;
		App.doRequest(oData,sUrl,function(data,result){
			if(result.data){
				var tagid,tag;
				for(var j=0,length=result.data.length;j<length;j++){
					tagid = result.data[j].tagid;
					tag = result.data[j].tag;
					var imgURL = scope.$BASEIMG+"style/images/common/transparent.gif";
					var newTagURL = "/pub/tags/" + encodeURIComponent(tag);
					if(scope.$pageid === "set_tag"){//设置页
						var html = '<li onmouseover="this.className=\'bg\';" onmouseout="this.className=\'\';">' +
								'<a class="a1" href="' + newTagURL + '">'+ tag +'</a>' +
								'<a class="a2" tagid="'+ tagid +'" ' +
								'href="javascript:;" onclick="scope.deleteTag(this)">' +
								'<img title="' + $CLTMSG['CX0034'] + '" src="'+imgURL+'"></a></li>';
						
						Core.Dom.insertHTML($E("tag_list"), html, "AfterBegin");
						if(scope.arrTags.length == 0){
							$E("mytagshow1").style.display = "block";
							$E("mytagshow2").style.display = "block";
						}
						if(typeof callback === "function"){
							callback(data,result);
						}
					}else{//我的微博页
						if($E("no_tag_tip")){
							$E("no_tag_tip").style.display = "none";
						}
						//空格是解决ff3下显示不折行而隐藏了的bug
						var html = '<a class="font_12 fb" tagid="'+tagid+'" href="'+newTagURL+'">'+tag+'</a>&nbsp;';
						Core.Dom.insertHTML($E("module_tags"), html, "AfterBegin");
						if(scope._tag_region){
							scope._tag_region.style.display = "none";
						}
					}
					if(scope.arrTags.length === 0){
						scope._afterTagsAdded(newTags);
					}
					scope.arrTags.unshift(tag);
					if(scope._submit_tag_btn){
						scope._submit_tag_btn.disabled = false;
						if(scope.arrTags.length>=10){
							var oAddBtn = $E("addUserTag");
							if(oAddBtn){
								oAddBtn.style.display = "none";
								oAddBtn.nextSibling.style.display = "none";
							}
						}
					}
					
					scope._on_submiting = false;
				}
			}	
		},function(result){
			if(result && result.code){
				scope._error.innerHTML = '<span style="color:red;font:bold;">'+$SYSMSG[result.code]+'</span>';
			}else{
				scope._error.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0017'] + '</span>';
			}
			if(scope._submit_tag_btn){
				scope._submit_tag_btn.disabled = false;
			}
			scope._on_submiting = false;
		});
	},
	
	//删除tag
	deleteTag:function(el){
		var sUrl = "http://t.sina.com.cn/person/aj_delusertag.php";
		var oData = {"tagid":el.getAttribute("tagid")};
		var lock = false;
		if(lock){
			return;
		}
		lock = true;
		App.doRequest(oData,sUrl,function(data,result){
			try{
				lock = false;
				
				if(scope.$pageid === "square_tag"||scope.$pageid ==="tag_search"){//微博广场
					var previousSibling = el.parentNode.previousSibling;
					while(previousSibling && previousSibling.nodeType == 3){
						previousSibling = previousSibling.previousSibling;
					} 
					var tagName = previousSibling.getElementsByTagName("A")[0].innerHTML;
					scope.arrTags.splice(Core.Array.findit(scope.arrTags,tagName),1);
					var pp = el.parentNode.parentNode;
					pp.parentNode.removeChild(pp);
					if($E("tag_list").getElementsByTagName("DIV").length === 0){
						$E("mytags") && ($E("mytags").style.display = "none");
						$E("tag_list") && ($E("tag_list").style.display = "none");
					}
					if($E("insert_tag")){
						$E("insert_tag").style.display = "";
						$E("insert_tag").nextSibling.style.display = "";
					}
					if($E("add_tag_btn")){
						$E("add_tag_btn").parentNode.style.display = "";
					}
				}else{
					var tagName = el.previousSibling.innerHTML;
					scope.arrTags.splice(Core.Array.findit(scope.arrTags,tagName),1);
					var ul = $E("tag_list");
					ul.removeChild(el.parentNode);
					
					if(ul.getElementsByTagName("li").length === 0){
						$E("mytagshow1").style.display = "none";
						$E("mytagshow2").style.display = "none";
					}	
				}
			}catch(e){
				lock = false;
			}
		},function(result){
			lock = false;
			if(result && result.code){
				App.alert($SYSMSG[result.code],{icon:2,width:370,height:120});
			}else{
				App.alert($CLTMSG['CX0035'],{icon:2,width:370,height:120});
			}
		});
	},
	
	//添加推荐的标签
	addRecommendedTag:function(el){
		var tagName = el.innerHTML.substring(10);
		this.addTag(tagName,function(){
			el.parentNode.removeChild(el);
			
			//添加推荐的所有标签后（删除了）则自动刷新页面
			if($E("rec_tags").getElementsByTagName("A").length === 0){
				location.reload();
			}
		});
	},
	
	//按权重排序显示tag（不同权重使用不同等级字体大小，相同等级tag随机粗体显示）
	showTag:function(){
		//scope.$tags = {"19":{"tagid":"19","tag":"1223sw","weight":"1"}};
		var container = $E("module_tags");
		var weights = [], tags = [];
		for(var t in scope.$tags){
			if(!(t  in {})){
				var a = $C("A");
				a.innerHTML = scope.$tags[t]['tag'];
				a.setAttribute("tagid",scope.$tags[t]['tagid']);
				a.setAttribute("weight",scope.$tags[t]['weight']);
				weights.push(parseFloat(scope.$tags[t]['weight']));
				tags.push(a);
				var url = "/pub/tags/" + encodeURIComponent(scope.$tags[t]['tag']);
				if(scope.$uid == ''){
					url = 'http://t.sina.com.cn/reg.php?inviteCode=' + scope.$oid;
				}
				a.setAttribute("href",url);
				container.appendChild(a);
				
				//空格是解决ff3下显示不折行而隐藏了的bug
				container.appendChild(document.createTextNode(" "));
			}
		}
		
		//分4个字体大小等级；随机粗体。
		weights.sort();
		var w;
		for(var i=0,len=tags.length;i<len;i++){
			w = parseFloat(tags[i].getAttribute("weight"));
			if(w > weights[Math.round(len/2)]){
				if(w > weights[Math.round(len*3/4)] ){
					tags[i].className = Math.round(Math.random()*100)%2 ? "font_18 fb":"font_18";
				}else{
					tags[i].className = Math.round(Math.random()*100)%2 ? "font_16 fb":"font_16";
				}
			}else{
				if(w > weights[Math.round(len/4)]){
					tags[i].className = Math.round(Math.random()*100)%2 ? "font_14 fb":"font_14";
				}else{
					tags[i].className = Math.round(Math.random()*100)%2 ? "font_12 fb":"font_12";
				}
			}
		}
		
	},
	
	//显示并且定位添加标签区到'编辑'按钮下合适位置
	showTagEditor:function(e){
		if(!scope._tag_region){
			var region = $C("DIV");
			region.id = "tag_editor";
			region.style.display = "none";
			region.className = "small_Yellow"
			region.innerHTML = '<table style="width: 200px;" class="CP_w">\
		        <thead>\
		            <tr>\
		                <th class="tLeft">\
		                    <span></span>\
		                </th>\
		                <th class="tMid">\
		                    <span></span>\
		                </th>\
		                <th class="tRight">\
		                    <span></span>\
		                </th>\
		            </tr>\
		        </thead>\
		        <tfoot>\
		            <tr>\
		                <td class="tLeft">\
		                    <span></span>\
		                </td>\
		                <td class="tMid">\
		                    <span></span>\
		                </td>\
		                <td class="tRight">\
		                    <span></span>\
		                </td>\
		            </tr>\
		        </tfoot>\
		        <tbody>\
		            <tr>\
		                <td class="tLeft">\
		                    <span></span>\
		                </td>\
		                <td class="tMid">\
		                    <div class="tagslayer">\
		                        <p>\
		                            <input type="text" class="PY_input" id="tag_input">\
		                            <a class="btn_normal btnxs" href="javascript:;" id="add_tag" >\
		                            <em>' + $CLTMSG['CX0036'] + '</em></a>\
		                        </p>\
		                        <p class="txt" id="tag_error">\
		                            ' + $CLTMSG['CX0037'] + '  \
		                        </p>\
		                    </div>\
		                </td>\
		                <td class="tRight">\
		                    <span></span>\
		                </td>\
		            </tr>\
		        </tbody>\
		    </table>\
		    <div class="close">\
		        <a href="javascript:;" id="close_tag"></a>\
		    </div>';
		    document.body.appendChild(region);
		    scope._tag_region = region;
		}
		setTimeout(function(){
			if(scope._tag_region.style.display!=="none"){
				$E("tag_input").focus();
			}
			
		},100);
		
		$E("tag_input").value = "";
		$E("tag_error").innerHTML = $CLTMSG['CX0037'];
		var e = e||window.event;
		var target = e.srcElement || e.target;
		target.parentNode && (target.parentNode.style.position = "relative");
		scope._srcElement = target;
		var pos = Core.Dom.getXY(target);
		var editor = scope._tag_region;
		var style = editor.style; 
		if(style.display == "none"){
			style.display = "block";
		}else{
			style.display = "none";
			return ;
		}
		with(style){
			position = "absolute";
			left = pos[0] - editor.offsetWidth + 85 + "px";
			top = pos[1] + 20 +"px";
			if(scope.$pageid === "square_tag"||scope.$pageid==="tag_search"){
				left = pos[0] - editor.offsetWidth + 150 + "px";
				top = pos[1] + 25 +"px";
				if(target.id === "insert_tag"){
					top = pos[1] + 15 +"px";
					left = pos[0] - editor.offsetWidth + 145 + "px";
				}
			}
		}
		Core.Events.addEvent($E("close_tag"),function(e){
			style.display = "none";
		},"click",false);
		
	},
	
	//自动提示，联想输入推荐标签
	//spec['input'] 是标签输入框,url是ajax请求地址
	autoSuggestTags:function(spec,url){
		//自动完成始终联想最后一个tag
	    spec["formatKey"]=function(key){
			key = key.replace(/,|;|\uFF0C|\uFF1B|\u3001|\s/g," ");
			var arr = key.split(/\s/);
			return arr[arr.length-1];
		}
		spec['ok'] =  function(value,text){
	       if(spec['input'].value && /,|;|\uFF0C|\uFF1B|\u3001|\s/.test(spec['input'].value)){
	        	var arr = spec['input'].value.split(/,|;|\uFF0C|\uFF1B|\u3001|\s/);
	        	var v = spec['input'].value.substring(0,spec['input'].value.length-arr[arr.length-1].length);
	        	spec['input'].value = v + text + " ";//加空格可以避免选中该项后还提示该项对应的下来列表，并且用户可以连续输入
	        }else{
	        	spec['input'].value = text + " ";
	        }
	        
			if(spec['select'] && typeof spec['select'] =="function"){
				spec['select'](value,text);
			}
	    };
	    spec['timer'] = spec['timer'] || 5;
	    spec['style'] = spec['style'] || 'width:'+spec['input'].clientWidth+'px;position:absolute;z-Index:1200;';
	    spec['light'] = spec['light'] || function(el){
	        el.className = 'cur';
	    };
	    spec['dark'] = spec['dark'] || function(el){
	        el.className = '';
	    };
	    spec['class'] = spec['class'] || 'layerMedia_menu';
	    spec['type'] = spec['type'] || 'ajax';
	    spec['data'] = spec['data'] || url+'?key=' + spec['input'].value;
		spec['itemStyle'] = 'overflow:hidden;height:20px';
	    return App.autoComplate(spec);
	}
});
