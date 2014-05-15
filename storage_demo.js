$(document).ready(function(){
	last_visits.init();
	var no_last_pros = '<li><div class="m_box" style="padding:10px;">暂无访问过任何产品</div></li>';
	var pids = encodeURI(JSON.stringify(last_visits.get()));
	$("#history_main ul").html(no_last_pros);
	$.ajax({
		url	:	'/ucenter/last_visit.php',
		type	:	'POST',
		data	:	{'ajax' : 1, 'do_type' : 'get_pro', 'pids' : pids},
		dataType	:	'json',
		async	:	false,
		success	:	function(ret)
		{
			if(ret.flag == 1)
			{
				var htmlDatas = '';
				var jsonMsg = ret.msg;
				for(pid in jsonMsg)
				{
					var disabledDatas = jsonMsg[pid]["fav_or"] ? 'disabled="disabled"' : '';
					var addFavDatas = jsonMsg[pid]["fav_or"] ? '已收藏' : '加入收藏';
					var mobile_num = jsonMsg[pid]["corpinfo_corpinfo_contact_mobile"] ? jsonMsg[pid]["corpinfo_corpinfo_contact_mobile"] : '暂无电话';
					var mobile_href = jsonMsg[pid]["corpinfo_corpinfo_contact_mobile"] ? 'tel:' + jsonMsg[pid]["corpinfo_corpinfo_contact_mobile"] : '###';
					htmlDatas +=
					      '<li class="li-' + jsonMsg[pid]["proid"] + '">' +
					        '<div class="m_box">' +
					          	'<div class="b_pro">' +
						            '<div class="p_pic"><a href="/pd.php?id=' + jsonMsg[pid]["proid"] + '"><img src="' + jsonMsg[pid]["show_image"] + '"></a></div>' +
					            	'<div class="p_text">' +
										'<h3><a href="/pd.php?id=' + jsonMsg[pid]["proid"] + '">' + jsonMsg[pid]["title"] + '</a></h3>' +
										'<p> 供应商：' + '<a href="/ucenter/seller/index.php?id=' + jsonMsg[pid]["corpid"] + '">' + jsonMsg[pid]["corpinfo_corpname"] + '</a> </p>' +
										'<span><em>' + jsonMsg[pid]["pconf_unit_price"] + '</em> （' + jsonMsg[pid]["pconf_min_order"] + jsonMsg[pid]["pconf_price_unit"] + '起售）</span>' +
						            '</div>' +
								'</div>' +
						        '<div class="b_btn">' +
						            '<p><a href="###" class="pro_id" data-pid="' + jsonMsg[pid]["proid"] + '"' + disabledDatas +'><i class="icon_quick icon_hert"></i><span>' + addFavDatas +'</span></a></p>' +
						            '<p class="p_tel"><a href="' + mobile_href + '"><i class="icon_quick icon_tel"></i>' + mobile_num + '</a></p>' +
						            '<p><a href="#"><i class="icon_quick icon_wei"></i>微信联系</a></p>' +
						        '</div>' +
						    '</div>' +
					      '</li>';
				}
				htmlDatas = htmlDatas ? htmlDatas : no_last_pros;
				$("#history_main ul").html(htmlDatas);
			}
		}
	});
});

//最近访问的产品
var last_visits = {
		storageName : 'latest_visits',
		init : function()
		{
			storage.init(this.storageName);
		},
		insert : function(pid)
		{
			if(pid && !this.checkUnique(pid))
			{
				storage.addData(pid);
			}
			else
			{
//				alert('已存在');
			}
		},
		del : function(index)
		{
			if(storage.delData(index))
			{
				alert('删除成功');
			}
		},
		/*
		 * 检测唯一性
		 * @param proid int 唯一标识
		 * @return true表示已存在,false表示没
		 */
		checkUnique : function(proid)
		{
			var local_datas = storage.getDatas(-1);
			for(i in local_datas)
			{
				if(local_datas[i] == proid)
				{
					return true;
				}
			}
			return false;
		},
		get : function(nums)
		{
			nums = arguments[0] ? arguments[0] : 10;
			return storage.getDatas(nums);
		}
};
