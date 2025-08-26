// api/profiles.js - 使用数据存储的版本
const dataStore = require('./data-store');

module.exports = async function handler(req, res) {
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
  try {
    const result = dataStore.getProfiles(req.query);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 创建新档案
async function handleCreateProfile(req, res) {
  try {
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

    const newProfile = dataStore.createProfile(profileData);

    return res.status(201).json({
      success: true,
      data: newProfile,
      message: '档案创建成功'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 更新档案
async function handleUpdateProfile(req, res) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: '缺少档案ID'
      });
    }

    const updatedProfile = dataStore.updateProfile(id, updateData);

    return res.status(200).json({
      success: true,
      data: updatedProfile,
      message: '档案更新成功'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// 删除档案
async function handleDeleteProfile(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: '缺少档案ID'
      });
    }

    const deletedProfile = dataStore.deleteProfile(id);

    return res.status(200).json({
      success: true,
      message: '档案删除成功',
      deletedId: deletedProfile.id
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}