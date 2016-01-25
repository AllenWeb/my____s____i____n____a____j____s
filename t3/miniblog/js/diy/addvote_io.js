/**
 * @author wanglaing3
 *发布器投票弹层HTML
 */
$import("jobs/base.js");
App.voteHtml = function(type,json){
    var html = [];

    html.push('	<div class="layerBoxCon1">');
    html.push('		<div id="tab" class="layervote">');
    html.push('			<div class="layerArrow"></div>');
    html.push('			<div class="layerMedia_close"><a id="close" title="关闭" class="close" href="javascript:void(0);"></a></div>');
    html.push('			<div class="lv_nav">');
    html.push('				<ul>');
    html.push('					<li nav="new" class="cur"><span>新建投票</span></li>');
    html.push('					<li nav="list"><span>我的投票库</span></li>');
    html.push('				</ul>');
    html.push('			</div>');
    html.push('			<div tab="new" class="lv_form">');
    html.push('				<form id="form">');
    //start create vote
    html.push('<fieldset>');
    
    //start error tip
    html.push('<div id="tip" class="errorLayer" style="display:none;">');
    html.push('	<div class="top"></div>');
    html.push('	<div class="mid">');
    html.push('		<div id="tip_close" class="close">x</div>');
    html.push('		<div class="conn">');
    html.push('			<p id="tip_title" class="bigtxt">密码错误</p>');
    html.push('			<p id="tip_msg" class="stxt">请检查密码大小写是否正确。</p>');
    html.push('		</div>');
    html.push('	</div>');
    html.push('	<div class="bot"></div>');
    html.push('</div>');
    //end error tip
    
    html.push('	<p><label for="">创建标题：</label><input act="title" value="111" type="text" class="lv_input1"></p>');
    html.push('	<p>投票选项：<span class="gray9">可设置20项，每项最多20个汉字</span></p>');
    html.push('	<p class="lv_mg"><input act="vitem" type="text" class="lv_input1"></p>');
    html.push('	<p class="lv_mg"><input act="vitem" type="text" class="lv_input1"></p>');
    html.push('	<p class="lv_mg"><input act="vitem" type="text" class="lv_input1"></p>');
    html.push('	<p class="lv_mg"><input act="vitem" type="text" class="lv_input1"></p>');
    html.push('	<p class="lv_mg"><input act="vitem" type="text" class="lv_input1"></p>');
    html.push('	<p class="lv_mg"><span class="vote_addicon"></span><a id="add" href="javascript:void(0);">增加选项</a></p>');
    html.push('	<p>');
    html.push('		<label for="">投票类型：</label>');
    html.push('		<select id="vote_class" act="class">');
    html.push('			<option value="1" selected>最多选择1项</option>');
    html.push('		</select>');
    html.push('	</p>');
    html.push('	<p>');
    html.push('		<label for="">截止时间：</label>');
    html.push('		<input id="vote_dd" act="dd" type="text" class="lv_calendar" value="2010-02-25">');
    html.push('		<select id="vote_hh" act="hh">');
    html.push('		</select>时');
    html.push('		<select id="vote_mm" act="mm">');
    html.push('		</select>分</p>');
    html.push('	<div class="lv_btn"><a id="save" class="newbbtngrn" href="javascript:void(0);"><em>保存</em></a><span class="gray9">保存后可增加选项，不可修改。</span></div>');
    html.push('</fieldset>');
    //end create vote
    html.push('				</form>');
    
    //start error
    html.push('				<div id="save_error" class="lvtip" style="display:none;">');
    html.push('					<div class="lvtip_cont"> <img align="absmiddle" title="" alt="" src="../../images/common/PY_ib.gif" class="PY_ib PY_ib_1">');
    html.push('						<div class="lvtip_conttext">');
    html.push('							<p class="fb">保存失败！</p>');
    html.push('							<p id="save_err_msg">或者含非法内容，请返回修改</p>');
    html.push('						</div>');
    html.push('					</div>');
    html.push('					<div class="lvtip_btn"><a id="save_back" class="newbbtngrn" href="javascript:void(0);"><em>返回上一步</em></a></div>');
    html.push('				</div>');
    //end error
    html.push('			</div>');
    
    //start list
    html.push('<div tab="list" style="display:none" class="myvote">');
    html.push('	<h3>下面是你发起的投票，可以选择某个投票添加到微博：</h3>');
    html.push(' <div id="vote_list">');
    //start page 1
    /*
     html.push('  <div page="1">');
     html.push('	  <ul class="lv_textlist">');
     html.push('		<li>');
     html.push('			<label><input act="v_item" vid="100001" name="v_item" link="http://123.com.cn" type="radio">');
     html.push('			投票选项内容详情选项</label>');
     html.push('		</li>');
     html.push('		<li class="sepcil">');
     html.push('			<label><input act="v_item" vid="100002" name="v_item" link="http://123.com.cn" type="radio">');
     html.push('			投票选项内容详情选项</label>');
     html.push('		</li>');
     html.push('		<li>');
     html.push('			<label><input act="v_item" vid="100003" name="v_item" link="http://123.com.cn" type="radio">');
     html.push('			投票选项内容详情选项</label>');
     html.push('		</li>');
     html.push('	  </ul>');
     html.push('  </div>');
     */
    //end page 1
    html.push(' </div>');
    html.push('	<div class="lv_page"> <a id="list_up" style="display:none;" href="javascript:void(0);"><em>&lt;&lt;</em>上一页</a> <a id="list_next" style="display:none;" href="javascript:void(0);">下一页<em>&gt;&gt;</em></a> </div>');
    html.push('	<div class="MIB_linedot1"></div>');
    html.push('	<div class="lv_btn"><a id="list_add" class="newbbtngrn" href="#"><em>添加</em></a></div>');
    html.push('</div>');
    
    //end list
    html.push('		</div>');
    html.push('	</div>');
    
    
    
    //vote list html
    
    var list = [];
    //page 2
    list.push('  <div page="1">');
    list.push('	  <ul class="lv_textlist">');
    list.push('		<li>');
    list.push('			<label><input act="v_item" name="v_item" link="http://123.com.cn" type="radio">');
    list.push('			投票选项内容详情选项2</label>');
    list.push('		</li>');
    list.push('		<li class="sepcil">');
    list.push('			<label><input act="v_item" name="v_item" link="http://123.com.cn" type="radio">');
    list.push('			投票选项内容详情选项2</label>');
    list.push('		</li>');
    list.push('		<li>');
    list.push('			<label><input act="v_item" name="v_item" link="http://123.com.cn" type="radio">');
    list.push('			投票选项内容详情选项2</label>');
    list.push('		</li>');
    list.push('	  </ul>');
    list.push('  </div>');
    
    
    if (type == 'create') {
        json.data = html.join('');
    }
    if (type == 'mylist') {
        json.data = list.join('');
    }

	return json;


}
