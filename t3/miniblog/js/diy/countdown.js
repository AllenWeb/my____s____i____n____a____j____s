/**
 * @author chibin
 * 倒计时小工具
 */
(function(proxy){
    var nowTime = scope.$severtime * 1000 || new Date().getTime();
    var delay = function(spec){
        var that = {}, dl = spec['delay'] || 1000 //倒计时默认1秒
        var clock = setInterval(function(){
            that.time = spec['fun'](spec);
        }, dl);
        that.clock = clock;
        return that;
    };
    
    var operation = function(spec){
        var that = {}, type = spec['type'] || 'decrease';//默认做减法
        var now = {}, term = spec['termination'], inter = {};
        now.time = nowTime;
        now.date = new Date(now.time);
        now.year = now.date.getFullYear(); //年
        now.month = now.date.getMonth(); //月
        now.day = now.date.getDate(); //日	
        now.hour = now.date.getHours();
        now.minute = now.date.getMinutes();
        now.second = now.date.getSeconds();
		now.millisecond = now.date.getMilliseconds();
        if (term) {
            inter.year = term.getFullYear() - now.year;
            inter.month = term.getMonth() - now.month;
            inter.day = term.getDate() - now.day;
            inter.hour = term.getHours() - now.hour;
            inter.minute = term.getMinutes() - now.minute;
            inter.second = term.getSeconds() - now.second;
			inter.millisecond = term.getMilliseconds() - now.millisecond;
        }
		if (inter.millisecond < 0) {
            inter.millisecond = 1000 + inter.millisecond;
            inter.second = inter.second - 1;
        }
        if (inter.second < 0) {
            inter.second = 60 + inter.second;
            inter.minute = inter.minute - 1;
        }
        if (inter.minute < 0) {
            inter.minute = 60 + inter.minute;
            inter.hour = inter.hour - 1;
        }
        if (inter.hour < 0) {
            inter.hour = 24 + inter.hour;
            inter.day = inter.day - 1;
        }
        if (inter.day < 0) {
            inter.day = 31 + inter.day;
            inter.month = inter.month - 1;
        }
        if (inter.month < 0) {
            inter.month = 12 + inter.month;
            inter.year = inter.year - 1;
        }
   		that = inter;
		that.nowTime = nowTime;
        return that;
    }
    var init = function(spec){
        var that = {}
        var dl = spec['delay'] || 1000;
        spec['fun'] = function(){
            var time = operation(spec);
			spec['Do'](time);
			nowTime += +dl; 
        };
        that = delay(spec);
		return that;
    }
    proxy.countdown = function(spec){
        init(spec ||
        {})
    }
})(App)


