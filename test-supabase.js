// 测试Supabase连接
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

async function testSupabase() {
  console.log('测试Supabase连接...')
  
  try {
    // 测试认证服务
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.log('认证服务测试失败:', authError.message)
    } else {
      console.log('认证服务测试成功')
    }
    
    // 测试数据库连接
    const { data: dbData, error: dbError } = await supabase.from('animations').select('*').limit(1)
    if (dbError) {
      console.log('数据库连接测试失败:', dbError.message)
    } else {
      console.log('数据库连接测试成功')
    }
    
    console.log('Supabase连接测试完成')
  } catch (error) {
    console.error('测试过程中出现错误:', error)
  }
}

testSupabase()