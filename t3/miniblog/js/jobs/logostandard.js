/**
 * @author dmfeng dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/foreach.js");
$import("diy/viewLightPhotoBox.js");
$registJob('bindLogoBoxShow', function(){
	var list = [];
	var baseUrl = scope.$BASEIMG+'style/images/logostandard';
	Core.Array.foreach([1,2,3,4,5],function(v){
		list.push({
			picUrl : baseUrl + '/sli'+v+'.png',
			middlePicUrl: baseUrl + '/li'+v+'.jpg'
		})
	});
	var lightBox = new App.PhotoLightBox();	
	Core.Array.foreach('0,1,2,3,4,5'.split(','),function(v,i){
		Core.Events.addEvent($E('preshowid' + v),function(){
			var n = i > 2 ? 1 : i == 2 ? 2 : 0;
			lightBox.showPhoto( list , n );
		},'click');
	})
});