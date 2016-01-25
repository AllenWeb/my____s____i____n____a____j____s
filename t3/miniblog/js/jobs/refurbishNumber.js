/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import("jobs/base.js");
$import("diy/timer.js");
$import("diy/animation.js");
$import("diy/opacity.js");

$registJob('refurbishNumber',function(){
	var getDoms = function(){
//		var DIVS = document.getElementsByTagName('DIV');
//		var MAIN = null;
//		for (var i = 0, len = DIVS.length; i < len; i += 1) {
//			if (DIVS[i].className == 'person_atten') {
//				MAIN = DIVS[i];
//				break;
//			}
//		}
		var MAIN = $E('profile_following_follower_update');
		if(!MAIN){
			return false;
		}
		var ITEMS = MAIN.getElementsByTagName('LI');
		var following = ITEMS[0];
		var follower = ITEMS[1];
		var update = ITEMS[2];
		App.refurbishFollowing = upgrade(following);
		App.refurbishFollower = upgrade(follower);
		App.refurbishUpdate = upgrade(update);
	};
	var orbit = [[20, -1, 80], [22, -2, 70], [24, -3, 60], [28, -5, 40], [32, -7, 30], [36, -9, 20], [36, -9, 0]];
	var upgrade = function(el){
		var num = el.getElementsByTagName('DIV')[0];
		var that = {};
		el.style.position = 'relative';
		that.animation = function(cfg){
			var duplicate = num.cloneNode(true);
			duplicate.style.position = 'absolute';
			el.insertBefore(duplicate, num);
			var width = duplicate.offsetWidth;
			var current = 1;
			var tk = App.timer.add(function(){
				if (cfg.beging){
					cfg.beging(duplicate,num);
				}
				if (current >= orbit.length*2) {
					App.timer.remove(tk);
					App.setOpacity(num, 100);
					el.removeChild(duplicate);
					duplicate.style.display = 'none';
					num.getElementsByTagName('A')[0].innerHTML = num.getElementsByTagName('A')[0].innerHTML;
					return false;
				}
				if (current == orbit.length){
					cfg.middle(duplicate,num);
				}
				var now = orbit.length - Math.abs(current - orbit.length) - 1;
				duplicate.style.fontSize = orbit[now][0] + 'px';
				duplicate.style.top = orbit[now][1] + 'px';
				duplicate.style.left = 0 - (duplicate.offsetWidth - width)/2 + 'px';
				App.setOpacity(duplicate, orbit[now][2]);
				App.setOpacity(num, orbit[now][2]);
				current += 1;
				if (cfg.ending){
					cfg.ending(duplicate,num);
				}
			});
		};
		that.add = function(num){
			var doadd = function(du,or){
				var numBox = or.getElementsByTagName('A')[0];
				numBox.innerHTML = (parseInt(numBox.innerHTML) + num)||0;
				du.getElementsByTagName('A')[0].innerHTML = numBox.innerHTML;
			}
			this.animation({
				'middle' : doadd
			});
		};
		return that;
	};
	getDoms();
});