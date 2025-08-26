// api/location.js - 完整版本（包含模拟数据）
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

    // 根据经纬度返回模拟的地址数据
    // 这里使用一些预设的中国主要城市数据
    const mockAddress = getMockAddress(lat, lng);

    return res.status(200).json({
      success: true,
      data: mockAddress,
      coordinates: { latitude: lat, longitude: lng },
      source: 'mock_data_enhanced',
      message: '定位成功'
    });

  } catch (error) {
    console.error('定位API错误:', error);
    
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      message: error.message
    });
  }
}

// 根据经纬度返回模拟地址
function getMockAddress(lat, lng) {
  // 定义一些中国主要城市的数据
  const cities = [
    {
      name: '上海',
      lat: 31.2304,
      lng: 121.4737,
      districts: ['浦东新区', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区'],
      communities: ['张江高科技园区', '陆家嘴金融区', '五角场商圈', '人民广场', '南京路步行街', '外滩']
    },
    {
      name: '北京',
      lat: 39.9042,
      lng: 116.4074,
      districts: ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区', '通州区', '顺义区'],
      communities: ['望京', '中关村', '国贸', '三里屯', '王府井', '西单', '五道口']
    },
    {
      name: '广州',
      lat: 23.1291,
      lng: 113.2644,
      districts: ['天河区', '越秀区', '海珠区', '荔湾区', '白云区', '黄埔区', '番禺区', '花都区'],
      communities: ['珠江新城', '天河城', '北京路', '上下九', '白云山', '小蛮腰']
    },
    {
      name: '深圳',
      lat: 22.5431,
      lng: 114.0579,
      districts: ['福田区', '罗湖区', '南山区', '盐田区', '宝安区', '龙岗区', '龙华区', '坪山区'],
      communities: ['华强北', '深圳湾', '科技园', '东门', '世界之窗', '欢乐谷']
    },
    {
      name: '杭州',
      lat: 30.2741,
      lng: 120.1551,
      districts: ['西湖区', '上城区', '下城区', '江干区', '拱墅区', '滨江区', '萧山区', '余杭区'],
      communities: ['西湖', '武林广场', '钱江新城', '城西', '下沙', '临平']
    }
  ];

  // 找到最近的城市
  let nearestCity = cities[0];
  let minDistance = getDistance(lat, lng, cities[0].lat, cities[0].lng);
  
  for (let city of cities) {
    const distance = getDistance(lat, lng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }

  // 随机选择一个区和小区
  const district = nearestCity.districts[Math.floor(Math.random() * nearestCity.districts.length)];
  const community = nearestCity.communities[Math.floor(Math.random() * nearestCity.communities.length)];
  
  // 生成街道名
  const streets = ['中山路', '解放路', '人民路', '建设路', '文化路', '和平路', '幸福路', '光明路', '青年路', '创新路'];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const streetNumber = Math.floor(Math.random() * 500) + 1;

  return {
    formattedAddress: `${nearestCity.name}市${district}${street}${streetNumber}号`,
    province: nearestCity.name + '市',
    city: nearestCity.name + '市',
    district: district,
    street: street,
    streetNumber: streetNumber + '号',
    community: community,
    communityType: 'residential',
    nearbyLandmark: community,
    postalCode: generatePostalCode(nearestCity.name)
  };
}

// 计算两点之间的距离（简单版）
function getDistance(lat1, lng1, lat2, lng2) {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
}

// 生成邮政编码
function generatePostalCode(cityName) {
  const postalCodes = {
    '上海': '200000',
    '北京': '100000',
    '广州': '510000',
    '深圳': '518000',
    '杭州': '310000'
  };
  return postalCodes[cityName] || '100000';
}