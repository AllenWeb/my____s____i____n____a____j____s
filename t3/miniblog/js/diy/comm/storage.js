/**
 * @author wangliang3@staff.sina.com.cn
 * 搬自STK wukan@staff.sina.com.cn storage.js
 */
$import("sina/sina.js");
$import("sina/app.js");
(function(){
    App.storage = (function(){
        var objDS = window.localStorage;
        
		if(window.ActiveXObject){//ie8清除页面历史信息后再对localStorage操作无法记录，故对ie做特殊处理，有限处理ie
            store = document.documentElement;
            STORE_NAME = 'localstorage';
            try {
                store.addBehavior('#default#userdata');
                store.save('localstorage');
            } 
            catch (e) {
//                throw "don't support userData";
            }
            
            return {
                set: function(key, value){
                    store.setAttribute(key, value);
                    store.save(STORE_NAME);
                },
                get: function(key){
                    store.load(STORE_NAME);
                    return store.getAttribute(key);
                },
                del: function(key){
                    store.removeAttribute(key);
                    store.save(STORE_NAME);
                }
            };
        }
        else 
            if (objDS) {
                return {
                    get: function(key){
                        return objDS.getItem(key) == null ? null : unescape(objDS.getItem(key));
                    },
                    set: function(key, value, exp){
                        objDS.setItem(key, escape(value));
                    },
                    del: function(key){
                        objDS.removeItem(key);
                    },
                    clear: function(){
                        objDS.clear();
                    },
                    getAll: function(){
                        var l = objDS.length, key = null, ac = [];
                        for (var i = 0; i < l; i++) {
                            key = objDS.key(i), ac.push(key + '=' + this.getKey(key));
                        }
                        return ac.join('; ');
                    }
                };
            }
            else {
                return {
                    get: function(key){
                        var aCookie = document.cookie.split("; "), l = aCookie.length, aCrumb = [];
                        for (var i = 0; i < l; i++) {
                            aCrumb = aCookie[i].split("=");
                            if (key === aCrumb[0]) {
                                return unescape(aCrumb[1]);
                            }
                        }
                        return null;
                    },
                    set: function(key, value, exp){
                        if (!(exp && typeof exp === date)) {
                            exp = new Date(), exp.setDate(exp.getDate() + 1);
                        }
                        document.cookie = key + "=" + escape(value) + "; expires=" + exp.toGMTString();
                    },
                    del: function(key){
                        document.cookie = key + "=''; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
                    },
                    clear: function(){
                        var aCookie = document.cookie.split("; "), l = aCookie.length, aCrumb = [];
                        for (var i = 0; i < l; i++) {
                            aCrumb = aCookie[i].split("=");
                            this.deleteKey(aCrumb[0]);
                        }
                    },
                    getAll: function(){
                        return unescape(document.cookie.toString());
                    }
                };
            }
    })();
})();

