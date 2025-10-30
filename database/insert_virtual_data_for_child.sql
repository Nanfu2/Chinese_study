-- 萌豆语文动画屋 - 为孩子ID 9af1725e-3712-4bfa-b319-6208af5688e5 创建虚拟数据
-- 创建时间: 2025-10-29

-- 首先确保动画数据存在（使用现有的动画ID）
-- 动画ID列表（来自insert_animation_data.sql）：
-- '550e8400-e29b-41d4-a716-446655440000' - 波波精灵和阿阿精灵
-- '550e8400-e29b-41d4-a716-446655440001' - 汉字小故事：日、月、水
-- '550e8400-e29b-41d4-a716-446655440002' - 成语故事：画蛇添足
-- '550e8400-e29b-41d4-a716-446655440003' - 古诗动画：静夜思
-- '550e8400-e29b-41d4-a716-446655440004' - 儿歌：小星星

-- 插入观看历史数据
INSERT INTO watch_history (
    child_id,
    animation_id,
    watch_duration,
    completed,
    watched_at
) VALUES
-- 最近一周的观看记录
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440000', 280, TRUE, '2025-10-29 09:30:00'),
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440001', 420, TRUE, '2025-10-28 14:15:00'),
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440002', 350, FALSE, '2025-10-27 16:45:00'),
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440003', 180, TRUE, '2025-10-26 10:20:00'),
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440004', 150, TRUE, '2025-10-25 11:10:00'),

-- 前一周的观看记录
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440000', 300, TRUE, '2025-10-22 08:45:00'),
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440001', 400, TRUE, '2025-10-21 15:30:00'),
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440002', 200, FALSE, '2025-10-20 17:20:00'),

-- 更早的观看记录
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440003', 360, TRUE, '2025-10-18 09:15:00'),
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440004', 180, TRUE, '2025-10-15 14:00:00'),

-- 重复观看同一内容（学习巩固）
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440000', 250, TRUE, '2025-10-14 10:40:00'),
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440001', 380, TRUE, '2025-10-12 16:25:00'),

-- 部分观看记录（未完成）
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440002', 120, FALSE, '2025-10-10 11:50:00'),
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440003', 90, FALSE, '2025-10-08 13:15:00');

-- 插入互动记录数据
INSERT INTO interactions (
    child_id,
    animation_id,
    interaction_type,
    interaction_data,
    created_at
) VALUES
-- 测验答题记录
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440000', 'quiz_answer', 
    '{"score": 85, "answers": ["A", "B", "A", "C"], "correct_count": 3, "total_questions": 4}', 
    '2025-10-29 09:45:00'),

('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440001', 'quiz_answer', 
    '{"score": 92, "answers": ["B", "A", "C", "A", "B"], "correct_count": 4, "total_questions": 5}', 
    '2025-10-28 14:30:00'),

('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440002', 'quiz_answer', 
    '{"score": 70, "answers": ["C", "B", "A"], "correct_count": 2, "total_questions": 3}', 
    '2025-10-27 17:00:00'),

-- 点赞记录
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440003', 'like', 
    '{"value": true, "reason": "喜欢古诗动画"}', 
    '2025-10-26 10:25:00'),

('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440004', 'like', 
    '{"value": true, "reason": "儿歌很好听"}', 
    '2025-10-25 11:15:00'),

-- 分享记录
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440000', 'share', 
    '{"platform": "wechat", "message": "这个拼音学习动画很有趣！"}', 
    '2025-10-22 09:00:00'),

('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440001', 'share', 
    '{"platform": "qq", "message": "汉字学习动画帮助很大"}', 
    '2025-10-21 15:45:00'),

-- 收藏记录
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440002', 'favorite', 
    '{"value": true, "category": "成语故事"}', 
    '2025-10-20 17:30:00'),

-- 评论记录
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440003', 'comment', 
    '{"content": "静夜思是我最喜欢的古诗！", "rating": 5}', 
    '2025-10-18 09:30:00'),

-- 学习进度记录
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440004', 'progress', 
    '{"current_time": 120, "total_duration": 180, "percentage": 66.67}', 
    '2025-10-15 14:15:00'),

-- 重复互动（学习巩固）
('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440000', 'quiz_answer', 
    '{"score": 95, "answers": ["A", "B", "A", "C"], "correct_count": 4, "total_questions": 4}', 
    '2025-10-14 10:50:00'),

('9af1725e-3712-4bfa-b319-6208af5688e5', '550e8400-e29b-41d4-a716-446655440001', 'quiz_answer', 
    '{"score": 88, "answers": ["B", "A", "C", "A", "B"], "correct_count": 4, "total_questions": 5}', 
    '2025-10-12 16:40:00');

-- 验证插入的数据
-- 查看观看历史统计
SELECT 
    COUNT(*) as total_watch_records,
    SUM(watch_duration) as total_watch_time,
    SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_count
FROM watch_history 
WHERE child_id = '9af1725e-3712-4bfa-b319-6208af5688e5';

-- 查看互动记录统计
SELECT 
    interaction_type,
    COUNT(*) as count
FROM interactions 
WHERE child_id = '9af1725e-3712-4bfa-b319-6208af5688e5'
GROUP BY interaction_type
ORDER BY count DESC;

-- 查看最近的学习活动
SELECT 
    'watch' as type,
    animation_id,
    watched_at as activity_time
FROM watch_history 
WHERE child_id = '9af1725e-3712-4bfa-b319-6208af5688e5'
UNION ALL
SELECT 
    'interaction' as type,
    animation_id,
    created_at as activity_time
FROM interactions 
WHERE child_id = '9af1725e-3712-4bfa-b319-6208af5688e5'
ORDER BY activity_time DESC
LIMIT 10;