/**
 * @author chibin
 */
(function(proxy, G){
    
//    var h = (container.style.display != "none");
    var html = '<div style="opacity: 1;" id="recm_options" class="recm_options">\
						<table>\
							<tbody><tr>\
								<td><input type="checkbox" value="1" checked="" name="tag" id="set1"><label for="set1">标签</label></td>\
								<td><input type="checkbox" value="1" checked="" name="company" id="set2"><label for="set2">公司</label></td>\
							</tr>\
							<tr>\
								<td><input type="checkbox" value="1" checked="" name="school" id="set3"><label for="set3">学校</label></td>\
								<td><input type="checkbox" value="1" checked="" name="area" id="set4"><label for="set4">在我附近的人</label></td>\
							</tr>\
						</tbody></table>\
						<div class="recm_btn"><a onclick="App.mburfriend_setting.submit();" href="javascript:void(0)" class="btn_normal btns"><em>确定</em></a></div>\
					 </div>';
	var d = new G.Dialog.BasicDialog($CLTMSG["CC6106"],html,{zIndex:1000,hidden:true,hiddClose:true});				 
	var container = d._node;
	proxy.show = function(){
//        h = !h;
//        if (h) {
//            container.style.display = "";
//            G.setOpacity(container, 0);
//            G.opacity(container, {
//                first: 0,
//                last: 100
//            });
//        }
//        else {
//            G.curtain.raise(container, function(){
//                container.style.display = "none";
//            });
//        }
		d.show();
    };
    proxy.submit = function(){
        var event = Core.Events.getEvent();
        var target = event ? (event.srcElement || event.target) : null;
        var pos = Core.Dom.getXY(target);
        var x = pos[0] - 30;
        var y = pos[1] - (target.offsetHeight) - 23
        var alert = G.PopUpAlert().position(x, y);
        var p = G.htmlToJson(container);
        var cb = function(){
            alert.content($CLTMSG['CC6105']).icon(3).wipe("up", true).lateClose(1000);
            //			proxy.show();
            G.MBYF_Task._html = [];
            G.MBYF_Task.getList(true);
			setTimeout(function(){
				d.close();
			},'1500')
        }
        G.doRequest(p, '/person/aj_maybefriend_rule.php', cb, cb);
    };
    
    
})(App.mburfriend_setting = {}, App);

