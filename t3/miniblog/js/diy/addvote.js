/*
 * @author pjan | peijian@staff.sina.com.cn
 * @title 插入投票功能
 */
$import("jobs/base.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/dom/removeNode.js");
$import('sina/core/dom/getXY.js');
$import('sina/core/string/byteLength.js');
$import('sina/core/string/leftB.js');
$import('sina/core/string/encodeHTML.js');


App.addVote = function(el, cb, ecb, indata){
	var that = {};
	var _layer = {};
	var _tit = {}; //标题输入框
	var _items = []; //所有选项输入框
	var _submit = {};
	var _dorequest = App.doRequest;
	var _cue = '最多30个汉字';
	var _tip = {};
	var _voteId = {};
	var _rnd = (new Date()).getTime();
	
	var _addE = Core.Events.addEvent;
	var _init = function(){ //初始化浮出层
		var __pos = [];
		var __module = '\
			<table class="mBlogLayer" id="vote_layer' + _rnd + '" style="z-index:200;position:absolute;display:none;">\
				<tr>\
					<td class="top_l"></td>\
					<td class="top_c"></td>\
					<td class="top_r"></td>\
				</tr>\
				<tr>\
					<td class="mid_l"></td>\
					<td class="mid_c">\
						<div class="layerBox">\
							<div class="layerBoxCon1" style="width:368px;">\
								<div class="layerMedia add_vote">\
									<div class="layerArrow"></div>\
									<div class="layerMedia_close"><a href="javascript:void(0);" id="vote_close' + _rnd + '" class="close"></a></div>\
									<p class="fb">给微博添加投票<input type="hidden" id="vote_id' + _rnd + '" /></p>\
									<p class="vote_tit MIB_linedot2">投票标题：<input id="vote_title' + _rnd + '"  maxlength="60" type="text" class="gray9" value="' + _cue + '" /></p>\
									<p class="options_tit">投票选项：<span>可设置5项，每项最多15个汉字</span></p>\
									<ul class="vote_item" id="vote_items' + _rnd + '">\
										<li><em>1.</em><input type="text" maxlength="30" /></li>\
										<li><em>2.</em><input type="text" maxlength="30" /></li>\
										<li><em>3.</em><input type="text" maxlength="30" /></li>\
										<li style="display:none"><em>4.</em><input type="text" maxlength="30" /></li>\
										<li style="display:none"><em>5.</em><input type="text" maxlength="30" /></li>\
									</ul>\
									<div class="add_vote_btm">\
										<div class="addNew"><a href="javascript:void(0);" id="vote_add_item' + _rnd + '"><em>+</em>添加投票项</a></div>\
										<p class="save"><a href="javascript:void(0);" id="vote_submit' + _rnd + '" class="btn_normal"><em>保存</em></a><span id="vote_cue' + _rnd + '"></span></p>\
									</div>\
								</div>\
							</div>\
						</div>\
					</td>\
					<td class="mid_r"></td>\
				</tr>\
				<tr>\
					<td class="bottom_l"></td>\
					<td class="bottom_c"></td>\
					<td class="bottom_r"></td>\
				</tr>\
			</table>\
		';
		if(!$E('vote_layer' + _rnd )){
			Core.Dom.insertHTML(document.body, __module, 'beforeend');
		}
		_layer = $E('vote_layer' + _rnd);
		__pos = Core.Dom.getXY(el); //获取点击位置的坐标
		_layer.style.left = (__pos[0] - 220) + "px";
		_layer.style.top = (__pos[1] + 25) + "px";
		
		_tit = $E('vote_title' + _rnd);
		_items = $E('vote_items' + _rnd).getElementsByTagName("INPUT");
		_submit = $E('vote_submit' + _rnd);
		_tip = $E('vote_cue' + _rnd);
		_voteId = $E('vote_id' + _rnd);
		
		//开始绑定事件
		_addE($E('vote_close' + _rnd),that.close,'click');
		_addE($E('vote_add_item' + _rnd),_addItem.bind2($E('vote_add_item' + _rnd)),'click');
		// _addE(_tit,function(){
			// _checkLength(_tit, 30);
		// },'keyup');
		_addE(_tit,function(){
			if(this.value === _cue){
				this.value = '';
			}
		}.bind2(_tit),'focus');
		_addE(_tit,function(){
			if(this.value === ''){
				this.value = _cue;
			}
		}.bind2(_tit),'blur');
		
		for(var i=0;i<_items.length;i++){
			(function(_input){
				_addE(_input,function(){
					_input.style.backgroundColor = '#fff';
					// _checkLength(_input, 15);
				},'focus');
			})(_items[i]);
		}
		
		//提交按钮绑定事件
		_addE(_submit,function(){
			that.submit(_submit);
		},'click');
		
		//填入数据
		if(indata){
			_voteId.value	= indata['id']	|| '';
			_tit.value		= indata['title']	|| '';
			if(indata['items'].length > 0){
				for(var i = 0;i < indata['items'].length; i++){
					if(indata['items'][i]){
						_items[i].value = indata['items'][i];
						_items[i].parentNode.style.display = '';
					}
				}
			}
			that.frozen();
		}
	};
	//检测输入框的字符长度
	// var _checkLength = function(_input, _len){
		// if(Core.String.byteLength(_input.value) > _len*2){
			// var __value = Core.String.trim(_input.value);
			// __value = Core.String.leftB(__value, _len*2);
			// _input.value = __value;
		// }
	// };
	
	//添加一个投票项
	var _addItem = function(_dom){
		var lis = $E('vote_items' + _rnd).getElementsByTagName("LI");
		for(var i=0;i<lis.length;i++){
			if(lis[i].style.display === "none"){
				lis[i].style.display = '';
				if(i === lis.length-1){
					this.parentNode.style.display = 'none';
				}
				break;
			}
		}
		return false;
	};
	
	//检查表单方法
	var _check = function(_add){
		var __hideError = function(){
			_tip.style.display = 'none';
			_tip.className = '';
		};
		that.beauty();
		__hideError();
		//添加投票时检查
		var __errPosition2 = function(){
			var __itemExLen = [];
			for(var i=0;i<_items.length;i++){
				if(_items[i].value && (_items[i].style.display === '')){
					//顺便判断字符串长度
					if(Core.String.byteLength(_items[i].value) > 30){
						__itemExLen.push(_items[i]);
					}
				}
			}
			if(__itemExLen.length > 0){
				return -4;
			}
		};
		//创建投票时检查
		var __errPosition = function(){
			//判断标题为空
			if(!_tit.value || _tit.value === _cue){
				return -1;
			}
			//判断选项数量
			var __c = 0;
			var __itemExLen = [];
			for(var i=0;i<_items.length;i++){
				if(_items[i].value){
					//顺便判断字符串长度
					if(Core.String.byteLength(_items[i].value) > 30){
						__itemExLen.push(_items[i]);
					}
					__c++;
				}
			}
			if(__c < 2){
				return -2;
			}
			//标题字符数超长
			if(Core.String.byteLength(_tit.value) > 60){
				return -3
			}
			//内容字符超长
			if(__itemExLen.length > 0){
				return -4;
			}
			return 1;
		}
		//显示错误方法
		var __showErr = function(_html, _on){
			_tip.style.display = '';
			_tip.className = 'errorTs2 error_color';
			_tip.innerHTML = _html;
			// setTimeout(
				// function(){
					// _tip.style.display = 'none';
				// }, 3000
			// );
			//如果是报错在某个上面
			if(_on){
				for(var i=0;i<_items.length;i++){
					if(Core.String.byteLength(_items[i].value) > 30){
						_items[i].style.backgroundColor = '#faa';
					}
				}
			}
		};
		if(_add){ //如果是增加选项
			switch(__errPosition2()){
				case -4:
					__showErr('红色背景的选项字数超过15个字，精简一下吧。', true);
					return false;
				default:
					return true;
			}
		}else{
			switch(__errPosition()){
				case -1:
					__showErr('请填写投票标题。');
					return false;
				case -2:
					__showErr('投票选项必须大于2项，请修改。');
					return false;
				case -3:
					__showErr('标题字数超过30个字，精简一下吧。');
					return false;
				case -4:
					__showErr('红色背景的选项字数超过15个字，精简一下吧。', true);
					return false;
				case 1:
					return true;
				default:
					return true;
			}
		}
	};
	
	//重置
	that.reset = function(){ 
		_layer.parentNode.removeChild(_layer);
		_init();
	};
	//关闭层，不清空数据
	that.close = function(){
		_layer.style.display = 'none';
		return false;
	};
	that.hidden = that.close;
	//显示投票层
	that.show = function(cli){
		_layer.style.display = '';
		__pos = Core.Dom.getXY(cli); //获取点击位置的坐标
		_layer.style.left = (__pos[0] - 220) + "px";
		_layer.style.top = (__pos[1] + 25) + "px";
	};
	//提交表单
	that.submit = function(_sub){
		if(_sub.className === 'btn_notclick'){
			return;
		}
		//用于创建投票成功的调用
		var __success = function(json){
			_sub.className = 'btn_normal';
			_voteId.value = json.id;
			that.frozen();
			cb(json);
		};
		//用户创建投票失败的调用
		var __error = function(json){
			_sub.className = 'btn_normal';
			ecb(json);
		};
		//用于增加投票选项的成功调用
		var __success2 = function(json){
			_sub.className = 'btn_normal';
			that.frozen();
			that.hidden();
			//cb(json);
		};
		//用于增加投票选项的失败调用
		var __error2 = function(json){
			_sub.className = 'btn_normal';
			ecb(json);
		};
		
		
		//检查表单是创建还是增加选项
		if(_tit.style.display === 'none'){ //这个说明是更新投票
			if(_check(true)){
				if(_voteId.value === ''){
					return;
				}
				_sub.className = 'btn_notclick'; //将按钮置为无效
				var __item2 = [];
				for(var i=0;i<_items.length;i++){
					if(_items[i].value && _items[i].style.display == ''){
						__item2.push(encodeURIComponent(_items[i].value));
					}
				}
				if(__item2.length === 0){
					__success2();
					return;
				}
				var __data2 = {
					'items'		: __item2.join(','),
					'voteid'	: _voteId.value
				};
				_dorequest(__data2, '/vote/aj_addoneitem.php', __success2, __error2, 'post');
			}
		}else{	//这个是创建投票
			//提交表单
			if(_check()){
				_sub.className = 'btn_notclick'; //将按钮置为无效
				//获取数据
				var __item = [];
				for(var i=0;i<_items.length;i++){
					if(_items[i].value){
						__item.push(encodeURIComponent(_items[i].value));
					}
				}
				var __data = {
					'title'	: encodeURIComponent(_tit.value),
					'items'	: __item.join(",")				
				};
				_dorequest(__data, '/vote/aj_addvote.php', __success, __error, 'post');
			}
		}
		
	};
	//投票选项整形
	that.beauty = function(){
		_tit.value = Core.String.trim(_tit.value);
		//调整位置选项位置,保证有效文字在头几项，后面的空着
		for(var i = 0; i < _items.length; i++){
			_items[i].value = Core.String.trim(_items[i].value);
			if(_items[i].value){
				var j = i;
				while(j>0){
					if(_items[j-1].value == ''){
						_items[j-1].value = _items[j].value;
						_items[j].value = '';
					}
					j--;
				};
			}
		}
	};
	//冻结表单
	that.frozen = function(){
		if(_tit.style.display === ''){
			_tit.style.display = 'none';
			Core.Dom.insertHTML(_tit, Core.String.encodeHTML(_tit.value), 'afterend');
		}
		
		for(var i = 0; i < _items.length; i++){
			if(_items[i].value && (_items[i].style.display === '')){
				_items[i].style.display = 'none';
				Core.Dom.insertHTML(_items[i], Core.String.encodeHTML(_items[i].value), 'afterend');
			}
		}
	};
	
	
	
	_init(); 
	return that;
};
