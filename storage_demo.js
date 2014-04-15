$(document).ready(function(){
	last_visits.init();
	last_visits.insert(getParameterByName('proid'));
	last_visits.del(0);
});

//获取URL的get请求的参数
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
//最近访问的产品
var last_visits = {
		storageName : 'latest_visits',
		init : function()
		{
			storage.init(this.storageName);
		},
		insert : function(pid)
		{
			if(!this.checkUnique(pid))
			{
				storage.addData(pid);
			}
			else
			{
				alert('已存在');
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
			var local_datas = storage.getDatas();
			for(i in local_datas)
			{
				alert(i);
				alert(local_datas[i]);
				if(local_datas[i] == proid)
				{
					return true;
				}
			}
			return false;
		}
};
