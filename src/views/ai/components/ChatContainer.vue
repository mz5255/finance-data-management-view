<template>
  <div class="chat-container">
    <!-- 消息列表 -->
    <div ref="messagesRef" class="chat-messages">
      <template v-if="messages && messages.length > 0">
        <ChatMessage
          v-for="(msg, index) in messages"
          :key="msg.id || index"
          :role="msg.role"
          :content="msg.content"
          :loading="msg.loading"
          :tool-calls="msg.toolCalls"
          :progress="msg.progress"
          :timestamp="msg.timestamp"
        />
      </template>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="icon">
          <el-icon :size="64" color="#dcdfe6"><ChatDotRound /></el-icon>
        </div>
        <h3>开始新的对话</h3>
        <p>输入消息与 AI 助手开始对话</p>
      </div>
    </div>

    <!-- 输入区域 -->
    <ChatInput
      ref="inputRef"
      :disabled="false"
      :loading="sending"
      :placeholder="inputPlaceholder"
      :show-stop="sending"
      @send="handleSend"
      @send-with-files="handleSendWithFiles"
      @stop="handleStop"
    />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import { aiApi } from '@/api/ai'

const props = defineProps({
  conversationId: {
    type: String,
    default: ''
  },
  agentType: {
    type: String,
    default: 'chat'
  },
  initialMessages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['message-sent', 'message-received', 'error'])

const messagesRef = ref(null)
const inputRef = ref(null)
const messages = ref([])
const sending = ref(false)
const abortController = ref(null)

const inputPlaceholder = computed(() => {
  const placeholders = {
    chat: '输入消息与 AI 对话...',
    code: '描述你想要的代码功能...',
    data: '输入数据分析需求...'
  }
  return placeholders[props.agentType] || '输入消息...'
})

// 监听初始消息变化
watch(() => props.initialMessages, (newMessages) => {
  if (newMessages && newMessages.length > 0) {
    messages.value = [...newMessages]
    nextTick(() => {
      scrollToBottom()
    })
  }
}, { immediate: true })

// 监听会话ID变化，清空消息
watch(() => props.conversationId, (newId, oldId) => {
  if (newId !== oldId) {
    messages.value = []
  }
})

const scrollToBottom = () => {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

const handleSend = async (text) => {
  if (!text.trim() || sending.value) return

  if (!props.conversationId) {
    ElMessage.warning('请先创建会话')
    return
  }

  // 添加用户消息
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: text,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  emit('message-sent', userMessage)

  // 添加AI消息占位
  const aiMessage = {
    id: Date.now() + 1,
    role: 'assistant',
    content: '',
    loading: true,
    toolCalls: [],
    timestamp: new Date()
  }
  messages.value.push(aiMessage)

  sending.value = true

  // 创建 AbortController 用于取消请求
  abortController.value = new AbortController()

  try {
    await aiApi.sendMessage({
      message: text,
      conversationId: props.conversationId,
      agentType: props.agentType
    }, (event) => {
      handleStreamEvent(aiMessage, event)
      nextTick(() => {
        scrollToBottom()
      })
    }, abortController.value.signal)

    aiMessage.loading = false
    emit('message-received', aiMessage)
  } catch (error) {
    console.error('Send message error:', error)
    aiMessage.loading = false
    if (error.name !== 'AbortError') {
      aiMessage.content = '抱歉，发送消息时出现错误，请重试。'
      emit('error', error)
      ElMessage.error('发送消息失败')
    }
  } finally {
    sending.value = false
    abortController.value = null
  }
}

// 带文件发送
const handleSendWithFiles = async ({ text, files }) => {
  if (sending.value) return

  if (!props.conversationId) {
    ElMessage.warning('请先创建会话')
    return
  }

  // 添加用户消息
  const fileNames = files.map(f => f.name).join(', ')
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: text + `\n\n[附件: ${fileNames}]`,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  emit('message-sent', userMessage)

  // 添加AI消息占位
  const aiMessage = {
    id: Date.now() + 1,
    role: 'assistant',
    content: '',
    loading: true,
    toolCalls: [],
    timestamp: new Date()
  }
  messages.value.push(aiMessage)

  sending.value = true
  abortController.value = new AbortController()

  try {
    await aiApi.sendMessageWithFiles({
      message: text,
      conversationId: props.conversationId,
      agentType: props.agentType,
      files: files
    }, (event) => {
      handleStreamEvent(aiMessage, event)
      nextTick(() => {
        scrollToBottom()
      })
    }, abortController.value.signal)

    aiMessage.loading = false
    emit('message-received', aiMessage)
  } catch (error) {
    console.error('Send message with files error:', error)
    aiMessage.loading = false
    if (error.name !== 'AbortError') {
      aiMessage.content = '抱歉，发送消息时出现错误，请重试。'
      emit('error', error)
      ElMessage.error('发送消息失败')
    }
  } finally {
    sending.value = false
    abortController.value = null
  }
}

// 停止生成
const handleStop = () => {
  if (abortController.value) {
    abortController.value.abort()
    ElMessage.info('已停止生成')
  }
}

const handleStreamEvent = (aiMessage, event) => {
  switch (event.type) {
    case 'content':
      aiMessage.content += event.data || ''
      break

    case 'tool_call':
      const toolCall = {
        name: event.toolName,
        status: event.status || 'running',
        params: event.params,
        result: event.result,
        error: event.error
      }
      const existingIndex = aiMessage.toolCalls.findIndex(
        t => t.name === event.toolName
      )
      if (existingIndex >= 0) {
        aiMessage.toolCalls[existingIndex] = {
          ...aiMessage.toolCalls[existingIndex],
          ...toolCall
        }
      } else {
        aiMessage.toolCalls.push(toolCall)
      }
      break

    case 'progress':
      aiMessage.progress = {
        taskName: event.taskName,
        currentStep: event.currentStep,
        percent: event.percent || 0,
        steps: event.steps
      }
      break

    case 'error':
      aiMessage.content += `\n\n**错误**: ${event.message}`
      break

    default:
      if (event.content) {
        aiMessage.content += event.content
      }
  }
}

// 暴露方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  addMessage: (msg) => {
    messages.value.push(msg)
    nextTick(() => scrollToBottom())
  },
  clearMessages: () => {
    messages.value = []
  }
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  padding: 40px;
}

.empty-state .icon {
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 500;
  color: #606266;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
