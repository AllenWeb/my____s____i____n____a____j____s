var $Debug = (function(){
	var contentList = [];
	// 添加一条信息
	function add_to_content(sText, oOpts, sCMD){
		var key;
		var text = sText != null ? sText : '';
		
		var opts = {
			color: null,
			bgcolor: null,
			html: null
		};
		var cmd = sCMD != null ? sCMD : 'log';
		oOpts = oOpts != null ? oOpts : {};
		for (key in opts) {
			if (oOpts[key] != null) {
				opts[key] = oOpts[key];
			}
		}
		contentList.push({
			label: text,
			cmd: cmd,
			opts: opts,
			time: new Date()
		});
	}
	function debug_proto(sText, oOpts){
		add_to_content(sText, oOpts, 'log');
	}
	debug_proto.fatal = function(sText, oOpts){
		add_to_content(sText, oOpts, 'fatal');
	};
	debug_proto.error = function(sText, oOpts){
		add_to_content(sText, oOpts, 'error');
	};
	debug_proto.warning = function(sText, oOpts){
		add_to_content(sText, oOpts, 'warning');
	};
	debug_proto.info = function(sText, oOpts){
		add_to_content(sText, oOpts, 'info');
	};
	debug_proto.log = function(sText, oOpts){
		add_to_content(sText, oOpts, 'log');
	};
	debug_proto.clear = function(){
		contentList = [];
	};
	debug_proto.contentList = contentList;
	return debug_proto;
})();
