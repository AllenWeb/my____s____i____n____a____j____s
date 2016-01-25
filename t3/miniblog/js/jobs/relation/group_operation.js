/**
 * @author yuwei
 * @fileoverview 分组操作（对分组的增删修改操作）
 */
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/encodeHTML.js");
$import('jobs/group_manage.js');
$import('sina/core/dom/getXY.js');
$import('sina/core/dom/contains.js');
$import('sina/utils/template.js');
$import('sina/core/string/decodeHTML.js');
$registJob('group_operation', function(){
    var Task = {
        dom:{
            add:$E('add_group'),
            del:$E('delete_group'),
            rename:$E('update_group'),
            more:$E('attlistMore'),
            popup: $E('popMoreGrouplist'),
            current:$E('current_group'),
            groups:$E('group_list') 
        },
        addGroup:function(){
            if(this.dom.add){
                this.operate('add',this.dom.add);
            }
            return this;
        },
        afterGroupAdded:function(json, params){
            var more = this.dom.more,popup = this.dom.popup , groups = this.dom.groups;
            if(more){
                function newItem(){
                    var html = '<a href="/attention/att_list.php?action=0&uid=#{uid}&t=1&gid=#{gid}">#{name}</a>';
                    var item = $C('LI');
                    item.className = "txt";
                    var name;
                    if(Core.String.byteLength(params.name) > 8){//先截取再转码
		                name = Core.String.encodeHTML(Core.String.leftB(params.name,6)) + "...";
		            }else{
		                name = params.name;
		            }
                    item.innerHTML = (new Utils.Template(html)).evaluate({
                        uid:scope.$uid,
                        name:name,
                        gid:json
                    });
                    item.title = params.name;
                    return item;
                }
                if(scope.groupList.length <= 3){
                    var sibling = groups.children[groups.children.length - 2];
                    if(sibling.className !== 'MIB_line_l' && sibling.className !== 'current' ){
                        var span = $C('LI');
                        span.className = "MIB_line_l";
                        span.innerHTML = "|";
                        groups.insertBefore(span,more.parentNode);
                    }
                    groups.insertBefore(newItem(),more.parentNode);
                }else if(popup){
                    more.style.display = "";
                    popup.children[0].appendChild(newItem());
                }
            }
            
            if(scope.groupList.length >= 20){
                this.dom.add.style.display = 'none';
            }
        },
        renameGroup:function(){
            if(this.dom.rename){
                this.operate('rename',this.dom.rename);
            }
            return this;
        },
        operate:function(type,dom){
    	   var addEvent = Core.Events.addEvent ,me = this;
        	addEvent(dom, function() {
        	    var html = '<div class="groupLayer"><div class="inputBox">' + $CLTMSG['YA0002'] + '：<input id="group_newname" type="text" value="' + $CLTMSG["YA0003"] + '"></div><div id="errorTs" class="errorTs" style="display:none">' +
        			'</div><div class="btns"><a id="group_submit" href="javascript:void(0)" class="btn_normal"><em>' + $CLTMSG['CX0125'] + '</em></a><a id="group_cancel" href="javascript:void(0)" class="btn_normal"><em>' + $CLTMSG['CX0126'] + '</em></a></div></div>';
            	var title = (type === "add" ? $CLTMSG['YA0001']: $CLTMSG['YA0010']);
            	var oDialog = new App.Dialog.BasicDialog(title, html, {
            		zIndex: 1200,
            		width:300,
            		hiddClose: false,
            		hidden: true
            	});
            
            	var group_newname = $E("group_newname");
            	addEvent(group_newname, function(e) {
            		if (group_newname.value === '') {
            			group_newname.value = $CLTMSG["YA0003"];
            		}
            	}, 'blur');
            	addEvent(group_newname, function(e) {
            		if (group_newname.value === $CLTMSG["YA0003"]) {
            			group_newname.value = '';
            		}
            	}, 'focus');
            	addEvent(group_newname, function(e) {
            		if (e.keyCode === 13) {
            			submit();
            		}
            	}, 'keypress');
            
            	var submit = function() {
            		var value = Core.String.trim(group_newname.value);
            		if (checkNewName(value)) {
            			if (!value) {
            				return false;
            			}
            			if(type === 'add'){
            			    App.group_manage.create({
                				'name' : value,
                				'success' : function(json) {
                					setTimeout(function() {
                						oDialog.close();
                						window.location.href = '/attention/att_list.php?uid=' + scope.$uid + '&gid=' + json;
                					}, 500);
                				},
                				'onError' : function(json) {
                					if(json && json.code && _err){
            			                _err.style.display = "";
        		                        _err.innerHTML = $SYSMSG[json.code];
                                    }
                				}
                			});
            			}
            			if(type === 'rename'){
            			    App.group_manage.rename({
            			        id:dom.getAttribute('gid'),
            			        name:value,
            			        success:function(data){
            			            value = Core.String.trim(value);
            			            var link = me.dom.current.children[0];
            			            link.title = value;
            			            link.innerHTML = scope.groupCurrentName = Core.String.encodeHTML(value);
            			            oDialog.close();
            			        },
            			        onError:function(json){
            			            if(json && json.code && _err){
            			                _err.style.display = "";
        		                        _err.innerHTML = $SYSMSG[json.code];
                                    }
            			        }
            			    });
            			}
            			return true;
            		}
            		return false;
            	};
            	var _gsubmit = $E("group_submit");
            	var _gcancel = $E("group_cancel");
            	var _err = $E("errorTs");
            	var errorTs = $E("errorTs");
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
        	
            	addEvent(_gsubmit, function() {
            		submit();
            	}, "click");
            	addEvent(_gcancel, function() {
            		oDialog.close();
            	}, "click");
        		group_newname.value = $CLTMSG["YA0003"];
        		_err.style.display = "none";
        		_err.innerHTML = "";
        		oDialog.show();
        		group_newname.focus();
        		if(type === 'rename'){
            	    group_newname.value = Core.String.decodeHTML(scope.groupCurrentName);
            	    group_newname.select();
            	}
        		return false;
        	}, "click");
        },
        popup:function(){
            if(this.dom.more && this.dom.popup){
                var addEvent = Core.Events.addEvent, me = this;
                var oPopup = me.dom.popup, oButton = me.dom.more,pNode = oButton.parentNode ;
                var displayKey = false;
        		var DELAY = 300;
        		var show = function(){
        			if(oPopup.style.display == 'none' && displayKey){
        				var pos = Core.Dom.getXY(oButton);
        				oPopup.style.cssText = "position:absolute;display:'';top:" + (pos[1] + oButton.offsetHeight) + "px;left:" + pos[0] + "px;";
        			}
        		}
        		var hidd = function(){
        			if(oPopup.style.display !== "none" && !displayKey){
        				oPopup.style.display = 'none';
        			}
        		}
        		Core.Events.addEvent(oButton,function(e){
        			Core.Events.stopEvent(e);
        			if(!displayKey){
        				setTimeout(show,DELAY);
        				displayKey = true;
        			}
        		},'mouseover');
        		Core.Events.addEvent(oButton,function(e){
        			Core.Events.stopEvent(e);
        			if(displayKey){
        				setTimeout(hidd,DELAY);
        				displayKey = false;
        			}
        		},'mouseout');
        		
        		Core.Events.addEvent(oPopup,function(e){
        			Core.Events.stopEvent(e);
        			if(!displayKey){
        				setTimeout(show,DELAY);
        				displayKey = true;
        			}
        		},'mouseover');
        		Core.Events.addEvent(oPopup,function(e){
        			Core.Events.stopEvent(e);
        			if(displayKey){
        				setTimeout(hidd,DELAY);
        				displayKey = false;
        			}
        		},'mouseout');
            }
        },
        run:function(){
            this.addGroup().renameGroup().popup();
        }
    };
    Task.run();
    
    App.group_manage.register('create', function(json, params){//创建新组后
        Task.afterGroupAdded(json, params);
    }, {});
});