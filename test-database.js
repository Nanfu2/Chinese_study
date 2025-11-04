// 测试数据库连接和表状态
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// 从.env文件读取Supabase配置
const envContent = fs.readFileSync('.env', 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabaseUrl = envVars.VITE_SUPABASE_URL
const supabaseServiceKey = envVars.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少Supabase配置，请检查.env文件')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function testDatabase() {
  console.log('开始测试数据库连接和表状态...')
  
  try {
    // 测试拼音学习表
    console.log('\n1. 测试拼音学习表 (pinyin_lessons)...')
    const { data: pinyinData, error: pinyinError } = await supabaseAdmin
      .from('pinyin_lessons')
      .select('*')
      .limit(5)
    
    if (pinyinError) {
      console.error('拼音学习表查询失败:', pinyinError)
    } else {
      console.log(`拼音学习表查询成功，找到 ${pinyinData.length} 条记录`)
      if (pinyinData.length > 0) {
        console.log('示例数据:', pinyinData[0])
      }
    }
    
    // 测试汉字学习表
    console.log('\n2. 测试汉字学习表 (chinese_characters)...')
    const { data: charData, error: charError } = await supabaseAdmin
      .from('chinese_characters')
      .select('*')
      .limit(5)
    
    if (charError) {
      console.error('汉字学习表查询失败:', charError)
    } else {
      console.log(`汉字学习表查询成功，找到 ${charData.length} 条记录`)
      if (charData.length > 0) {
        console.log('示例数据:', charData[0])
      }
    }
    
    // 测试动画表（作为对比）
    console.log('\n3. 测试动画表 (animations)...')
    const { data: animData, error: animError } = await supabaseAdmin
      .from('animations')
      .select('*')
      .limit(5)
    
    if (animError) {
      console.error('动画表查询失败:', animError)
    } else {
      console.log(`动画表查询成功，找到 ${animData.length} 条记录`)
      if (animData.length > 0) {
        console.log('示例数据:', animData[0])
      }
    }
    
    console.log('\n数据库测试完成')
    
  } catch (error) {
    console.error('测试过程中出现错误:', error)
  }
}

// 运行测试
testDatabase()