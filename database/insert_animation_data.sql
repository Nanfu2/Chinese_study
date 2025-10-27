-- 萌豆语文动画屋 - 插入动画测试数据
-- 创建时间: 2025-10-27

-- 插入一条完整的动画数据
INSERT INTO animations (
    id,
    title,
    description,
    video_url,
    thumbnail_url,
    duration,
    category_id,
    age_group,
    difficulty,
    learning_objectives,
    tags,
    view_count,
    like_count,
    is_active,
    sort_order
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000', -- 固定ID便于测试
    '波波精灵和阿阿精灵',
    '学习声母b和韵母a的发音，通过有趣的动画故事帮助孩子掌握拼音基础',
    'https://example.com/videos/pinyin-ba.mp4', -- 示例视频URL
    '/thumbnails/pinyin-ba.jpg', -- 缩略图路径
    300, -- 5分钟
    (SELECT id FROM categories WHERE name = '拼音学习' LIMIT 1), -- 关联拼音学习分类
    'preschool', -- 学龄前
    'easy', -- 简单难度
    ARRAY['掌握声母b的发音', '掌握韵母a的发音', '学会拼读ba'], -- 学习目标
    ARRAY['拼音', '声母', '韵母', '基础'], -- 标签
    150, -- 观看次数
    45, -- 点赞数
    TRUE, -- 激活状态
    1 -- 排序
);

-- 插入第二条动画数据（汉字学习）
INSERT INTO animations (
    id,
    title,
    description,
    video_url,
    thumbnail_url,
    duration,
    category_id,
    age_group,
    difficulty,
    learning_objectives,
    tags,
    view_count,
    like_count,
    is_active,
    sort_order
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '汉字小故事：日、月、水',
    '通过生动的故事学习汉字"日"、"月"、"水"的写法和含义',
    'https://example.com/videos/characters-riyueshui.mp4',
    '/thumbnails/characters-riyueshui.jpg',
    420, -- 7分钟
    (SELECT id FROM categories WHERE name = '汉字启蒙' LIMIT 1),
    'kindergarten', -- 幼儿园
    'easy',
    ARRAY['认识汉字"日"', '认识汉字"月"', '认识汉字"水"', '理解汉字含义'],
    ARRAY['汉字', '启蒙', '基础汉字', '故事'],
    89,
    32,
    TRUE,
    2
);

-- 插入第三条动画数据（成语故事）
INSERT INTO animations (
    id,
    title,
    description,
    video_url,
    thumbnail_url,
    duration,
    category_id,
    age_group,
    difficulty,
    learning_objectives,
    tags,
    view_count,
    like_count,
    is_active,
    sort_order
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    '成语故事：画蛇添足',
    '通过有趣的动画故事学习成语"画蛇添足"的含义和用法',
    'https://example.com/videos/idiom-huashetianzu.mp4',
    '/thumbnails/idiom-huashetianzu.jpg',
    480, -- 8分钟
    (SELECT id FROM categories WHERE name = '成语故事' LIMIT 1),
    'elementary', -- 小学
    'medium', -- 中等难度
    ARRAY['理解成语"画蛇添足"的含义', '学会正确使用成语', '了解成语背后的故事'],
    ARRAY['成语', '故事', '传统文化', '语言学习'],
    67,
    28,
    TRUE,
    3
);

-- 插入第四条动画数据（古诗词）
INSERT INTO animations (
    id,
    title,
    description,
    video_url,
    thumbnail_url,
    duration,
    category_id,
    age_group,
    difficulty,
    learning_objectives,
    tags,
    view_count,
    like_count,
    is_active,
    sort_order
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    '古诗动画：静夜思',
    '通过优美的动画学习李白的《静夜思》，感受古诗的意境',
    'https://example.com/videos/poetry-jingyesi.mp4',
    '/thumbnails/poetry-jingyesi.jpg',
    360, -- 6分钟
    (SELECT id FROM categories WHERE name = '古诗词' LIMIT 1),
    'kindergarten',
    'easy',
    ARRAY['背诵《静夜思》', '理解诗意', '感受古诗韵律'],
    ARRAY['古诗', '李白', '静夜思', '传统文化'],
    112,
    41,
    TRUE,
    4
);

-- 插入第五条动画数据（儿歌童谣）
INSERT INTO animations (
    id,
    title,
    description,
    video_url,
    thumbnail_url,
    duration,
    category_id,
    age_group,
    difficulty,
    learning_objectives,
    tags,
    view_count,
    like_count,
    is_active,
    sort_order
) VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    '儿歌：小星星',
    '欢快的儿歌动画，帮助孩子学习经典儿歌《小星星》',
    'https://example.com/videos/nursery-littlestar.mp4',
    '/thumbnails/nursery-littlestar.jpg',
    180, -- 3分钟
    (SELECT id FROM categories WHERE name = '儿歌童谣' LIMIT 1),
    'preschool',
    'easy',
    ARRAY['学唱儿歌《小星星》', '培养音乐节奏感', '学习简单词汇'],
    ARRAY['儿歌', '童谣', '音乐', '娱乐'],
    203,
    78,
    TRUE,
    5
);

-- 验证插入的数据
SELECT 
    a.id,
    a.title,
    a.description,
    c.name as category,
    a.age_group,
    a.difficulty,
    a.view_count,
    a.like_count
FROM animations a
LEFT JOIN categories c ON a.category_id = c.id
ORDER BY a.sort_order;