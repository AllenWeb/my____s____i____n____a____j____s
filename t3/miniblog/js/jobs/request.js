$import("sina/sina.js");
$import("sina/core/string/j2o.js");
$import("sina/utils/io/ajax.js");
/**
 * 请求的包装 
 * @param {Object} oData
 * @param {Object} sUrl
 * @param {Object} fCb
 * @param {Object} fEcb
 * @param {Object} ptype
 * @param {Object} type
 */
App.doRequest = function(oData,sUrl,fCb,fEcb,ptype,type){
	var emptyFun = function(){};
	var param = {
		onComplete : function(result){
			try{
				if(typeof result == "string"){
					result = result.replace(/;$/, "");
				}
				result = (typeof result == "string" && (/\s*{/.test(result))) ? Core.String.j2o(result) : result;				
				if(result && (result.code == "A00006" || result.code == "S00001")){
					(fCb||emptyFun)(result.data,result);	
				}else{					
					(fEcb||emptyFun)(result);
				}
				
			}catch(e){
			}			
		},
		onException   :function(json) {
			(fEcb||emptyFun)(json);
		}
	};	
	ptype = (ptype||"post").toUpperCase();
	param[ ptype ] = oData;
	param.returnType = "json";
	type  = type||"ajax";	
	Utils.Io.Ajax.request(sUrl,param);
}; 