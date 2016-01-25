/*
 * Copyright (c) 2008, Sina Inc. All rights reserved.
 * @fileoverview Sina Space统一加载数据的函数
 * @author Pjan|peijian@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("diy/dialog.js");

/**
 * 加载ajax数据
 * @param {Object} url
 * @param {Object} dom
 * @param {Object} echo
 */
App.loadData = function(url,dom,echo){
	if(!url || !dom){
		return;
	}
	Utils.Io.Ajax.request(url,{
		onComplete:function(json){
			if(json.code == 'A00006'){
				try {
					if ($E(dom)) {
						$E(dom).innerHTML = json.data;
						if(scope.resize)scope.resize();
					}
					//开始执行加载完成后的函数
					if (echo) {
						if (typeof(echo) == "string") {
							eval(echo + "()");
						}
						else {
							echo(json.data);
						}
					}
				}catch(e){}
			}else{
				App.alert({code:json.code},{ok:function(){}});
			}
		},
		onException:function(e,u){
			$Debug(e);
		},
		returnType:'json'
	});
};
