$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/getElementsByClass.js");
$import("jobs/request.js");

//@author Pjan|peijian@staff.sina.com.cn
//@title 绑定投票在feed区的懒加载

(function(ns){
	ns.bindVote = function(_dom, _key, _value){
		var _fid = _dom.parentNode.getAttribute("mid"), _vote;
		if(!_fid){
			return;
		}
		var _prev = $E('prev_'+_fid);
		var _disp = $E('disp_'+_fid);
		
		//如果是单条页，直接调整抢占位置
		if(scope.$pageid === 'mblog'){
			_prev = _disp;
		}
		
		//配置参数
		var _content = {
			'imgurl'	: scope.$BASEIMG,
			'id'		: _value.voteid,
			'title'		: _value.title,
			'conid'		: _fid
		};
		
		//在我的首页和微博单条页展示不同的内容
		var _dispVoteOnPage = function(){
			var _vote = '';
			var __voteDisp = function(_type){
				/*
				 * @title	根据类型展示不同的投票样式
				 * @param	_type{String}
				 * 			0:正常模式，显示原创微博效果
				 * 			1:转发模式，显示转发微博效果
				 * 			2:展开模式，显示单条微博效果
				 * 			默认:展开模式，显示单条微博效果，返回值为空，需要异步去加载数据
				*/
				__dispString = '';
				switch(_type){
					case 0:
						__dispString = '\
							<div class="MIB_assign">\
									<div class="MIB_assign_t"></div>\
									<div class="MIB_assign_c MIB_txtbl">\
									<p class="vote_title"><em><img src="' + _content.imgurl + '/images/common/transparent.gif" class="small_icon icon_vote" />\
										<a href="#" onclick="App.showVote(' + _content.id + ',' + _content.conid + ');return false;">' + _content.title + '</a></em></p>\
									</div>\
									<div class="MIB_assign_b"></div>\
								</div>\
								<div class="clear">\
							</div>';
						break;
					case 1:
						__dispString = '\
							<div class="MIB_linedot_l1"></div>\
							<p class="vote_title"><em><img src="' + _content.imgurl + '/images/common/transparent.gif" class="small_icon icon_vote" />\
								<a href="#" onclick="App.showVote(' + _content.id + ',' + _content.conid + ');return false;">' + _content.title + '</a>\
							</em></p>';
						break;
					case 2:
						__dispString = '';
						break;
					default:
						__dispString = '';
						break;
				}
			};
			
			//如果条件成立，插入到显示区|预览区投票内容
			var __inertVoteTitle = function(_html){
				var _clear = Core.Dom.getElementsByClass(_prev, 'div', 'clear');
				if(_clear){
					Core.Dom.insertHTML(_clear, _html, 'beforebegin');
					return;
				}
				_prev.innerHTML = _html;
			};
			
			//如果没有被绑定的话
			if(_prev.getAttribute('mbind') !== '1'){
				//首先锁定预览区的内容
				_prev.setAttribute('mbind', '1');
				
				//如果是转发
				if(_dom.parentNode.getAttribute('type') === '2'){
					__inertVoteTitle(__voteDisp(2));
					return;
				} 
				//如果是原创
				if(_dom.parentNode.getAttribute('type') === '1'){
					//如果是单条页，需要异步请求投票数据
					if(scope.$pageid === 'mblog'){
						App.doRequest({'voteid' : _content.id}, '/vote/aj_getvote.php', __inertVoteTitle, function(){}, 'get');
					}
					//非单条页的投票显示
					__inertVoteTitle(__voteDisp(1));
					return;
				}
			}
		};
		
		//绑定到dom上
		Core.Event.addEvent(_dom, (function(_id, _conid){
			return function(){
				App.showVote(_id, _conid);
				return false;
			}
		})(_content.id, _content.conid), 'click');
		_dispVoteOnPage();
	};
})(App);