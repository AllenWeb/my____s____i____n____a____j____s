/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/addEvent.js");
$import("diy/dialog.js");
$import("diy/imgURL.js");
$import("diy/htmltojson.js");
$import("jobs/developer/topTray.js");
$import("diy/checkForm.js");
$import("diy/check.js");

$registJob("create_app",function(){
	
	var submit = $E("submit");
	
	App.upIcon = function(key,b){
		var panel = $E(key + "_panel");
		var upPanel = $E(key+"_upPanel");
		var viewPanel = $E(key+"_viewPanel");
		var file = $E(key+"_file");
		var value = $E(key);
		panel && upPanel && viewPanel && file && value && (function(){
			if(!b){file.value = "";value.value=""}
			viewPanel.style.display = b?"":"none";
			upPanel.style.display = b?"none":"";
			panel.className = b?"check_pic":"";
		})();
	};
	var checkUI = function(key,noError,affect,error){
	
		if(error.key && error.key !== key && noError){
		//	if( noError ) error.key = false;
			return false;
		}else{	
			showCUI(key,noError,error);
		}
	};
	
	function showCUI (key,noError,error){
		if(noError){
				error.className = 'co_kd2 ok_color';
				error.innerHTML = "";
				error.key = false;
			}else{
				error.className = 'errorTs error_color';
				error.innerHTML = $CLTMSG[key] || $SYSMSG[key];
				error.key = key;
			}
	};
	
	var checkEmpty = function(el){
		var value = Core.String.trim(el.value);
		if(value){
			return true;
		}
		return false;
	};
	var checkFunction = {
		'CL0804' : function(el){
			return checkEmpty(el);
		},
		'CL0805' : function(el){//大于20个字
			var value = Core.String.trim(el.value);
			var lens = Core.String.byteLength(value);
			if(lens <= 20 || el.value.length == 0){
				return true;
			}else{
				return false;
			}
		},
		'CL0806':function(el){
			return checkEmpty(el);
		},
		'CL0812':function(el){
			return checkEmpty(el);
		},
		'CL0811':function(el){
			var value = el.value;
			return App.checkURLoose(value);
		},
		'CL0807':function(el){
			return checkEmpty(el);
		},
		'CL0814':function(el){
			return checkFunction['CL0805'](el);
		},
		'CL0815':function(el){
			var value = el.value;
			return App.checkURLoose(value);
		},
		'CL0808':function(el){
			return checkEmpty(el);
		},
		'CL0816':function(el){
			var value = el.value.replace(/ |，/g,',').replace(/,+/g,',');
			var tags = value.split(",");
			var len = tags.length;
			if(len && len<=5){
				for(var i=0;i<len;i++){
					var tag = tags[i];
					if(Core.String.byteLength(Core.String.trim(tag))>16){
						return false;
					}
				}
				return true;
			}else{
				return false;
			}
		},
		'CL0817':function(el){
			var value = el.value;
			if(Core.String.byteLength(Core.String.trim(value))>10000){
				return false;
			}
			return true;
		},
		'CL0818':function(el){
			var value = el.value;
			return /^[\w\u4e00-\u9fa5.]*$/.test( value ) && (!/^[_.]+|[_.]+$/.test( value ));
		}
	};
	
	App.Checkinfo = App.checkForm(checkUI);


	App.Checkinfo.add('CL0804',$E("source_title"),$E("source_title_error"),checkFunction['CL0804']);
	App.Checkinfo.add('CL0805',$E("source_title"),$E("source_title_error"),checkFunction['CL0805']);
	App.Checkinfo.add('CL0818',$E("source_title"),$E("source_title_error"),checkFunction['CL0818']);
	App.Checkinfo.add('CL0811',$E("source_url"),$E("source_url_error"),checkFunction['CL0811']);
	App.Checkinfo.add('CL0806',$E("source_url"),$E("source_url_error"),checkFunction['CL0806']);
	App.Checkinfo.add('CL0807',$E("dev_name"),$E("dev_name_error"),checkFunction['CL0807']);
	App.Checkinfo.add('CL0814',$E("dev_name"),$E("dev_name_error"),checkFunction['CL0814']);
	App.Checkinfo.add('CL0818',$E("dev_name"),$E("dev_name_error"),checkFunction['CL0818']);
	App.Checkinfo.add('CL0815',$E("dev_website"),$E("dev_website_error"),checkFunction['CL0815']);
	App.Checkinfo.add('CL0808',$E("dev_website"),$E("dev_website_error"),checkFunction['CL0808']);
	App.Checkinfo.add('CL0816',$E("app_tags"),$E("app_tags_error"),checkFunction['CL0816']);
	App.Checkinfo.add('CL0817',$E("app_desc"),$E("app_desc_error"),checkFunction['CL0817']);
	
	var isNameUniq = false;  //是否重复，默认不重复
	(function(){
		var ex = /appkey=(\d+)/.exec(location.href);
		var apk = ex && ex[1] || '';
	//	if( apk ) isNameUniq = true;  //如果是编辑页
		var _lastValue = null;
        Core.Events.addEvent($E("source_title"), function(){
            setTimeout(function(){
	
                var key = $E("source_title_error").key
                var _val = Core.String.trim($E("source_title").value)
                if (!_val || _val === _lastValue) 
                    return;           
                if (key === "CL0804" || key === "CL0805" || key === "CL0818") 
                    return;          
                _lastValue = _val;
                var _suc = function(oJson){           
                    //如果 == A00006 表示不重复
                    isNameUniq = (oJson && oJson.code == "A00006") ? false : true;                
                    //重复表示出错
                    showCUI(oJson.code, !isNameUniq, $E("source_title_error"));
                }
                
                Utils.Io.Ajax.request("/aj_checkappname.php", {
                    "GET": {
                        "appkey": apk,
                        "appname": _val
                    },
                    "onComplete": _suc,
                    "returnType": "json"
                });
            }, 0)
        }, 'blur');
	})();
	
	
	(function(){
		var inputs, len, files, i;
		inputs = document.getElementsByTagName("INPUT");
		len = inputs.length;
		len && (function(){
			i = 0;
			files = [];
			for(i; i<len; i++){
				if(inputs[i].type=="file"){
					files.push(inputs[i]);
				}
			}
			i = 0;
			len = files.length;
			len && (function(){
				for(i; i<len; i++){
					var f = files[i];
					var p = f.parentNode;
					p && p.tagName=="FORM" && (function(f,p){
						Core.Events.addEvent(f,function(){
							var filename = f.value;
							if (!/\.(gif|jpg|png|jpeg)$/i.test(filename)) {
								App.alert({
									'code': "M07004"
								});
								return false;
							}
							scope.addImgSuccess = function(json){
								if(json && json["ret"]==1 && json["key"]){
									var t = $E(json["key"]);
									if(t){
										t.value = json["pid"];
										var src = App.imgURL(json["pid"],"square");
										$E(json["key"]+"_view").src = src;
										App.upIcon(json["key"],true);
									}
								}else{
									App.alert($SYSMSG["M07002"]);
								}
							};
							p.submit();
						},"change");
					})(f,p);
				}
			})();
		})();
	})();
	var navigateTo = function(key){
			var go = function(){
				window.location.href = (key?("/appinfo.php?appkey=" + key):"/myapp.php");
			};
			var clock = setTimeout(go,3000);
			var alert = App.alert({"code":"A00006"},{
				ok:function(){
					clearTimeout(clock);
					go();
				}
			});
			
		};
	var succ = function(oJson){
			if(oJson && oJson.code=="A00006" && oJson.data){
				navigateTo(oJson.data);
				return false;
			}
			fail(oJson);
		};
	var fail = function(oJson){
			var msg = $CLTMSG["CD0036"];
			(typeof oJson == "object") && oJson.code && (msg=$SYSMSG[oJson.code]||msg);
			App.alert(msg);
		};
	var onSubmit = function(){
		if(!App.Checkinfo.check() || isNameUniq){
			document.body.scrollTop = 0;
			if (document.documentElement) {
				document.documentElement.scrollTop = 0;
			}
			return;
		}
		if(!$E("agree").checked){
			App.alert("没有接受《新浪微博开发者协议》不能创建应用");
			return false;
		}
		
		
		function $send(){
			var data = App.htmlToJson($E("wrapper"));
			data["uid"] = scope.$uid;
			
			data["app_tags"].join && (function(){data["app_tags"] = data["app_tags"].join(",")})();
			data["app_tags"] = data["app_tags"].replace(/ |，/g,',').replace(/,+/g,',')
			
			data["app_pics"].join && (function(){data["app_pics"] = data["app_pics"].join(",")})();
			Utils.Io.Ajax.request("/aj_saveapp.php", {
				"POST"        : data,
				"onComplete"  : succ,
				"onException" : fail,
				"returnType"  : "json"
			});
		}
		
		if ( /appkey=\d+/.test(location.href) && scope.$app_status == 1 ) { //编辑页
			App.confirm($CLTMSG['CF0103'], {
        		ok: function(){   $send();     }	
			})			
		}else{
			$send();
		}
		
		return false;
	};
	
	App.deleteApp = function(appkey){
		var alert = App.confirm($CLTMSG["CL0813"],{
			ok:function(){
				var navigateTo = function(){
					var go = function(){
						window.location.href = "/myapp.php";
					};
					var clock = setTimeout(go,3000);
					var alert = App.alert({"code":"A00006"},{
						ok:function(){
							clearTimeout(clock);
							go();
						}
					});
					
				};
				var fail = function(oJson){
					var msg = $CLTMSG["CD0036"];
					(typeof oJson == "object") && oJson.code && (msg=$SYSMSG[oJson.code]||msg);
					App.alert(msg);
				};
				var succ = function(oJson){
						if(oJson && oJson.code=="A00006"){
							navigateTo();
							return false;
						}
						fail(oJson);
					};
				Utils.Io.Ajax.request("/aj_del_app.php", {
					"POST"        : {"appkey":appkey},
					"onComplete"  : succ,
					"onException" : fail,
					"returnType"  : "json"
				});
			}
		});
	};
	
	submit && Core.Events.addEvent(submit,onSubmit,"click");
});
