/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 注册 Core 命名空间
 * 		将 Core 注册为 Sina.Core 的简写形式
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0 | 2008-08-25
 */
$import("sina/sina.js");

Sina.pkg("Core");

if (typeof Core == "undefined") {
	Core = Sina.Core;
}