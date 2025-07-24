export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        // 获取动物档案列表
        const profiles = await getProfiles(req.query);
        res.status(200).json({
          success: true,
          data: profiles
        });
        break;
        
      case 'POST':
        // 创建新档案
        const newProfile = await createProfile(req.body);
        res.status(201).json({
          success: true,
          data: newProfile
        });
        break;
        
      default:
        res.status(405).json({ error: '方法不被允许' });
    }
  } catch (error) {
    console.error('档案API错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
}

async function getProfiles(query) {
  // 这里可以连接数据库获取数据
  // 暂时返回模拟数据
  return [
    {
      id: '1',
      name: '小橘',
      type: '猫',
      status: '等待领养',
      location: '上海市'
    }
  ];
}

async function createProfile(data) {
  // 这里可以保存到数据库
  return {
    id: Date.now().toString(),
    ...data,
    createTime: new Date().toISOString()
  };
}