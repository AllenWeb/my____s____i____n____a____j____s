/**
 * @fileoverview 勋章设置
 * @author zhaobo@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/request.js");


$registJob('set_medal', function(){
    //ul容器
    var listBox = $E("medal_list");
    //li元素集合
	var list = listBox.getElementsByTagName("li");
    //mouseover事件函数
    var hoverAct = function(thisObj) {
        if(thisObj.className !== "activehonor cur")thisObj.className = "activehonor ahover";
    };
    //mouseout事件函数
    var msoutAct = function(thisObj) {
        var _checkObj = thisObj.getElementsByTagName("INPUT")[0];
        if(_checkObj.checked) return;
        thisObj.className = "activehonor";
    };
	var bindEventFun = function(obj){
		Core.Events.addEvent(obj, function(){hoverAct(obj);}, "mouseover");
		Core.Events.addEvent(obj, function(){msoutAct(obj);}, "mouseout");
	};
    //遍历li元素集合，并绑定每个li元素的mouseover，mouseout事件。
    for(var _i = 0, len = list.length; _i < len; _i++){
        var li = list[_i];
		bindEventFun(li);
    }
    //递归查找父节点，返回li节点。
    var getLi = function(obj){
        if(!obj) return null;
        var tagName = obj.tagName.toLowerCase();
        if(tagName === "li"){
            return obj;
        }else if(tagName === "body"){
            return null;
        }else {
            return getLi(obj.parentNode);
        }
    };
    //绑定ul容器的click事件，通过判断事件源对象将checkbox反选。
	Core.Events.addEvent(listBox, function(event){
        //事件源对象。
		var _dom = Core.Events.getEventTarget(event);
		var tagName = _dom.tagName.toLowerCase();
        var li = null;
        //通过判断tagName，点击操作是作用在上半部分区域的。
        var bC = (tagName === "img" || tagName === "span" || tagName === "div");
		
        //如果是点击在checkbox或者label上则直接返回。
        li = getLi(_dom);
		if(!li) return;
        var _check = li.getElementsByTagName("input")[0];
        if(!_check) return;
        if(bC) _check.checked = !(_check.checked);
        if(_check.checked)li.className = "activehonor cur";
	}, "click");
    //获取被选中的对象集合。
	var getList = function(){
        //返回的数据对象，check为选中对象的数组，uncheck为未被选中的。
		var listAll = {check : [], uncheck : []};
		for(var i = 0, len = list.length;i<len;i++){
            //单个li元素。
			var item = list[i];
            //li元素下对应的checkbox元素。
			var checkObj = item.getElementsByTagName("input")[0];
            //li元素下对应的span元素。
			var span = item.getElementsByTagName("span")[0];
            //临时变量，根据checkbox是否被选中来判断将数据对象存入哪个数组中。
            var temp = null;
			if(checkObj.checked){
                temp = listAll.check;
			}else{
                temp = listAll.uncheck;
            }
            //拼装数据对象存入数组中。
            //name，显示的名字；id，勋章对应的数据库中的id。
            temp.push({name : span.innerHTML, id : checkObj.value});
		}
		return listAll;
	};
    //提示显示容器
	var MSGBox = $E("MSG_box");
    var tipClass=$E("tip_class");
    //提示img元素
	var boxIMG = $E("MSG_box_img");
    //提示信息容器
	var boxTxt = $E("MSG_box_txt");
    //预加载图片。
    (new Image()).src = "http://timg.sjs.sinajs.cn/t3/style/images/common/PY_icon.gif";
    /**
     * 保存动作之后的处理函数。
     * @param arr  选中的对象数组。
     * @param oResult 返回结果。
     */
	var handleTip = function(arr, oResult){
        if(!boxIMG || !boxTxt) return;
        //未处理成功
		if(typeof oResult === "undefined" || oResult.code === "M00004"){
			tipClass.className = "PY_clew_error";
			boxIMG.className = "PY_ib PY_ib_2";
			boxTxt.className = "txt fb";
			boxTxt.innerHTML = $CLTMSG["ZB0004"];
		}else{
            var len = arr.length;
            tipClass.className = "PY_clew";
            boxIMG.className = "PY_ib PY_ib_3";
            boxTxt.className = "txt fb";
            if(len == list.length){
                boxTxt.innerHTML = $CLTMSG["ZB0001"];
            }else if(len == 0){
                boxTxt.innerHTML = $CLTMSG["ZB0002"];
            }else{
                var nameArr = [];
                for(var i = 0;i<arr.length;i++){
                    nameArr.push(arr[i].name);
                }
                boxTxt.innerHTML = nameArr.join("，")+$CLTMSG["ZB0003"];
            }
        }
        App.curtain.droop(MSGBox);
		setTimeout(function(){
			App.curtain.raise(MSGBox);
		}, 1500);
	};
	var commitBtn = $E("commit_btn");
    //绑定保存按钮事件。
	Core.Events.addEvent(commitBtn, function(){
        //获取经选择后的勋章的数据对象。
        var dataObj = getList();
        //接口需要传递的参数medal_ids， 为未被选中的勋章的id。
		var uncheck = dataObj.uncheck;
		var idArr = [];
        for(var i = 0;i< uncheck.length;i++){
			idArr.push(uncheck[i].id);
		}
		var _ids = idArr.length > 0 ? idArr.join(",") : "";
		
        var url = "/person/aj_medalsetting.php";
        App.doRequest({medal_ids : _ids},url,function(data,result){
			handleTip(dataObj.check, result);
		},function(){
			handleTip(dataObj.check);
		});
	}, "click");
});