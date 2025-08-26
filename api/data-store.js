// api/data-store.js - 数据存储模块（完整版）
// 使用内存存储，在Vercel重启后会重置
// 如需持久化，可以集成MongoDB、PostgreSQL等数据库

class DataStore {
  constructor() {
    this.posts = [
      {
        id: 'F20250826-001',
        title: '紧急救助！发现受伤小猫',
        content: '在XX路发现一只受伤的小猫，后腿似乎受伤了，无法正常行走。急需医疗救助，有爱心人士愿意帮忙吗？小猫很亲人，应该是被遗弃的家猫。',
        author: '爱心用户A',
        authorId: 'user_001',
        isEmergency: true,
        likes: 12,
        comments: 5,
        images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'],
        location: '上海市杨浦区五角场',
        tags: ['救助', '紧急', '猫', '受伤'],
        createTime: '2025-08-26T10:00:00Z',
        updateTime: '2025-08-26T10:00:00Z'
      },
      {
        id: 'F20250826-002',
        title: '小区发现流浪狗一只',
        content: '小区门口有只流浪狗，看起来很饿，已经投喂了一些食物。狗狗很温顺，不会攻击人，希望能找到收养的好心人。',
        author: '热心居民',
        authorId: 'user_002',
        isEmergency: false,
        likes: 8,
        comments: 3,
        images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'],
        location: '北京市朝阳区望京',
        tags: ['流浪狗', '投喂', '领养'],
        createTime: '2025-08-26T08:00:00Z',
        updateTime: '2025-08-26T08:00:00Z'
      },
      {
        id: 'F20250826-003',
        title: '寻找橘猫主人',
        content: '在公园捡到一只橘猫，很亲人，应该是走失的宠物猫。猫咪很健康，已经做过绝育，希望能帮它找到主人。',
        author: '公园志愿者',
        authorId: 'user_003',
        isEmergency: false,
        likes: 15,
        comments: 7,
        images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400'],
        location: '广州市天河区珠江新城',
        tags: ['寻主', '橘猫', '走失'],
        createTime: '2025-08-26T06:00:00Z',
        updateTime: '2025-08-26T06:00:00Z'
      },
      {
        id: 'F20250826-004',
        title: '需要猫粮狗粮捐赠',
        content: '我们救助站目前收养了20多只流浪猫狗，粮食快用完了，希望爱心人士能捐赠一些猫粮狗粮，感谢大家的支持！',
        author: '阳光救助站',
        authorId: 'user_004',
        isEmergency: false,
        likes: 25,
        comments: 10,
        images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'],
        location: '深圳市福田区',
        tags: ['捐赠', '猫粮', '狗粮', '救助站'],
        createTime: '2025-08-26T05:00:00Z',
        updateTime: '2025-08-26T05:00:00Z'
      },
      {
        id: 'F20250826-005',
        title: '三花猫找领养',
        content: '救助的三花猫，约1岁，已绝育驱虫疫苗齐全，性格温顺亲人，找靠谱领养人，需要签领养协议，定期回访。',
        author: '猫咪救助小组',
        authorId: 'user_005',
        isEmergency: false,
        likes: 18,
        comments: 12,
        images: ['https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400'],
        location: '上海市浦东新区',
        tags: ['领养', '三花猫', '已绝育'],
        createTime: '2025-08-25T14:00:00Z',
        updateTime: '2025-08-25T14:00:00Z'
      }
    ];

    this.profiles = [
      {
        id: 'A20250826-001',
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
        rescueLocation: '上海市杨浦区五角场',
        rescuer: '志愿者小林',
        photos: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400'],
        description: '性格活泼亲人，已做驱虫和疫苗',
        sterilized: '未绝育',
        vaccinated: '已接种',
        contact: '13800138000',
        createTime: '2025-06-28T10:00:00Z'
      },
      {
        id: 'A20250826-002',
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
        photos: ['https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400'],
        description: '车祸受伤，正在恢复中',
        sterilized: '已绝育',
        vaccinated: '已接种',
        contact: '13900139000',
        createTime: '2025-06-25T14:20:00Z'
      },
      {
        id: 'A20250826-003',
        name: '小白',
        type: '猫',
        breed: '英短',
        gender: '母',
        ageEstimate: '1岁',
        weight: '3.2kg',
        furColor: '纯白色',
        healthStatus: '良好',
        currentStatus: '已领养',
        rescueDate: '2025-07-10',
        rescueLocation: '深圳市福田区',
        rescuer: '救助站',
        photos: ['https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400'],
        description: '温柔安静，适合家庭饲养',
        sterilized: '已绝育',
        vaccinated: '已接种',
        contact: '13700137000',
        createTime: '2025-07-10T09:15:00Z'
      }
    ];

    // 添加海和院小区的32只猫数据
    this.profiles.push(...this.generateHaiHeYuanCats());

    this.activityLog = [];
    this.apiCallCount = 0;
  }

  // 生成海和院小区的猫数据
  generateHaiHeYuanCats() {
    const cats = [
      { name: '大黄', color: '黄狸花', sterilized: true, location: '北大门', character: '亲人' },
      { name: '小花', color: '三花', sterilized: true, location: '3号楼下', character: '温顺' },
      { name: '黑仔', color: '纯黑', sterilized: false, location: '地下车库', character: '胆小' },
      { name: '虎子', color: '狸花', sterilized: true, location: '1号楼', character: '活泼' },
      { name: '奶牛', color: '黑白', sterilized: true, location: '花园', character: '慵懒' },
      { name: '橘子', color: '橘猫', sterilized: false, location: '2号楼', character: '贪吃' },
      { name: '小灰', color: '灰色', sterilized: true, location: '垃圾房', character: '警惕' },
      { name: '豹子', color: '狸花', sterilized: true, location: '南门', character: '独立' },
      { name: '雪球', color: '纯白', sterilized: false, location: '4号楼', character: '粘人' },
      { name: '煤球', color: '纯黑', sterilized: true, location: '停车场', character: '安静' },
      { name: '花花', color: '三花', sterilized: true, location: '5号楼', character: '友善' },
      { name: '大白', color: '纯白', sterilized: true, location: '西门', character: '懒散' },
      { name: '斑斑', color: '狸花', sterilized: false, location: '6号楼', character: '顽皮' },
      { name: '咪咪', color: '橘白', sterilized: true, location: '东门', character: '温柔' },
      { name: '球球', color: '黑白', sterilized: true, location: '7号楼', character: '好奇' },
      { name: '毛毛', color: '长毛橘', sterilized: true, location: '8号楼', character: '高冷' },
      { name: '点点', color: '狸花', sterilized: false, location: '9号楼', character: '敏感' },
      { name: '妮妮', color: '三花', sterilized: true, location: '10号楼', character: '活泼' },
      { name: '皮皮', color: '橘猫', sterilized: true, location: '篮球场', character: '调皮' },
      { name: '乖乖', color: '黑白', sterilized: true, location: '小广场', character: '乖巧' },
      { name: '胖胖', color: '橘白', sterilized: false, location: '11号楼', character: '贪吃' },
      { name: '瘦瘦', color: '狸花', sterilized: true, location: '12号楼', character: '机灵' },
      { name: '长腿', color: '黑白', sterilized: true, location: '健身区', character: '优雅' },
      { name: '短腿', color: '橘猫', sterilized: true, location: '儿童区', character: '憨厚' },
      { name: '大王', color: '狸花', sterilized: false, location: '13号楼', character: '霸气' },
      { name: '小乖', color: '三花', sterilized: true, location: '14号楼', character: '文静' },
      { name: '阿福', color: '橘白', sterilized: true, location: '15号楼', character: '福气' },
      { name: '招财', color: '橘猫', sterilized: true, location: '商铺区', character: '亲人' },
      { name: '进宝', color: '黑白', sterilized: false, location: '快递站', character: '机警' },
      { name: '平安', color: '狸花', sterilized: true, location: '保安室', character: '稳重' },
      { name: '健康', color: '三花', sterilized: true, location: '凉亭', character: '健壮' },
      { name: '快乐', color: '橘白', sterilized: true, location: '花坛', character: '欢快' }
    ];

    const catPhotos = [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
      'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400',
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400',
      'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=400',
      'https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=400',
      'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400'
    ];

    return cats.map((cat, index) => ({
      id: `A20250826-HY${String(index + 1).padStart(3, '0')}`,
      name: cat.name,
      type: '猫',
      breed: '中华田园猫',
      gender: index % 3 === 0 ? '公' : '母',
      ageEstimate: `${Math.floor(Math.random() * 5 + 1)}岁`,
      weight: `${(Math.random() * 3 + 2).toFixed(1)}kg`,
      furColor: cat.color,
      healthStatus: '良好',
      currentStatus: '社区猫',
      sterilized: cat.sterilized ? '已绝育' : '未绝育',
      rescueDate: '2025-01-01',
      rescueLocation: `海和院小区${cat.location}`,
      rescuer: '小区志愿者',
      photos: [catPhotos[index % catPhotos.length]],
      community: '海和院小区',
      description: `性格${cat.character}，定期投喂中`,
      vaccinated: cat.sterilized ? '已接种' : '未接种',
      contact: '小区物业：021-12345678',
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  // 生成ID
  generateId(prefix) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getTime()).slice(-6);
    return `${prefix}${year}${month}${day}-${time}`;
  }

  // 记录活动
  logActivity(type, description) {
    this.activityLog.unshift({
      id: this.generateId('LOG'),
      type,
      description,
      timestamp: new Date().toISOString()
    });
    
    // 只保留最近100条
    if (this.activityLog.length > 100) {
      this.activityLog = this.activityLog.slice(0, 100);
    }
  }

  // === 论坛相关方法 ===
  
  getPosts(query = {}) {
    this.apiCallCount++;
    let posts = [...this.posts];
    
    // 筛选
    if (query.emergency === 'true') {
      posts = posts.filter(p => p.isEmergency);
    }
    
    if (query.type) {
      posts = posts.filter(p => 
        p.tags.some(tag => tag.includes(query.type))
      );
    }
    
    if (query.search) {
      const search = query.search.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.content.toLowerCase().includes(search)
      );
    }
    
    // 排序
    posts.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    
    // 分页
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      posts: posts.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: posts.length,
        totalPages: Math.ceil(posts.length / limit)
      }
    };
  }
  
  createPost(data) {
    const newPost = {
      id: this.generateId('F'),
      ...data,
      likes: data.likes || 0,
      comments: data.comments || 0,
      images: data.images || [],
      tags: data.tags || [],
      isEmergency: data.isEmergency || false,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    this.posts.push(newPost);
    this.logActivity('CREATE_POST', `创建帖子: ${newPost.title}`);
    return newPost;
  }
  
  updatePost(id, data) {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('帖子不存在');
    }
    
    this.posts[index] = {
      ...this.posts[index],
      ...data,
      updateTime: new Date().toISOString()
    };
    
    this.logActivity('UPDATE_POST', `更新帖子: ${id}`);
    return this.posts[index];
  }
  
  deletePost(id) {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('帖子不存在');
    }
    
    const deleted = this.posts.splice(index, 1)[0];
    this.logActivity('DELETE_POST', `删除帖子: ${deleted.title}`);
    return deleted;
  }
  
  likePost(id) {
    const post = this.posts.find(p => p.id === id);
    if (!post) {
      throw new Error('帖子不存在');
    }
    
    post.likes++;
    post.updateTime = new Date().toISOString();
    this.logActivity('LIKE_POST', `点赞帖子: ${post.title}`);
    return post;
  }
  
  // === 档案相关方法 ===
  
  getProfiles(query = {}) {
    this.apiCallCount++;
    let profiles = [...this.profiles];
    
    // 筛选
    if (query.type) {
      profiles = profiles.filter(p => p.type === query.type);
    }
    
    if (query.status) {
      profiles = profiles.filter(p => p.currentStatus === query.status);
    }
    
    if (query.search) {
      const search = query.search.toLowerCase();
      profiles = profiles.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.rescueLocation.toLowerCase().includes(search)
      );
    }
    
    if (query.community) {
      profiles = profiles.filter(p => p.community === query.community);
    }
    
    // 排序
    profiles.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    
    // 分页
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      profiles: profiles.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: profiles.length,
        totalPages: Math.ceil(profiles.length / limit)
      }
    };
  }
  
  createProfile(data) {
    const newProfile = {
      id: this.generateId('A'),
      ...data,
      photos: data.photos || [],
      createTime: new Date().toISOString()
    };
    
    this.profiles.push(newProfile);
    this.logActivity('CREATE_PROFILE', `创建档案: ${newProfile.name}`);
    return newProfile;
  }
  
  updateProfile(id, data) {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('档案不存在');
    }
    
    this.profiles[index] = {
      ...this.profiles[index],
      ...data,
      updateTime: new Date().toISOString()
    };
    
    this.logActivity('UPDATE_PROFILE', `更新档案: ${id}`);
    return this.profiles[index];
  }
  
  deleteProfile(id) {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('档案不存在');
    }
    
    const deleted = this.profiles.splice(index, 1)[0];
    this.logActivity('DELETE_PROFILE', `删除档案: ${deleted.name}`);
    return deleted;
  }
  
  // === 统计方法 ===
  
  getStats() {
    return {
      postsCount: this.posts.length,
      profilesCount: this.profiles.length,
      emergencyCount: this.posts.filter(p => p.isEmergency).length,
      adoptedCount: this.profiles.filter(p => p.currentStatus === '已领养').length,
      waitingCount: this.profiles.filter(p => p.currentStatus === '等待领养').length,
      medicalCount: this.profiles.filter(p => p.currentStatus === '医疗中').length,
      communityCount: this.profiles.filter(p => p.currentStatus === '社区猫').length,
      apiCalls: this.apiCallCount,
      recentActivity: this.activityLog.slice(0, 10),
      totalLikes: this.posts.reduce((sum, p) => sum + p.likes, 0),
      totalComments: this.posts.reduce((sum, p) => sum + p.comments, 0)
    };
  }
  
  // === 数据导入导出 ===
  
  exportData() {
    return {
      exportTime: new Date().toISOString(),
      posts: this.posts,
      profiles: this.profiles,
      stats: this.getStats()
    };
  }
  
  importData(data) {
    if (data.posts) {
      this.posts = data.posts;
    }
    if (data.profiles) {
      this.profiles = data.profiles;
    }
    this.logActivity('IMPORT_DATA', '导入数据成功');
    return {
      postsImported: data.posts?.length || 0,
      profilesImported: data.profiles?.length || 0
    };
  }
}

// 创建单例
const dataStore = new DataStore();

module.exports = dataStore;