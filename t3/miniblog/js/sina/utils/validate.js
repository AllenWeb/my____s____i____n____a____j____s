/**
 * @fileoverview This file is some validate functions
 * @author xy xinyu@staff.sina.com
 * @version 0.1
 */
$import("sina/utils/utils.js");
$import("sina/core/string/bytelength.js");
Module.Validate = {};

/**
 * This function is check the certain string's length and if its type is right
 * @param str 给定的字符串,可以是任意字符串
 * @param type 进行判断的类型
 * 				"CHN" 代表汉字字符
 * 				"ENG" 代表英文字符
 * 				"ALL" 代表任意字符
 * @param length str参数这个字符所预期的长度，"CHN"类型按中文字符长度算，比如“好啊”的预期长度
 * 				  为2，则length填入2,"ENG"以及"ALL"类型按字节长度算。
 * @return 如果给定字符串符合给定长度以及给定类型，则返回true,否则返回false
 * @example
 * 			Module.Validate.checkLength("123abc","ENG"，6) return true;
 * 			Module.Validate.checkLength("123abc","CHN"，6) return false;
 * 			Module.Validate.checkLength("好好好","ENG"，3) return false;
 * 			Module.Validate.checkLength("好好好","CHN"，3) return true;
 * 			Module.Validate.checkLength("好好好","ALL"，3) return false;
 * 			Module.Validate.checkLength("好好好","ALL"，6) return true;
 * 			Module.Validate.checkLength("好好好123","ALL"，10) return true;
 */
Module.Validate.checkLength = function(str, type, length){
    var len = byteLength(str);
    
    switch (type) {
        case "CHN":
            if (len > length * 2 || str.length * 2 != len) {
                return false;
            }
            break;
        case "ENG":
            if (len > length || str.length != len) {
                return false;
            }
            break;
        case "ALL":
            if (len > length) {
                return false;
            }
            break;
            
    }
    return true;
    
};

