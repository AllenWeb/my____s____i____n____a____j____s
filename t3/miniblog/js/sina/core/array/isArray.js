/**
 * @id Core.Array.isArray 
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @fileoverview 判断一个对象是不是为数组的终极办法
 */

$import("sina/core/array/_array.js");

/**
 * 判断是否为数组类型
 * @for Core.Array.isArray 
 * @param {Array|Object|String|Number} o 任意类型的参数
 * @return {Boolean} 如果参数是数组类型则返回：true;f否则返回:false
 */
Core.Array.isArray=function(o){
  return Object.prototype.toString.call(o) === '[object Array]';
};
