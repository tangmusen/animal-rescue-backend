// api/forum.js - 修正版本
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
  const { 
    page = 1, 
    limit = 10,
    type,
    emergency
  } = req.query;

  // 模拟数据
  const mockPosts = [
    {
      id: '1',
      title: '紧急救助！发现受伤小猫',
      content: '在XX路发现一只受伤的小猫，急需医疗救助，有爱心人士愿意帮忙吗？',
      author: '爱心用户A',
      authorId: 'user_001',
      isEmergency: true,
      likes: 12,
      comments: 5,
      images: ['/images/emergency1.jpg'],
      location: '上海市杨浦区',
      tags: ['救助', '紧急', '猫'],
      createTime: '2025-07-23T10:00:00Z',
      updateTime: '2025-07-23T10:00:00Z'
    },
    {
      id: '2',
      title: '小区发现流浪狗一只',
      content: '小区门口有只流浪狗，看起来很饿，已经投喂了一些食物',
      author: '热心居民',
      authorId: 'user_002',
      isEmergency: false,
      likes: 8,
      comments: 3,
      images: ['/images/dog1.jpg'],
      location: '北京市朝阳区',
      tags: ['流浪狗', '投喂'],
      createTime: '2025-07-23T08:00:00Z',
      updateTime: '2025-07-23T08:00:00Z'
    },
    {
      id: '3',
      title: '寻找橘猫主人',
      content: '在公园捡到一只橘猫，很亲人，应该是走失的宠物猫',
      author: '公园志愿者',
      authorId: 'user_003',
      isEmergency: false,
      likes: 15,
      comments: 7,
      images: ['/images/cat1.jpg'],
      location: '广州市天河区',
      tags: ['寻主', '橘猫', '走失'],
      createTime: '2025-07-23T06:00:00Z',
      updateTime: '2025-07-23T06:00:00Z'
    }
  ];

  // 筛选逻辑
  let filteredPosts = mockPosts;

  if (emergency === 'true') {
    filteredPosts = filteredPosts.filter(p => p.isEmergency);
  }

  if (type) {
    filteredPosts = filteredPosts.filter(p => 
      p.tags.some(tag => tag.includes(type))
    );
  }

  // 按时间排序
  filteredPosts.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return res.status(200).json({
    success: true,
    data: {
      posts: paginatedPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit)
      }
    }
  });
}

// 创建新帖子
async function handleCreatePost(req, res) {
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

  const newPost = {
    id: generateId(),
    ...postData,
    likes: 0,
    comments: 0,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  };

  return res.status(201).json({
    success: true,
    data: newPost,
    message: '帖子发布成功'
  });
}

// 更新帖子
async function handleUpdatePost(req, res) {
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
    return res.status(200).json({
      success: true,
      message: '点赞成功',
      data: {
        id,
        likes: (updateData.likes || 0) + 1
      }
    });
  }

  // 处理评论操作
  if (action === 'comment') {
    return res.status(200).json({
      success: true,
      message: '评论成功',
      data: {
        id,
        comments: (updateData.comments || 0) + 1
      }
    });
  }

  // 普通更新
  const updatedPost = {
    id,
    ...updateData,
    updateTime: new Date().toISOString()
  };

  return res.status(200).json({
    success: true,
    data: updatedPost,
    message: '帖子更新成功'
  });
}

// 删除帖子
async function handleDeletePost(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: '缺少帖子ID'
    });
  }

  return res.status(200).json({
    success: true,
    message: '帖子删除成功',
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
  return `F${year}${month}${day}-${time}`;
}
