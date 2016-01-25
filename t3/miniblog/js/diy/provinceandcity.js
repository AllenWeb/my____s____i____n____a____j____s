/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @省市的选择级联
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/findit.js");

(function(){
    var Group = {};
    Group.prov0 = $CLTMSG['CX0078'];
    Group.code0 = "0";
    Group.prov34 = $CLTMSG['CX0079'];
    Group.code34 = "1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18";
    Group.prov11 = $CLTMSG['CX0080'];
    Group.code11 = "1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,28,29";
    Group.prov50 = $CLTMSG['CX0081'];
    Group.code50 = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,81,82,83,84";
    Group.prov35 = $CLTMSG['CX0082'];
    Group.code35 = "1,2,3,4,5,6,7,8,9";
    Group.prov62 = $CLTMSG['CX0083'];
    Group.code62 = "1,2,3,4,5,6,7,8,9,10,24,26,29,30";
    Group.prov44 = $CLTMSG['CX0084'];
    Group.code44 = "1,2,3,4,5,6,7,8,9,12,13,14,15,16,17,18,19,20,51,52,53";
    Group.prov45 = $CLTMSG['CX0085'];
    Group.code45 = "21,22,3,4,5,6,7,8,9,10,11,12";
    Group.prov52 = $CLTMSG['CX0086'];
    Group.code52 = "1,2,3,4,22,23,24,26,27";
    Group.prov46 = $CLTMSG['CX0087'];
    Group.code46 = "1,2,90";
    Group.prov13 = $CLTMSG['CX0088'];
    Group.code13 = "1,2,3,4,5,6,7,8,9,10,11";
    Group.prov23 = $CLTMSG['CX0089'];
    Group.code23 = "1,2,3,4,5,6,7,8,9,10,11,12,27";
    Group.prov41 = $CLTMSG['CX0090'];
    Group.code41 = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17";
    Group.prov42 = $CLTMSG['CX0091'];
    Group.code42 = "1,2,3,5,6,7,8,9,10,11,12,13,28";
    Group.prov43 = $CLTMSG['CX0092'];
    Group.code43 = "1,2,3,4,5,6,7,8,9,10,11,12,13,31";
    Group.prov15 = $CLTMSG['CX0093'];
    Group.code15 = "1,2,3,4,5,6,7,22,25,26,28,29";
    Group.prov32 = $CLTMSG['CX0094'];
    Group.code32 = "1,2,3,4,5,6,7,8,9,10,11,12,13";
    Group.prov36 = $CLTMSG['CX0095'];
    Group.code36 = "1,2,3,4,5,6,7,8,9,10,11";
    Group.prov22 = $CLTMSG['CX0096'];
    Group.code22 = "1,2,3,4,5,6,7,8,24";
    Group.prov21 = $CLTMSG['CX0097'];
    Group.code21 = "1,2,3,4,5,6,7,8,9,10,11,12,13,14";
    Group.prov64 = $CLTMSG['CX0098'];
    Group.code64 = "1,2,3,4";
    Group.prov63 = $CLTMSG['CX0099'];
    Group.code63 = "1,21,22,23,25,26,27,28";
    Group.prov14 = $CLTMSG['CX0100'];
    Group.code14 = "1,2,3,4,5,6,7,8,9,10,23";
    Group.prov37 = $CLTMSG['CX0101'];
    Group.code37 = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17";
    Group.prov31 = $CLTMSG['CX0102'];
    Group.code31 = "1,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20,30";
    Group.prov51 = $CLTMSG['CX0103'];
    Group.code51 = "1,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20,32,33,34";
    Group.prov12 = $CLTMSG['CX0104'];
    Group.code12 = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,21,23,25";
    Group.prov54 = $CLTMSG['CX0105'];
    Group.code54 = "1,21,22,23,24,25,26";
    Group.prov65 = $CLTMSG['CX0106'];
    Group.code65 = "1,2,21,22,23,27,28,29,30,31,32,40,42,43,44";
    Group.prov53 = $CLTMSG['CX0107'];
    Group.code53 = "1,3,4,5,6,23,25,26,27,28,29,31,32,33,34,35";
    Group.prov33 = $CLTMSG['CX0108'];
    Group.code33 = "1,2,3,4,5,6,7,8,9,10,11";
    Group.prov61 = $CLTMSG['CX0109'];
    Group.code61 = "1,2,3,4,5,6,7,8,9,10";
    Group.prov71 = $CLTMSG['CX0110'];
    Group.code71 = "1,2,90";
    Group.prov81 = $CLTMSG['CX0111'];
    Group.code81 = "1";
    Group.prov82 = $CLTMSG['CX0112'];
    Group.code82 = "1";
    Group.prov400 = $CLTMSG['CX0113'];
    Group.code400 = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16";
    Group.prov100 = "";
    Group.code100 = "";
    Group.provinces = $CLTMSG['CX0114'];
    Group.provcodes = "34,11,50,35,62,44,45,52,46,13,23,41,42,43,15,32,36,22,21,64,63,14,37,31,51,12,54,65,53,33,61,71,81,82,400,100";
	/*
	  参数：
	  		provDom : 省节点
	  		cityDom : 市节点
	  		provCode：省初始化码
	  		cityCode：市初始化码
	  		areaDom ：区县节点
	  		areaCode: 区县初始化码
	  		areaDisplayName ：三级城市显示
	  		is3level:true为3级城市
	  		noLimit  :true为去掉不限
	  
	 */
    App.ProvinceAndCity = function(provDom, cityDom, provCode, cityCode, areaDom,areaCode, areaDisplayName, is3level,noLimit){
        this.provDom = provDom;
        this.cityDom = cityDom;
        this.provCode = provCode;
        this.cityCode = cityCode;
        this.areaDom = areaDom;
		this.areaCode = areaCode;
        this.is3level = is3level;
		this.noLimit  = noLimit;
        this.areacache = {};
        this.cache = {};
        if (areaDisplayName) {
            this.areaDisplay = document.getElementsByName(areaDisplayName);
        }
        this.init();
    };
    (function(_p){
        _p.init = function(){
            this.loadProv();
            this.loadCity();
            if (this.is3level) {
                this.loadArea();
            }
            Core.Events.addEvent(this.provDom, (function(_this){
                return function(){
					if (!_this.noLimit) {
						_this.cityCode = 1000;
					}else{
						if (_this.noLimit['city']) {
							_this.cityCode = 1;
						}else{
							_this.cityCode = 1000;
						}
					}
                    _this.provCode = _this.provDom.value;
                    _this.loadCity();
					_this.loadArea();
                };
            })(this), "change");
            Core.Events.addEvent(this.cityDom, (function(_this){
                return function(){
					if (!_this.noLimit) {
						_this.areaCode = 1000;
					}else{
						if (_this.noLimit['area']) {
							_this.areaCode = 1;
						}else{
							_this.areaCode = 1000;
						}
					}
                    _this.cityCode = _this.cityDom.value;
                    _this.loadArea();
                };
            })(this), "change");
        };
        _p.disp = function(){
        };
        
        //显示省的列表。
        _p.loadProv = function(){
            var provOps = this.provDom.options;
            var provcodes = Group.provcodes.split(",");
            var provinces = Group.provinces.split(",");
            if (provOps.length <= 1) {
				if (!(this.noLimit&&this.noLimit.province)) {
					provOps[0] = new Option($CLTMSG['CX0115'], 0);
				}
                for (var i = 0, len = provcodes.length; i < len; i++) {
                    provOps[provOps.length] = new Option(provinces[i], provcodes[i]);
                }
            }
            if (Core.Array.findit(provcodes, this.provCode) != -1) {
                this.provDom.value = this.provCode;
            }
            else {
                this.provDom.value = 0;
            }
        };
        //根据省id来显示城市列表。
        _p.loadCity = function(){
            if (this.provCode == "1001") {
                this.cityDom.style.display = "none";
                this.cityDom.disabled = true;
                return false;
            }
            else {
                this.cityDom.disabled = false;
                this.cityDom.style.display = "";
            }
            var cityOps = this.cityDom.options;
            while (cityOps.length) {
                this.cityDom.remove(0);
            }
            var cityCodes = Group["code" + this.provCode].split(",");
            var cityTexts = Group["prov" + this.provCode].split(",");
			if (!(this.noLimit&&this.noLimit.city)) {
				cityOps[0] = new Option($CLTMSG['CX0116'], 1000);
			}
            for (var i = 0, len = cityCodes.length; i < len; i++) {
                if (cityTexts[i] && cityCodes[i]) {//避免出现空白下拉选项
                    cityOps[cityOps.length] = new Option(cityTexts[i], cityCodes[i]);
                }
            }
            if (Core.Array.findit(cityCodes, this.cityCode) != -1) {
                this.cityDom.value = this.cityCode;
            }
            else {
				if (!this.noLimit) {
					this.cityDom.value = 1000;
				}else{
					if (this.noLimit.city) {
						this.cityDom.value = 1;
					}
				}
            }
        };
        _p.displayarea = function(data, option,areadisp,limit){
			if (areadisp && areadisp.length > 0) {
				if (!data || data.length == 0) {
					for (var m = 0, len = areadisp.length; m < len; m++) {
						areadisp[m].style.display = 'none'
					}
					return false;
				}
				for (var m = 0, len = areadisp.length; m < len; m++) {
					areadisp[m].style.display = ''
				}
			}
			if (!(limit&&limit.area)) {
				option[0] = new Option($CLTMSG['CC5802'], 1000);
			}
            for (var i = 0, len = data.length; i < len; i++) {
                var areaCodes = data[i]['value'];
                var areaTexts = data[i]['text'];
                if (areaTexts && areaCodes) {//避免出现空白下拉选项
                    option[option.length] = new Option(areaTexts, areaCodes);
                }
                //                this.areaDom.value = this.cityCode;
            }
        }
        _p.loadArea = function(){
            if (!this.is3level) {
                return false;
            }
            //            if (this.cityCode == "1001") {
            //                this.areaDom.style.display = "none";
            //                this.areaDom.disabled = true;
            //                return false;
            //            }
            //            else {
            //                this.areaDom.disabled = false;
            //                this.areaDom.style.display = "";
            //            }
            var areaOps = this.areaDom.options;
			var areaDisplay = this.areaDisplay;
			var cache = this.cache;
            while (areaOps.length) {
                this.areaDom.remove(0);
            }
			var _this= this;
            if (!cache[_this.provCode + '_' + _this.cityCode]) {
                App.doRequest({
                    province: this.provDom.value,
                    city: this.cityDom.value
                }, '/person/aj_getarea.php', function(data){
                    _p.displayarea(data, areaOps,areaDisplay,_this.noLimit);
					cache[_this.provCode + '_' + _this.cityCode] = data;
                }, function(){
                })
            }else{
				_p.displayarea(this.cache[this.provCode + '_' + this.cityCode], areaOps,areaDisplay,_this.noLimit);
			}
        };
        _p.loadNewData = function(provCode, cityCode){
            this.provCode = provCode;
            this.cityCode = cityCode;
            this.loadProv();
            this.loadCity();
            if (this.is3level) {
                this.loadArea();
            }
        };
    })(App.ProvinceAndCity.prototype);
})();
