/**
 * @fileoverrever
 * 计算服务器时间与传入时间的显示，页面载入后会本地动态更新服务器时间,返回规则为
 * - 一小时内 : n分钟前
 * - 今天以内 : 今天hh:mm
 * - 本年度内 : mm月dd日 hh:mm
 * - 本年度外 : yy年mm月dd日 hh:mm
 * @author liusong@staff.sina.com.cn
 */

(function(ns){
	var ct = new Date().getTime(), st = scope.$severtime*1000, ys=$CLTMSG["CX0122"], ms = $CLTMSG["CL0304"], ds = $CLTMSG["CL0302"];
	/**
	 * 格式化时间
	 * @param {Object} ft 必选参数，目标时间秒数
	 */
	ns.FormatViewTime = function(ft){
		var nt = new Date().getTime(), fd = new Date((ft = ft * 1000)), y, m, ny, nf, nd, h= [(h = fd.getHours())<10?"0":"",h].join(""), f = [(f = fd.getMinutes())<10?"0":"",f].join(""), d, df;
		st = st + (((df = (nt - ct)) < 0) ? 0 : df);
		ct = nt;
		nt = new Date(st);
		y  = nt.getFullYear();
		m  = nt.getMonth();
		d  = nt.getDate();
        ny = fd.getFullYear();
        nm = fd.getMonth()+1;
        nd = fd.getDate();
		if ((ft - new Date(y, 1, 1).getTime()) > 0) {
			if ((ft - new Date(y, m, d).getTime()) > 0) {
				df = st - ft;
				return df > 3600000? [$CLTMSG["CL1002"], " ", h, ":", f].join("") : [Math.max(Math.ceil(df / 60000),1), $CLTMSG["CL1001"]].join("")
			}
			return [nm, ms, nd, ds, " ", h, ":", f].join("");
		}
		return [ny, ys, nm, ms, nd, ds, " ", h, ":", f].join("");
	};
})(App);