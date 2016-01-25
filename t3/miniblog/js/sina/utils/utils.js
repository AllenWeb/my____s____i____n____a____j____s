/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 注册 Utils 命名空间
 * 		将 Utils 注册为 Sina.Utils 的简写形式
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0 | 2008-08-25
 */
$import("sina/sina.js");

Sina.pkg("Utils");

if (typeof Utils == "undefined") {
	Utils = Sina.Utils;
}
