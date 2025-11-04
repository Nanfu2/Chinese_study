// 测试contentService中的方法
import { contentService } from './src/services/contentService.js'

async function testContentService() {
  console.log('开始测试contentService...')
  
  try {
    console.log('测试getAllPinyin方法...')
    const pinyinData = await contentService.getAllPinyin()
    console.log('拼音数据:', pinyinData)
    console.log('拼音数据数量:', pinyinData.length)
    
    console.log('测试getAllCharacters方法...')
    const charactersData = await contentService.getAllCharacters()
    console.log('汉字数据:', charactersData)
    console.log('汉字数据数量:', charactersData.length)
    
    console.log('测试getAllAnimations方法...')
    const animationsData = await contentService.getAllAnimations()
    console.log('动画数据:', animationsData)
    console.log('动画数据数量:', animationsData.length)
    
    console.log('所有测试完成!')
  } catch (error) {
    console.error('测试失败:', error)
    console.error('错误详情:', error.message)
  }
}

testContentService()