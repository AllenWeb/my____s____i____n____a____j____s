/**
 * @author yuwei
 * @fileoverview 老虎机游戏
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("diy/dialog.js");
$import("diy/slot_machine.js");

$registJob("slot_machine", function(){
    var _addEvent = Core.Events.addEvent , bLocked = false;
    var map = {
        "storage.gif" : $CLTMSG['CD0160'],
        "money.gif" : $CLTMSG['CD0161'],
        "bag.gif" : $CLTMSG['CD0162'],
        "mouse.gif" : $CLTMSG['CD0163'],
        'whsths.gif': $CLTMSG['CD0169'],
        'ball.gif':$CLTMSG['CD0170']
    };
            
    var Task = {
        run: function(){
            var me = this;
            _addEvent($E("start"), function(){
                if(!bLocked){
                    bLocked = true;
                    Utils.Io.Ajax.request("/aj_drawprize.php", {
                        GET: {},
                        returnType: "json",
                        onComplete: function(result){
                            if ((result && result.code)) {
                                if (result.code === "A00006") {
                                    me.startGame(result);
                                }else if(result.code === "MR0120"){//无权限玩游戏
                                    $E("no_authority").style.display = "";
                                }else if(result.code === "MR0121"){//已经玩过一次了
                                    $E("gameover").style.display = "";
                                }else if(result.code === "M00003"){
                                    var dialog = App.ModLogin();
                                    dialog.onClose = function(){
                                        bLocked = false;
                                    };
                                    return ;
                                }else{
                                    App.alert($SYSMSG[result.code], {
                                        icon: 2
                                    });
                                }
                            }
                            else {
                                App.alert($CLTMSG['CD0092']);
                            }
                        },
                        onException: function(msg){
                            App.alert(msg);
                        }
                    });
                }
                
            }, "click");
            
            _addEvent($E("close"), function(){
                $E('game_result').style.display='none';
            },"click");
        },
        startGame: function(result){
            if(result && result.result && result.result.push){
                var oManager = new App.SlotMachineManager(),machines = [];
                var list = result.result,len = list.length;
                var srcList = [];
                for(var i=0;i<len;i++){
                    srcList.push(list[i].src);
                    oManager.register(new App.SlotMachine($E("container" + i), list[i].src, oManager));
                }
                
                oManager.win = this.winGame;
                oManager.lost = this.lostGame;
                var bWin = false,src="";
                if(srcList.join("").replace(new RegExp(srcList[0],"gi"),"").length === 0){
                    bWin = true;
                    src = srcList[0];
                }
                oManager.chain().start(bWin,src);

                setTimeout(function(){
                    oManager.stop();//3秒后自动停止老虎机
                }, 3000);
            }
        },
        winGame: function(targetSrc){
            $E("game_result").style.display = "";
            $E("game_result").style.zIndex = 700;
            $E("win").style.display = "";
            $E("lost").style.display = "none";
            
            $E("award").innerHTML = map[targetSrc];
            bLocked = false;
        },
        lostGame: function(){
            $E("game_result").style.display = "";
            $E("game_result").style.zIndex = 1000;
            $E("win").style.display = "none";
            $E("lost").style.display = "";
            bLocked = false;
        }
    };
    Task.run();
});
