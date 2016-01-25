/**
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
$Import('debug_base');
var Jobs = (function(){
	// 由于Jobs应该对于STK没有依赖,所以把Ready放在这里执行
	// FlashSoft 
	var E = function(id) {
        if (typeof id === 'string') {
            return document.getElementById(id);
        }
        else {
            return id;
        }
    };
    var addEvent = function(sNode, sEventType, oFunc) {
        var oElement = E(sNode);
        if (oElement == null) {
            return;
        }
        sEventType = sEventType || 'click';
        if ((typeof oFunc).toLowerCase() != "function") {
            return;
        }
        if (oElement.attachEvent) {
            oElement.attachEvent('on' + sEventType, oFunc);
        }
        else if (oElement.addEventListener) {
            oElement.addEventListener(sEventType, oFunc, false);
        }
        else {
            oElement['on' + sEventType] = oFunc;
        }
    };
	
	var Ready = (function() {
        var funcList = [];
        var inited = false;

        // 执行数组里的函数列表
        var exec_func_list = function() {
            if (inited == true) {return;}
            inited = true;
            for (var i = 0, len = funcList.length; i < len; i++) {
                if ((typeof funcList[i]).toLowerCase() == 'function') {
                    funcList[i].call();
                }
            }
            funcList = [];
        };
        // for IE
        if (document.attachEvent) {
            (function() {
                try {
                    document.documentElement.doScroll("left");
                }
                catch(e) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                exec_func_list();
            })();
        }

        // FireFox and Opera
        else if (document.addEventListener) {
            addEvent(document, 'DOMContentLoaded', exec_func_list);
        }
        // for Other
        else if (/WebKit/i.test(navigator.userAgent)) {
            (function() {
                if (/loaded|complete/.test(document.readyState.toLowerCase())) {
                    exec_func_list();
                    return;
                }
                setTimeout(arguments.callee, 25);
            })();
        }
        addEvent(window, 'load', exec_func_list);

        return function(oFunc) {
            // 如果还没有DOMLoad, 则把方法传入数组
            if (inited == false) {
                funcList.push(oFunc);
            }
            // 如果已经DOMLoad了, 则直接调用
            else {
                if ((typeof oFunc).toLowerCase() == 'function') {
                    oFunc.call();
                }
            }
        };
    })();
	
	
	
	
	function jobCls(){
		var regist_jobs_list = {};
		var run_job_list = [];
		
		/**
		 * job start
		 * @private
		 * @method start_event DOMLoad后执行的start动作
		 * @author FlashSoft | flashsoft@live.com
		 */
		function start_event(){
			var run_index = 0;
			var run_list_len = run_job_list.length;
			var jobName, jobFunc, startTime;
			(function(){
				if (run_list_len > run_index) {
					jobName = run_job_list[run_index];
					jobFunc = regist_jobs_list[jobName];
					startTime = new Date();
					
					if (typeof jobFunc == 'undefined') {
						$Debug.fatal('<b>Job [' + jobName + '] 未定义!</b>', {
							html: true
						});
						return;
					}
					try {
						jobFunc.call();
					} 
					catch (e) {
						$Debug.fatal('<b>Job [' + jobName + '] 执行失败!</b>' +
						'<br/>&nbsp;' +
						e.name +
						'<br/>&nbsp;' +
						(e.message || e.description) +
						(e.fileName ? '<br/>&nbsp;' +
						e.fileName : '') +
						(e.lineNumber ? '<br/>&nbsp;' +
						e.lineNumber : ''), {
							html: true
						});
					}
					finally {
						$Debug.info('<b>Job [' + jobName + '] 执行成功(' + (new Date() - startTime) + '毫秒)</b>', {
							html: true
						});
					}
					
					run_index++;
					setTimeout(arguments.callee, 25);
				}
			})();
		}
		/**
		 * @method jobCls.regist
		 * @param {String} sJobName Job的名字标示
		 * @param {Function} oJobFunc Job的函数引用
		 * @author FlashSoft | flashsoft@live.com
		 */
		this.regist = function(sJobName, oJobFunc){
			if (regist_jobs_list[sJobName] == null) {
				regist_jobs_list[sJobName] = oJobFunc;
			}
			run_job_list.push(sJobName);
		};
		Ready(start_event);
	}
	return new jobCls();
})();


