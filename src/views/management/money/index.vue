<template>
  <PageContainer subtitle="Hello World - 欢迎使用资金管理系统" title="资金管理">
    <template #icon>
      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V6" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <path d="M12 18V22" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <path d="M4.93 4.93L7.76 7.76" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2"/>
        <path d="M16.24 16.24L19.07 19.07" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2"/>
        <path d="M2 12H6" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <path d="M18 12H22" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <path d="M4.93 19.07L7.76 16.24" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2"/>
        <path d="M16.24 7.76L19.07 4.93" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2"/>
      </svg>
    </template>

    <div class="hello-world">
      <h1>Hello World</h1>
      <p>这是资金管理页面</p>
      <p>当前时间: {{ currentTime }}</p>
    </div>
  </PageContainer>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import PageContainer from '@/components/PageContainer.vue'

const currentTime = ref('')
let timer = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.hello-world {
  text-align: center;
  padding: 60px 20px;
}

.hello-world h1 {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 20px;
}

.hello-world p {
  font-size: 18px;
  color: #606266;
  margin: 10px 0;
}
</style>
