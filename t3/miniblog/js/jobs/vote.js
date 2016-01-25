/*
 * Copyright (c) 2008, Sina Inc. All rights reserved.
 * @fileoverview Sina 用于页面显示投票功能
 * @author Pjan|peijian@staff.sina.com.cn
 */

$import("jobs/base.js");
$import("sina/core/dom/insertHTML.js");

//鼠标移动到上面显示高亮
App.voteHover = function(_dom){
	if(_dom.getAttribute('voted') === '1'){
		return;
	}
	App.cleanup(_dom); //for test
	_dom.className = 'cur';
	// _dom.style.backgroundColor = '#ebebeb';
	_dom.childNodes[3].childNodes[0].style.display = '';
};
//鼠标移除恢复
App.voteOut = function(_dom){
	if(_dom.getAttribute('voted') === '1'){
		return;
	}
	_dom.className = '';
	// _dom.style.backgroundColor = '';
	_dom.childNodes[3].childNodes[0].style.display = 'none';
};

App.cleanup = function(_dom){
	//清除ff下的无用node
	__node = _dom.childNodes[0];
	while(__node){
		var __tmp = __node.nextSibling;
		if(__node.nodeType !== '1'){
			_dom.removeChild(__node);
		}
		__node = __tmp;
	}
};

//发起投票
App.voteOneItem = function(_dom, _voteId, _id){
	if(_dom.getAttribute('voted') === '1'){
		return;
	}
	_nodes = _dom.childNodes;
	var _gather = []; //显示内容的数据
	//投票成功后数据算法
	var _reCalculate = function(){
		var __tr = _dom.parentNode.getElementsByTagName('TR');
		var __count = 0;
		var __now = {};
		for(var i = 0;i < __tr.length; i++){
			var __tds = __tr[i].getElementsByTagName('TD');
			var __c = __tds[2].innerHTML;
			var __onec = parseInt(/^([0-9]{1,})\(([0-9%]{1,})\)$/.exec(__c)[1]);
			
			if(__tr[i] === _dom){
				__now = {
					'dom'	: __tr[i],
					'hits'	: __onec
				};
			}
			
			__count += __onec;
			_gather.push(
				{
					'dom'		: __tr[i],
					'chart'		: __tds[1].getElementsByTagName("EM")[1],
					'count'		: __tds[2],
					'hits'		: __onec
				}
			);
		}
		//返回数据顺序
		// 1、每一个td下的dom对象和数据
		// 2、现在对象和相应的数据
		// 3、投票总数
		return [_gather, __now, __count];
	};
	
	//投票成功
	var _success = function(){
		_dom.setAttribute('voted', '1');
		_nodes[3].innerHTML = '<img src="'+scope.$BASEIMG+'style/images/common/transparent.gif" class="tipicon tip3" />';
		// _dom.style.backgroundColor = '';
		_dom.className = '';
		
		//进行重新计算
		var _refresh = function(){
			var _percent = function(_elememt , _least){
				var __per = Math.round((_elememt/_least)*100);
				return __per;
			};
			var __count = _reCalculate();
			//开始重新赋值
			__count[2]++;
			__count[1].hits++;
			
			var __data = __count[0];
			for(var i =0; i < __data.length; i++){
				var __len = 0;
				if(__data[i].dom !== __count[1].dom){
					__len = _percent(__data[i]['hits'], __count[2]);
					__data[i].chart.style.width = __len + 'px';
					__data[i]['count'].innerHTML = __data[i]['hits'] + '(' + __len + '%)';
				}else{
					__len = _percent(__count[1]['hits'], __count[2]);
					__data[i].chart.style.width = __len + 'px';
					__data[i]['count'].innerHTML = __count[1]['hits'] + '(' + __len + '%)';
				}
			}
		};
		_refresh();
	};
	
	//投票失败
	var _error = function(json){
		//App.alert(json);
	}
	
	App.doRequest({'voteid' : _voteId, 'itemid' : _id}, '/vote/aj_voteone.php', _success, _error, 'post');
};

//feed中调用投票显示接口，输出投票
App.showVote = function(_voteId, _container_id){
	//获取数据
	var _success = function(_data){
		$E('disp_'+_container_id).innerHTML = _data;
		$E('disp_'+_container_id).style.display = '';
		$E('prev_'+_container_id).style.display = 'none';
	}
	
	var _error = function(_json){
		// alert(json);
	}
	App.doRequest({'voteid' : _voteId}, '/vote/aj_getvote.php', _success, _error, 'get');
};

//收起投票功能
App.closeVote = function(_container_id){
	// 获得收起后的内容
	$E('disp_'+_container_id).innerHTML = '';
	$E('disp_'+_container_id).style.display = 'none';
	$E('prev_'+_container_id).style.display = '';
};