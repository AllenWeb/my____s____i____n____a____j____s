/**
 * 发布器弹层
 * @fileoverview
 * App.publisherDialog.show(); //显示发布器弹层
 * App.publisherDialog.hidd(); //隐藏发布器弹层
 * @author liusong@staff.sina.com.cn
 */
$import("jobs/base.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/setStyle.js");
$import('diy/querytojson.js');
$import("diy/flyout.js");
$import("diy/check.js");
$import("diy/imgURL.js");
$import("diy/curtain.js");
$import("diy/getimgsize.js");
$import("diy/general_animation.js");
$import("jobs/refurbishNumber.js");
$import("jobs/insertTextArea.js");
$import("diy/PopUpFace.js");
$import("diy/forbidrefresh_dialog.js");
$import("diy/TextareaUtils.js");

	try{
	//函数集
	
	/*
	 * @发布器的操作函数
	 * @elements: 发布器需要的页面元素
	 * 	{
	 *		'image' : 
	 *		'info'	:
	 *		'editor':
	 *		'submit':
	 *		'imgPerch'	: 
	 *		'imgForm'	: 
	 *		'imgFile'	:
	 *		'preview'	:
	 *		'shadow'	:
	 *		'modal'		:
	 *		'close'		:
	 *	}
	 * @config	: 发布器的配置参数
	 *
	 */
	scope.addImgSuccess = function(){
	};
	App.publisher = function(elements){
		var instence = {};
		var _addEvent	= Core.Events.addEvent;
		var _trim		= Core.String.trim;
		var _bLength	= Core.String.byteLength;
		var _getByClass	= Core.Dom.getElementsByClass;
		var _setStyle	= Core.Dom.setStyle;
		var _imgURL		= App.imgURL;
		var _insertAfter= Core.Dom.insertAfter;
		var _query2json = App.queryToJson;
		var _alert		= App.alert;
		var _feedType	= scope['$feedtype'];
		var _leftB		= Core.String.leftB;
		if(!elements){throw('publisher need elements as parameters');}
		var _submitKey = true;
		var _newImageFile = function(){
			var file = document.createElement('INPUT');
			file.type = 'file';
			file.size = '1';
			file.name = 'pic1';
			//------------------chibin modify------------------
			//file.style.cssText = 'cursor:pointer !important;height:18px;left:70px;margin:0;opacity:0;filter:alpha(opacity=0);overflow:hidden;padding:0;position:absolute;top:0;';
			file.style.cssText = 'border: 0pt none ; filter:alpha(opacity=0);background: transparent none repeat scroll 0% 0%; opacity: 0; position: absolute; left: 70px; top: 0pt; -moz-background-clip: border; -moz-background-origin: padding; -moz-background-inline-policy: continuous; width: 60px; height: 22px';
			//------------------modify end ------------------
			elements['imgFile'].parentNode.insertBefore(file, elements['imgFile']);
			elements['imgFile'].parentNode.removeChild(elements['imgFile']);
			elements['imgFile'] = file;
			_addEvent(elements['imgFile'], _upImage, 'change');
		};
		
		var _upImage = function(){	
			var filename = elements['imgFile'].value;
			//对可用性的判断
			if(!/\.(gif|jpg|png|jpeg)$/i.test(filename)){
				App.alert({'code' : "M07004"});
				return false;
			}
			//页面操作
			elements['imgLoading'].style.display = '';
			elements['image'].style.display = 'none';
			//返回函数
			scope.addImgSuccess = function(cfg){
				if (cfg['ret'] === '1') {
					filename = filename.match(/[^\/|\\]*$/)[0];
					imgName = filename.slice(0,-4);
					if(imgName.length > 10){
						imgName = imgName.slice(0,10) + '...'
					}
					filename = imgName + filename.slice(-4);
					elements['imgName'].innerHTML = filename || $CLTMSG['CD0068'];
					elements['imgPerch'].style.display = '';
					elements['imgPerch'].value = cfg['pid'];
					if(!_trim(elements['editor'].value.replace('#' + $CLTMSG['CD0069'] + '#','')).length){
						elements['editor'].value = $CLTMSG['CD0070'];
						_limit();
					}
					App.getImgSize(_imgURL(cfg['pid'],'bmiddle'),function(){});
					App.getImgSize(_imgURL(cfg['pid'],'thumbnail'),function(){});
					
					_newImageFile();
					elements['imgLoading'].style.display = 'none';
					elements['preBox'].style.display = '';
					elements['preImage'].innerHTML = '<img src="' + App.imgURL(cfg['pid'], 'small') + '" />';
				}else {
					_delImg();
					elements['imgForm'].reset();
					App.alert({
						'code': 'M07002'
					});
				}
			};
			
			elements['imgForm'].submit();
		};
		
		//得到输入内容的长度
		var regexp = new RegExp('(http://)+(([-A-Za-z0-9]+(\.[-A-Za-z0-9]+)*(\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\$\.\+\!\*\(\),;:@&=\?/~\#\%]*)*', 'gi')
		var _getLength	= function(str){
			var len = _trim(str.replace(new RegExp("(#" + $CLTMSG['CD0069'] + "#)",'g'),"")).length;
			if (len > 0){
				var min=41,max=140,tmp=str;
				var urls = str.match(regexp) || [];
				var urlCount = 0;
				for(var i=0,len=urls.length;i<len;i++){
					var count = _bLength(urls[i]);
					if(count>min){
						urlCount += count<=max?21:(21+ (count-max)/2);
						tmp = tmp.replace(urls[i],'');
					}
				};
				return Math.ceil(urlCount + _bLength(tmp) / 2)
				//return Math.ceil(_bLength(_trim(str))/2);
			}else{
				return 0;
			}
		};
		
		//输入框的限制
		var _testlimit	= function(func){
			var len = _getLength(elements['editor'].value);
			if (typeof func === 'function') {
				func(len);
			}
			if (len >0 && len <= 140){
				return true;
			} else {
				return false;
			}
		};
		
		//修改自数提示信息
		var _countInfo	= function(len){
			if (len >= 0 && len <= 140) {
				elements['info'].className = 'writeScores';
				elements['info'].innerHTML = $CLTMSG['CD0071'].replace(/#\{cls\}/,"pipsLim").replace(/#\{len\}/,140 - len);
			}
			else {
				elements['info'].className = 'writeScores';
				elements['info'].innerHTML = $CLTMSG['CD0159'].replace(/#\{cls\}/,"pipsLim").replace(/#\{style\}/,"color:#FF3300").replace(/#\{len\}/,(140 - len) * (-1));
			}
		}; 
		
		//限制函数
		var _limit	= scope.flush_publish_dialog = function(event){
			if(event && event.ctrlKey==true && (event.keyCode=="13" || event.keyCode=="10")){return;}
			if(_testlimit(_countInfo)){
				if(!_submitKey){
					elements['submit'].className = 'submit';
					_submitKey = true;
				}
			}else{
				elements['submit'].className = 'submit_notclick';
				_submitKey = false;
			}
		};
		//缓存发布器的焦点位置
		var cashCur = function(){
			var selValue = App.TextareaUtils.getSelectedText(elements['editor']);
			var slen = (selValue == '' || selValue == null) ? 0 : selValue.length;
			var start = App.TextareaUtils.getCursorPos(elements['editor']);
			var curStr = start + '&' + slen;
			elements['editor'].setAttribute('range',curStr);
		};
		
		var _submit	= function(){
			if (!_submitKey) {
				if(!_testlimit()){
					App.cartoon.noticeInput(elements['editor']);
				}
				return false
			}
			_submitKey = false;
			
			elements['submit'].className = 'submit_notclick';
			var content = _trim(elements['editor'].value || '');
			var pic = [_trim(elements['imgPerch'].value || '')];
			
			var success = function(json,parameters){
				_clear();
				App.publisherDialog.success();
			};
			var error = function(json){
				_submitKey = true;
				
				//需要验证
				if(json.code == "MR0050"){
					App.forbidrefresh(function(){
						_submit();
					},"/mblog/publish.php");
					return false;
				}
				if (json) {
					_alert({
						'code': json['code']
					});
				}else{
					_alert({
						'code': 'R01404'
					});
				}
			};
			
			App.publishRumor(content, pic, success, error);
			return false;
		};
		
		var _ctrlSubmit = function(event){
			if(event.ctrlKey==true && event.keyCode=="13"){
				_submit();
			}
			return false;
		};
		
		var _clear	= function(){
			elements['editor'].value = '';
			_limit();
			_delImg();
		};
		
		var _delImg = function(){
			elements['preBox'].style.display = 'none';
			
			elements['imgPerch'].style.display = 'none';
			elements['imgPerch'].value = '';
			elements['imgLoading'].style.display = 'none';
			elements['image'].style.display = '';
			elements['preImage'].innerHTML = '<img src="">';
			scope.addImgSuccess = function(){};
			
		};
		
		var _getPos = function(){
			if (elements['editor'].createTextRange){
				elements['editor'].caretPos = document.selection.createRange().duplicate();
			}
		};
		
		var _publishFocus = function(){
			_limit();
			setTimeout(function(){elements['editor'].focus();}, 100);
		};
		/*
		var preUpImg = {
			mouseOver : function(e){
				elements['preBox'].style.display = 'block';
			},
			mouseOut : function(e){
				elements['preBox'].style.display = 'none';
			}
		};
		*/
		_addEvent(elements['imgFile'], _upImage, 'change');
		_addEvent(elements['editor'], _limit, 'keyup');
		_addEvent(elements['editor'], _limit, 'keypress');
		
		_addEvent(elements['editor'], _limit, 'input');
		_addEvent(elements['editor'], function(){setTimeout(_limit,0);}, 'paste');
		_addEvent(elements['editor'], function(){setTimeout(_limit,0);}, 'cut');
		_addEvent(elements['editor'], _limit, 'focus');
		_addEvent(elements['submit'], _submit, 'click');
		_addEvent(elements['editor'], _ctrlSubmit, 'keyup');
		_addEvent(elements['imgDelete'],_delImg,'click');
		
		_addEvent(elements['editor'], _getPos, "keyup");
		_addEvent(elements['editor'], _getPos, "focus");
		_addEvent(elements['editor'], _getPos, "select");
		_addEvent(elements['editor'], _getPos, "click");
		
		_addEvent(elements['editor'], cashCur, "mouseup");
		_addEvent(elements['editor'], cashCur, "keyup");
		
		/*
		_addEvent(elements['imgName'], preUpImg.mouseOver, 'mouseover');
		_addEvent(elements['imgName'], preUpImg.mouseOut, 'mouseout');
		*/
		
		_publishFocus();
		scope.publisherLimit = _limit;
		scope.publisherClear = _clear;
	};
	
	//提交数据的发布函数
	App.publishRumor = function(content,pic,success,error){
		
		if(typeof content != 'string'){
			throw('The publishRumor need a string as first parameter');
		}
		
		if(!(pic instanceof Array)){
			throw('The publishRumor need an array as second parameter');
		}
		
		if(typeof success != 'function'){
			throw('The publishRumor need a function as thrid parameter');
		}
		
		if(typeof error != 'function'){
			throw('The publishRumor need a function as fourth parameter');
		}
		var parameters = {
			'content'	: content.replace(/\uff20/ig,'@'),
			'pic'		: pic.join(','),
			'styleid'	: scope['styleid'],
			'retcode'   : scope.doorretcode||""
		};
		scope.doorretcode = "";
		
		/**
		 * 提供可配置的自定义提交地址:App.publisherDialog.submitUrl
		 * 提供可配置的附加提交参数:App.publisherDialog.options
		 * 提供可配置的App._hidePic_控制是否显示图片上传HTML元素
		 * */
		//--------------------------------------------------------------------
		var url = App.publisherDialog.submitUrl||"/mblog/publish.php";
		var options;
		if(options = App.publisherDialog.options){
		    for(var key in options){
		        if(!parameters[key] && !(key in {})){
		            parameters[key] = options[key];
		        }
		    }
		}
		//----------------------------------------------------------------------
		
		Utils.Io.Ajax.request(url, {
			'POST'		: parameters,
			'onComplete': function(json){
				if(json.code == 'A00006'){
					success(json.data,parameters);
				}else if(json.code == 'M00008'){
					window.location.replace(json.data);
				}else if(json.code =="G1"){					
					var dialog =	App.alert(App.getMsg('M02005'));
					dialog.onClose = function(){
						location.href ="/"+ scope.$uid;							
					};
					
					setTimeout(function(){
						if(dialog && dialog._distory){
							location.href ="/"+ scope.$uid;
						}
					},3000);
					
				}else{
					error(json);
				}
			},
			'onException': function(){
				error();
			},
			'returnType': 'json'
		});
	};
	/**
	 * 编辑器弹出层
	 */
	App.publisherDialog = (function(){
		var _imgPath = scope.$BASEIMG + "style";
		var _baseDialog = App.Dialog.BasicDialog;
		var successContent = '\
			<div class="commonLayer2" style="padding-top:0">\
	                <div class="zok">\
						<img class="PY_ib PY_ib_3" src="' + _imgPath + '/images/common/transparent.gif" align="absmiddle" alt="" title="" /> ' + $CLTMSG['CD0151'] + '\
	                </div>\
            </div>';
		//add by dimu 为应用广场写单独的引导
		var bHidePic = !App._hidePic_ ? '':'none';
		var topTitle = $CLTMSG['CD0073'];
		//haidong 沒看出參數如何傳，以後再
		if(scope.$pageid == "skin"){
			topTitle = "";
		}
		var content = '\
			<div class="commonLayer2" style="padding-top:14px;">\
                <div class="zPoster">\
                  <div class="ztips">\
				  	<div class="lf gray6">'+ topTitle+ '</div>\
				  	<div class="rt" id="publisher_info2">' + $CLTMSG['CD0071'].replace(/#{len}/,140) + '</div>\
				  </div>\
                  <div class="ztxtarea"><textarea id="publish_editor2" rows="" cols="" name=""></textarea></div>\
                  <div class="sendor">\
                  	<span>\
                  		<a href="javascript:void(0);" onclick="App.showFaces(this,$E(\'publish_editor2\'),-10,0,\'360px\',scope.flush_publish_dialog)">\
                  			<img align="absmiddle" class="zmotionico" alt="" src="' + _imgPath + '/images/common/transparent.gif"/>' + $CLTMSG['CD0032'] + '\
                  		</a>\
                  	</span>\
                  	<span id="publisher_image2" style="display:' + bHidePic + '">\
                  		<img src="' + _imgPath + '/images/common/transparent.gif" alt="" class="zpostorimgico" align="absmiddle" />\
						' + $CLTMSG['CD0074'] + '\
						<form method="POST" enctype="multipart/form-data" id="publisher_image_form2" action="http://picupload.t.sina.com.cn/interface/pic_upload.php?marks=' + (scope.$domain?1:0) + '&amp;markstr=' + (scope.$domain?scope.$domain:'') + '&amp;s=rdxt&amp;app=miniblog' + (scope.wm? "&amp;wm=2": "") + '&amp;cb=http://' + window.location.host + '/upimgback.html" target="Upfiler_file_iframe">\
							<input type="file" size="1" style="-moz-opacity:0; filter:alpha(opacity=0); opacity:0;position:absolute; left:70px; top:0; background:none transparent; border:0; width:60px; height:22px;" id="publisher_file2" name="pic1"/>\
						</form>\
					</span>\
					<span id="publisher_image_loading2" style="display: none;">' + $CLTMSG['CD0075'] + '</span>\
					<span id="publisher_perch2" style="display: none;"><em id="publisher_perch_name2">' + $CLTMSG['CD0076'] + '</em><a href="javascript:;" title="' + $CLTMSG['CX0013'] + '" class="close" id="publisher_perch_delete2"><img height="7" width="8" align="absmiddle" src="' + scope.$BASEIMG + 'images/index/fbqimgclose.gif"/></a></span>\
					<a href="javascript:void(0);" title="' + $CLTMSG['CD0048'] + '"><img id="publisher_submit2" src="' + _imgPath + '/images/common/transparent.gif" alt="' + $CLTMSG['CD0048'] + '" class="submit" /></a></div>\
                </div>\
                <div class="clearit"></div>\
				<iframe style="display:none;" class="fb_img_iframe" frameborder="0" id="Upfiler_file_iframe" name="Upfiler_file_iframe" src="about:blank"></iframe>\
            </div>\
			<div id="publisher_imgpreview2" class="layerPicBg" style="position:absolute; left:100px; top:190px;z-index:1008;display:none;">\
				<table class="fb_img" style="margin:0;"><tbody>\
					<tr><td></td><td class="j_bg"></td><td></td></tr>\
					<tr><td class="t_l"></td><td class="t_c"></td><td class="t_r"></td></tr>\
					<tr><td class="c_l"></td>\
						<td class="c_c" id="publisher_preimage2"><img src=""></td>\
					<td class="c_r"></td></tr>\
					<tr><td class="b_l"></td><td class="b_c"></td><td class="b_r"></td></tr>\
				</tbody></table>\
			</div>';
		var config = {width:490,zIndex:1000,hidden:true};
		var instence = {};
		//add by chibin 为我的微博页单独写标题
		//add by dimu 为应用广场写单独的标题
			var _head = '';
			if(scope.$pageid == 'mymblog'){
				_head = $CLTMSG["CD0077"];
			}else if(scope.$pageid == 'square_act_detail'){
				_head = $CLTMSG['CW0101'];
			}else if(scope.$pageid =='skin'){
				_head = $CLTMSG["CD0167"];
			}else{
				_head = $CLTMSG["CD0078"];
			}
			
			// 单例发布器弹层,该对像在选行App.publisherDialog.show()时初始化
			instence.publisherDialog = (function(){
				var _ins = null;
				var _cfg = null;
				
				return function(){
					if( _ins==null){
						try{
						if(scope.$pageid == 'profile'){
							_head = $CLTMSG["CY0106"].replace('{name}',decodeURIComponent(scope.recFriend['name']));
						}			
						}catch(ex){
							
						}
						_ins = new _baseDialog(_head, content, config);
						
						//避免同一页面有常规发布框id冲突
						_cfg = {
							'image' : $E('publisher_image2'),
							'info'	: $E('publisher_info2'),
							'editor': $E('publish_editor2'),
							'submit': $E('publisher_submit2'),
							'imgForm'	: $E('publisher_image_form2'),
							'imgPerch'	: $E('publisher_perch2'),
							'imgFile'	: $E('publisher_file2'),
							'imgName'	: $E('publisher_perch_name2'),
							'imgDelete'	: $E('publisher_perch_delete2'),
							'imgLoading': $E('publisher_image_loading2'),
							'preBox'	: $E('publisher_imgpreview2'),
							'preImage'	: $E('publisher_preimage2')
						};
						_ins.close = function(){
							if( _cfg.imgLoading      ){ _cfg.imgLoading.style.display = "none" }
							if( _cfg.imgFile         ){ _cfg.imgFile.value = "" }
							if( _cfg.imgPerch        ){ _cfg.imgPerch.style.display = "none" }
							if( _cfg.image           ){ _cfg.image.style.display='' }
							if( scope.publisherClear ){ scope.publisherClear(); }
							_ins.hidd();
							
							//App.hideFaces();//隐藏表情层
						}
						/*publish start2*/
						if(!$E('publisher_submit2')){
							return false;
						}
						App.publisher(_cfg);
					}
					return _ins;
				}
			})();
			instence.clock = null;
			// 单例成功提示层，该对像在选行App.publisherDialog.success()时初始化
			instence.successDialog = (function(){
				var _ins = null;
				return function(){
					if( _ins==null ){
						_ins = new _baseDialog(_head,successContent,config);
						_ins.close = _ins.hidd;
					}
					return _ins;
				};
			})();
			instence.close = function(){
				instence.publisherDialog().close();
			};
			instence.show = function(content,func){
				func = func || function(){};
				instence.publisherDialog().show();
				var editor = $E("publish_editor2");
				if( content && editor ){ editor.value = decodeURIComponent(content); }
				if( scope.publisherLimit ){ scope.publisherLimit(); }
				App.TextareaUtils.setCursor(editor);
				
				//避免同一页面有常规发布框id冲突
				var _cfg = {
					'image' : $E('publisher_image2'),
					'info'	: $E('publisher_info2'),
					'editor': $E('publish_editor2'),
					'submit': $E('publisher_submit2'),
					'imgForm'	: $E('publisher_image_form2'),
					'imgPerch'	: $E('publisher_perch2'),
					'imgFile'	: $E('publisher_file2'),
					'imgName'	: $E('publisher_perch_name2'),
					'imgDelete'	: $E('publisher_perch_delete2'),
					'imgLoading': $E('publisher_image_loading2'),
					'preBox'	: $E('publisher_imgpreview2'),
					'preImage'	: $E('publisher_preimage2')
				};
				func(_cfg);
				
				//缓存发布器的焦点位置
				var cashCur = function(obj){
					var selValue = App.TextareaUtils.getSelectedText(obj);
					var slen = (selValue == '' || selValue == null) ? 0 : selValue.length;
					var start = App.TextareaUtils.getCursorPos(obj);
					var curStr = start + '&' + slen;
					obj.setAttribute('range',curStr);
				};
				cashCur(editor);
			};
			instence.complete = function(){
				clearTimeout(instence.clock);
				instence.successDialog().close();
				//chibin add 我的微博页完事要刷新
					if(scope.$pageid=='mymblog'){
						window.location.reload(true);
					}
			};
			instence.success = function(){
				instence.close();
				instence.successDialog().show();
				instence.clock = setTimeout(function(){
					instence.complete();
				},1000);
			};
		return instence;
	})();
	}catch(exp){}


