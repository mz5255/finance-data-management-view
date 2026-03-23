<template>
  <div class="tool-call-card">
    <div
      class="tool-call-header"
      :class="{ expanded: isExpanded }"
      @click="toggleExpand"
    >
      <div class="status-icon">
        <el-icon v-if="status === 'running'" class="is-loading" color="#409eff">
          <Loading />
        </el-icon>
        <el-icon v-else-if="status === 'success'" color="#67c23a">
          <CircleCheck />
        </el-icon>
        <el-icon v-else-if="status === 'error'" color="#f56c6c">
          <CircleClose />
        </el-icon>
        <el-icon v-else color="#909399">
          <Clock />
        </el-icon>
      </div>
      <span class="tool-name">{{ toolName }}</span>
      <el-tag
        :type="statusTagType"
        size="small"
        effect="light"
      >
        {{ statusText }}
      </el-tag>
      <el-icon class="expand-icon" :class="{ rotated: isExpanded }">
        <ArrowDown />
      </el-icon>
    </div>
    <div v-show="isExpanded" class="tool-call-content">
      <div class="tool-params">
        <div class="tool-result-label">参数</div>
        <pre><code>{{ formattedParams }}</code></pre>
      </div>
      <div v-if="result" class="tool-result">
        <div class="tool-result-label">返回结果</div>
        <pre><code>{{ formattedResult }}</code></pre>
      </div>
      <div v-if="error" class="tool-result error">
        <div class="tool-result-label" style="color: #f56c6c;">错误信息</div>
        <pre><code>{{ error }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Loading, CircleCheck, CircleClose, Clock, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  toolName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending' // pending, running, success, error
  },
  params: {
    type: Object,
    default: () => ({})
  },
  result: {
    type: [Object, String, null],
    default: null
  },
  error: {
    type: String,
    default: ''
  }
})

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const statusText = computed(() => {
  const statusMap = {
    pending: '等待中',
    running: '执行中',
    success: '成功',
    error: '失败'
  }
  return statusMap[props.status] || props.status
})

const statusTagType = computed(() => {
  const typeMap = {
    pending: 'info',
    running: 'primary',
    success: 'success',
    error: 'danger'
  }
  return typeMap[props.status] || 'info'
})

const formattedParams = computed(() => {
  try {
    return JSON.stringify(props.params, null, 2)
  } catch (e) {
    return String(props.params)
  }
})

const formattedResult = computed(() => {
  if (typeof props.result === 'string') {
    return props.result
  }
  try {
    return JSON.stringify(props.result, null, 2)
  } catch (e) {
    return String(props.result)
  }
})
</script>

<style scoped>
.tool-call-card {
  margin-top: 8px;
}

.tool-call-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: #fafbfc;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.tool-call-header:hover {
  background: #f0f2f5;
}

.status-icon {
  margin-right: 8px;
}

.tool-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.expand-icon {
  margin-left: 8px;
  transition: transform 0.2s;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.tool-call-content {
  padding: 12px;
  background: #f9fafb;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #e4e7ed;
}

.tool-params pre,
.tool-result pre {
  margin: 0;
  background: #1e1e1e;
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
}

.tool-params code,
.tool-result code {
  color: #e6e6e6;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
}

.tool-result-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.tool-result {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e4e7ed;
}
</style>
