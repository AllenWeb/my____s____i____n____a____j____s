/**
 * @author chibin
 *
 * 可爱的大泡泡
 *
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/builder2.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/setXY.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/dom/removeNode.js');
$import('sina/core/string/trim.js');
$import("sina/core/string/leftB.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/system/getScrollPos.js");
/*
 * param:
 *   spec:{
 *       popwidth 内置宽度
 *       popheight 内置宽度
 *       poptype  横竖 :1、小尖向上，2、小尖向右，3、小尖向下，4、小尖向左
 *       popcontent 内置html
 *       }
 *       
 *  
 */

(function(proxy){
	proxy.bigpop = function(spec){
    spec.template = '<div class="PopLayer" id="bigpop" style="display:none;"><table class="Poptips"><tbody><tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr>\
<tr><td class="mid_l"></td><td class="mid_c"><div class="layerBox"><div style="width: auto;" class="layerBoxCon1"><div class="PopInfo clearFix">\
<div class="Pop_close"><a id="popclose" class="close" href="javascript:void(0);"></a></div><div id="poptype" class="Poparrow"></div>\
<div class="iconntent" id="popcontent"><div class="clearit"></div></div></div></div></div></td><td class="mid_r"></td></tr><tr>\
<td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr>\
</tbody></table></div>';
    spec.view = new proxy.builder2(spec);
	var ifm = $C('IFRAME');
	ifm.frameBorder="0";
	ifm.Border="0";   
	ifm.framespacing="0";   
	ifm.allowtransparency=true;
	spec.view.domList['bigpopifr'] = ifm;
	spec.view.domList['popcontent'].innerHTML = spec['popcontent'] + spec.view.domList['popcontent'].innerHTML;
    spec.view.domList['popclose'].onclick=function(){
		that.clear = true;
        spec.view.domList['bigpop'].style.display='none';
		spec.view.domList['bigpopifr'].style.display='none';
		proxy.doRequest({type:spec['popfrom']},'/person/aj_closepop.php',function(){},function(){})
    };
	spec.view.domList['bigpop'].style.position='absolute';
	spec.view.domList['bigpop'].style.zIndex='800';
	spec.view.domList['bigpopifr'].style.position='absolute';
	spec.view.domList['bigpopifr'].style.zIndex='600';
	spec.view.domList['bigpopifr'].style.backgroundColor="transparent";
	document.body.appendChild(spec.view.domList['bigpop']);
	document.body.appendChild(spec.view.domList['bigpopifr']);
	var that = {
        show : function(){
			      that.clear = false;
		          spec.view.domList['bigpop'].style.display='';
				  spec.view.domList['bigpopifr'].style.display='';
	           },
	    hidd : function(){
			      Core.Events.fireEvent(spec.view.domList['popclose'],'click');
	           },
	    getWidth : function(){
		          return spec.view.domList['bigpop'].offsetWidth;
	           },
	    getHeight : function(){
                    return spec.view.domList['bigpop'].offsetHeight;
               },
	    setPostion : function(pos){
			Core.Dom.setXY(spec.view.domList['bigpop'],pos);
			Core.Dom.setXY(spec.view.domList['bigpopifr'],[pos[0]+2,pos[1]+2]);
			spec.view.domList['bigpopifr'].width = spec.view.domList['bigpop'].offsetWidth - 5 ;
			spec.view.domList['bigpopifr'].height = spec.view.domList['bigpop'].offsetHeight - 5 ;
		},
		setType:function(type){
			spec.view.domList['poptype'].className='Poparrow'+type;
		},
		getRoot:function(){
			return spec.view.domList['bigpop'];
		}
	}
	return that;
	}
})(App);
$registJob('bigpop', function(){
    try {
        var box = document.body;
        var l = box.getElementsByTagName('A');
		if(!scope.popalert||!scope.popid) return false;
		var html=$SYSMSG[scope.popalert],tmp;
		if(Core.Dom.getElementsByAttr($E('pop_'+scope.popid),'pop','true').length<=0){
			return false;
		}
		tmp = Core.Dom.getElementsByAttr($E('pop_'+scope.popid),'pop','true')[0];
        //按照右左下上的方向
        var checkTip = function(el,pop){
            var param = {type:4};//默认是箭头向左
			var aXY = Core.Dom.getXY(el);
            var winsize = Core.System.winSize();
            var winscroll = Core.System.getScrollPos();
            var arrow = 10;
			//泡泡大小
            param['popwidth']=pop.offsetWidth;
            param['popHeight'] =pop.offsetHeight;
            param['position'] = new Array();
			//判断元素居左还是居右
			if(aXY[0]+el.offsetWidth/2>=(winsize.width/2+winscroll[1])){
				//箭头向右，元素居右
                if(aXY[0]-param['popwidth']-arrow-winscroll[1]>0){
                    param['type'] = 2;
                    param['position'][0] = aXY[0] - param['popwidth'] - arrow;
                    param['position'][1] = aXY[1] -((pop.offsetHeight-el.offsetHeight)/2);
                    return param;
                }
				//箭头向左，元素居左
                if(aXY[0]+el.offsetWidth+param['popwidth']<winsize.width-winscroll[1] && aXY[0]+el.offsetWidth+param['popwidth']>winscroll[1]){
                    param['type'] = 4;
                    param['position'][0] = aXY[0]+el.offsetWidth+arrow;
                    param['position'][1] = aXY[1]-((pop.offsetHeight-el.offsetHeight)/2);
                    return param;
                }
			}else{
				//箭头向右，元素居右
                if(aXY[0]-param['popwidth']-arrow-winscroll[1]>0){
                    param['type'] = 2;
                    param['position'][0] = aXY[0] - param['popwidth'] - arrow;
                    param['position'][1] = aXY[1] -((pop.offsetHeight-el.offsetHeight)/2);
                    return param;
                }
				//箭头向左，元素居左
                if(aXY[0]+el.offsetWidth+param['popwidth']>winscroll[1]){
                    param['type'] = 4;
                    param['position'][0] = aXY[0]+el.offsetWidth+arrow;
                    param['position'][1] = aXY[1]-((pop.offsetHeight-el.offsetHeight)/2);
                    return param;
                }
			}
            //判断元素居上还是居下
			if (aXY[1] + el.offsetHeight / 2 >= (winsize.height / 2 + winscroll[0])) {
			     //元素居下
				 if(aXY[1]+el.offsetHeight+param['popHeight']<winsize.height-winscroll[1] && aXY[1]+el.offsetHeight+param['popHeight']>=winscroll[0]){
	                param['type'] = 1;
	                param['position'][0] = aXY[0]-((pop.offsetWidth-el.offsetWidth)/2);
	                param['position'][1] = aXY[1]+el.offsetHeight+arrow;
	                return param;   
	            }
	            //下
	            if(aXY[1]-param['popHeight']-arrow>winscroll[0]){
	                param['type'] = 3;
	                param['position'][0] = aXY[0]-((pop.offsetWidth-el.offsetWidth)/2);
	                param['position'][1] = aXY[1]-param['popHeight'] - arrow;
	                return param;
	            }
			}else{
				if(aXY[1]+el.offsetHeight+param['popHeight']>=winscroll[0]){
                param['type'] = 1;
                param['position'][0] = aXY[0]-((pop.offsetWidth-el.offsetWidth)/2);
                param['position'][1] = aXY[1]+el.offsetHeight+arrow;
                return param;   
	            }
	            //下
	            if(aXY[1]-param['popHeight']-arrow>winscroll[0]){
	                param['type'] = 3;
	                param['position'][0] = aXY[0]-((pop.offsetWidth-el.offsetWidth)/2);
	                param['position'][1] = aXY[1]-param['popHeight'] - arrow;
	                return param;
	            }
			}
            //上
            
            return false;
        };
        scope.bigpop = new App.bigpop({
            popcontent:html,
			popfrom:scope.popid
            });
        scope.bigpop.show();
        var st = setInterval(function(){
            if(scope.bigpop.clear) {
                clearInterval(st);
                return false;
            }
            var param = checkTip(tmp,scope.bigpop.getRoot());
			if(!param ) return false;
            scope.bigpop.setType(param['type']);
            scope.bigpop.setPostion(param['position']);
        },100
        )
		}
    catch (e) {
    }
    
});
