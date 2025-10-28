-- 萌豆语文动画屋 - 数据库架构
-- 创建时间: 2025-10-24

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 用户表 (使用Supabase Auth的用户表)
-- 注意: Supabase Auth会自动创建auth.users表

-- 家长信息表
CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 儿童信息表
CREATE TABLE IF NOT EXISTS children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 18),
    avatar_url TEXT,
    learning_level VARCHAR(20) DEFAULT 'beginner',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 动画内容分类表
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 动画内容表
CREATE TABLE IF NOT EXISTS animations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration INTEGER NOT NULL, -- 视频时长(秒)
    category_id UUID REFERENCES categories(id),
    age_group VARCHAR(20) NOT NULL, -- preschool, kindergarten, elementary
    difficulty VARCHAR(20) NOT NULL, -- easy, medium, hard
    learning_objectives TEXT[], -- 学习目标数组
    tags TEXT[], -- 标签数组
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 观看历史表
CREATE TABLE IF NOT EXISTS watch_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    animation_id UUID NOT NULL REFERENCES animations(id) ON DELETE CASCADE,
    watch_duration INTEGER NOT NULL, -- 实际观看时长(秒)
    completed BOOLEAN DEFAULT FALSE,
    watched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(child_id, animation_id, watched_at)
);

-- 互动记录表
CREATE TABLE IF NOT EXISTS interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    animation_id UUID NOT NULL REFERENCES animations(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- like, share, quiz_answer, etc.
    interaction_data JSONB, -- 互动数据
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学习成就表
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    condition_type VARCHAR(50) NOT NULL, -- watch_count, completion_rate, etc.
    condition_value INTEGER NOT NULL,
    reward_points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 儿童成就记录表
CREATE TABLE IF NOT EXISTS child_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(child_id, achievement_id)
);

-- 学习统计表
CREATE TABLE IF NOT EXISTS learning_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_watch_time INTEGER DEFAULT 0, -- 总观看时长(秒)
    completed_animations INTEGER DEFAULT 0,
    earned_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(child_id, date)
);

-- 拼音学习表
CREATE TABLE IF NOT EXISTS pinyin_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pinyin VARCHAR(10) NOT NULL,
    audio_url TEXT NOT NULL,
    image_url TEXT,
    example_words TEXT[],
    difficulty VARCHAR(20) DEFAULT 'easy',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 汉字学习表
CREATE TABLE IF NOT EXISTS chinese_characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character VARCHAR(5) NOT NULL,
    pinyin VARCHAR(20) NOT NULL,
    meaning TEXT,
    stroke_order_url TEXT,
    audio_url TEXT,
    difficulty VARCHAR(20) DEFAULT 'easy',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_watch_history_child_id ON watch_history(child_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_animation_id ON watch_history(animation_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_watched_at ON watch_history(watched_at);
CREATE INDEX IF NOT EXISTS idx_interactions_child_id ON interactions(child_id);
CREATE INDEX IF NOT EXISTS idx_animations_category_id ON animations(category_id);
CREATE INDEX IF NOT EXISTS idx_animations_age_group ON animations(age_group);
CREATE INDEX IF NOT EXISTS idx_animations_difficulty ON animations(difficulty);
CREATE INDEX IF NOT EXISTS idx_learning_stats_child_id_date ON learning_stats(child_id, date);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要更新时间的表创建触发器
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_animations_updated_at BEFORE UPDATE ON animations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全 (RLS)
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE animations ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_stats ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 家长只能访问自己的信息
CREATE POLICY "家长只能访问自己的信息" ON parents FOR ALL USING (auth.uid() = user_id);

-- 家长只能访问自己孩子的信息
CREATE POLICY "家长只能访问自己孩子的信息" ON children FOR ALL USING (
    parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
);

-- 所有人都可以查看动画内容
CREATE POLICY "所有人都可以查看动画内容" ON animations FOR SELECT USING (true);

-- 只有认证用户可以记录观看历史
CREATE POLICY "认证用户可以记录观看历史" ON watch_history FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()))
);

-- 类似的策略应用于其他表...

-- 插入初始数据
INSERT INTO categories (name, description, icon_url, sort_order) VALUES
('拼音学习', '学习汉语拼音基础', '/icons/pinyin.png', 1),
('汉字启蒙', '认识常用汉字', '/icons/characters.png', 2),
('成语故事', '通过故事学习成语', '/icons/idioms.png', 3),
('古诗词', '经典古诗词学习', '/icons/poetry.png', 4),
('儿歌童谣', '趣味儿歌和童谣', '/icons/nursery-rhymes.png', 5);

INSERT INTO achievements (name, description, condition_type, condition_value, reward_points) VALUES
('初次见面', '观看第一个动画', 'watch_count', 1, 10),
('学习小达人', '观看10个动画', 'watch_count', 10, 50),
('拼音小能手', '完成拼音学习', 'completion_rate', 80, 100),
('汉字小专家', '认识50个汉字', 'character_count', 50, 150);

-- 插入模拟数据：测试用户（仅限开发环境）
-- 注意：在生产环境中应通过 Supabase Auth API 创建用户
INSERT INTO auth.users (id, email, encrypted_password, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'parent1@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW());

-- 插入模拟数据：家长和孩子
INSERT INTO parents (id, user_id, name, contact_phone, avatar_url) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440011', '张家长', '13800138000', '/avatars/parent1.jpg');

INSERT INTO children (id, parent_id, name, age, avatar_url, learning_level) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '张小豆', 6, '/avatars/child1.jpg', 'beginner'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', '张小萌', 5, '/avatars/child2.jpg', 'beginner');

-- 插入模拟数据：动画内容（使用新的 UUID 避免冲突）
INSERT INTO animations (id, title, description, video_url, thumbnail_url, duration, category_id, age_group, difficulty) VALUES
(gen_random_uuid(), '拼音 b', '学习拼音 b', '/videos/pinyin-b.mp4', '/thumbnails/pinyin-b.jpg', 300, (SELECT id FROM categories WHERE name = '拼音学习'), 'preschool', 'easy'),
(gen_random_uuid(), '拼音 p', '学习拼音 p', '/videos/pinyin-p.mp4', '/thumbnails/pinyin-p.jpg', 240, (SELECT id FROM categories WHERE name = '拼音学习'), 'preschool', 'easy'),
(gen_random_uuid(), '汉字 人', '学习汉字“人”', '/videos/character-ren.mp4', '/thumbnails/character-ren.jpg', 360, (SELECT id FROM categories WHERE name = '汉字启蒙'), 'kindergarten', 'medium'),
(gen_random_uuid(), '儿歌 小星星', '经典儿歌', '/videos/little-star.mp4', '/thumbnails/little-star.jpg', 180, (SELECT id FROM categories WHERE name = '儿歌童谣'), 'preschool', 'easy')
ON CONFLICT (id) DO NOTHING;

-- 插入模拟数据：观看历史
INSERT INTO watch_history (child_id, animation_id, watch_duration, completed, watched_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 300, TRUE, '2025-10-25 10:00:00'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 180, FALSE, '2025-10-26 11:30:00'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 420, TRUE, '2025-10-27 09:15:00'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 240, TRUE, '2025-10-25 14:00:00'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 360, FALSE, '2025-10-26 16:45:00');

-- 插入模拟数据：互动记录
INSERT INTO interactions (child_id, animation_id, interaction_type, interaction_data) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'quiz_answer', '{"score": 80, "answers": ["A", "B", "C"]}'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'like', '{"value": true}'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'quiz_answer', '{"score": 90, "answers": ["A", "B", "D"]}'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'share', '{"platform": "wechat"}');