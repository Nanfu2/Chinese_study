-- 萌豆语文动画屋 - 行级安全策略修复（修正版）
-- 修复缺失的RLS策略，确保数据安全
-- 创建时间: 2025-10-27

-- 1. 为interactions表创建RLS策略
CREATE POLICY "家长只能访问自己孩子的互动记录" ON interactions FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()))
);

-- 2. 为child_achievements表创建RLS策略
CREATE POLICY "家长只能访问自己孩子的成就记录" ON child_achievements FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()))
);

-- 3. 为learning_stats表创建RLS策略
CREATE POLICY "家长只能访问自己孩子的学习统计" ON learning_stats FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()))
);

-- 4. 为categories表启用RLS并创建策略
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "所有人都可以查看分类信息" ON categories FOR SELECT USING (true);

-- 5. 为achievements表启用RLS并创建策略
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "所有人都可以查看成就信息" ON achievements FOR SELECT USING (true);

-- 6. 为pinyin_lessons表启用RLS并创建策略
ALTER TABLE pinyin_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "所有人都可以查看拼音学习内容" ON pinyin_lessons FOR SELECT USING (true);

-- 7. 为chinese_characters表启用RLS并创建策略
ALTER TABLE chinese_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "所有人都可以查看汉字学习内容" ON chinese_characters FOR SELECT USING (true);

-- 8. 修复animations表的策略（简化版本，避免不存在的列引用）
-- 先删除可能存在的旧策略
DROP POLICY IF EXISTS "所有人都可以查看动画内容" ON animations;
-- 重新创建策略
CREATE POLICY "所有人都可以查看动画内容" ON animations FOR SELECT USING (true);
-- 注意：管理员权限需要额外的表结构支持，这里暂时只允许查看

-- 9. 修复watch_history表的策略（分离SELECT和INSERT权限）
DROP POLICY IF EXISTS "认证用户可以记录观看历史" ON watch_history;
CREATE POLICY "家长可以查看自己孩子的观看历史" ON watch_history FOR SELECT USING (
    child_id IN (SELECT id FROM children WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()))
);
CREATE POLICY "家长可以记录自己孩子的观看历史" ON watch_history FOR INSERT WITH CHECK (
    child_id IN (SELECT id FROM children WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()))
);

-- 10. 如果需要管理员功能，需要先创建管理员表
-- 以下是创建管理员表的示例（可选）
/*
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 为admins表启用RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "只有管理员可以管理管理员表" ON admins FOR ALL USING (auth.uid() = user_id);
*/

-- 11. 验证策略是否生效的查询示例
-- 检查所有表的RLS状态
SELECT 
    schemaname,
    tablename,
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('parents', 'children', 'animations', 'watch_history', 'interactions', 'child_achievements', 'learning_stats', 'categories', 'achievements', 'pinyin_lessons', 'chinese_characters');

-- 检查所有策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual 
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('parents', 'children', 'animations', 'watch_history', 'interactions', 'child_achievements', 'learning_stats', 'categories', 'achievements', 'pinyin_lessons', 'chinese_characters');