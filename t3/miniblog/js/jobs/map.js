/**
 * @fileoverview map
 */
$import("sina/sina.js");
$import("sina/jobs.js");

$registJob("map", function(){
    new App.map.Map("map_container",{
        'keyword':"世界杯",
//        'city':"北京",
        'interval':3000,
        'zoom':6,
        'overviewMap':false,
        'params':{
//            'test1':"胡",
//            'test2':"温"
        }
    });
    
});
