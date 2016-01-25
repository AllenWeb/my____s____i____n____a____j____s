/**
 * @author afc163
 *
 * 冻结用户jobs
 *
 */
$import('sina/core/events/addEvent.js');
$import("sina/core/events/fireEvent.js");
$import("sina/core/string/trim.js");
$import("diy/check.js");
$import("diy/enter.js");
$registJob('defreeze_user', function(){
	var addEvent = Core.Events.addEvent;
	//defreeze.html:step 1
	var checkM = function(input){
		if(!App.checkMobile(Core.String.trim(input.value))){
			$E("warning") && ( $E("warning").innerHTML = $CLTMSG['CF0326'] );
			input.focus();
			return false;
		}
		$E("warning") && ( $E("warning").innerHTML = "" );
		return true;
	};

	if($E("tostep1")){
		var m = $E("m");

		addEvent($E("gen"),function(){
			if(!checkM(m))	return;
			//异步提交消除ie6点击按钮无效的bug
			setTimeout(function(){
				$E("tostep1").submit();
			},0);
		},"click");

		App.enterSubmit({
			parent: m.parentNode,
			action: function(){
				if(!checkM(m))	return;
				Core.Events.fireEvent($E("gen"),'click');
			}
		});
	}
	//defreeze.html:step 2
	else if($E("tostep2")){
		var checkbox = $E("fzstep"), pic = null;
		if(checkbox.parentNode !== null){
			pic = checkbox.parentNode.getElementsByTagName("a");
		}
		if(pic.length == 0) return;
		var setCheck = function(){
			if(checkbox.checked == true){
				pic[0].style.display = "inline-block";
				pic[1].style.display = "none";
			}
			else{
				pic[0].style.display = "none";
				pic[1].style.display = "inline-block";
			}
		};
		setCheck();
		addEvent(checkbox,function(){
			setCheck();
		},"click");
		addEvent(pic[0],function(){
			//异步提交消除ie6点击按钮无效的bug
			setTimeout(function(){
				$E("tostep2").submit();
			},0);
		},"click");
	}
	//defreeze.html:step 3
	else
	{
		var timeout = 0, timer = null;
		var s2 = $E("step2");
		var s3 = $E("step3");
		var s4 = $E("step4");
		var stepdiv = Core.Dom.getElementsByClass(document,"DIV","step2div")[0];

		if(s2 == null || s3 == null || s4 == null) return;
		var getDate = function(){
			App.doRequest({}, '/resdefr.php', function(json){
				//successed
				if(json["result"] == 0){
					s4.style.display = "block";
					stepdiv.className = "step3div";
					stepdiv.lastChild.innerHTML = $CLTMSG["XM0001"]; //第三步的文案修改
					clearInterval(timer);
				}
				//failed
				else if(json["result"] == 1){
					s2.style.display = "none";
					s3.style.display = "block";
					stepdiv.className = "step3div";
					stepdiv.lastChild.innerHTML = $CLTMSG["XM0002"]; //第三步的文案修改
					clearInterval(timer);
				}
				//else if(xmlHttpRequest.responseText == 2)
				//	;//do nothing
				else
					;//do nothing
			}, function(){
			});
		};

		//ask for data per 5 seconds
		getDate();
		timer = setInterval(function(){
			timeout += 5000;
			//over 10 min, failed
			if(timeout > 600000)
			{
				s2.style.display = "none";
				s3.style.display = "block";
				stepdiv.className = "step3div";
				stepdiv.lastChild.innerHTML = $CLTMSG["XM0002"]; //第三步的文案修改
				clearInterval(timer);
			}
			getDate();
		},5000);
	}
});
