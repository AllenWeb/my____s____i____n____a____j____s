/**
 * @author chibin
 *
 * 下拉菜单渲染效果，主要用clip属性
 *
 * el:下拉的元素
 *
 * cfg:{
 *
 *
 * }
 *
 */
App.Clip = function(el, config){
    var that = {};
    var cfg = config ||
    {};
    var q, func, i, init;
    var clip = function(el, cfg, clipfun){
        var spec = {};
        spec['left'] = (cfg['left'] && cfg['left'] + 'px') || 'auto';
        spec['right'] = cfg['right'] || 'auto';
        spec['top'] = cfg['top'] || 'auto';
        spec['bottom'] = cfg['bottom'] || 'auto';
        spec['endPixel'] = cfg['endPixel'] || 0;
        el.style.clip = 'rect(' + spec['top'] + ',' + spec['right'] + ',' + spec['bottom'] + ',' + spec['left'] + ')';
        var i = 0;
        if (!q) {
            q = window.setInterval(function(){
                clipfun(spec);
            }, 1)
        }
    };
    that.stopClip = function(){
        clearInterval(q);
        init(cfg);
        q = null;
    };
    that.startClip = function(){
        el.style.visibility = 'visible'
        clip(el, config, func);
    };
    switch (cfg['clipType']) {
        //从左到右
        case '1':
            init = function(cfg){
                i = parseInt(cfg['right'] || '0');
            };
            func = function(spec){
                i += cfg['clipspeed']||2;
                el.style.clip = 'rect(' + spec['top'] + ',' + i + 'px,' + spec['bottom'] + ',' + spec['right'] + ')';

                if (i >= parseInt(spec['endPixel'])) {
                    clearInterval(q)
                }
            }
            init(cfg);
            break;
        case '2':
            //从上到下
            init = function(cfg){
                i = parseInt(cfg['bottom'] || '0');
            };
            func = function(spec){
                i += cfg['clipspeed']||2;
                el.style.clip = 'rect('+ spec['top'] + ',' + spec['right'] + ','+ i + 'px,' + spec['left'] + ')';
				if (i >= parseInt(spec['endPixel'])) {
                    clearInterval(q)
                }
            }
            init(cfg);
            break;
    };
    return that;
};
