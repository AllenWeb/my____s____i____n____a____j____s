/*
 * Copyright (c) 2008, Sina Inc. All rights reserved.
 * @fileoverview Sina 显示等级提示层的公用函数
 * @author Pjan|peijian@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("diy/dialog.js");
$import("sina/utils/template.js");

App.rankDialog = function(rank, point){
	//判断显示图片的方法
	function transforms(r){
		var str = [];
		for(var i = 0, r = r.split(""); i < r.length; i++){
			str.push('<img src="'+scope.$BASEIMG+'style/images/common/' + r[i] + '.gif" />');
		}
		return str.join("");
	}
	var conf = {
		title	:	$CLTMSG["CD0149"],
		width	:	550,
		height	:	700,
		zIndex	:	1000,
		btns	:	[
						{
							text: $CLTMSG["CD0044"],
							func: function(){
								//alert(1);
							}
						}
					]
	};
	var content = '\
					<div class="gradeLayer">\
						<div class="title"><strong>#{CD0124}当前等级：' + transforms(rank) + ' #{CD0125}级</strong>#{CD0126}离下一级还差<span>' + point + '</span>#{CD0127}分</div>\
						<div class="gradeSm">#{CD0128}微博等级是对用户积极表现的鼓励，根据用户的行为记分换算而成。</div>\
							<div>#{CD0129}目前有以下行为影响微博积分：</div>\
								<table class="gradeTab">\
								<tr><th class="th_1">#{CD0130}行为</th><th>#{CD0131}积分</th></tr>\
								<tr><td class="td_1">#{CD0132}绑定手机</td><td class="td_2"><span class="red">+100</span><em>(#{CD0133}每个帐号只享用一次)</em></td></tr>\
								<tr><td class="td_1">#{CD0134}登录</td><td class="td_2"><span class="red">+20</span><em>(#{CD0135}一天只享用一次)</em></td></td></tr>\
								<tr><td class="td_1">#{CD0136}发布微博<em>(通过任何渠道发布)</em></td><td class="td_2"><span class="red">+20</span></td></tr>\
								<tr><td class="td_1">#{CD0137}评论微博</td><td class="td_2"><span class="red">+10</span></td></tr>\
								<tr><td class="td_1">#{CD0138}转发微博</td><td class="td_2"><span class="red">+20</span></td></tr>\
								<tr><td class="td_1">#{CD0139}收藏话题</td><td class="td_2"><span class="red">+20</span></td></tr>\
								<tr><td class="td_1">#{CD0140}他人接受你的邀请而关注你</td><td class="td_2"><span class="red">+50</span></td></tr>\
								<tr><td class="td_1">#{CD0141}微博被他人转发</td><td class="td_2"><span class="red">+10</span></td></tr>\
								<tr><td class="td_1">#{CD0142}微博被他人评论</td><td class="td_2"><span class="red">+10</span></td></tr>\
								<tr><td class="td_1">#{CD0143}自己删除微博</td><td class="td_2"><span class="blue">-20</span></td></tr>\
								<tr><td class="td_1">#{CD0144}自己删除评论</td><td class="td_2"><span class="blue">-10</span></td></tr>\
								<tr><td class="td_1">#{CD0145}自己删除收藏话题</td><td class="td_2"><span class="blue">-20</span></td></tr>\
								</table>\
						<div class="ts">\
						<p class="color1">#{CD0146}注意：</p>\
						<p>1.#{CD0147}每日积分有最高分数限制，等级越高，每日可积分数越高。</p>\
						<p>2.#{CD0148}如果微博内容因为不符合当地法律、法规而被删除，那么所扣积分会很高哦</p>\
						</div>\
					</div>\
					';
	var tmp = new Utils.Template(content);
	content = tmp.evaluate($CLTMSG);
	App.customDialog(content, conf);
};
