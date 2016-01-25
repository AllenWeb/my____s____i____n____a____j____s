/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("diy/autocomplate.js");
$import("jobs/request.js");
/*
 * 
 * 
 * @param {Object} spec
 * {
 * select:function(value,text){} //点击列表某一项时事件,可选
 * input: el //需要绑定的元素，必选
 * timer: integer //设定请求间隔 ，可选
 * style: string //列表框的样式   ，可选
 * light: function(el){}  //高亮选择时el改变样式
 * dark:  function(el){}  //不选中的时候el样式
 * class: string  //列表中ul的样式
 * type: string  // 后台提交类型，默认ajax;［关注是0，粉丝是1］
 * data: string  //数据或者当请求为ajax时为url
 * }
 * 
 */
App.fansfind = function(spec){
    spec['ok'] =  function(value,text){
    	 text = text.replace(/\(.*\)/g,"");//去掉备注名称
    	 if(spec['input'].value && /,|;|\uFF0C|\uFF1B|\u3001|\s/.test(spec['input'].value)){
        	var arr = spec['input'].value.split(/,|;|\uFF0C|\uFF1B|\u3001|\s/);
        	var v = spec['input'].value.substring(0,spec['input'].value.length-arr[arr.length-1].length);
        	spec['input'].value = v + text + " ";//加空格可以避免选中该项后还提示该项对应的下来列表，并且用户可以连续输入
        }else{
        	spec['input'].value = text;
        }
        
		if(spec['select'] && typeof spec['select'] =="function"){
			spec['select'](value,text);
		}
    };
    spec['timer'] = spec['timer'] || 5;
    spec['style'] = spec['style'] || 'width:'+spec['input'].clientWidth+'px;position:absolute;z-Index:1200;';
    spec['light'] = spec['light'] || function(el){
        el.className = 'cur';
    };
    spec['dark'] = spec['dark'] || function(el){
        el.className = '';
    };
    spec['class'] = spec['class'] || 'layerMedia_menu';
    spec['type'] = spec['type'] || 'ajax';
    spec['data'] = spec['data'] || '/attention/aj_chooser.php?key=' + spec['input'].value + '&type=' + spec['searchtype'];
	spec['itemStyle'] = 'overflow:hidden;height:20px';
    return App.autoComplate(spec);
    
    
}
