/**
 * @fileoverview 接收（发送）的推荐
 * @author zhaobo@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/request.js");
$import("sina/core/dom/getElementsByAttr.js");

$registJob('recommended', function() {
    /**
     * 全部推荐为已读，去掉"新"标志，右侧"我接受的推荐（212）"数字变为0
     * begin
     */
    var ignore = $E("ignore");
    if (ignore) ignore.onclick = function() {
        $E("my_recommend").getElementsByTagName("em")[0].innerHTML = "(0)";
        var url = "#{URL}";
        App.doRequest({}, url, function() {
            $E("my_recommend").getElementsByTagName("em")[0].innerHTML = "";
        }, function() {
        });
    };
    /**
     * end
     */
    /**
     * 获取所有子节点
     */
    var getChildren = function() {
        var ret = [];
        var childNodes = this.childNodes;
        if (childNodes && childNodes.length > 0) {
            for (var i = 0,len = childNodes.length; i < len; i++) {
                if (childNodes[i].nodeType == 1) {
                    ret.push(childNodes[i]);
                }
            }
        }
        return ret;
    };
    //接受的推荐列表ul元素
    var recommendList = $E("recommend_list");
    //推荐列表ul的子元素li
    var items = getChildren.call(recommendList);
    /**
     * 删除函数，接口返回成功则将当前li在ul元素中移除。
     * @param uid 用户id
     * @param recid
     * @param page
     * @param target 当前点击元素
     */
    App.delRecommend = function(uid, recid, page, target) {
        var _li = getParent(target, "li");
        var param = {
            uid:uid,
            recid:recid,
            page:page
        };
        App.confirm($CLTMSG['ZB0008'], {ok:function() {
            App.doRequest(param, "/recommend/aj_delrecommend.php", function(data, result) {
                //onSuccess成功函数
                if (result && result.code) {
                    if (result.code === "A00006") {
                        //"推荐成功！"
                        App.Wipe(null, _li).wipe("down", false, function(){
                        recommendList.removeChild(_li);
                        });
                    }
                }
            }, function(data) {
                //onError失败函数
                App.alert($SYSMSG[data.code]);
            });
        }, cancel:function() {
        }})
    };

    /**
     * 逐级查找父节点获取指定tagName的元素
     * @param obj 当前节点
     * @param tgName 需要查找的tagName，如：li
     */
    var getParent = function(obj, tgName) {
        if (obj && obj.tagName) {
            var tagName = obj.tagName.toLowerCase();

            if (tagName === tgName) {
                return obj;
            } else if (tagName === "body") {
                return null;
            } else {
                return getParent(obj.parentNode, tgName);
            }
        } else {
            return null;
        }
    };
    /**
     * 获取选中的用户或全选/全不选
     * @param frds Array对象，元素为Object，由uid和check属性构成。check属性为input元素。
     * @param check 此参数为可选，当传入此参数时需要对所有的复选框进行全选或者全不选，
     * 否则将选中的对象对应的uid放入数组中并返回。
     */
    var getSelectedFriends = function(frds, check) {
        var ret = [];
        var isCheck = typeof check !== "undefined";
        for (var i = 0,len = frds.length; i < len; i++) {
            if (isCheck) {
                frds[i].check.checked = check;
            } else {
                if (frds[i].check.checked)ret.push(frds[i].uid);
            }
        }
        return ret;
    };
    /**
     * 绑定所有需要的事件，并且拼装需要的对象，数组等。
     * @param _index items数组的下标。
     */
    var bindEvents = function(_index) {
        var item = items[_index];
        var children = getChildren.call(item);
        var content = getChildren.call(children[1]);
        //删除当前的推荐
        /*var delBtn = Core.Dom.getElementsByClass(item, "a", "icon_closedel")[0];
         delBtn.onclick = function() {
         delFun(item);
         };*/
        if (!content[3]) return;
        var ahr = (content[3] && content[3].tagName.toLowerCase() === "a") ? content[3] : content[3].getElementsByTagName("a")[0];
        if (!ahr) return;
        var _friendsArea = content[4];
        //展开/收起我接受的推荐
        ahr.onclick = function() {
            var _dom = this;
            if (_friendsArea.style.display === "none") {
                App.curtain.droop(_friendsArea, function(){
                    _friendsArea.style.height = "";
                });
                _dom.innerHTML = $CLTMSG['ZB0009'] + '<img src="' + scope.$BASEIMG + 'images/common/transparent.gif" class="moreUp_icon" title="">';
            } else {
                App.curtain.raise(_friendsArea);
                _dom.innerHTML = $CLTMSG['ZB0010'] + '<img src="' + scope.$BASEIMG + 'images/common/transparent.gif" class="moreDown_icon" title="">';
            }
        };
		var _reclist = Core.Dom.getElementsByAttr(item,'reclist',"true");
		if(_reclist.length>0){
			_reclist[0].onclick=function(){
				Core.Events.fireEvent(ahr,'click');
			}
		}
		
        //用户列表容器ul元素。
        var friendsList = _friendsArea.getElementsByTagName("ul")[0];
        //用户列表li元素集合。
        var _friendsLis = friendsList.getElementsByTagName("li");
        //用户数组 ，元素为Object，由uid和check属性构成。check属性为input元素。
        var friends = [];
        //全选复选框对象
        var checkAll = Core.Dom.getElementsByClass(item, "div", "a")[0];
        var addAttention = Core.Dom.getElementsByClass(item, "div", "b")[0];
		
        if(addAttention) addAttention = addAttention.getElementsByTagName("a")[0];
        var len = _friendsLis.length;
        if (checkAll && addAttention) {
            checkAll = checkAll.getElementsByTagName("input")[0];
            checkAll.onclick = function() {
                addAttention.className = "flsl" + (this.checked ? "" : " flsl_gray");
                checkAll.setAttribute("total", this.checked ? len : 0);
                getSelectedFriends(friends, this.checked);
            };
        }
        if (checkAll)checkAll.setAttribute("total", len);
        //关注已选用户按钮。
        for (var _i = 0; _i < len; _i++) {
            var input = _friendsLis[_i].getElementsByTagName("input")[0];
			var as = Core.Dom.getElementsByClass(_friendsLis[_i],'A','addFollow');
            (function(dom, checkAllBtn, count, submitBtn) {
                Core.Events.addEvent(dom, function() {
                    var total = parseInt(checkAllBtn.getAttribute("total"));
                    if (!dom.checked) {
                        total--;
                    } else {
                        total++;
                    }
                    checkAllBtn.setAttribute("total", total);
                    checkAllBtn.checked = (total==count);
                    submitBtn.className = "flsl" + ((total !== 0) ? "" : " flsl_gray");
                }, "click");
            })(input, checkAll, len, addAttention);
			if(as.length){
				(function(d,i){
					Core.Events.addEvent(d,function(){
						i.checked=true;
						i.disabled=true;
					},'click');
				})(as[0],input);
			}
            friends.push({uid:_friendsLis[_i].getAttribute("uid"), check : input});
        }


        if (addAttention)addAttention.onclick = function() {
            //获取已选用户集合
            var _this = this;
            var lock = _this.className == "flsl flsl_gray";
            var uids = getSelectedFriends(friends);
            var param = {
                uid: uids.join(","),
                fromuid: scope.$uid
            };
            if(lock) return;
            _this.className = "flsl flsl_gray";
            App.doRequest(param, "/attention/aj_addfollow.php", function(data, result) {
                //onSuccess成功函数
                if (result && result.code) {
                    if (result.code === "A00006") {
                        //"推荐成功！"
                        App.alert($SYSMSG['M00912'], {icon:3});

                    }
                }
                window.location.reload();
            }, function(data) {
                //onError失败函数
                App.alert($SYSMSG['M02013'], {icon:2});
            });

        };

    };
    for (var i = 0, len = items.length; i < len; i++) {
        bindEvents(i);
    }
});