export default async function handler(req, res) {
  // 处理 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetProfiles(req, res);
      case 'POST':
        return await handleCreateProfile(req, res);
      case 'PUT':
        return await handleUpdateProfile(req, res);
      case 'DELETE':
        return await handleDeleteProfile(req, res);
      default:
        return res.status(405).json({ 
          error: '方法不被允许',
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });
    }
  } catch (error) {
    console.error('档案API错误:', error);
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      message: error.message
    });
  }
}

// 获取动物档案列表
async function handleGetProfiles(req, res) {
  const { 
    page = 1, 
    limit = 10, 
    type, 
    status, 
    search 
  } = req.query;

  // 模拟数据
  const mockProfiles = [
    {
      id: '1',
      name: '小橘',
      type: '猫',
      breed: '中华田园猫',
      gender: '公',
      ageEstimate: '6个月',
      weight: '2.5kg',
      furColor: '橘白相间',
      healthStatus: '良好',
      currentStatus: '等待领养',
      rescueDate: '2025-06-28',
      rescueLocation: '上海市杨浦区',
      rescuer: '志愿者小林',
      photos: ['/images/cat1.jpg'],
      createTime: '2025-06-28T10:00:00Z'
    },
    {
      id: '2', 
      name: '小黑',
      type: '狗',
      breed: '拉布拉多',
      gender: '母',
      ageEstimate: '2岁',
      weight: '18kg',
      furColor: '纯黑色',
      healthStatus: '康复中',
      currentStatus: '医疗中',
      rescueDate: '2025-06-25',
      rescueLocation: '北京市朝阳区',
      rescuer: '爱心救助团',
      photos: ['/images/dog1.jpg'],
      createTime: '2025-06-25T14:20:00Z'
    }
  ];

  // 筛选逻辑
  let filteredProfiles = mockProfiles;

  if (type) {
    filteredProfiles = filteredProfiles.filter(p => p.type === type);
  }

  if (status) {
    filteredProfiles = filteredProfiles.filter(p => p.currentStatus === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProfiles = filteredProfiles.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.rescueLocation.toLowerCase().includes(searchLower)
    );
  }

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex);

  return res.status(200).json({
    success: true,
    data: {
      profiles: paginatedProfiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredProfiles.length,
        totalPages: Math.ceil(filteredProfiles.length / limit)
      }
    }
  });
}

// 创建新档案
async function handleCreateProfile(req, res) {
  const profileData = req.body;
  
  const requiredFields = ['name', 'type', 'rescueDate', 'rescueLocation'];
  const missingFields = requiredFields.filter(field => !profileData[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: '缺少必填字段',
      missingFields
    });
  }

  const newProfile = {
    id: generateId(),
    ...profileData,
    createTime: new Date().toISOString()
  };

  return res.status(201).json({
    success: true,
    data: newProfile,
    message: '档案创建成功'
  });
}

// 更新档案
async function handleUpdateProfile(req, res) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: '缺少档案ID'
    });
  }

  const updatedProfile = {
    id,
    ...updateData,
    updateTime: new Date().toISOString()
  };

  return res.status(200).json({
    success: true,
    data: updatedProfile,
    message: '档案更新成功'
  });
}

// 删除档案
async function handleDeleteProfile(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: '缺少档案ID'
    });
  }

  return res.status(200).json({
    success: true,
    message: '档案删除成功',
    deletedId: id
  });
}

// 生成ID
function generateId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getTime()).slice(-6);
  return `A${year}${month}${day}-${time}`;
}
