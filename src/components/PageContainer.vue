<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header glass-card">
      <div class="header-content">
        <div class="title-section">
          <div v-if="icon" class="icon-wrapper">
            <component :is="icon"/>
          </div>
          <div v-if="$slots.icon" class="icon-wrapper">
            <slot name="icon"/>
          </div>
          <div class="title-text">
            <h1>{{ title }}</h1>
            <p v-if="subtitle">{{ subtitle }}</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button v-if="showAdd" class="add-btn" size="large" type="primary" @click="handleAdd">
            <el-icon>
              <Plus/>
            </el-icon>
            {{ addButtonText }}
          </el-button>
          <slot name="actions"/>
        </div>
      </div>
      <div v-if="$slots.filters" class="filter-section">
        <slot name="filters"/>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="page-content glass-card">
      <slot/>
    </div>
  </div>
</template>

<script setup>
import {Plus} from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: [Object, Function],
    default: null
  },
  showAdd: {
    type: Boolean,
    default: false
  },
  addButtonText: {
    type: String,
    default: '新增'
  }
})

const emit = defineEmits(['add'])

const handleAdd = () => {
  emit('add')
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片样式 */
.glass-card {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 页面头部 */
.page-header {
  padding: 24px 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: #ecf5ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper :deep(svg) {
  width: 24px;
  height: 24px;
  color: #409eff;
}

.title-text h1 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.title-text p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-btn {
  background: #409eff;
  border: none;
  color: #fff;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #66b1ff;
}

/* 筛选区域 */
.filter-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

/* 页面内容 */
.page-content {
  padding: 24px;
  overflow: hidden;
}
</style>
