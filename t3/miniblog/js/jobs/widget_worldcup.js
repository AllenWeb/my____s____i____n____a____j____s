/**
 * @author yuwei
 * @fileoverview 2010世界杯专题widget
 */
$import("diy/marquee.js");

$registJob("widget_worldcup", function(){
    var _addEvent = Core.Events.addEvent;
    
    var oTabs ;
    if(oTabs = $E('worldcup_nav')){
        var children = oTabs.children;
        _addEvent(oTabs,function(e){
            var t  = (e.srcElement || e.target).parentNode;
            if(t == children[0] && children[0].className !== "current"){
                children[0].className = "current";
                $E('worldcup_topfwd').style.display = "";
                children[1].className = "";
                $E('worldcup_hottopic').style.display = "none";
            }
            if(t == children[1] && children[1].className !== "current"){
                children[0].className = "";
                $E('worldcup_topfwd').style.display = "none";
                children[1].className = "current";
                $E('worldcup_hottopic').style.display = "";
            }
        },"click");
    }
    
    //-------滚动显示-----------------------------------------------------------------
    var oMarqueeBox,oMarquee;
    if(oMarqueeBox = $E('worldcup_forward')){
        oMarquee = marquee(oMarqueeBox);
    }
    if($E('worldcup_fwd_t') && $E('worldcup_fwd_k')){
        var map = {
            'worldcup_fwd_t':$E('worldcup_forward'),
            'worldcup_fwd_k':$E('worldcup_keyword')
        };
        var oMoreLink;
        if(oMoreLink = $E("mblog_more")){
            var href1 = oMoreLink.href;
        }
        for(var id in map){
            (function(id){
                _addEvent($E(id),function(){
                    currentTab(id,map);
                    
                    //
                    if(id === "worldcup_fwd_k" && oMoreLink){
                        oMoreLink.href = oMoreLink.getAttribute("href2");
                    }
                    if(id === "worldcup_fwd_t" && oMoreLink){
                        oMoreLink.href = href1;
                    }
                    //
                    
                    if(oMarquee){
                        oMarquee.stop();
                    }
                    oMarquee = marquee(map[id]);
                },'mouseover');
            })(id);
        }
    }
    function currentTab(id,map){
        for(var k in map){
            $E(k).className = "";
            map[k].style.display = "none";
        }
        $E(id).className = "cur";
        map[id].style.display = "";
    }
    
    function marquee(oMarqueeBox){
        oMarqueeBox.style.height = "418px";//限高是关键,内容要足够多
        var lis = oMarqueeBox.getElementsByTagName("LI");
        var items = [];
        for(var i = 0, len = lis.length;i < len; i += 1){
            lis[i].style.display = "";
            items.push(lis[i]);
        }
        try{
            var oMarquee = new App.marquee(oMarqueeBox,items,{forward:"up",speed:3});
            _addEvent(oMarqueeBox,function(){oMarquee.pause()},'mouseover');
            _addEvent(oMarqueeBox,function(){oMarquee.restart()},'mouseout');
            oMarquee.start();
        }catch(e){
            
        }
        return oMarquee;
    }
    
    
    //---------------------------------------------------------------------------------
    var nav1;
    if(nav1 = $E('nav1')){
        var content1 = $E('welcome_team'),content2 = $E('welcome_fans'),content3 = $E('hotword');
        var hash = {
            'nav1':content1,
            'nav2':content2,
            'nav3':content3
        };
        
        for(var id in hash){
            (function(id){
                _addEvent($E(id),function(){
                    showTab(id,hash);
                },'mouseover');
            })(id);
        }
        
        function showTab(id,hash){
            for(var k in hash){
                $E(k).className = "PY_tagn";
                hash[k].style.display = "none";
            }
            $E(id).className = "PY_tago";
            
            hash[id].style.display = "";
        }
    }
});