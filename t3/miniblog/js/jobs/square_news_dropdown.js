/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import('sina/core/events/stopEvent.js');
$import('sina/core/dom/getXY.js');
$import('diy/dropdownAnimation.js');
$registJob('square_news_dropdown', function(){

    /**
     *
     * @param {Object} spec
     * spec.items
     * spec.trigger
     */
    var droper = function(spec){
        var box = document.createElement('DIV');
        box.className = 'cur_menu';
        box.style.visibility = 'hidden';
        box.style.position = 'absolute';
        box.innerHTML = spec.items;
        document.body.appendChild(box);
        var displayKey = false;
        var DELAY = 300;
		var clip = App.Clip(box, {
            clipType: '2',
            bottom: '0px',
            endPixel: box.offsetHeight+'px',
            clipspeed: 4
        });
        var show = function(){
            if (box.style.visibility == 'hidden' && displayKey) {
                var position = Core.Dom.getXY(spec.trigger);
                position[1] += (spec.trigger).offsetHeight;
                box.style.left = (position[0] - ('v' == '\v' ? 4 : 2)) + 'px';
                box.style.top = (position[1] - ('v' == '\v' ? 3 : 0)) + 'px';
                box.style.visibility = 'visible';
				clip.startClip();
            }
        }
        var hidd = function(){
            if (box.style.visibility == 'visible' && !displayKey) {
                box.style.visibility = 'hidden';
				clip.stopClip();
            }
        }
        
        Core.Events.addEvent(spec.trigger, function(e){
            Core.Events.stopEvent(e);
            if (!displayKey) {
                setTimeout(show, DELAY);
                displayKey = true;
            }
        }, 'mouseover');
        Core.Events.addEvent(spec.trigger, function(e){
            Core.Events.stopEvent(e);
            if (displayKey) {
                setTimeout(hidd, DELAY);
                displayKey = false;
            }
        }, 'mouseout');
        
        Core.Events.addEvent(box, function(e){
            Core.Events.stopEvent(e);
            if (!displayKey) {
                setTimeout(show, DELAY);
                displayKey = true;
            }
        }, 'mouseover');
        Core.Events.addEvent(box, function(e){
            Core.Events.stopEvent(e);
            if (displayKey) {
                setTimeout(hidd, DELAY);
                displayKey = false;
            }
        }, 'mouseout');
    };
    
    droper({
        items: '<ul>\
                    <li><a href="http://t.sina.com.cn/pub/news">' + $CLTMSG['CX0001'] + '</a></li>\
                    <li><a href="http://t.sina.com.cn/pub/sofa">' +
        $CLTMSG['CX0003'] +
        '</a></li>\
                </ul>',
        trigger: $E('square_news_dropdown')
    });
    
    droper({
        items: '<ul>\
                    <li><a href="http://t.sina.com.cn/pub/hotmblog">' + $CLTMSG['CX0004'] + '</a></li>\
            <li><a href="http://t.sina.com.cn/pub/topmblog?type=re&act=day">' +
        $CLTMSG['CX0005'] +
        '</a></li>\
                        <li><a href="http://t.sina.com.cn/pub/topmblog?type=cmt&act=day">' +
        $CLTMSG['CX0006'] +
        '</a></li>\
                    <li><a href="http://t.sina.com.cn/pub/hottopic">' +
        $CLTMSG['CX0007'] +
        '</a></li>\
                </ul>',
        trigger: $E('square_hot_dropdown')
    });
    
    droper({
        items: '<ul>\
                    <li><a href="http://t.sina.com.cn/pub/hottags">' + $CLTMSG['CX0008'] + '</a></li>\
                    <li><a href="http://t.sina.com.cn/pub/tags">' +
        $CLTMSG['CX0009'] +
        '</a></li>\
                </ul>',
        trigger: $E('square_tag_dropdown')
    });
    
    droper({
        items: '<ul>\
                    <li><a href="http://t.sina.com.cn/pub/star/index.php">' + $CLTMSG['CC3702'] + '</a></li>\
                    <li><a href="http://t.sina.com.cn/pub/star/mediumlist.php ">' + $CLTMSG['CC3701'] + '</a></li>\
										<li><a href="http://t.sina.com.cn/pub/star/brandlist.php">' + $CLTMSG['CC3703'] + '</a></li>\
                </ul>',
        trigger: $E('square_star_dropdown')
    });
    
    if (scope.city_url) {
        var cityHtml = '<ul>\
                    <li><a href="http://url/">' + $CLTMSG['CD0177'] + '</a></li>\
                    <li><a href="http://event.t.sina.com.cn/eventlist.php?status=1">' +
        $CLTMSG['CD0175'] +
        '</a></li>\
                    <li><a href="http://url/city_mblog">' +
        $CLTMSG['CX0002'] +
        '</a></li>\
                </ul>';
        droper({
            items: cityHtml.replace(/url/g, scope.city_url),
            trigger: $E('square_city_dropdown')
        });
    }
    
});
