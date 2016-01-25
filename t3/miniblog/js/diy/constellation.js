/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 根据日期，等到星座
 */

$import("sina/sina.js");
$import("sina/app.js");

(function(proxy){
	proxy.constellation = function(m,d){
		var res = m*31 + d;
		var con = [
			'Capricorn',
			'Aquarius',
			'Pisces',
			'Aries',
			'Taurus',
			'Gemini',
			'Cancer',
			'Leo',
			'Virgo',
			'Libra',
			'Scorpio',
			'Sagittarius'
		];
		if(res  <= 31*0 + 19){
			return con[0];
		}else if(res <= 31*1 + 18){
			return con[1];
		}else if(res <= 31*2 + 20){
			return con[2];
		}else if(res <= 31*3 + 20){
			return con[3];
		}else if(res <= 31*4 + 20){
			return con[4];
		}else if(res <= 31*5 + 21){
			return con[5];
		}else if(res <= 31*6 + 22){
			return con[6];
		}else if(res <= 31*7 + 22){
			return con[7];
		}else if(res <= 31*8 + 22){
			return con[8];
		}else if(res <= 31*9 + 22){
			return con[9];
		}else if(res <= 31*10 + 21){
			return con[10];
		}else if(res <= 31*11 + 21){
			return con[11];
		}else{
			return con[0];
		}
	}
})(App);
