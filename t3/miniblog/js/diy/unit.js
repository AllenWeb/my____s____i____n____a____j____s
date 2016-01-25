/**
 * 集联继承
 * @author liusong@staff.sina.com.cn
 * @example
 		var a = function(){
 			it = App.unit(), u = it.u;
 			it.close = u(function(){
 				console.log(1);
 			})
 			return it;
 		}
 		var b = function(){
 			var it = a(), e = it.u;
 			it.close = e(function(){
 				console.log(2);
 				this.sup();
 			},"close")
 			return it;
 		}
 		var c = function(){
 			var it = b(), e = it.u;
 			it.close = e(function(){
 				console.log(3);
 				this.sup();
 			},"close")
 			return it;
 		}
 		c().close()  // 3 2 1
 */

$import("sina/app.js");

App.unit = function(){
	var it = {}, udf;
	it.u = u = function(func, key){
		var context = {"it":it, "sup": it[key]};
		return function(){
			func.apply(context, arguments);
			return it;
		}
	}
	return it;
};