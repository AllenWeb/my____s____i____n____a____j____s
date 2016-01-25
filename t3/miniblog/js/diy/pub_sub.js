/**
 * @fileoverview publish-subscribe(发布－订阅模式)
 * @author yuwei@staff.sina.com.cn
 * 
 * for example:
 * ----------------------------------------------
 * function test(a,b,c,d){console.log(a,b,c,d)}
 * var proxy = new App.PubSub();
 * proxy.subscribe("click",window,"test");
 * proxy.publish("click",[1,2,3,"a"]);
 * ----------------------------------------------
 * This code will fire the "test" function,and prints the log msg:1,2,3,"a"
 */
$import("sina/app.js");

(function(proxy){
	proxy.PubSub = function PubSub() {
		this.subscribers = {};
	}
	
	/**
	 * @param{String}topic
	 * @param{Array}params
	 * */
	proxy.PubSub.prototype.publish = function(topic,params) {
		for (var i=0; i < this.subscribers[topic].length; i++) {
			var observer = this.subscribers[topic][i];
			observer.apply(this, params);
		}
	}
	
	/**
	 * @param{String}topic
	 * @param{Object}context 
	 * @param{String}handlerName
	 * */
	proxy.PubSub.prototype.subscribe = function(topic, context, handlerName){
		this.subscribers[topic] = this.subscribers[topic]||[];
		this.subscribers[topic].push(function(){
			if(context){
				context[handlerName].apply(context,arguments);
			}else{
				if(typeof handlerName === "function"){
					handlerName(arguments);
				}
			}
			
		});
	}
})(App);
