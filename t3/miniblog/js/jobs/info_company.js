/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('jobs/base.js');
$import('diy/recordEditor.js');
$registJob('info_company',function(){
	var imgURI =  scope.$BASEIMG+"style/images/common/transparent.gif";
	var rt = '<span class="pri_content"><img src="'+imgURI+'"' +
			'class="small_icon privacy_icon" title='+$CLTMSG["CC1901"]+'/>#{privacyName}</span>' +
			'<span><a href="/search/user.php?comorsch=#{name}">' +
			'<img src="'+scope.$BASEIMG+'style/images/common/transparent.gif" ' +
			'class="small_icon search_icon" title='+$CLTMSG["CC1902"]+'>'+$CLTMSG["CC1903"]+'</a></span>' +
			'<span class="navBorder gray9">|</span>' +
			'<a onclick="scope.editCompanyItem(this)" href="javascript:void(0);">'+$CLTMSG["CC1402"]+'</a>' +
			'<span class="navBorder gray9">|</span>' +
			'<a onclick="scope.delCompanyItem(this)" href="javascript:void(0);">'+$CLTMSG["CC1904"]+'</a>';
	
	var temp = '<input type="hidden" name="id" value="#{id}" />\
		<input type="hidden" name="name" value="#{name}" />\
		<input type="hidden" name="province" value="#{province}" />\
		<input type="hidden" name="city" value="#{city}" />\
		<input type="hidden" name="start" value="#{start}" />\
		<input type="hidden" name="end" value="#{end}" />\
		<input type="hidden" name="remark" value="#{remark}" />\
		<input type="hidden" name="privacy" value="#{privacy}" />\
		<li class="lf">\
			<span class="font_14"><a href="/search/user.php?comorsch=#{encoded_name}&comorsch_type=2">#{name}</a></span>\
			<span class="edu_conn_place">#{location}</span>\
			<span>#{during}</span>\
		</li>\
		<li class="rt" style="display:none;" >' +rt +'</li>'+		
		'<li class="infoRemarks">#{remarkString}</li>';
	try{
		var schoolList = App.recordList({
			'dom'		:{
				'privacy':$E('privacy_option'),
				'prov'	: $E('provid'),
				'city'	: $E('cityid'),
				'name'	: $E('nameid'),
				'join'	: $E('joinid'),
				'leave'	: $E('leaveid'),
				'note'	: $E('noteid'),
				'box'	: $E('info_box'),
				'submit': $E('info_submit'),
				'cancel': $E('info_cancel'),
				'red_name':$E('red_nameid'),
				'red_join':$E('red_joinid'),
				'red_note':$E('red_noteid')
			},
			'listBox'	: $E('info_list_box'),
			'delInter'	: '/person/delcompany.php',
			'addInter'	: '/person/updatecompany.php',
			'srhInter'	: '/person/relatecompany.php',
			'isconfirm'	: true,
			'template'	: temp,
			'itemLength': parseInt($E('info_list_count').value),
			'type'		: 'company'
		});
	}catch(exp){}
	
	scope.delCompanyItem = function(el){
		schoolList.del(el.parentNode.parentNode);
	}
	scope.editCompanyItem = function(el){
		schoolList.edit(el.parentNode.parentNode);
	};
	
	//显示或者隐藏　rt　LI.延时是为了解决IE6下切换class时光标闪动问题
	var displayKey = false;
	scope.toggleEditor = function(el,bShow){
		if(bShow){
			if(!displayKey){
				setTimeout(function(){
					el.className = "infoTable hover_table";
					Core.Dom.getElementsByClass(el, "LI", "rt")[0].style.display = "";
				},0);
				displayKey = true;
			}
		}else{
			if(displayKey){
				setTimeout(function(){
					el.className = "infoTable";
					Core.Dom.getElementsByClass(el, "LI", "rt")[0].style.display = "none";
				},0);
				displayKey = false;
			}
		}
	}
	
	var div = $E("modify_result");
	if(div){
		div.style.display = "none";
	}
});