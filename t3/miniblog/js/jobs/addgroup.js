$import("sina/sina.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/events/addEvent.js");
$import('jobs/group_manage.js');
$registJob('addgroup', function() {
	var _creategroup = document.getElementById("MIB_creategroup");
	if(!_creategroup){return false}   //没有创建分组按钮直接返回
	var _addEvent = Core.Events.addEvent;
	var _html = '<div class="groupLayer"><div class="inputBox">' + $CLTMSG['YA0002'] + '：<input id="group_newname" type="text" value="' + $CLTMSG["YA0003"] + '"></div><div id="errorTs" class="errorTs" style="display:none">' +
			'</div><div class="btns"><a id="group_submit" href="javascript:void(0)" class="btn_normal"><em>' + $CLTMSG['CX0125'] + '</em></a><a id="group_cancel" href="javascript:void(0)" class="btn_normal"><em>' + $CLTMSG['CX0126'] + '</em></a></div></div>';


	var _dialog = new App.Dialog.BasicDialog($CLTMSG['YA0001'], _html, {
		zIndex: 1200,
		width:300,
		hiddClose: true,
		hidden: true
	});

	var group_newname = document.getElementById("group_newname");
	_addEvent(group_newname, function(e) {
		if (group_newname.value === '') {
			group_newname.value = $CLTMSG["YA0003"];
		}
//		checkNewName(Core.String.trim(group_newname.value));      //焦点移开后是否检验数据
	}, 'blur');
	_addEvent(group_newname, function(e) {
		if (group_newname.value === $CLTMSG["YA0003"]) {
			group_newname.value = '';
		}
	}, 'focus');
	_addEvent(group_newname, function(e) {
		if (e.keyCode === 13) {
			_submitevent();
		}
	}, 'keypress');


	var _submitevent = function() {
		var value = Core.String.trim(group_newname.value);

		if (checkNewName(value)) {
			if (!value) {
				return false;
			}
			//			groupEditor.set('lock', true);
			App.group_manage.create({
				'name' : value,
				'success' : function(json) {
					//					groupEditor.hidd();
					setTimeout(function() {
						_dialog.hidd();
						window.location.href = '/attention/att_list.php?uid=' + scope.$uid + '&gid=' + json;
					}, 500);
					//					groupEditor.set('lock', false);
				},
				'onError' : function(json) {
					//					groupEditor.set('lock', false);
					_dialog.hidd();
					App.alert($SYSMSG[json['code']]);
				}
			});
			return true;
		}
		return false;
	};
	var _gsubmit = $E("group_submit");
	var _gcancel = $E("group_cancel");
	var _err = $E("errorTs");
	_addEvent(_gsubmit, function() {
		_submitevent();
	}, "click");
	_addEvent(_gcancel, function() {
		_dialog.hidd();
	}, "click");

	_addEvent(_creategroup, function() {
		group_newname.value = $CLTMSG["YA0003"];
		_err.style.display = "none";
		_err.innerHTML = "";
		_dialog.show();
		group_newname.focus();
		return false;
	}, "click");

	var errorTs = document.getElementById("errorTs");
	var defaultGroupName = $CLTMSG["YA0003"];
	var showError = function(key) {
		errorTs.innerHTML = $SYSMSG[key];
		errorTs.style.display = '';
	};
	var hiddError = function(key) {
		errorTs.style.display = 'none';
	};
	var checkNewName = function(name) {
		if (Core.String.byteLength(name) > 16) {
			showError('M14010');                                                                
			return false;
		}
		if (name == defaultGroupName || name == '') {
			showError('M14014');
			return false;
		}
		for (var i = 0, len = scope.groupList.length; i < len; i += 1) {
			if (Core.String.decodeHTML(scope.groupList[i]['name']) == name) {
				showError('M14008');
				return false;
			}
		}
		hiddError();
		return true;
	};


});
