/**
 * @author chibin
 *
 *
 * input id:vinput
 * submit id:vsubmit
 * redinfo id:redinfo
 *
 */
$import("jobs/base.js");
$import("diy/flyout.js");
$import("sina/core/events/addEvent.js");
$import("diy/mediadialog.js");
$import("sina/core/dom/contains.js");
//chibin add owner为了做limit()
App.addvideo = function(el, cb, ecb, owner){
    //单例
    if (scope.$extdialog) {
        scope.$extdialog.close();
        scope.$extdialog = null;
    }
    var videohtml = '<div class="layerMedia_tip01">' + $CLTMSG['CL0201'] + '</div>\
                    <div id="musicinput" class="layerMedia_input">\
                    	<input type="text" id="vinput" value="http://" class="layerMusic_txt"/>\
                        <a id="vsubmit" class="btn_normal" href="javascript:void(0)"><em>' +
    $CLTMSG['CL0112'] +
    '</em></a>\
                    </div>\
                    <p id="vredinfo" class="layerMedia_err error_color" style="display:none">' +
    $CLTMSG['CL0105'] +
    '</p>\
					<p id="normalact" class="mail_pl" style="display:none;"><a href="javascript:void(0);" id="vcancel">' +
    $CLTMSG['CL0202'] +
    '</a>。</p>';
    var beforeClose = function(){
        scope.$extdialog = null;
    }
    var _hasrequest = false;
    scope.$extdialog = new App.MediaDialog.BasicDialog(videohtml, {
        width: 368,
        zIndex: 1000,
        hidden: true,
        timer: 2,
        distance: 5,
        beforeClose: function(){
            beforeClose();
        }
    });
    var _addEvent = Core.Events.addEvent;
    var position = Core.Dom.getXY(el);
    scope.$extdialog.setPosition(position[0], position[1] + parseInt(el.offsetHeight) + 5);
    var _cb = typeof cb === "function" ? cb : function(){
    };
    var _ecb = typeof ecb === "function" ? ecb : function(){
    };
    var videosubmit = function(nosuc){
        if (_hasrequest) {
            return false;
        }
        var params = {
            url: $E("vinput").value
        };
        var redinfo = $E("vredinfo");
        var normalact = $E("normalact");
        _hasrequest = true;
        Utils.Io.Ajax.request('/video/publish.php', {
            'POST': params,
            'onComplete': function(json){
                if (json) {
                    if (json.code == 'A00006') {
                        redinfo.style.display = "none";
                        redinfo.innerHTML = "";
                        normalact.style.display = "none";
                        if (!nosuc) {
                            _cb(json);
                            scope.$extdialog.close();
                        };
                                            }
                    else {
                        redinfo.style.display = "";
                        redinfo.innerHTML = App.getMsg({
                            'code': json.code
                        });
                        normalact.style.display = "";
                        _ecb(json);
                        _hasrequest = false;
                    }
                }
                else {
                    redinfo.style.display = "";
                    redinfo.innerHTML = $CLTMSG['CL0105'];
                    normalact.style.display = "";
                    _ecb();
                    _hasrequest = false;
                }
            },
            'onException': function(){
                if (json) {
                    redinfo.style.display = "";
                    redinfo.innerHTML = App.getMsg({
                        'code': json.code
                    });
                    normalact.style.display = "";
                    _ecb(json);
                }
                else {
                    redinfo.style.display = "";
                    redinfo.innerHTML = App.getMsg({
                        'code': R01404
                    });
                    normalact.style.display = "";
                    _ecb();
                }
                _hasrequest = false;
            },
            'returnType': 'json'
        });
    };
    try {
        scope.$extdialog.show();
        _addEvent($E("vsubmit"), function(){
            videosubmit();
        }, "click");
        _addEvent($E("vinput"), function(){
            if ($E("vinput").value == "http://") {
                //                if ($IE) {
                //                    App.setCursor($E("vinput"), -1, $E("vinput").value.length + 2);
                //                }
                //                else {
                //                    $E("vinput").setSelectionRange(0, $E("vinput").value.length);
                //                }
                $E("vinput").value = "";
            }
        }, "focus");
        _addEvent($E("vinput"), function(){
            if ($E("vinput").value == "") {
                //                if ($IE) {
                //                    App.setCursor($E("vinput"), -1, $E("vinput").value.length + 2);
                //                }
                //                else {
                //                    $E("vinput").setSelectionRange(0, $E("vinput").value.length);
                //                }
                $E("vinput").value = "http://";
            }
            else {
                videosubmit(true);
                _hasrequest = false;
            }
        }, "blur");
        //取消操作
        _addEvent($E("vcancel"), function(){
            if (scope.$extdialog) {
                scope.$extdialog.close();
            }
            
        }, "click");
        
        //作为普通链接
        _addEvent($E("vback"), function(){
            if ($E("vinput")) {
                //App.insertTextArea($E('publish_editor'), " " + $E("vinput").value + " ");
//                $E('publish_editor').value += " " + $E("vinput").value + " ";
//                $E('publish_editor').focus();
//                $E('publish_editor').value = $E('publish_editor').value;
//                owner.limit && owner.limit();
//                owner.cashInput && owner.cashInput();
//                owner.cashCur && owner.cashCur();
				
				owner.insertText(" " + $E("vinput").value + " ");
				
            }
            if (scope.$extdialog) {
                scope.$extdialog.close();
            }
            
        }, "click");
        App.enterSubmit({
            parent: 'musicinput',
            action: function(){
                videosubmit();
            }
        });
		var hidd = function(){
            var oEvent = Core.Events.getEvent();
            var oTarget = oEvent? (oEvent.srcElement || oEvent.target): null;
			if (scope.$extdialog) {
				if (Core.Dom.contains(scope.$extdialog._node, oTarget)) {
					return true;
				}
				else {
					scope.$extdialog && scope.$extdialog.close();
				}
			}
			Core.Events.removeEvent(document.body, hidd, 'click');
			Core.Events.stopEvent();
			return false;
        };
        Core.Events.addEvent(document.body, hidd, 'click');
        //$E("vinput").focus();
    } 
    catch (e) {
    
    }
    return true;
    
};
