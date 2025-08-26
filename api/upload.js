// api/upload.js - 完整版本（模拟文件上传）
module.exports = async function handler(req, res) {
  // 处理 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: '文件上传API服务正常',
      status: 'ok',
      endpoints: {
        POST: '/api/upload - 上传文件'
      },
      supportedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxSize: '5MB',
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
    const { fileData, fileName, fileType } = req.body;
    
    if (!fileData || !fileName) {
      return res.status(400).json({
        success: false,
        error: '缺少文件数据',
        required: ['fileData', 'fileName']
      });
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (fileType && !allowedTypes.includes(fileType)) {
      return res.status(400).json({
        success: false,
        error: '不支持的文件类型',
        allowedTypes
      });
    }

    // 生成唯一的文件ID
    const fileId = generateFileId();
    const fileExtension = getFileExtension(fileName);
    const newFileName = `${fileId}${fileExtension}`;
    
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 使用真实的图片URL（来自Unsplash）
    const sampleImages = [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce',
      'https://images.unsplash.com/photo-1548247416-ec66f4900b2e',
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987',
      'https://images.unsplash.com/photo-1558788353-f76d92427f16',
      'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0'
    ];
    
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    
    // 返回上传结果
    const uploadResult = {
      fileId,
      originalName: fileName,
      fileName: newFileName,
      fileType: fileType || 'image/jpeg',
      fileSize: estimateFileSize(fileData),
      url: `${randomImage}?w=800`,
      thumbnailUrl: `${randomImage}?w=200`,
      uploadTime: new Date().toISOString(),
      status: 'uploaded',
      message: '文件上传成功'
    };

    return res.status(200).json({
      success: true,
      data: uploadResult,
      message: '文件上传成功'
    });

  } catch (error) {
    console.error('文件上传错误:', error);
    return res.status(500).json({
      success: false,
      error: '文件上传失败',
      message: error.message
    });
  }
}

// 生成文件ID
function generateFileId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getTime()).slice(-6);
  return `IMG${year}${month}${day}-${time}`;
}

// 获取文件扩展名
function getFileExtension(fileName) {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '.jpg';
}

// 估算文件大小
function estimateFileSize(fileData) {
  if (typeof fileData === 'string') {
    // 如果是base64字符串，估算大小
    if (fileData.includes('base64,')) {
      const base64 = fileData.split('base64,')[1];
      return Math.round(base64.length * 0.75);
    }
    return fileData.length;
  }
  // 返回一个随机的合理大小（100KB - 2MB）
  return Math.floor(Math.random() * 2000000) + 100000;
}