/**
 * @fileoverview
 * 延迟函数执行
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-02
 */
$import("sina/core/function/_function.js");
/**
 * @author xp
 * Ensure that this function executes only once
 * Invoke this function at once.
 * Be aware of that if exception raised function will not be treated as
 * finished. call Func.once() again will run it again.
 * 创建1个只会调用1次的函数
 */
Core.Function.once = function (fFunc){
  if (fFunc.__$$alreadyInvokded == true) {
  	return;
  }
  fFunc();
  fFunc.__$$alreadyInvokded = true;
};