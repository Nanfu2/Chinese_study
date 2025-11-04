// 调试脚本：检查contentService中的方法
// 这个脚本将在浏览器控制台中运行

async function debugContentService() {
    console.log('开始调试contentService...');
    
    try {
        // 动态导入contentService
        const { contentService } = await import('./src/services/contentService.js');
        console.log('contentService导入成功!');
        
        // 测试getAllPinyin方法
        console.log('测试getAllPinyin方法...');
        try {
            const pinyinData = await contentService.getAllPinyin();
            console.log('拼音数据加载成功!', pinyinData);
            console.log('拼音数据数量:', pinyinData.length);
        } catch (error) {
            console.error('拼音数据加载失败:', error);
        }
        
        // 测试getAllCharacters方法
        console.log('测试getAllCharacters方法...');
        try {
            const charactersData = await contentService.getAllCharacters();
            console.log('汉字数据加载成功!', charactersData);
            console.log('汉字数据数量:', charactersData.length);
        } catch (error) {
            console.error('汉字数据加载失败:', error);
        }
        
        // 测试getAllAnimations方法
        console.log('测试getAllAnimations方法...');
        try {
            const animationsData = await contentService.getAllAnimations();
            console.log('动画数据加载成功!', animationsData);
            console.log('动画数据数量:', animationsData.length);
        } catch (error) {
            console.error('动画数据加载失败:', error);
        }
        
    } catch (error) {
        console.error('导入contentService失败:', error);
    }
}

// 运行调试函数
debugContentService();