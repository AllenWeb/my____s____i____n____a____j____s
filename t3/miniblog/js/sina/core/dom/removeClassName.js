/**
 * @id Core.Dom.removeClassName 
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * 删除指定的元素的指定样式
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * @for Core.Dom.removeClassName 
 * 删除指定的元素的指定样式
 * @param {Object} obj
 * @param {Object} _className
 */ 
Core.Dom.removeClassName = function (obj, _className){
  obj = $E(obj);
  obj.className = (" " + obj.className + " ").replace(" " + _className + " ","");
};