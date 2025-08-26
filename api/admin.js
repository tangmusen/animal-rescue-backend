// api/admin.js - 管理API
const dataStore = require('./data-store');

module.exports = async function handler(req, res) {
  // 处理 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 获取操作类型
    const { action } = req.query;

    switch (action) {
      case 'stats':
        return handleGetStats(req, res);
      case 'export':
        return handleExportData(req, res);
      case 'import':
        return handleImportData(req, res);
      case 'reset':
        return handleResetData(req, res);
      default:
        return handleAdminInfo(req, res);
    }
  } catch (error) {
    console.error('管理API错误:', error);
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      message: error.message
    });
  }
}

// 获取管理信息
function handleAdminInfo(req, res) {
  return res.status(200).json({
    success: true,
    message: '动物救助后端管理API',
    endpoints: {
      stats: '/api/admin?action=stats - 获取统计信息',
      export: '/api/admin?action=export - 导出所有数据',
      import: '/api/admin?action=import - 导入数据（POST）',
      reset: '/api/admin?action=reset - 重置数据（需确认）'
    },
    dataStore: {
      posts: dataStore.posts.length,
      profiles: dataStore.profiles.length,
      apiCalls: dataStore.apiCallCount
    },
    timestamp: new Date().toISOString()
  });
}

// 获取统计信息
function handleGetStats(req, res) {
  try {
    const stats = dataStore.getStats();
    
    // 添加更多统计信息
    const enhancedStats = {
      ...stats,
      typeBreakdown: {
        cats: dataStore.profiles.filter(p => p.type === '猫').length,
        dogs: dataStore.profiles.filter(p => p.type === '狗').length,
        others: dataStore.profiles.filter(p => p.type === '其他').length
      },
      statusBreakdown: {
        waiting: dataStore.profiles.filter(p => p.currentStatus === '等待领养').length,
        medical: dataStore.profiles.filter(p => p.currentStatus === '医疗中').length,
        adopted: dataStore.profiles.filter(p => p.currentStatus === '已领养').length,
        community: dataStore.profiles.filter(p => p.currentStatus === '社区猫').length
      },
      emergencyPosts: dataStore.posts.filter(p => p.isEmergency).length,
      totalLikes: dataStore.posts.reduce((sum, p) => sum + p.likes, 0),
      totalComments: dataStore.posts.reduce((sum, p) => sum + p.comments, 0),
      communities: {
        haiHeYuan: dataStore.profiles.filter(p => p.community === '海和院小区').length
      },
      lastUpdate: new Date().toISOString()
    };
    
    return res.status(200).json({
      success: true,
      data: enhancedStats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 导出数据
function handleExportData(req, res) {
  try {
    const exportData = dataStore.exportData();
    
    return res.status(200).json({
      success: true,
      data: exportData,
      message: '数据导出成功'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 导入数据
function handleImportData(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '导入数据需要使用POST方法'
    });
  }
  
  try {
    const importData = req.body;
    
    if (!importData || typeof importData !== 'object') {
      return res.status(400).json({
        success: false,
        error: '无效的导入数据'
      });
    }
    
    const result = dataStore.importData(importData);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: '数据导入成功'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 重置数据
function handleResetData(req, res) {
  const { confirm } = req.query;
  
  if (confirm !== 'yes') {
    return res.status(400).json({
      success: false,
      error: '需要确认重置操作',
      message: '请添加参数 ?action=reset&confirm=yes 来确认重置'
    });
  }
  
  try {
    // 重新初始化数据
    const DataStore = require('./data-store').constructor;
    const newStore = new DataStore();
    
    // 复制新数据到现有存储
    dataStore.posts = newStore.posts;
    dataStore.profiles = newStore.profiles;
    dataStore.activityLog = [];
    dataStore.apiCallCount = 0;
    
    return res.status(200).json({
      success: true,
      message: '数据已重置为初始状态',
      data: {
        posts: dataStore.posts.length,
        profiles: dataStore.profiles.length
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}