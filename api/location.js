import axios from 'axios';

export default async function handler(req, res) {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: '缺少经纬度参数' 
      });
    }

    // 调用腾讯地图API
    const mapKey = process.env.TENCENT_MAP_KEY;
    const url = `https://apis.map.qq.com/ws/geocoder/v1/`;
    
    const response = await axios.get(url, {
      params: {
        location: `${latitude},${longitude}`,
        key: mapKey,
        get_poi: 1
      }
    });

    if (response.data.status === 0) {
      const result = response.data.result;
      const community = extractCommunity(result);
      
      res.status(200).json({
        success: true,
        data: {
          formattedAddress: result.formatted_addresses.recommend,
          province: result.address_component.province,
          city: result.address_component.city,
          district: result.address_component.district,
          street: result.address_component.street,
          community: community
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: '地理编码失败'
      });
    }
  } catch (error) {
    console.error('定位API错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
}

// 提取小区信息
function extractCommunity(result) {
  const pois = result.pois || [];
  const keywords = ['小区', '花园', '公寓', '社区', '园', '庭'];
  
  for (let poi of pois) {
    for (let keyword of keywords) {
      if (poi.title.includes(keyword)) {
        return poi.title;
      }
    }
  }
  
  return result.address_component.street || '附近区域';
}