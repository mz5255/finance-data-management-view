<template>
  <div class="progress-card">
    <div class="progress-header">
      <el-icon :size="20" color="#409eff">
        <Operation />
      </el-icon>
      <span class="task-name">{{ taskName }}</span>
    </div>

    <div class="progress-bar-container">
      <div
        class="progress-bar"
        :style="{ width: `${progressPercent}%` }"
      ></div>
    </div>

    <div class="progress-info">
      <span class="progress-text">{{ currentStep }}</span>
      <span class="progress-percent">{{ progressPercent }}%</span>
    </div>

    <ul v-if="steps && steps.length > 0" class="progress-steps">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="progress-step"
        :class="getStepStatus(step.status)"
      >
        <span class="step-icon">
          <el-icon v-if="step.status === 'completed'" :size="12">
            <Check />
          </el-icon>
          <el-icon v-else-if="step.status === 'error'" :size="12">
            <Close />
          </el-icon>
          <span v-else-if="step.status === 'running'" class="spinner"></span>
          <span v-else>{{ index + 1 }}</span>
        </span>
        <span class="step-text">{{ step.name || step }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Operation, Check, Close } from '@element-plus/icons-vue'

const props = defineProps({
  taskName: {
    type: String,
    default: '任务执行中'
  },
  currentStep: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
  },
  steps: {
    type: Array,
    default: () => []
  }
})

const progressPercent = computed(() => {
  return Math.min(100, Math.max(0, props.progress))
})

const getStepStatus = (status) => {
  return status || 'pending'
}
</script>

<style scoped>
.progress-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 14px;
  margin-top: 12px;
}

.progress-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-left: 8px;
}

.progress-bar-container {
  height: 6px;
  background: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-text {
  font-size: 13px;
  color: #606266;
}

.progress-percent {
  font-size: 13px;
  font-weight: 500;
  color: #409eff;
}

.progress-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #e4e7ed;
  padding-top: 12px;
}

.progress-step {
  display: flex;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;
  color: #606266;
}

.step-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 12px;
  flex-shrink: 0;
}

.progress-step.pending .step-icon {
  background: #e4e7ed;
  color: #909399;
}

.progress-step.running .step-icon {
  background: #409eff;
  color: #fff;
}

.progress-step.completed .step-icon {
  background: #67c23a;
  color: #fff;
}

.progress-step.error .step-icon {
  background: #f56c6c;
  color: #fff;
}

.step-text {
  flex: 1;
}

.spinner {
  width: 10px;
  height: 10px;
  border: 2px solid transparent;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
