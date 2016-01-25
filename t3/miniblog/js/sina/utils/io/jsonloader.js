/**-------------------------/// Json Loader \\\---------------------------
*
* <b>Load data through a script tag, avoiding cross-domain problem</b>
* @version : 1.0
* @since : 2008.01.20
* 
* @description :
*
*     通过script标签以get方式载入任何域下的数据。
*     返回数据的格式必须按照给定的格式输出。包括1个ScriptLoader发送的请求id，和真实数据
*
*     发送的请求格式：
*        http://host/path/?name=value&name=value&vars=×××
*        //其中vars指定为返回的 JSON 对象的名字
*
*     返回数据格式：
*       var ××× = {};
*
* @usage :
*     <code>
*       $JsonLoader.request(url, {
*         vars		  : ×××,
*         onComplete  : Function (responsedObject×××),  
*         charset     : String
*       });
*       testFunction : function(e){
*          // 这里的 e 就是该 JSON 对象 ×××，可以在这里对他进行任何处理
*          // alert(e);
*       }
*     </code>
* 
* @author : L.Ming
* @copyright sina.com.cn 
* @TODO : 
*     Remove Garbage script element after request finished.
* 
*--------------------------\\\ Script Loader ///---------------------------*/


$import("sina/utils/io/_io.js");
$import("sina/sina.js");
$JsonLoader = {
	request : function(url, option){
		var obj = document.createElement("script");
		obj.src = url;
		var vars = url.match(/(vars|varname|var|jv)\=(\w+)/)[2];
		var id = "scriptId_" + Math.random();
		obj.id = id;
		obj.charset = option.charset || "UTF-8";
		obj[document.all?"onreadystatechange":"onload"] = function(){
			var vars = null;
			if (/[\?&](vars|varname|var|jv)\=(\w+)/.test(url)) {
				vars = url.match(/(vars|varname|var|jv)\=(\w+)/)[2];
			}
			if(scope.$MOZ || this.readyState.toLowerCase() == 'complete' || this.readyState.toLowerCase() == 'loaded'){
				if (vars != null) {
					//clearTimeout($Timer[id]);
					//delete $Timer[id];
					option.onComplete(eval(vars), "json");
				}
				else{
					option.onComplete();
				}
			}
			//catch(e){}
		};
		document.body.appendChild(obj);
		/*$Timer[id] = setTimeout(function(){
			Timer(vars,"j");
		}, 300000);*/
		obj = null;
		}
};

