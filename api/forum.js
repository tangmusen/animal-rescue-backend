// api/forum.js - 使用数据存储的版本
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
        return await handleGetPosts(req, res);
      case 'POST':
        return await handleCreatePost(req, res);
      case 'PUT':
        return await handleUpdatePost(req, res);
      case 'DELETE':
        return await handleDeletePost(req, res);
      default:
        return res.status(405).json({ 
          error: '方法不被允许',
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });
    }
  } catch (error) {
    console.error('论坛API错误:', error);
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      message: error.message
    });
  }
}

// 获取帖子列表
async function handleGetPosts(req, res) {
  try {
    const result = dataStore.getPosts(req.query);
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

// 创建新帖子
async function handleCreatePost(req, res) {
  try {
    const postData = req.body;
    
    const requiredFields = ['title', 'content', 'author'];
    const missingFields = requiredFields.filter(field => !postData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段',
        missingFields,
        requiredFields
      });
    }

    const newPost = dataStore.createPost(postData);
    
    return res.status(201).json({
      success: true,
      data: newPost,
      message: '帖子发布成功'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 更新帖子
async function handleUpdatePost(req, res) {
  try {
    const { id } = req.query;
    const { action, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: '缺少帖子ID'
      });
    }

    // 处理点赞操作
    if (action === 'like') {
      const updatedPost = dataStore.likePost(id);
      return res.status(200).json({
        success: true,
        message: '点赞成功',
        data: updatedPost
      });
    }

    // 普通更新
    const updatedPost = dataStore.updatePost(id, updateData);

    return res.status(200).json({
      success: true,
      data: updatedPost,
      message: '帖子更新成功'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// 删除帖子
async function handleDeletePost(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: '缺少帖子ID'
      });
    }

    const deletedPost = dataStore.deletePost(id);

    return res.status(200).json({
      success: true,
      message: '帖子删除成功',
      deletedId: deletedPost.id
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}