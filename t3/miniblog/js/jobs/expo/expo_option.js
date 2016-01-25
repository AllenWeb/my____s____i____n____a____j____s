/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/findit.js");
$import("sina/core/array/isArray.js");
(function(){
    var Expo = {};
    Expo.parkinces = $CLTMSG["CC3801"];//'---请选择服务区域---,园区内,园区外'
    Expo.parkcodes = '0,1,2';
    
    Expo.jobinces = {
        0: $CLTMSG["CC3802"],
        1: $CLTMSG['CC3803'],
        2: $CLTMSG['CC3804']
    };
    Expo.jobcodes = {
        0: '0',
        1: '0,1,2,3,4,5,6,7,8',
        2: '0,1,2,3,4,5,6'
    };
    Expo.workinces = {
        0: {
            0: $CLTMSG['CC3805']
        },
        1: {
            0: $CLTMSG['CC3805'],
            1: $CLTMSG['CC3806'],
            2: $CLTMSG['CC3807'],
            3: $CLTMSG['CC3808'],
            4: $CLTMSG['CC3809'],
            5: $CLTMSG['CC3810'],
            6: $CLTMSG['CC3811'],
            7: $CLTMSG['CC3812'],
            8: $CLTMSG['CC3813']
        },
        2: {
            0: $CLTMSG['CC3805'],
            1: $CLTMSG['CC3814'],
            2: $CLTMSG['CC3814'],
            3: $CLTMSG['CC3814'],
            4: $CLTMSG['CC3814'],
            5: $CLTMSG['CC3814'],
            6: $CLTMSG['CC3814']
        }
    };
    Expo.workcodes = {
        0: {
            0: '0'
        },
        1: {
            0: '0',
            1: '0,1,2,3,4',
            2: '0,1,2',
            3: '0,1,2,3',
            4: '0,1',
            5: '0,1,2,3,4,5',
            6: '0,1,2',
            7: '0,1,2',
            8: '0,1,2,3,4,5'
        },
        2: {
            0: '0',
            1: '0,1,2,3,4',
            2: '0,1,2,3,4',
            3: '0,1,2,3,4',
            4: '0,1,2,3,4',
            5: '0,1,2,3,4',
            6: '0,1,2,3,4'
        }
    };
    Expo.areainces = {
        0: $CLTMSG['CC3815'],
        1: $CLTMSG['CC3816']
    };
    Expo.areacodes = {
        0: '0',
        1: '0,1,2,3,4,5,6'
    };
    Expo.venueinces = {
        0: {
            '0': $CLTMSG['CC3817']
        },
        1: {
            0: $CLTMSG['CC3817'],
            1: $CLTMSG['CC3818'],
            2: $CLTMSG['CC3819'],
            3: $CLTMSG['CC3820'],
            4: $CLTMSG['CC3821'],
            5: $CLTMSG['CC3822'],
            6: $CLTMSG['CC3823']
        }
    };
    Expo.venuecodes = {
        0: {
            0: '0'
        },
        1: {
            0: '0',
            1: '0,1,2,3,4,5,6,7,8',
            2: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19',
            3: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37',
            4: '0,1,2,3,4,5,6,7,8,9,10,11,12',
            5: '0,1,2,3,4,5,6,7,8,9,10,11',
            6: '0,1'
        }
    };
    
    App.ExpoVolunteerJob = function(parkDom, jobDom, workDom, areaDom, venueDom, parkCode, jobCode, workCode, areaCode, venueCode){
        this.parkDom = parkDom;
        this.jobDom = jobDom;
        this.workDom = workDom;
        this.areaDom = areaDom;
        this.venueDom = venueDom;
        this.parkCode = parkCode;
        this.jobCode = jobCode;
        this.workCode = workCode;
        this.areaCode = areaCode;
        this.venueCode = venueCode;
        this.areaSelect = $E('area_select');
        this.venueSelect = $E('venue_select');
        this.init();
    };
    (function(_p){
        _p.init = function(){
            this.loadPark();
            this.loadJob(this.jobCode, this.workCode);
            //this.loadWork();
            this.loadArea(this.areaCode, this.venueCode);
            //this.loadVenue();
            if (!Core.Array.isArray(this.parkDom)) {
                Core.Events.addEvent(this.parkDom, (function(_this){
                    return function(){
                        _this.jobCode = 0;
                        _this.parkCode = _this.parkDom.value;
                        _this.loadJob(0, 0);
                        _this.loadArea(0, 0);
                        
                    };
                })(this), "change");
            }
            else {
                for (var i = 0; i < this.parkDom.length; i++) {
					if (this.parkDom[i].tagName == 'INPUT' && this.parkDom[i].type == 'radio') {
						Core.Events.addEvent(this.parkDom[i], (function(_this,el){
							return function(){
								_this.jobCode = 0;
								_this.parkCode = el.value;
								_this.loadJob(0, 0);
								_this.loadArea(0, 0);
								
							};
						})(this,this.parkDom[i]), "click");
					}
                }
            }
            Core.Events.addEvent(this.jobDom, (function(_this){
                return function(){
                    _this.workCode = 0;
                    _this.jobCode = _this.jobDom.value;
                    _this.loadWork(_this.workCode);
                };
            })(this), "change");
            Core.Events.addEvent(this.areaDom, (function(_this){
                return function(){
                    _this.venueCode = 0;
                    _this.areaCode = _this.areaDom.value;
                    _this.loadVenue(_this.venueCode);
                };
            })(this), "change");
        };
        
        //显示服务区域的列表。
        _p.loadPark = function(){
			var parkcodes = Expo.parkcodes.split(",");
            var parkinces = Expo.parkinces.split(",");
            if (this.parkDom.tagName == 'SELECT') {
				var parkOps = this.parkDom.options;
				if (parkOps.length <= 1) {
					//parkOps[0] = new Option('---请选择园区---', 0);
					for (var i = 0, len = parkcodes.length; i < len; i++) {
						parkOps[parkOps.length] = new Option(parkinces[i], parkcodes[i]);
					}
				}
				if (Core.Array.findit(parkcodes, this.parkCode) != -1) {
					this.parkDom.value = this.parkCode;
				}
				else {
					this.parkDom.value = 0;
				}
			}
        };
        //根据服务区域选择职位。
        _p.loadJob = function(initcode, initnextcode){
            //            if (this.parkCode == "1001") {
            //                this.jobDom.style.display = "none";
            //                this.jobDom.disabled = true;
            //                return false;
            //            }
            //            else {
            //                this.jobDom.disabled = false;
            //                this.jobDom.style.display = "";
            //            }
            var jobOps = this.jobDom.options;
            while (jobOps.length) {
                this.jobDom.remove(0);
            }
            var jobCodes = Expo.jobcodes[this.parkCode].split(",");
            var jobTexts = Expo.jobinces[this.parkCode].split(",");
            for (var i = 0, len = jobCodes.length; i < len; i++) {
                if (jobTexts[i] && jobCodes[i]) {//避免出现空白下拉选项
                    jobOps[jobOps.length] = new Option(jobTexts[i], jobCodes[i]);
                }
            }
            this.jobCode = initcode;
            if (Core.Array.findit(jobCodes, this.jobCode) != -1) {
                this.jobDom.value = this.jobCode;
            }
            else {
                this.jobDom.value = 0;
            }
            this.loadWork(initnextcode);
        };
        //根据职位选择工作。
        _p.loadWork = function(initcode){
            var workOps = this.workDom.options;
            while (workOps.length) {
                this.workDom.remove(0);
            }
            var workCodes = Expo.workcodes[this.parkCode][this.jobCode].split(",");
            var workTexts = Expo.workinces[this.parkCode][this.jobCode].split(",");
            
            for (var i = 0, len = workCodes.length; i < len; i++) {
                if (workTexts[i] && workCodes[i]) {//避免出现空白下拉选项
                    workOps[workOps.length] = new Option(workTexts[i], workCodes[i]);
                }
            }
            this.workCode = initcode;
            if (Core.Array.findit(workCodes, this.workCode) != -1) {
                this.workDom.value = this.workCode;
            }
            else {
                this.workDom.value = 0;
            }
        };
        //根据服务区域选择片区。
        _p.loadArea = function(initcode, initnextcode){
            if (this.parkCode != "1") {//非园区内就隐藏
                this.areaDom.style.display = "none";
                this.areaDom.disabled = true;
                if (this.areaSelect) {
                    this.areaSelect.style.display = 'none';
                }
                this.loadVenue();
                return false;
            }
            else {
                this.areaDom.disabled = false;
                this.areaDom.style.display = "";
                if (this.areaSelect) {
                    this.areaSelect.style.display = '';
                }
            }
            var areaOps = this.areaDom.options;
            while (areaOps.length) {
                this.areaDom.remove(0);
            }
            var areaCodes = Expo.areacodes[this.parkCode].split(",");
            var areaTexts = Expo.areainces[this.parkCode].split(",");
            for (var i = 0, len = areaCodes.length; i < len; i++) {
                if (areaTexts[i] && areaCodes[i]) {//避免出现空白下拉选项
                    areaOps[areaOps.length] = new Option(areaTexts[i], areaCodes[i]);
                }
            }
            this.areaCode = initcode;
            if (Core.Array.findit(areaCodes, this.areaCode) != -1) {
                this.areaDom.value = this.areaCode;
            }
            else {
                this.areaDom.value = 0;
            }
            this.loadVenue(initnextcode);
        };
        //根据片区选择场馆。
        _p.loadVenue = function(initcode){
            if (this.parkCode != "1") {//非园区内就隐藏
                this.venueDom.style.display = "none";
                this.venueDom.disabled = true;
                if (this.venueSelect) {
                    this.venueSelect.style.display = 'none';
                }
                return false;
            }
            else {
                this.venueDom.disabled = false;
                this.venueDom.style.display = "";
                if (this.venueSelect) {
                    this.venueSelect.style.display = '';
                }
            }
            var venueOps = this.venueDom.options;
            while (venueOps.length) {
                this.venueDom.remove(0);
            }
            var venueCodes = Expo.venuecodes[this.parkCode][this.areaCode].split(",");
            var venueTexts = Expo.venueinces[this.parkCode][this.areaCode].split(",");
            for (var i = 0, len = venueCodes.length; i < len; i++) {
                if (venueTexts[i] && venueCodes[i]) {//避免出现空白下拉选项
                    venueOps[venueOps.length] = new Option(venueTexts[i], venueCodes[i]);
                }
            }
            this.venueCode = initcode;
            if (Core.Array.findit(venueCodes, this.venueCode) != -1) {
                this.venueDom.value = this.venueCode;
            }
            else {
                this.venueDom.value = 0;
            }
        };
    })(App.ExpoVolunteerJob.prototype);
})();
