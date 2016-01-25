/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 注册 Module 命名空间
 * 		将 Module 注册为 Sina.Module 的简写形式
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0 | 2008-08-25
 */
$import("sina/sina.js");

Sina.pkg("Module");

if (typeof Module == "undefined") {
	Module = Sina.Module;
}