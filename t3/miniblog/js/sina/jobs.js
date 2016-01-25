/*
 * Copyright (c) 2007, Sina Inc. All rights reserved. 
 */
/** 
 * @fileoverview 任务管理类
 */
$import("sina/sina.js");
$import("sina/trace_base.js");
$import("sina/core/array/each.js");
/**
 * @class 任务管理类，
 * 		1. 提供注册job的方法
 *		2. 延时顺序执行job的功能
 *		3. 对job的出错保护，避免影响后续job的执行
 *		4. 单个job的执行时间
 * @author stan | chaoliang@staff.sina.com.cn
 * @since 2008.01.05
 * @example
  		$registJob("testjob", function(){
  			$Debug("testjob is called!");
  		});
  		var sampleJob = new Jobs();
  		sampleJob.add("testjob");
  		sampleJob.start();	//testjob is called!
 */
function Jobs(){
	this._jobTable = [];
}
Jobs.prototype = {
	_registedJobTable : {},
	initialize: function(){
	},
	_registJob : function (jobName, rel){
		this._registedJobTable[jobName] = rel;
	},
	/**
	 * push a job to the job queue
	 * @param {String} jobName
	 */
	add : function (jobName) {
		this._jobTable.push(jobName);
	},
	start : function () {
		var jobs = this._jobTable;
		var regJobs = this._registedJobTable;
		var i = 0;
		var joblen = this._jobTable.length;
		var getTime = function() {return new Date().valueOf();};
		var interNum = window.setInterval(function () {
			if(i >= joblen){
				clearInterval(interNum);
				return;
			}
			var jobName = jobs[i];
			var job = regJobs[jobName];
			i++;
			if(typeof job == 'undefined'){
				$Debug.error("<b>[" + jobName + "# is undefiend!!!</b>", {'html':true});
				return;
			}
			var _try = true;
			var _start = getTime();
			try{
				job.call();
			}catch(e){
				$Debug.error("<b>[" + jobName + "] failed!!!</b>", {'html':true});
				_try = false;
			}finally{
				if (_try) {
					var _end = getTime();
					$Debug.info("[" + jobName + "] done in " + (_end - _start) + "ms.");
				}
			}
		},10);
	},
	/**
	 * 单独呼叫某一个job
	 */
	call : function(jobName, args) {
		if(typeof this._registedJobTable[jobName] != "undefined"){
			this._registedJobTable[jobName].apply(this, args);		
		}else{
			$Debug("#" + jobName + "# is undefined!!!", {
					"color": "#900",
					"bgColor": "#FFF;"
				});
		}
	}
};
/**
 * 将一个自定义的过程定义为job
 * @param {String} name	job名字
 * @param {Function} rel job的引用，
 */
$registJob = function(name, rel){
	Jobs.prototype._registJob(name, rel);
};

$callJob = function(name){
	var args = [];
	if(arguments.length > 1){
		Core.Array.foreach(arguments, function(v,i){
			args[i] = v;
		});
		args.shift();
	}
	Jobs.prototype.call(name, args);
};
