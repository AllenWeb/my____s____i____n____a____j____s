/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/app.js");
$import('sina/core/events/addEvent.js');
$import("sina/core/string/byteLength.js");
$import("diy/opacity.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/getEvent.js");
$registJob('medaldemo', function(){
    var shell = $E('medal_list');
    var box = $E('marqueebox');
    shell.style.width = '5000px';
    //    shell.style.height = '340px';
    shell.style.cssFloat = 'left';
    box.style.width = '470px';
    //    box.style.height = '340px'
    var items = Core.Dom.getElementsByClass(shell, 'div', 'mbnConHid');
    App.pulley($E('turn_left'), $E('turn_right'), box, items, shell, 1, 470, {
        isArray: true,
        nomouseAction: false,
        notloop: false,
        loopsTime: 8000
    });
    
    
    
    //    var shellL = $E('medalTXT_list');
    //    var boxL = $E('marqueeTXTbox');
    //    var arrItem;
    //    shellL.style.width = '5000px';
    //    //    shell.style.height ='340px';
    //    shellL.style.cssFloat = 'left';
    //    boxL.style.width = '400px';
    ////    boxL.style.height = '340px'
    //    boxL.style.margin = 'auto'
    //    boxL.style.overflow = 'hidden'
    //    var itemsS = Core.Dom.getElementsByClass(shellL, 'div', 'medalNote');
    //    shellL.insertBefore(itemsS[itemsS.length - 1], itemsS[0]);
    //    arrItem = itemsS.pop();
    //    itemsS.unshift(arrItem);
    //    boxL.scrollLeft += 400;
    //    Core.Events.addEvent($E('turn_right'), function(){
    //		App.setOpacity(boxL,0);
    //        App.opacity(boxL, {
    //            first: 0,
    //            last: 100,
    //            time: 8
    //        })
    //        shellL.appendChild(itemsS[0]);
    //        arrItem = itemsS.shift();
    //        itemsS.push(arrItem);
    ////        boxL.scrollLeft += 400;
    //    }, 'click');
    //    Core.Events.addEvent($E('turn_left'), function(){
    //		App.setOpacity(boxL,0);
    //        App.opacity(boxL, {
    //            first: 0,
    //            last: 100,
    //            time: 8
    //        })
    //        shellL.insertBefore(itemsS[itemsS.length - 1], itemsS[0]);
    //        arrItem = itemsS.pop();
    //        itemsS.unshift(arrItem);
    ////        boxL.scrollLeft += 400;
    //    }, 'click');
    //    
    //    //    
    //    App.pulley($E('turn_left'), $E('turn_right'), boxL, itemsS, shellL, 1 ,400,{isArray:true,nomouseAction:true});
});
