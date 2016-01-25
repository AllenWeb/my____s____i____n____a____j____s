/**
 * @author sinadmin
 */
$import("sina/sina.js");
$import("sina/app.js");
/*
 * 在我的首页加载可能感兴趣的人
 *
 */
$registJob('maybeconcern_index', function(){
    var _div = $E("maybe_friens_container") || null;
    if (!_div) {
        return false;
    }
    Utils.Io.Ajax.request('/person/aj_maybefriend.php', {
        'GET': {},
        'onComplete': function(json){
            try {
                if (json.code == 'A00006') {
                    if (Core.String.trim(json.data) != "") {
                        _div.innerHTML = json.data;
                        _div.className = "f_pro";
                        _div.style.display = "";
                    }
                }
                else {
                    _div.className = "";
                    _div.innerHTML = "";
                }
            } 
            catch (exp2) {
                _div.className = "";
                _div.innerHTML = "";
            }
        },
        'onException': function(){
            _div.className = "";
            _div.innerHTML = "";
        },
        'returnType': 'json'
    });
});
