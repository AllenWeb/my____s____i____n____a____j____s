/*
 * Copyright (c) 2008, Sina Inc. All rights reserved.
 * @fileoverview Sina miniblog 头像修改
 * @author Pjan|peijian@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("diy/prompttip.js");
$import("diy/imgURL.js");
$import("sina/core/math/getRandomNumber.js");

App.head4miniblog = (function(){
    var head = {};
    var swfWidth = 791;
    var swfHeight = 474;
    /**
     * 显示裁剪头像的flash
     * @param {Object|String}	container	显示flash的容器
     * @param {Object|String}	param		需要传入参数
     * {String}			swfUrl		调用flash地址
     * {String} 		width		flash宽度
     * {String|Number}	height		flash高度
     * {String|Number}	uid			当前用户uid
     * {String}			vxf			sinapro cookie
     * {String}			uidUrl		当前用户默认头像地址
     * {String}			tmpImgUrl	上传临时文件接口
     * {String}			imgUrl		上传裁剪结束后头像接口
     * {String}			delUrl		删除临时文件接口
     * {String}			jsFunc		头像上传完毕后调用javascript方法
     *
     * @example
     * App.head4miniblog.show("x",{
     * 	swfUrl		:	"/view/js/group/head4group.swf",
     * 	width		:	500,
     * 	height		:	500,
     * 	uid			:	0,
     * 	vxf			:	0,
     * 	uidUrl		:	"http://www.zhegeshitouxiang",
     * 	tmpUrl		:	"http://t.sina.com.cn",
     * 	tmpImgUrl	:	"http://t.sina.com.cn",
     * 	imgUrl		:	"http://shangchuantouxiangdizhi.com",
     * 	delUrl		:	"http://shanchudizhi",
     * 	jsFunc		:	"afterComplete"
     * });
     */
    head.show = function(container, param){
        var conf = {
            swfurl: param.swfUrl ? param.swfUrl : ("/view/js/group/head4group.swf"),
            width: param.width ? param.width : 500,
            height: param.heigh ? param.height : 500,
            uid: param.uid ? param.uid : 0,
            ver: param.ver ? param.ver : 0,
            //vxf: param.vxf ? param.vxf : 0,
            uidurl: param.uidUrl ? param.uidUrl : 0,
            tmpurl: param.tmpUrl ? param.tmpUrl : "",
            tmpimgurl: param.tmpImgUrl ? param.tmpImgUrl : "",
            imgurl: param.imgUrl ? param.imgUrl : "",
            delurl: param.delUrl ? param.delUrl : "",
            jsfunc: param.jsFunc ? param.jsFunc : "afterComplete"
        };
        
        var query = [];
        for (var i in conf) {
            query.push(i.toLowerCase() + "=" + encodeURIComponent(conf[i]));
        }
        
        var str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0"\
					width="' + conf.width + '" \
					height="' +
        conf.height +
        '" \
					id="Head_Cut_miniblog">\
				<param name="movie" \
					value="' +
        conf.swfurl +
        '?' +
        query.join("&") +
        '&ct=' +
        (new Date().getTime()) +
        '" />\
				<param name="quality" value="high" />\
				<param name="wmode" value="transparent" />\
				<param name="allowScriptAccess" value="always" />\
				<embed \
					src="' +
        conf.swfurl +
        '?' +
        query.join("&") +
        '&ct=' +
        (new Date().getTime()) +
        '" \
					quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" wmode="transparent" \
					width="' +
        conf.width +
        '" height="' +
        conf.height +
        '" \
					swLiveConnect="true" allowScriptAccess="always" name="Head_Cut_miniblog">\
				</embed>\
			</object>';
        if (typeof container == "string") {
            container = $E(container);
        }
        container.innerHTML = str;
        
        $E("img_avatar").src = "http://tp" + ((scope.$uid % 4) + 1) + ".sinaimg.cn/" + scope.$uid + "/180/" + scope.version+'/'+(scope.sex=='1'?'1':'0');
        Core.Events.addEvent($E("uploadmode_js"), function(){
            $E("div_flashupload").style.display = "none";
            $E("div_jsupload").style.display = "";
            submit_ImageUpload();
        }, "click");
    };
    
    return head;
})();

function submit_ImageUpload(){
    var uploadImage_event = function(){
        var element = {};
        element['formupload'] = $E('form_upload');
        element['sFilename'] = $E('file_name');//文件名
        element['hiddenimage'] = $E('hidden_image');//隐藏图片，为判断图片大小
        element['headimage'] = $E('img_avatar');//头像图片
        element['uploadstatus'] = $E('upload_status');//上传状态;
        //为空判断
        if (element['sFilename'].value == "" || element['sFilename'].value == null) {
            //modified by chibin 2009-9-21
            //element['uploadstatus'].innerHTML = "请上传jpg、gif、png格式的图片。";
            element['uploadstatus'].innerHTML = $CLTMSG['CC1501'];
            element['uploadstatus'].style.display = "";
            return false;
        }
        //格式判断
        if (!/\.(gif|jpg|jpeg)$/i.test(element['sFilename'].value)) {
            element['uploadstatus'].innerHTML = $CLTMSG["CC1502"];
            element['uploadstatus'].style.display = "";
            element['formupload'].reset();
//            $E('file_name_mask').value = '';
            return false;
        }
//        else {
//            // IE only detect local fileSize
//            element['hiddenimage'].src = element['sFilename'].value;
//			if (element['hiddenimage'].fileSize > 0) {
//                var file_size = element['hiddenimage'].fileSize / (1024 * 1024);
//                if (file_size > 2) {
//                    element['uploadstatus'].innerHTML = $SYSMSG["M07007"];
//                    element['uploadstatus'].style.display = "";
//					element['formupload'].reset();
//                    return false;
//                }
//            }
//        }
        //页面操作
        element['uploadstatus'].innerHTML = $CLTMSG['CC1503'];
        element['uploadstatus'].style.display = '';
        //返回函数
        scope.addImgSuccess = function(cfg){
            //为1时为上传成功，否则失败。
            if (cfg['ret'] == 1) {
                element['uploadstatus'].style.display = 'none';
                var version = cfg['version'];
                element['headimage'].src = "http://tp" + ((scope.$uid % 4) + 1) + ".sinaimg.cn/" + scope.$uid + "/180/" + (version ? version : 0)+'/'+(scope.sex=='1'?'1':'0');
                App.promptTip({
                    'code': cfg['code']
                });
                setTimeout(function(){
                    window.location.href = '/' + scope.$uid
                }, 2000)
            }
            else {
                element['uploadstatus'].style.display = 'none';
                App.promptTip({
                    'code': cfg['code']||'M00004'
                }, false, false, 'error');
                element['formupload'].reset();
            }
//            if (!$IE) {
//                $E('file_name').value = '';
//            }
//            else {
//                $E('file_name').outerHTML = $E('file_name').outerHTML;
//            }
//            $E('file_name_mask').value = '';
        };
        element['formupload'].submit();
    };
    Core.Events.addEvent($E('link_upload'), uploadImage_event, "click");
};

App.headAfterComplete = function(m){
    if (m == "A00006") {
        App.promptTip({
            code: m
        });
        setTimeout(function(){
            window.location.href = '/' + scope.$uid;
        }, 2000);
    }
    else 
        if (m == "M00003") {
            App.ModLogin();
        }
        else 
            if (m == 'M01107' || m == 'A00001') {
                App.alert({
                    code: m
                });
            }
            else {
                App.confirm({
                    code: m
                }, {
                    icon: ((m == 'M01161') ? 1 : 4),
                    ok: function(){
                        //			window.location.reload();
                        //		显示简单上传
                        if (m == 'M01161') {
                            window.location.reload();
                            return false;
                        }
                        else {
                            $E("div_flashupload").style.display = "none";
                            $E("div_jsupload").style.display = "";
                            submit_ImageUpload();
                        }
                        
                    },
                    cancel: function(){
                        window.location.reload();
                    }
                });
            }
};

//票据请求发起
App.requestTicket = function(_c){
    var _url = 'http://login.sina.com.cn/sso/getst.php?entry=miniblog&service=tupian&cb=setticket&cnt=' + (_c ? _c : 1) + '&ctime=' + (new Date().getTime());
    var _script = document.createElement("script");
    _script.setAttribute('type', 'text/javascript');
    _script.setAttribute('src', _url);
    document.getElementsByTagName('HEAD')[0].appendChild(_script);
    App.thisMovie('Head_Cut_miniblog');
};
//用于票据返回数据
var setticket = function(_json){
    if (_json.retcode == 0) {
        var newTickets = [];
        for (var i = 0; i < _json['ticket'].length; i++) {
            newTickets.push([encodeURIComponent(_json['ticket'][i]), ((new Date()).getTime())]);
        }
        App.thisMovie('Head_Cut_miniblog').setTicket(newTickets);
    }
    else {
        App.thisMovie('Head_Cut_miniblog').setTicket(new Array());
    }
};

//获取flash
App.thisMovie = function(movieName){
    if (navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    }
    else {
        return document[movieName];
    }
}
//传送语言包到flash
App.requestLanguage = function(){
    return $CLTMSG;
};

$registJob("minihead", function(){
	App.head4miniblog.show("miniblog_photo_swf", {
        swfUrl: scope.$BASECSS + "miniblog/static/swf/head4miniblog.swf",
        width: 700,
        height: 500,
        uid: scope.$uid,
        //vxf: scope.vxf,
        ver: scope.version ? scope.version : 0,
        uidUrl: "http://tp" + ((scope.$uid % 4) + 1) + ".sinaimg.cn/" + scope.$uid + "/180/" + (scope.version ? scope.version : 0) +'/'+(scope.sex=='1'?'1':'0')+"&ct=" + (new Date().getTime()),
        tmpUrl: "http://t.sina.com.cn/person/myface_post.php",
        tmpImgUrl: "http://cache.mars.sina.com.cn/nd/t/headpic/" + scope.$uid,
        imgUrl: "http://tt.upload.photo.sina.com.cn/upload_profile.php",
        delUrl: "http://t.sina.com.cn/person/aj_setnewversion.php",
        jsFunc: "App.headAfterComplete"
    });

    $E('file_name').onchange = function(){
        $E('file_name_mask').value = $E('file_name').value;
    };
});
