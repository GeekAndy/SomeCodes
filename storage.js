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
		if(typeof(storageDatasVals[index]) != 'undefined')
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
	 *@param counts int 表示从仓库中取出的个数 >= 1, -1 -> all
	 *@param offset int 相对于开始的偏移量
	 *@param orderby string Enum('DESC', 'ASC') 正序还是倒序
	 */
	function getDatas(counts, offset, orderby)
	{
		counts = arguments[0] > 0 ? ( arguments[0] >= storageDatasLength ? storageDatasLength : arguments[0]) : ( arguments[0] == -1 ? storageDatasLength : 0 );
		offset = arguments[1] ? arguments[1] : 0;
		orderby = arguments[2] ? arguments[2].toUpperCase() : 'DESC';
		var allDatas = {};
		var m = 0;
		switch(orderby)
		{
			case 'ASC':
			{
				for(i = 0; i < storageDatasLength; i ++)
				{
					allDatas[m] = [storageDatasKeys[i], storageDatasVals[storageDatasKeys[i]]];
					m++;
				}
				break;
			}
			case 'DESC':
			{
				for(i = storageDatasLength - 1; i >= 0; i --)
				{
					allDatas[m] = [storageDatasKeys[i], storageDatasVals[storageDatasKeys[i]]];
					m++;
				}
				break;
			}
			default:
			{
				return false;
			}
		}
		var returnDatas = {};
		var offsetCounts = offset + counts;
		var i =0;
		for(j = offset; j < offsetCounts; j ++)
		{
			returnDatas[i] = allDatas[j][1];
			i++;
		}
		return returnDatas;
	}
	
	return {
		init : init,
		addData : addData,
		delData : delData,
		getData : getData,
		getDatas : getDatas
	}
})();
