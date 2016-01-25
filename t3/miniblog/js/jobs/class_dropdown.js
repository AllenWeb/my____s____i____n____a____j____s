/**
 * @author xp | xiongping1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import('sina/core/events/stopEvent.js');
$import('sina/core/dom/getXY.js');
$import('diy/dropdownAnimation.js');
$import('sina/utils/io/ajax.js');
$import('sina/core/string/leftB.js');
$import('sina/core/string/trim.js');
$import('sina/core/events/stopEvent.js');
$registJob('class_dropdown', function(){
	var container = $E('drop_container');
	var typeArea = $E('typeArea');
    var _addEvent = Core.Events.addEvent;
	//搜索
	var oInput = $E("search_user"), oUserBtn = $E("search_btn");
    oUserBtn.title = $CLTMSG['CX0011'];
    function search(event){
        var value = Core.String.leftB(Core.String.trim(oInput.value), 30);
        if (value) {
            location.href = "/search/user.php?search=" + encodeURIComponent(encodeURIComponent(value));
        }
        else {
            oInput.focus();
        }
        Core.Events.stopEvent(event);
    }
	if(oInput && oUserBtn){
    	_addEvent(oUserBtn, search, "click");
	}
	
    var timer;
    var current = 0;
    var config_city = [
    	[34,"安徽"], 
			[11,"北京"], 
			[50,"重庆"], 
			[35,"福建"], 
			[62,"甘肃"], 
			[44,"广东"], 
			[45,"广西"], 
			[52,"贵州"], 
			[46,"海南"], 
			[13,"河北"], 
			[23,"黑龙江"], 
			[41,"河南"], 
			[42,"湖北"], 
			[43,"湖南"], 
			[15,"内蒙古"], 
			[32,"江苏"], 
			[36,"江西"], 
			[22,"吉林"], 
			[21,"辽宁"], 
			[64,"宁夏"], 
			[63,"青海"], 
			[14,"山西"], 
			[37,"山东"], 
			[31,"上海"], 
			[51,"四川"], 
			[12,"天津"], 
			[54,"西藏"], 
			[65,"新疆"], 
			[53,"云南"], 
			[33,"浙江"], 
			[61,"陕西"], 
			[71,"台湾"], 
			[81,"香港"], 
			[82,"澳门"], 
			[400,"海外"],
			[100,"其他"]
    ],
    config_letter = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var cityUrl = [],letterUrl = [];
    for(var i=0,len=config_city.length;i<len;i++){
    	var tempStr = '<a href="/pub/star/area_detail.php?areaid='+config_city[i][0]+'&t=1">'+config_city[i][1]+'</a>';
    	cityUrl[i]=tempStr;
    }
    var cityStr = cityUrl.join('');
    for(var i=0,len=config_letter.length;i<len;i++){
    	var tempStr = '<a href="/pub/star/letter_detail.php?lt='+config_letter[i].toLowerCase()+'&t=1">'+config_letter[i]+'</a>';
    	letterUrl[i]=tempStr;
    }
    var letterStr = letterUrl.join('');
   	var classEventOver = function(ele){
   		_addEvent(ele,function(){
   			ele.className = "cur";
   			switch(ele.id){
   				case "class_1":
   					current = 1;
   					container.innerHTML = $CONFIG.classhtml;
            break;
   				case "class_2":
   					current = 2;
   					container.innerHTML = cityStr;
   					break;
   				case "class_3":
   					current = 3;
   					container.innerHTML = letterStr;
   					break;
          default:
          	break;
   			}
   		},'mouseover')
   	}
   	var classEventOut = function(ele){
   		_addEvent(ele,function(){
   			ele.className = "";
   		},'mouseout')
   	}
   	for(var i=1;i<=3;i++){
   		var tempId = $E("class_"+i);
   		classEventOver(tempId);
   		classEventOut(tempId);
   	}
   	_addEvent(typeArea,function(){
   		container.style.display = "block";
			switch(current){
				case 1:
					$E('class_1').className = "cur";
					break;
				case 2:
					$E('class_2').className = "cur";
					break;
				case 3:
					$E('class_3').className = "cur";
					break;
				default:
					break;
			}
   		window.clearTimeout(timer);
   	},"mouseover");
   	_addEvent(typeArea,function(){
   		for(var i=1;i<=3;i++){
	   		var tempId = $E("class_"+i);
	   		tempId.className="";
			}
   		timer = window.setTimeout(function(){container.style.display = "none";},100)
   	},"mouseout");
});
