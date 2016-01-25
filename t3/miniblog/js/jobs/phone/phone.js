/**
 * @fileoverview 手机绑定、手机客户端下载页面
 */
$import("jobs/base.js");
$import("diy/marquee.js");
$import("diy/widget/poplayer.js");

$registJob("phone4miniblog",function(){
    var Task = {
        dom:{
            oBrand:$E("client_brand"),
            oModel:$E("client_model"),
            oDownload:$E('download_client'),
            
            oMobileNumber:$E("mobile_number"),
            oBindMobile : $E('bind_mobile'),
            oUnbindMobile:$E('unbind_mobile'),
            oMobileError:$E('mobile_error'),
            oChangeBind:$E('update_binding'),
            oBinding_region:$E('binding_region'),
            oBinding_region2:$E('binding_region2'),
            oBinding_region3:$E('binding_region3'),
            oSwitchNotice:$E('switch_notice'),
            oAgreement:$E('agreement_content'),
            oAgreementCB:$E('agreement'),
            oNoticeStatus:$E('notice_status'),
            
            oMarqueeBox : $E('slideshow')
        },
        addEvent:Core.Events.addEvent,
        run:function(){
            var me = this, oBrand = this.dom.oBrand, oModel = this.dom.oModel,oDownload = this.dom.oDownload;
            var brand,model;
            this.addEvent(oBrand,function(e){
                brand = oBrand.options[oBrand.selectedIndex].text;
                me.downloadClient(function(json){
                    if(json.data && json.data.push){
                        oModel.options.length = 0;
                        for(var i = 0,len = json.data.length ; i <len; i++){
                			oModel.options[i] = new Option(json.data[i],json.data[i]);
                		}
                    }
                },true);
            },"change");
            this.addEvent(oModel,function(e){
                model = oModel.options[oModel.selectedIndex].text;
                me.downloadClient(function(json){
                    if(json.data){
                        oDownload.setAttribute('href',json.data);
                    }
                });
            },"change");
            
            this.addEvent(this.dom.oAgreement,function(e){
                me.showAgreement();
            },"click");
            
            this.addEvent(this.dom.oBindMobile,function(e){
                me.bindPhone(me.dom.oMobileNumber.value);
            },"click");
            
            this.addEvent(this.dom.oUnbindMobile,function(e){
                me.unbindPhone();
            },"click");
            
            
            this.addEvent(this.dom.oChangeBind,function(e){
                me.changeBind();
            },"click");
            
            if(this.dom.oSwitchNotice){
                this.addEvent(this.dom.oSwitchNotice,function(e){
                    me.switchNotice(me.dom.oSwitchNotice);
                },"click");
            }
            
            if(this.dom.oMarqueeBox){
                this.slideshow(this.dom.oMarqueeBox);
            }
            
            if(this.dom.oBinding_region2 && this.dom.oBinding_region2.style.display !== "none"){
                this.checkBind();
            }
        },
        downloadClient:function(callback,bBrand){
            var platform = this.dom.oDownload.getAttribute('platform') || '' ,brand,model;;
            if(this.dom.oBrand && this.dom.oBrand.options){
                brand = this.dom.oBrand.options[this.dom.oBrand.selectedIndex].text;
            }else{
                brand = platform;
            }
            if(this.dom.oModel && this.dom.oModel.options ){
                model = this.dom.oModel.options[this.dom.oModel.selectedIndex].text;
            }else{
                model = "";
            }
            if(bBrand){
                model = "";
            }
            if(!this.dom.oBrand && platform === "Blackberry"){
                brand = "黑莓";
            }
            this.request("/mobile/downloadClient.php",{
                'platform':platform,
                'brand':brand,
                'model':model
            },callback,function(json){
                me.dom.oDownload.innerHTML = html;
                if(json.code){
                    App.alert($SYSMSG[json.code]);
                }
            });
        },
        slideshow:function(marqueeBox){
            var list = marqueeBox.getElementsByTagName("IMG");
            var items = [];
            for (var i = 0, len = list.length; i < len; i++) {
                items.push(list[i]);
            }
            if(items.length > 0){
                var marquee = new App.marquee(marqueeBox, items, {
                    forward: "left",
                    speed: 10
                });
                Core.Events.addEvent(marqueeBox, function(){
                    marquee.pause();
                }, 'mouseover');
                Core.Events.addEvent(marqueeBox, function(){
                    marquee.restart();
                }, 'mouseout');
                marquee.start();
            }
        },
        request:function(url,param,cb,ecb,method){
            if(this._lock){
                return;
            }
            this._lock = true;
            
            var me = this;
            
            var option = {
                onComplete:function(json){
    			    me._lock = false;					
    				if(json.code == "A00006"){
    					cb(json);	
    				}else{
    					ecb(json);	
    				}				
    			},
    			onException:function(){	
    			    me._lock = false;		
    			},
    			returnType:"json"
            };
            method = method || "GET";
            option.method = method;
            option[method] = param;
            Utils.Io.Ajax.request(url,option);
        },
        checkMobile:function(beRegStr){
			return /^1\d{10}$/.test(beRegStr);
        },
        checkValidRange:function(str){
            // see http://issue.internal.sina.com.cn/browse/MINIBLOGBUG-9794
            var arr = ['134','135','136','137','138','139','147','150','151','152','157','158','159',
            '187','188','133','153','189','130','131','132','155','156','186','182','180','145','185'];
            var b = false;
            for(var i=0,l=arr.length;i<l;i++){
                if(str.substring(0,3) === arr[i]){
                    b = true;
                    break;
                }
            }
            return b;
        },
        bindPhone:function(number){
            var me = this;
            if(!this.dom.oAgreementCB.checked){
               me.dom.oMobileError.style.display = "";
               me.dom.oMobileError.innerHTML = $CLTMSG['CC3202'];
               return;
            }
            var number = Core.String.trim(number);
            if(!this.checkValidRange(number)){
                this.dom.oMobileError.style.display = "";
                this.dom.oMobileError.innerHTML = $CLTMSG['CR0002'];
                return;
            }
            if(this.checkMobile(number)){
                this.dom.oMobileError.style.display = "none";
                this.request('/mobile/aj_bindmobile.php',{
                'mobile':number
                },function(){
                    location.reload();
                },function(json){
                    if(json.code){
                        me.dom.oMobileError.style.display = "";
                        me.dom.oMobileError.innerHTML = $SYSMSG[json.code];
                    }
                });
            }else{
                this.dom.oMobileError.style.display = "";
                this.dom.oMobileError.innerHTML = $CLTMSG['CC3201'];
            }
        },
        unbindPhone:function(){
            this.request('/mobile/aj_cancelbind.php',{},function(){
                location.reload();
            },function(){
                location.reload();
            });
        },
        switchNotice:function(el){
            var me = this;
            var status = el.rel||el.getAttribute("rel");
            this.request('/mobile/aj_setnotice.php',{
                'isnotice':status //'0'则关闭提醒，'1'则开启提醒
            },function(){
                if(status === "1"){
    				el.innerHTML = $CLTMSG['CC3203'];
    				if(me.dom.oNoticeStatus){
    				    me.dom.oNoticeStatus.innerHTML = $CLTMSG['CC3204'];
    				}
    				el.rel = "0";
    			}else{
    				el.innerHTML = $CLTMSG['CC3205'];
    				if(me.dom.oNoticeStatus){
    				    me.dom.oNoticeStatus.innerHTML =  $CLTMSG['CC3206'];
    				}
    				el.rel = "1";
    			}
            },function(json){
                if(json.code){
                    App.alert($SYSMSG[json.code]);
                }
            },"POST");
        },
        checkBind:function(){
            var me = this;
            me._interval = setInterval(function(){//longPoll
                me.request('/mobile/aj_checkbind.php',{},function(){
                    clearInterval(me._interval);
                    location.reload(true);
                },function(){});
            },3000);
        },
        changeBind:function(){
            if(this.dom.oBinding_region && this.dom.oBinding_region2){
                this.dom.oBinding_region.style.display = "";
                this.dom.oBinding_region2.style.display = "none";
                clearInterval(this._interval);
            }
            if(this.dom.oBinding_region && this.dom.oBinding_region3){
                this.dom.oBinding_region.style.display = "";
                this.dom.oBinding_region3.style.display = "none";
                clearInterval(this._interval);
            }
        },
        showAgreement:function(){
            var id = 'itemwrap';
    		var pid = id + '_panel';
    		var panel = App.CommLayer(pid,{ismask:true,index:1300,width:'500px',title:$CLTMSG['CC0205']});
    		panel.bd.style.cssText = 'padding:10px;margin:0 0 10px 0;height:280px;overflow-y:scroll;'
    		panel.bd.innerHTML = $E(id).innerHTML;
    		panel.show();
        },
        _lock : false
    };
    Task.run();
});