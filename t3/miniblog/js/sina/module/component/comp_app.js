/**
 * App组件基础类
 */
$import("sina/utils/io/ijax.js");
$import("sina/module/component/registComp.js");
/**
 * 新建App组件以此组件进行扩展
 * @exampel 
	//comp_2001
	$registComp(2001,{},"app");
	//完成注册
 */
$registComp("app", {
	url : "http://space.sina.com.cn////",
	load : function (){
		Utils.Io.Ijax.request(this.url, {
			GET : {
				cid : this.compId
			}.bind2(this),
			onComplete : function(resultText) {
				this.show(resultText);
			}.bind2(this),
			onException: function() {
				this.show("数据读取失败！");
			}.bind2(this)
		});
	}
});
