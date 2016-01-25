/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('jobs/base.js');
$import('diy/schoolrecordEditor.js');
$import('diy/schoolSelector.js');
$import('diy/builder2.js');
$import('sina/core/dom/getXY.js');
$import('sina/core/dom/setXY.js');
$import('sina/core/dom/getElementsByAttr.js');
$import('sina/utils/sinput/sinput.js');
$registJob('info_school', function(){
    var tipHTML = '<div style="position: absolute;" class="errorLayer">\
						<div class="top"></div>\
						<div class="mid">\
							<div style="width: 217px;" class="conn">\
								<p style="padding-left: 0px;" class="stxt">' + $CLTMSG['CC5823'] + '</p>\
							</div>\
						</div>\
						<div class="bot"></div>\
					</div>';
    var imgURI = scope.$BASEIMG + "style/images/common/transparent.gif";
    var rt = '<span class="pri_content" style="display:#{displayPrivacy}"><img src="' + imgURI + '"' +
    'class="small_icon privacy_icon" title="' +
    $CLTMSG["CC1901"] +
    '"/>#{privacyName}</span>' +
    '#{findmate}' +
    '<span class="navBorder gray9" style="display:#{displayPrivacy}">|</span><a onclick="scope.editSchoolItem(this)" ' +
    'href="javascript:void(0);">' +
    $CLTMSG["CC1402"] +
    '</a><span class="navBorder gray9">|</span>' +
    '<a onclick="scope.delSchoolItem(this)" href="javascript:void(0);">' +
    $CLTMSG["CC1904"] +
    '</a>';
    
    var temp = '<input type="hidden" name="id" value="#{id}" />\
		<input type="hidden" name="name" value="#{name}" />\
		<input type="hidden" name="province" value="#{school_province}" />\
		<input type="hidden" name="city" value="#{school_city}" />\
		<input type="hidden" name="start" value="#{start}" />\
		<input type="hidden" name="end" value="#{end}" />\
		<input type="hidden" name="remark" value="#{remark}" />\
		<input type="hidden" name="privacy" value="#{privacy}" />\
		<input type="hidden" name="area" value="#{school_area}" />\
		<input type="hidden" name="schooltype" value="#{school_type}" />\
		<input type="hidden" name="school_id" value="#{school_id}" />\
		<li class="lf">\
			<span class="font_14"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/style/images/common/transparent.gif" class="#{applyclass}" #{applytip}>#{applyschool}\
			</span>\
			<span class="edu_conn_place">#{schoolInfo}</span>\
		</li>\
		<li class="rt" style="display:none;">' + rt + '</li> '
    
    var schoolApplyInfo = '<div class="errorLayer"><div class="top"></div><div class="mid">\
    						<div class="conn" style="width: 217px;">\
      							<p class="stxt" style = "padding-left:0px">#{message}</p>\
    						</div>\
  						   </div><div class="bot"></div></div>'
    
    try {
        var schoolList = App.schoolrecordList({
            'dom': {
                'privacy': $E('privacy_option'), //是否所有人可见
                'province': $E('info_province'),//
                'city': $E('info_city'),
                'area': $E('info_area'),
                'name': $E('nameid'), //学校名称
                'join': $E('joinid'), //入学年份
                //                'leave': $E('leaveid'),
                'note': $E('noteid'), //院系/班级
                'box': $E('info_box'), //容器
                'submit': $E('info_submit'), //保存
                'cancel': $E('info_cancel'), //取消
                'red_name': $E('red_nameid'), //名称提醒
                'red_school_type': $E('red_school_type'),
                //                'red_join': $E('red_joinid'),					//入学年份提醒
                'red_note': $E('red_noteid'), //班级提醒
                'apply': $E('info_apply'),
                'school_id': $E('info_school_id'), //是否是申请
                'schooltype': $E('school_type'), //学校类型
                'txt_grade': $E('txt_grade') //院系/班级
            },
            'listBox': $E('info_list_box'), //已存在列表
            'delInter': '/person/delschool.php', //删除URL
            'addInter': '/person/updateschool.php', //增加URL
            'srhInter': '/person/relateschool.php', //联想URL
            'isconfirm': true,
            'template': temp,
            'itemLength': parseInt($E('info_list_count').value) || 0,
            'applyLength': parseInt($E('info_list_apply_count').value) || 0,
            'schooltype': $E('school_type'),
            'type': 'school'
        });
        var $temp = $C("div");
        $temp.className = "errorLayer";
        $temp.style.cssText = "visibility:hidden;position:absolute;";
        document.body.appendChild($temp)
        var infoDom = App.builder3(schoolApplyInfo, $temp);
    } 
    catch (exp) {
    }
    
    scope.delSchoolItem = function(el){
        schoolList.del(el.parentNode.parentNode);
    }
    scope.editSchoolItem = function(el){
        schoolList.edit(el.parentNode.parentNode);
    };
    
    //显示或者隐藏　rt　LI.延时是为了解决IE6下切换class时光标闪动问题
    var displayKey = false;
    scope.toggleEditor = function(el, bShow){
        if (bShow) {
            if (!displayKey) {
                setTimeout(function(){
                    el.className = "infoTable hover_table";
                    Core.Dom.getElementsByClass(el, "LI", "rt")[0].style.display = "";
                }, 0);
                displayKey = true;
            }
        }
        else {
            if (displayKey) {
                setTimeout(function(){
                    el.className = "infoTable";
                    Core.Dom.getElementsByClass(el, "LI", "rt")[0].style.display = "none";
                }, 0);
                displayKey = false;
            }
        }
    }
    var displayInfo = false
    scope.infoEditor = function(el, bShow, msg){
        if (bShow) {
            if (!displayInfo) {
                if (el) {
                    infoDom.box.innerHTML = schoolApplyInfo.replace(/#{message}/g, $CLTMSG[msg]);
                    var y = Core.Dom.getXY(el)[1] - infoDom.box.offsetHeight;
                    var x = Core.Dom.getXY(el)[0] + el.offsetWidth / 2 - infoDom.box.offsetWidth / 2 + 83;
                    Core.Dom.setXY(infoDom.box, [x, y]);
                }
                setTimeout(function(){
                    infoDom.box.style.visibility = "visible";
                    el.parentNode.parentNode.parentNode.className = "infoTable hover_table";
                    Core.Dom.getElementsByClass(el.parentNode.parentNode.parentNode, "LI", "rt")[0].style.display = "";
                }, 10);
                displayInfo = true;
            }
        }
        else {
            if (displayInfo) {
                setTimeout(function(){
                    infoDom.box.innerHTML = schoolApplyInfo;
                    infoDom.box.style.visibility = "hidden";
                    el.parentNode.parentNode.parentNode.className = "infoTable";
                    Core.Dom.getElementsByClass(el.parentNode.parentNode.parentNode, "LI", "rt")[0].style.display = "none";
                }, 10);
                displayInfo = false;
            }
        }
        Core.Events.stopEvent();
        return false;
    };
    var _stopEvt = function(){
        Core.Events.stopEvent();
        return false;
    };
    var selector;
    Core.Events.addEvent($E('nameid'), function(){
        //		if ($E('school_type').value == '3') {//当选择为大学时
        if (selector && selector.dialog._distory != true) {
            return false
        }
        selector = App.schoolSelector({
            'form-config': {
                zIndex: 1000,
                hiddClose: false,
                width: 590
            },
            'input': $E('nameid'),
            /*
             选择已有学校后操作
             */
            'afterSelect': function(spec){
                spec['input'].value = spec['school'] || '';
                $E('info_school_id').value = spec['school_id'] || '';
                $E('info_city').value = spec['city'];
                $E('info_area').value = spec['area'];
                $E('info_province').value = spec['province']
                
                $E('joinid').focus();
                $E('info_apply').value = "0";
            },
            /*
             申请成功后操作
             */
            'afterApply': function(spec){
                spec['input'].value = spec['school'] || '';
                $E('info_school_id').value = spec['school_id'] || '';
                $E('info_apply').value = "1";
                $E('info_city').value = spec['city'];
                $E('info_area').value = spec['area'];
                $E('info_province').value = spec['province'];
                $E('joinid').focus();
            },
            province: ($E('info_province') && $E('info_province').value) || scope.cprov_id || '0',
            city: ($E('info_city') && $E('info_city').value) || scope.ccity_id || '0',
            area: $E('info_area').value || '',
            'schooltype': $E('school_type').value,
            'schUrl': '/person/relateschool.php',
            'areaUrl': ''
        });
        //		}
        var p = setTimeout(function(){
            Core.Events.fireEvent($E('nameid'), 'blur');
			clearTimeout(p)
        }, 20)
    }, 'focus');
    
});
