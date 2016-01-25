/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @check the input value
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
(function(proxy){
	proxy.checkEml = function(eml){
		if(!/^[\.\w]([(\/)(\-)(\+).\w])*@([(\-)\w]{1,64}\.){1,7}[(\-)\w]{1,64}$/.test(eml)){
		   return false;
		}else{
			if(eml && eml != "" && (eml.indexOf("@") != -1)){
				var indexOfA = eml.indexOf("@");
				var name = eml.substring(0, indexOfA);
				if(name.length >64 || eml.length > 256){
					return false;
				}else{
					return true;
				}
			}
		}
		return false;
	};
	proxy.checkEmpty = function(str){
		if(!str){
			return false;
		}
		if(!(str instanceof String)){
			str = str.toString();
		}
		if((Core.String.trim(str)).length){
			return true;
		}else{
			return false;
		}
	};
	proxy.checkRealName = function(str){
		if(new RegExp("^[\u4e00-\u9fa5]{2,6}$").test(str)){
			return true;
		}else if(new RegExp("^[a-z]{2,20}$").test(str)){
			return true;
		}else if(new RegExp("^[a-z\u4e00-\u9fa5]{2,6}$")){
			return true;
		}else{
			return false;
		}
	};
	
	var checkBase = function(regStr){
		return function(beRegStr){
			if(new RegExp(regStr).test(beRegStr)){
				return true;
			}else{
				return false;
			}
		};
	};
	proxy.checkQQNum = function(str){
		if(new RegExp("^[1-9][0-9]{4,11}$").test(str)){
			return true;
		}else if(proxy.checkEml(str)){
			return true;
		}else{
			return false;
		}
	};
	proxy.checkUCNum = function(str){
		if(new RegExp("^[1-9][0-9]{4,9}$").test(str)){
			return true;
		}else{
			return false;
		}
	};
	proxy.checkMobile	= checkBase("^1(\\d{10})+$");
	proxy.checkTrName	= checkBase("^[\u4e00-\u9fa5]{2,6}$");
	proxy.checkNickSp	= checkBase("^[0-9a-zA-Z\u4e00-\u9fa5_]*$");
	proxy.checkNickSp2  = checkBase("^[0-9a-zA-Z\u4e00-\u9fa5_-]*$");
	proxy.checkTrueNm	= checkBase("^[a-zA-Z·\s\.\u4e00-\u9fa5]*$");
	proxy.checkSkype1	= checkBase("^[0-9a-zA-Z](-|\w){3}(-|\w)*$");
	proxy.checkSkype2	= checkBase("[!#@%&\/\'\"\$\^\*\(\)\+\=\[\]\{\}\?\;\:\<\>\|~`\x80-\xff\\]");
	proxy.checkImgURI	= checkBase("(\.jpg|\.gif|\.png|\.JPG|\.GIF|\.PNG)$");
	proxy.checkURL		= checkBase("^http:\\/\\/([\\w-]+(\\.[\\w-]+)+(\\/[\\w-   .\\/\\?%@&+=\\u4e00-\\u9fa5]*)?)?$");
	proxy.checkURLoose	= checkBase("^([^://])+\\:\\/\\/([^\\.]+)(\\.)(.+)([^\\.]+)$");
	proxy.checkMiniName	= checkBase("^[a-zA-Z0-9\u4e00-\u9fa5\uff00-\uffff\u0800-\u4e00\u3130-\u318f\uac00-\ud7a3_]*$");
	proxy.checkIdCard	= checkBase("^(([0-9]{15})|([0-9]{18})|([0-9]{17}(x|X)))$");
	
	proxy.checkSchool = function(str){
		if(new RegExp("\'|\"|\<|\>|\[|\]","g").test(str)){
			return false;
		}else{
			return true;
		}
	};
	proxy.checkCompany = function(str){
		if(new RegExp("\'|\"|\<|\>|\[|\]","g").test(str)){
			return false;
		}else{
			return true;
		}
	};
	//手机验证的验证码
	proxy.checkMobileCheckCode = checkBase("^[0-9a-z]{6}$");
	
	proxy.checkSepicalSymbol = function(str){
		if(new RegExp("[,|;|<|>]","g").test(str)){
			return true;
		}else{
			return false;
		}
	};
	/**
	 * 测试密码强度
	 * @param {String} pwd
	 * @return {Number}  返回百分比，100%表示强度最高
	 */
	proxy.checkPwdPower = function(pwd,minlen,maxlen){
		var len_p = (pwd.length - minlen)/(maxlen - minlen);
		var complex_p = 0;
		if(/[A-Z]/g.test(pwd)){
			complex_p += 0.273;
		}
                if(/[a-z]/g.test(pwd)){
			complex_p += 0.273;
		}
                if(/[0-9]/g.test(pwd)){
			complex_p += 0.114; 
		}
                if(/[^0-9a-zA-Z]/g.test(pwd)){
			complex_p += 0.340;
		}
		//console.log([len_p,complex_p]);
		return len_p /2 + complex_p /2;
	};
	/**
	 * 从统一登录那边拿到的测试密码强度的js
	 */
	proxy.checkPwdPowerNew = function(sPW){
		function CharMode(iN){
			if (iN>=65 && iN <=90){
				return 2;//大写字母
			} 
			if (iN>=97 && iN <=122){
				return 4;//小写
			}else{
				return 1;//数字
			} 
		}
		//计算出当前密码当中一共有多少种模式
		function bitTotal(num){
			var modes = 0;
			for (i=0;i<3;i++){
				if (num & 1){
					modes++;
				}
				num>>>=1;
			}
			return modes;
		}
		//checkStrong函数 返回密码的强度级别
		var Modes=0;
		for (i=0;i<sPW.length;i++){
			//测试每一个字符的类别并统计一共有多少种模式.
			Modes|=CharMode(sPW.charCodeAt(i));
		}
		var btotal = bitTotal(Modes);
		if (sPW.length >= 10) {
			btotal++;
		}
		switch(btotal) {
			case 1:
				return 1;
			case 2:
				return 2;
			case 3:
				return 3;
			default:
				return 1;
		}
	};
})(App);
