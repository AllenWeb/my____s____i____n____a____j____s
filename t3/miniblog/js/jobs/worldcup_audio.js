/**
 * @fileoverview 世界杯专题（黄加李泡）音频
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/core/array/each.js");

$registJob("worldcup_audio", function(){
    var PlayerTask = {
        url:'http://2010.sina.com.cn/huangjx/',
        
        //根据服务器端时间判断是否是节目播放区间，以此决定播放状态.
        checkAvailable:function(callback){
            this.request("/zt/worldcup/aj_audio.php",{},callback,"GET");
        },
        request:function(url,oParams,callback,method){
            var method = method || "GET";
            var config = {
                returnType: "json",
                onComplete: function(json){
                    if ((json && json.code && json.code === "A00006")) {
                        callback(json);
                    }
                },
                onException: function(msg){}
            };
            config[method] = oParams;
            Utils.Io.Ajax.request(url, config);
        },
        createPlayerUI:function(available){
            this.available = available;
            var dom = $C('div');
            dom.className = 'hJiaApp';
            var html = '<div class="hJiaBg"></div>\
            <div class="hJiaInfo">\
                <span class="sp1"><a target="_blank" href="http://2010.sina.com.cn/huangjx/"></a></span>\
                <span class="sp2"><a class="className" href="javascript:void(0);" id="player_control"></a></span>\
            </div>';
            
            html = html.replace("className",available?"pause":"more");
            
            dom.innerHTML = html;
            dom.style.cssText = $IE6?'position:absolute;top:auto;left:20px;bottom:10px;z-index:1700;':"position:fixed;top:auto;left:20px;bottom:10px;z-index:1700;";
            document.body.appendChild(dom);
            
			if($IE6){
			    setInterval(function(){
			        if(dom){
						dom.className = dom.className;
					}
			    }, 1000);
			}
            
            $E('player_control').onclick = function(){
                if(available){
                    PlayerTask.stop();
                }else{
                    window.open("http://2010.sina.com.cn/m/2010-06-11/115510974.shtml");
                }
            };
            this.dom = dom;
            this.ui = $E("player_control");
        },
        createMediaPlayer:function(){
            var dom = $C('div');
            dom.id = "player_container";
            dom.style.cssText = "width:1px;height:1px;overflow:hidden;line-height:0";
            dom.innerHTML = '<OBJECT id="MediaPlayer" width="1" height="1" \
                            classid="CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95" \
                            codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701"\
                            standby="Loading Microsoft Windows Media Player components..." type="application/x-oleobject">\
                            <param name="src" value="mms://03vl.sina.com.cn/sina_pull_tel_003">\
                            <param name="animationatStart" value="true">\
                            <param name="transparentatStart" value="true">\
                            <param name="autoStart" value="true">\
                            <param name="showControls" value="false">\
                            <param name ="ShowAudioControls"value="false">\
                            <param name="ShowStatusBar" value="true">\
                            <param name="loop" value="false">\
                            <EMBED type="application/x-mplayer2"\
                            pluginspage="http://microsoft.com/windows/mediaplayer/en/download/"\
                             name="MediaPlayer" displaysize="4" autosize="-1" \
                            bgcolor="darkblue" showcontrols="true" showtracker="-1" \
                            showdisplay="0" showstatusbar="-1" videoborder3d="-1" width="1" height="1"\
                            src="mms://03vl.sina.com.cn/sina_pull_tel_003" autostart="true" designtimesp="5311" loop="false">\
                            </EMBED>\
                            </OBJECT>';
           
            document.body.appendChild(dom);
            return dom;
        },
        getMovie:function(movieName){
            if (navigator.appName.indexOf("Microsoft") != -1) {
        		return window[movieName];
        	}
        	else {
        		return document[movieName];
        	}
        },
        play:function(){
            var oPlayer;
            oPlayer = this.getMovie('MediaPlayer')||$E('MediaPlayer');
            if(oPlayer){
                if(oPlayer.controls && oPlayer.controls.play){
                    oPlayer.controls.play();
                }else{
                    this.createMediaPlayer();
                }
            }else{
                this.createMediaPlayer();
            }
            this.ui.className = "pause";
            $E('player_control').onclick = function(){
                PlayerTask.stop();
            };
        },
        stop:function(){
            var oPlayer = this.getMovie('MediaPlayer')||$E('MediaPlayer');
            if(oPlayer){
                if(oPlayer.controls && oPlayer.controls.stop){
                    oPlayer.controls.stop();
                }else{
                    document.body.removeChild($E('player_container'));
                }

				if(this.ui.className !== 'more'){
					$E('player_control').onclick = function(){
						PlayerTask.play();
					};
					this.ui.className = "play";
				}
               
            }
        },
        destory:function(){
            try{
                document.body.removeChild(this.dom);
                document.body.removeChild($E('player_container'));
            }catch(e){
                
            }
            
        },
        run:function(){
            var available = false;
            this.checkAvailable(function(json){
                available = (json.result === "true") ? true : false;
                
                PlayerTask.createPlayerUI(available);
                PlayerTask.createMediaPlayer();
                //如果不在播放时间内，则暂停播放器
    			setTimeout(function(){
    				if(!PlayerTask.available){
    					PlayerTask.stop();
    				}
    			}, 1000);
            });
            
            PlayerTask.timer = setInterval(function(){//5分钟轮询状态
                PlayerTask.checkAvailable(function(json){
                    available = (json.result === "true") ? true : false;
                    if(available !== PlayerTask.available){
                        PlayerTask.destory();
                        
                        PlayerTask.createPlayerUI(available);
                        PlayerTask.createMediaPlayer();
                    }
                });
                
            },1000*60*5);
        }
    };
    
    if($E('publisher_faces')){//仅在围观世界杯页面使用
        if(navigator.platform == "Win32"){
            PlayerTask.run();
        }
    }
});