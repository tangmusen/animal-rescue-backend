import axios from 'axios';

export default async function handler(req, res) {
  // 处理 CORS 预检请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 支持 GET 请求用于测试
  if (req.method === 'GET') {
    return res.status(200).json({
      message: '定位API服务正常',
      status: 'running',
      endpoints: {
        POST: '/api/location - 获取位置信息',
        params: ['latitude', 'longitude']
      },
      time: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: '只支持 POST 请求',
      allowedMethods: ['POST', 'GET', 'OPTIONS'] 
    });
  }

  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: '缺少经纬度参数',
        required: {
          latitude: 'number - 纬度',
          longitude: 'number - 经度'
        },
        example: {
          latitude: 31.2304,
          longitude: 121.4737
        }
      });
    }

    // 验证经纬度格式
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        error: '经纬度格式错误',
        received: { latitude, longitude }
      });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        error: '经纬度范围错误',
        valid_range: {
          latitude: '[-90, 90]',
          longitude: '[-180, 180]'
        }
      });
    }

    // 调用腾讯地图API
    const mapKey = process.env.TENCENT_MAP_KEY;
    
    if (!mapKey) {
      // 如果没有配置API密钥，返回模拟数据
      console.warn('未配置腾讯地图API密钥，返回模拟数据');
      return res.status(200).json({
        success: true,
        data: {
          formattedAddress: '上海市浦东新区张江高科技园区',
          province: '上海市',
          city: '上海市',
          district: '浦东新区', 
          street: '张江路',
          streetNumber: '',
          community: '张江小区',
          communityType: 'mock_data',
          nearbyPOIs: [],
          adCode: '310115',
          cityCode: '021'
        },
        coordinates: { latitude: lat, longitude: lng },
        source: 'mock_data',
        message: '请配置TENCENT_MAP_KEY环境变量以使用真实地理编码服务'
      });
    }

    const url = 'https://apis.map.qq.com/ws/geocoder/v1/';
    
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lng}`,
        key: mapKey,
        get_poi: 1,
        poi_options: 'address_format=short;radius=1000;page_size=20;page_index=1;policy=2'
      },
      timeout: 10000
    });

    if (response.data.status === 0) {
      const result = response.data.result;
      const addressComponent = result.address_component;
      
      // 提取小区信息
      const community = extractCommunity(result);
      
      return res.status(200).json({
        success: true,
        data: {
          formattedAddress: result.formatted_addresses.recommend,
          province: addressComponent.province,
          city: addressComponent.city,
          district: addressComponent.district,
          street: addressComponent.street,
          streetNumber: addressComponent.street_number,
          community: community.name,
          communityType: community.type,
          nearbyPOIs: result.pois.slice(0, 5),
          adCode: result.ad_info.adcode,
          cityCode: result.ad_info.city_code
        },
        coordinates: { latitude: lat, longitude: lng },
        source: 'tencent_map_api'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: '地理编码失败',
        code: response.data.status,
        message: response.data.message
      });
    }
  } catch (error) {
    console.error('定位API错误:', error);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        error: '请求超时',
        message: '腾讯地图API响应超时'
      });
    }
    
    if (error.response) {
      return res.status(500).json({
        success: false,
        error: '腾讯地图API错误',
        status: error.response.status,
        message: error.response.data
      });
    }
    
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      message: error.message
    });
  }
}

// 提取小区信息
function extractCommunity(result) {
  const pois = result.pois || [];
  
  // 小区关键词
  const communityKeywords = [
    '小区', '花园', '公寓', '社区', '园', '庭', '居', '苑', '城', '府', '广场'
  ];
  
  // 小区分类
  const communityCategoryKeywords = [
    '房地产', '住宅区', '小区', '公寓', '写字楼'
  ];

  // 查找小区类型POI
  for (let poi of pois) {
    // 按分类查找
    const matchCategory = communityCategoryKeywords.some(keyword => 
      poi.category.includes(keyword)
    );
    
    // 按名称查找
    const matchName = communityKeywords.some(keyword => 
      poi.title.includes(keyword)
    );

    if (matchCategory || matchName) {
      return {
        name: poi.title,
        type: 'poi_matched',
        distance: poi._distance || 0,
        category: poi.category
      };
    }
  }

  // 从地址中提取
  const address = result.formatted_addresses.recommend;
  const communityFromAddress = extractCommunityFromAddress(address);
  
  if (communityFromAddress) {
    return {
      name: communityFromAddress,
      type: 'address_extracted',
      distance: 0
    };
  }

  // 使用街道信息作为fallback
  return {
    name: result.address_component.street || '未知区域',
    type: 'fallback',
    distance: 0
  };
}

// 从地址字符串提取小区名
function extractCommunityFromAddress(address) {
  const patterns = [
    /([^省市区县街道路]+(?:小区|花园|公寓|社区|苑|园|城|府|庭|居))/g,
    /([^省市区县街道路]+(?:一期|二期|三期|四期|五期|A区|B区|C区|D区))/g
  ];

  for (let pattern of patterns) {
    const matches = address.match(pattern);
    if (matches && matches.length > 0) {
      // 返回最长的匹配结果
      return matches.sort((a, b) => b.length - a.length)[0];
    }
  }

  return null;
}
