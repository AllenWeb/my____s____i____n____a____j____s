$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
/**
 * 绑定图片上传到
 * @author liusong@staff.sina.com.cn
 */
App.bindUploadImgToFile = function( file, success, fail, start){
	if(!file || !file.type || file.type!="file"){throw "传入的对像不是一个文件选择框"}
	var d = document, canceled = false, gc, up, wrap, form, id, ifrid = ("ifr_" + (id=["up",Math.floor(Math.random()*10000),new Date().getTime()].join("_"))), iframe, filename = "";
	//创建一个容器扔iframe
	wrap = $C("div");
	wrap.style.display = "none";
	wrap.innerHTML = '<iframe frameborder="0" src="about:blank" id="' +ifrid+ '" name="' +ifrid+ '" class="fb_img_iframe"></iframe>';
	iframe = $C(ifrid);
	//创建form
	form = $C("form");
	form.target = ifrid;
	//form.enctype = "multipart/form-data";
	form.encoding = "multipart/form-data";
	form.method = "POST";
	form.action = 'http://picupload.t.sina.com.cn/interface/pic_upload.php?marks=' + (scope.$domain?"1":"0") + (scope.wm? "&wm=2": "") + '&markstr=' + (scope.$domain && encodeURIComponent(scope.$domain.replace("http://",""))) +'&s=rdxt&app=miniblog&cb=http://t.sina.com.cn/upimgback.html';
	//实例化
	d.body.appendChild(wrap);
	file.parentNode.insertBefore(form, file);
	form.appendChild(file);
	setTimeout(function(){file.style.visibility = "visible"},300);
	//失败处理
	f = function(){
		file.value = "";
		fail && fail();
	}
	//点击上传
	up = function(){
		canceled = false;
		if (!/\.(gif|jpg|png|jpeg)$/i.test(file.value)) {
			form.reset();
            App.alert({'code': "M07004"});
            return false;
        }
		filename = file.value.match(/[^\/|\\]*$/)[0];
		var comp = "", snap = [filename.slice(0,-4),filename.slice(-4)], len = Core.String.byteLength(snap[0]);
		if(len>20){
			snap[0] = Core.String.leftB(snap[0],20);
			comp = "...";
		}
		filename = snap.join(comp)
		scope.addImgSuccess = function( json ){
			if(canceled){return}
			scope.addImgSuccess = function(){};
			if(json && json.ret=="1"){
				success && success(json,filename);
				form.reset();
				return;
			}
			form.reset();
			App.alert({'code': 'M07002'},{"width":400});
			f();
		};
		start && start();
		form.submit();
	};
	//绑定事件
	Core.Events.addEvent(file, up, "change");
	//该方法返回一个使用者可以调用的取消方法
	return {
		"cancel" : function(){
			canceled = true;
			scope.addImgSuccess = function(){};
			iframe.location = "about:blank";
			form.reset();
			f();
		},
		"reset": function(){
			form.reset();
		}
	}
};