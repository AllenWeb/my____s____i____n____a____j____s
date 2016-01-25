/**-------------------------/// Script Loader \\\---------------------------
*
* <b>Load data through a script tag, avoiding cross-domain problem</b>
* @version : 1.0
* @since : 07.08.27
* 
* @description :
*     Script Loader loads data as string from any domain.
*
*     The web service deal with request sent from Script Loader always receives
*     a parameter named of 'requestId' with unique value to identify current
*     reuqest. The service must send the value of 'requestId' back as the 1st
*     piese of data 
*
*     responsed data looks like below:
*     <code>$ScriptLoader.response(
*          "the.requestId.sent.in.url.params", "response.text");
*     </code>
*
*     Responded text can be plane text or serialized xml document. And in the
*     2nd case,  Xml-String will be convert back to xml-document automatically
*     which will be sent to user defined listener as the 2nd argument.
*
*     通过script标签以get方式载入任何域下的数据。
*     返回数据的格式必须按照给定的格式输出。包括1个ScriptLoader发送的请求id，和真实数据
*
*     发送的请求格式：
*        http://host/path/?name=value&name=value&requestId=738473289432
*        //其中requestId由ScriptLoader自动添加
*
*     返回数据格式：
*       $ScriptLoader.response("requestId", "text");
*
* @usage :
*     <code>
*       $scriptLoader.request(url, {
*         onComplete  : Function (responsedText, responsedXMLDocument),
*         onException : Function (responsedText, responsedXMLDocument, error);
*         charset     : String,
*         timeout : 30000
*       });
*     </code>
* 
* @author : drdr.xp | yanbo@staff.sina.com.cn | drdr.xp@gmail.com
* @copyright sina.com.cn 
* @TODO : 
*     Remove Garbage script element after request finished.
* 
*--------------------------\\\ Script Loader ///---------------------------*/
$import("sina/utils/io/_io.js");
$import("sina/sina.js");
$import("sina/utils/url.js");
$import("sina/utils/xml/xml.js");
$ScriptLoader = {
  /** 
   * @author : drdr.xp | yanbo@staff.sina.com.cn | drdr.xp@gmail.com
   * 
   *    Hash-table storing id, url and options of unfinished requests.
   */
  requestTable : {},

  /**
   * @author : drdr.xp | yanbo@staff.sina.com.cn | drdr.xp@gmail.com
   *
   * Entrence of Remote request.
   * @param url the url requested for data
   * @param option {
   *  onComplete  : Function (responsedText, responsedXMLDocument),
   *  onException : Function (responsedText, responsedXMLDocument, error);
   *  charset     : String
   * }
   */
  request : function (url, option){
    option = option || {};
    option.charset = option.charset || "utf-8";
    var id = "scriptId_" + Math.random();
	if(option.isCached) id = 'scriptId_cached';
    url = new Utils.Url(url);
    url.setParam("requestId",id);
    url = url.toString();
    this.requestTable[id] = {
      id : id,
      url : url,
      option : option
    };
    var sTag = document.createElement("script");
    sTag.id = id;
    sTag.src = url;
    sTag.charset = option.charset;
    document.body.appendChild(sTag);
	if (option.timeout != null) {
		$Timer[id] = setTimeout(function(){
			Timer(id, "s");
		}, option.timeout);
	}
	try{
		option.onStart && option.onStart();
	}catch(e){}
  },

  /** 
   * @author : drdr.xp | yanbo@staff.sina.com.cn | drdr.xp@gmail.com
   * 
   * Call-back handler
   * @param id
   * @param txt
   */
  response : function (id, txt){
  	if(typeof txt == "string"){
		//$Debug("Script response : "+txt, "#900", "white");
	}
    var entity = this.requestTable[id];
    if (entity){
		$Debug("txt="+txt);
	var doc = (typeof txt=="string") ?Utils.Xml.parse(txt) : "";
	$Debug("doc ="+doc);
      try {
        entity.option.onComplete(txt, doc);
      } catch (err) {
        var oe = entity.option.onException;
        try {
          if (oe) {
		  	oe(txt, doc, err);
		  }
		  else {
		  	scope.trace("error occurs while calling onComplete to url : " + this.requestTable[id].url + " Error : " + err);
		  }
        } catch (err) {}
      } finally {}

      /* var sc = document.getElementById(entity.id); */
      /* sc.parentNode.removeChild(sc); */
      /* this.requestTable[id] = null; */
    }
  }
};


