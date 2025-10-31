-- 萌豆语文动画屋 - 更新动画视频URL
-- 创建时间: 2025-10-30
-- 目的：将动画视频URL更新为真实可播放的在线视频资源

-- 更新第一条动画：拼音学习
UPDATE animations 
SET video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    duration = 596,
    updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- 更新第二条动画：汉字学习
UPDATE animations 
SET video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    duration = 653,
    updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- 更新第三条动画：成语故事
UPDATE animations 
SET video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    duration = 15,
    updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- 更新第四条动画：古诗词
UPDATE animations 
SET video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    duration = 15,
    updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- 更新第五条动画：儿歌童谣
UPDATE animations 
SET video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    duration = 60,
    updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440004';

-- 验证更新结果
SELECT 
    id,
    title,
    video_url,
    thumbnail_url,
    duration,
    updated_at
FROM animations 
ORDER BY sort_order;