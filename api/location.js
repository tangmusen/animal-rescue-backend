// api/location.js - 修正版本
const axios = require('axios');

module.exports = async function handler(req, res) {
  // 处理 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 支持 GET 请求用于测试
  if (req.method === 'GET') {
    return res.status(200).json({
      message: '定位API服务正常运行',
      status: 'ok',
      endpoints: {
        POST: '/api/location - 获取位置信息'
      },
      time: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: '只支持 POST 请求',
      allowedMethods: ['GET', 'POST', 'OPTIONS'] 
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
          communityType: 'mock_data'
        },
        coordinates: { latitude: lat, longitude: lng },
        source: 'mock_data',
        message: '请配置TENCENT_MAP_KEY环境变量'
      });
    }

    const url = 'https://apis.map.qq.com/ws/geocoder/v1/';
    
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lng}`,
        key: mapKey,
        get_poi: 1
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
          streetNumber: addressComponent.street_number || '',
          community: community.name,
          communityType: community.type
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
        error: '请求超时'
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
  
  const communityKeywords = [
    '小区', '花园', '公寓', '社区', '园', '庭', '居', '苑', '城', '府'
  ];
  
  // 查找小区类型POI
  for (let poi of pois) {
    for (let keyword of communityKeywords) {
      if (poi.title.includes(keyword)) {
        return {
          name: poi.title,
          type: 'poi_matched'
        };
      }
    }
  }

  // 使用街道信息作为fallback
  return {
    name: result.address_component.street || '未知区域',
    type: 'fallback'
  };
}
