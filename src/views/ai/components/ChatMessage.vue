<template>
  <div class="message-wrapper" :class="role">
    <div class="message" :class="role">
      <div class="message-avatar">
        <el-avatar
          v-if="role === 'assistant'"
          :size="32"
          class="ai-avatar"
        >
          <el-icon><Cpu /></el-icon>
        </el-avatar>
        <el-avatar
          v-else
          :size="32"
          class="user-avatar"
        >
          <el-icon><User /></el-icon>
        </el-avatar>
      </div>

      <div class="message-body">
        <div class="message-content">
          <!-- 用户消息直接显示 -->
          <template v-if="role === 'user'">
            {{ content }}
          </template>

          <!-- AI消息使用Markdown渲染 -->
          <template v-else>
            <MarkdownRender v-if="content" :content="content" />

            <!-- 加载状态 -->
            <div v-if="loading" class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </template>
        </div>

        <!-- 工具调用卡片 -->
        <template v-if="toolCalls && toolCalls.length > 0">
          <ToolCallCard
            v-for="(tool, index) in toolCalls"
            :key="index"
            :tool-name="tool.name"
            :status="tool.status"
            :params="tool.params"
            :result="tool.result"
            :error="tool.error"
          />
        </template>

        <!-- 进度卡片 -->
        <ProgressCard
          v-if="progress"
          :task-name="progress.taskName"
          :current-step="progress.currentStep"
          :progress="progress.percent"
          :steps="progress.steps"
        />

        <!-- 消息时间 -->
        <div v-if="timestamp" class="message-time">
          {{ formatTime(timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Cpu, User } from '@element-plus/icons-vue'
import MarkdownRender from './MarkdownRender.vue'
import ToolCallCard from './ToolCallCard.vue'
import ProgressCard from './ProgressCard.vue'

const props = defineProps({
  role: {
    type: String,
    required: true,
    validator: (value) => ['user', 'assistant'].includes(value)
  },
  content: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  toolCalls: {
    type: Array,
    default: () => []
  },
  progress: {
    type: Object,
    default: null
  },
  timestamp: {
    type: [String, Number, Date],
    default: null
  }
})

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}
</script>

<style scoped>
.message-wrapper {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.assistant {
  justify-content: flex-start;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.ai-avatar {
  background: linear-gradient(135deg, #409eff, #67c23a);
}

.user-avatar {
  background: #409eff;
}

.message-body {
  flex: 1;
  min-width: 0;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.message.user .message-content {
  background: #409eff;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: #f5f7fa;
  color: #303133;
  border-bottom-left-radius: 4px;
}

.loading-dots {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #409eff;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.message-time {
  font-size: 11px;
  color: #909399;
  margin-top: 6px;
  text-align: right;
}

.message.user .message-time {
  text-align: left;
}
</style>
