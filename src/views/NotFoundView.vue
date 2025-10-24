<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-light text-dark p-4">
    <div class="max-w-md text-center">
      <div class="text-9xl font-bold text-primary mb-6 font-display">404</div>
      <h2 class="text-3xl font-bold mb-4">页面找不到了！</h2>
      <p class="text-gray-600 mb-8">你访问的页面可能已经移动或不存在了</p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/" class="btn-large bg-primary text-white">
          返回首页
        </router-link>
        <router-link to="/login" class="btn-large border-2 border-primary text-primary">
          登录
        </router-link>
      </div>
      
      <div class="mt-12">
        <img src="/logo.svg" alt="萌豆语文动画屋" class="w-32 h-32 mx-auto animate-pulse-slow" />
      </div>
    </div>
  </div>
</template>

<script setup>
// 404页面组件
</script>

<style scoped>
.font-display {
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
</style>