//首先要进行本地仓库初始化
//storage.init('storageName');

/**
 * 定义一个JS本地仓库类(HTML5)
 * @author Andy(xuchenggang@makepolo.com)
 */
var storage = (function(){
	
	var storageName = '',
		storageDatasKeyVal = {'key' : null, 'val' : null},
		storageDatasVals = null,
		storageDatasKeys = null,
		storageDatasLength = 0;
	
	//初始化类
	//@param name string
	function init(name)
	{
		if(typeof(localStorage) == 'undefined')
		{
			alert('浏览器不支持localStorage对象');
			return false;
		}
		storageName = name;
		storageDatasKeyVal = JSON.parse(localStorage.getItem(storageName)) ? JSON.parse(localStorage.getItem(storageName)) : storageDatasKeyVal;
		storageDatasKeys = storageDatasKeyVal.key ? storageDatasKeyVal.key : {};
		storageDatasVals = storageDatasKeyVal.val ? storageDatasKeyVal.val : {};
		storageDatasLength = Object.keys(storageDatasKeys).length;
		//alert(storageDatasLength);
	}
	
	/**
	 * 供私有方法调用
	 */
	function finish()
	{
		try
		{
			storageDatasLength = Object.keys(storageDatasKeys).length;
			storageDatasKeyVal.key = storageDatasKeys;
			storageDatasKeyVal.val = storageDatasVals;
			localStorage.setItem(storageName, JSON.stringify(storageDatasKeyVal));
			return true;
		}
		catch(e)
		{
			console.log("Storage failed: " + e);
			return false;
		}
	}
	
	/**
	 *返回最大索引
	 * @return int
	 */
	function getMaxKey()
	{
		var maxKey = -1;
		for(i = 0; i < storageDatasLength; i ++)
		{
			maxKey = maxKey < storageDatasKeys[i] ? storageDatasKeys[i] : maxKey;
		}
		return maxKey;
	}
	
	//私有
	function delIndexKey(index)
	{
		var needKeys = {};
		var j = 0;
		for(i = 0; i < storageDatasLength; i ++)
		{
			if(storageDatasKeys[i] != index)
			{
				needKeys[j] = storageDatasKeys[i];
				j++;
			}
		}
		storageDatasKeys = needKeys;
	}
	
	/**
	 * 增加数据
	 * data多类型数据都可以(string,init,json)
	 */
	function addData(data)
	{
		storageDatasKeys[storageDatasLength] = getMaxKey() + 1;
		storageDatasVals[getMaxKey() + 1] = data;
		if(finish())
		{
			return true;
		}
		return false;
	}
	
	//根据索引删除值
	function delData(index)
	{
		if(storageDatasVals[index])
		{
			delIndexKey(index);
			delete storageDatasVals[index];
			if(!finish())
			{
				return false;
			}
		}
		return true;
	}
	
	/**
	 * 根据索引取值
	 * @return bool false Or multi type value
	 */
	function getData(index)
	{
		if(typeof(storageDatasVals[index]) != 'undefined')
		{
			return storageDatasVals[index];
		}
		return false;
	}
	
	/**
	 * 返回json格式串
	 *@param start int 表示仓库中相应数据的索引
	 *@param length int 取多少条
	 */
	function getDatas(start, length)
	{
		length = arguments[1] ? arguments[1] : (arguments[0] ? 1 : storageDatasLength);
		start = arguments[0] ? arguments[0] : 0;
		//alert(start + ', ' + length);
		var needDatas = {};
		for(i = 0; i < length; i ++)
		{
			if(storageDatasKeys[i] >= 0 && storageDatasKeys[i] >= start)
			{
				needDatas[storageDatasKeys[i]] = storageDatasVals[storageDatasKeys[i]];
			}
		}
		return needDatas;
	}
	
	return {
		init : init,
		addData : addData,
		delData : delData,
		getData : getData,
		getDatas : getDatas
	}
})();
