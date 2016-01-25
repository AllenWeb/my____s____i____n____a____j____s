/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/**
 * @fileoverview 克隆模板
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/class/create.js");
$import("sina/module/login/init_loginUI.js");
$import("sina/utils/url.js");
$import("sina/msg/systemMSG.js");
$import("sina/msg/templateMSG.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/template.js");
$import("sina/utils/windowDialog.js");
$import("sina/core/array/findit.js");
$import("sina/core/events/addEvent.js");


/**
 *	@author stan | chaoliang@staff.sina.com.cn
 *	克隆模板
 */
App.CloneTemplate = Core.Class.create();
App.CloneTemplate.prototype = {
	/**
	 * 模板ID
	 */
	id : "",
	/**
	 * 确认文案,默认为$SYSMSG['A23005'], 你是否要使用此风格？;
	 */
	confirm_text : $SYSMSG['A23005'],
	/**
	 * 成功文案,默认为$SYSMSG['A23006'], 已成功替换为此模版.;
	 */
	success_text : $SYSMSG['A23006'],
	/**
	 * 初始化Dom后，需要额外的操作
	 */
	action: new Function(),
	/**
	 * 保存接口
	 */
	save_url : "http://icp.cws.api.sina.com.cn/pfconf/template_clone.php",
	/**
	 * 舒适化函数	
	 * @param {Object} cnf 模板对应配置信息
	 */
	initialize : function(cnf){
		this.cnf = cnf;
		for(var key in cnf){
			this[key] = cnf[key];
		}
		this.initDom();
		this.initEvent();
	},
	//初始化克隆按钮
	initDom : function(){
		var buttonHtml;
        if ($IE && /png$/.test(this.pic_url)) {
            buttonHtml = "<div style='cursor:hand;filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale,src=\"" + this.pic_url + "\");background:none;width:"+ this.cnf.width+";height:"+ this.cnf.height+";'></div>";
        }
        else {
            buttonHtml = "<img src='" + this.pic_url + "' /></a>";
        }
		Core.Dom.addHTML($E("clone_template"), '\
			<div class="headTcBlock" id="idname_1">\
	    		<div class="headTcBlock_Num" id="idname_3"></div>\
	    		<a class="headTcBlock_BTn" id="idname_2" href="javascript:;">'+buttonHtml+'</a>\
			</div>\
		');
		if(this.desc_text){
			this.set_desc();
		}
		this.action();
	},
	/**
	 * 设置模板pv
	 */
	set_desc : function(){
		if(this.count_id){
			Utils.Io.JsLoad.request("http://hits.blog.sina.com.cn/hits?act=3&uid=" + this.count_id + "&varname=templateCount", {
				onComplete: function(){
					var tmp = new Utils.Template(this.desc_text);
					this.cnf.template_pv = templateCount.pv;
					$E("idname_3").innerHTML = tmp.evaluate(this.cnf);
				}.bind2(this)
			});	
		}else{
			$E("idname_3").innerHTML = this.desc_text;
		} 
	},
	/**
	 * 初始化事件
	 */
	initEvent : function(){
		Core.Events.addEvent("idname_2", function(){
			if (!$isLogin) {
				$login(function(){
					checkAuthor();
					this.confirm();
				}.bind2(this));
			}
			else {
				this.confirm();
			}
		}.bind2(this));
	},
	/**
	 * 提示用户是否确认克隆
	 */
	confirm : function(){
		windowDialog.confirm(this.confirm_text, {
	        funcOk: function(){
	            this.clone();
	        }.bind2(this),
	        textOk: "是",
	        textCancel: "否",
	        icon: "03"
	    });
	},
	/**
	 * 克隆操作
	 */
	clone: function(){
        checkAuthor();
        var url = new Utils.Url(this.save_url);
        url.setParam("uid", $UID);
		url.setParam("suid",scope.$uid);
        url.setParam("tp", this.id);
		url.setParam("productid", scope.pid_map[$CONFIG.$product]);
		setTimeout(function(){
	        Utils.Io.JsLoad.request(url.toString(), {
	            onComplete : this.parse.bind2(this),
	            charset : "UTF-8"
	        });
		}.bind2(this), 1);
    },
	/**
	 * 分析接口返回结果
	 * @param {Object} result 结果
	 */
	parse : function(result){
		switch (result.code) {
			case "A00006":
				windowDialog.alert(this.success_text, {
                    icon: "01",
                    funcOk: function(){
						var productUrl={
							blog:"u/",
							music:"m/",
							tiezi:"platform/?uid=",
							//icp:"platform/mygrouplist.php?uid=",
							icp:"u/",
							photo:"u/",
							vblog:"m/"
						};
						var url=window.location.protocol+"//"+window.location.host+"/"+productUrl[$CONFIG.$product]+$UID;
                        window.location.href = url;
                    },
					textOk:"确定"
                });
				break;
			default:
				showError(result.code);
				break;
		}
	}
};

/**
 * 
 */
App.$hiddenCloneTpl = function(){
    if ($E("idname_1")) {
        $E("idname_1").style.visibility = "hidden";
    }
};

App.$showCloneTpl = function(){
    if ($E("idname_1")) {
        $E("idname_1").style.visibility = "visible";
    }
};


/**
 * 通用job, 引入此文件即可，通过config的配置
 */
$registJob("copy_template", function(){
	var templateId = config.common.t;
	//cloneTemplateConfig DEF in http://sjs.sinajs.cn/common/js/config.js
	var templateConfig = scope.cloneTemplateConfig[templateId];
	if(templateConfig && config.common.r != "1"){
		templateConfig["id"] = templateId;
		new App.CloneTemplate(templateConfig);
	}
});

