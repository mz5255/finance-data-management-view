<template>
  <div class="ai-chat-page">
    <div class="ai-chat-container">
      <!-- 左侧会话列表 -->
      <div class="conversation-sidebar">
        <div class="sidebar-header">
          <h3>对话列表</h3>
          <el-button
            type="primary"
            size="small"
            class="new-chat-btn"
            @click="createNewConversation"
          >
            <el-icon><Plus /></el-icon>
            新对话
          </el-button>
        </div>

        <div class="conversation-list">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            class="conversation-item"
            :class="{ active: currentConversationId === conv.id }"
            @click="selectConversation(conv)"
          >
            <div class="conversation-icon" :style="{ background: getIconColor(conv.agentType) }">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <div class="conversation-info">
              <div class="conversation-title">{{ conv.title || '新对话' }}</div>
              <div class="conversation-time">{{ formatTime(conv.updateTime) }}</div>
            </div>
            <el-button
              class="delete-btn"
              type="danger"
              size="small"
              text
              @click.stop="deleteConversation(conv)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>

          <!-- 空状态 -->
          <div v-if="conversations.length === 0" class="empty-conversations">
            <p>暂无对话记录</p>
            <el-button type="primary" size="small" @click="createNewConversation">
              开始新对话
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧对话区域 -->
      <div class="chat-main">
        <!-- Agent类型选择器 -->
        <div class="agent-selector">
          <span class="label">Agent 类型:</span>
          <div class="agent-tabs">
            <div
              v-for="agent in agentTypes"
              :key="agent.value"
              class="agent-tab"
              :class="{ active: currentAgentType === agent.value }"
              @click="switchAgentType(agent.value)"
            >
              <el-icon><component :is="agent.icon" /></el-icon>
              {{ agent.label }}
            </div>
          </div>
        </div>

        <!-- 对话容器 -->
        <div class="chat-container-wrapper">
          <ChatContainer
              ref="chatRef"
              :agent-type="currentAgentType"
              :conversation-id="currentConversationId"
              :initial-messages="currentMessages"
              @error="onError"
              @message-sent="onMessageSent"
              @message-received="onMessageReceived"
          />
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <ConfirmationDialog
      v-model:visible="confirmationVisible"
      :title="confirmationData.title"
      :message="confirmationData.message"
      :details="confirmationData.details"
      :options="confirmationData.options"
      :show-reject="confirmationData.showReject"
      @confirm="handleConfirm"
      @reject="handleReject"
    />
  </div>
</template>

<script setup>
import {computed, markRaw, onMounted, reactive, ref} from 'vue'
import {ChatDotRound, ChatLineSquare, DataAnalysis, Delete, Document, Plus} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import ChatContainer from './components/ChatContainer.vue'
import ConfirmationDialog from './components/ConfirmationDialog.vue'
import {aiApi} from '@/api/ai'

// Agent 类型配置
const agentTypes = [
  { label: '通用对话', value: 'chat', icon: markRaw(ChatLineSquare) },
  { label: '代码助手', value: 'code', icon: markRaw(Document) },
  { label: '数据分析', value: 'data', icon: markRaw(DataAnalysis) }
]

// 状态
const allConversations = ref([])
const currentConversationId = ref('')
const currentAgentType = ref('chat')
const chatRef = ref(null)
const loading = ref(false)

// 会话消息缓存
const conversationMessages = reactive({})

// 当前 Agent 类型的会话列表（按 agentType 筛选）
const conversations = computed(() => {
  return allConversations.value.filter(conv => conv.agentType === currentAgentType.value)
})

// 确认对话框
const confirmationVisible = ref(false)
const confirmationData = reactive({
  title: '操作确认',
  message: '',
  details: null,
  options: [],
  showReject: false,
  requestId: ''
})

// 当前会话的消息
const currentMessages = computed(() => {
  return conversationMessages[currentConversationId.value] || []
})

// 获取图标颜色
const getIconColor = (agentType) => {
  const colors = {
    chat: 'linear-gradient(135deg, #409eff, #67c23a)',
    code: 'linear-gradient(135deg, #e6a23c, #f56c6c)',
    data: 'linear-gradient(135deg, #909399, #409eff)'
  }
  return colors[agentType] || colors.chat
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`

  return date.toLocaleDateString('zh-CN')
}

// 加载会话列表
const loadConversations = async () => {
  try {
    loading.value = true
    const res = await aiApi.getConversations({ page: 1, size: 50 })
    // 后端返回 { conversations: [...], page, size }
    const rawData = res.data?.conversations || res?.conversations || []
    // 字段映射：conversationId -> id, lastMessageAt -> updateTime
    allConversations.value = rawData.map(conv => ({
      ...conv,
      id: conv.conversationId,
      updateTime: conv.lastMessageAt
    }))
  } catch (error) {
    allConversations.value = []
  } finally {
    loading.value = false
  }
}

// 创建新会话
const createNewConversation = async () => {
  const newConv = {
    id: `temp_${Date.now()}`,
    title: '新对话',
    agentType: currentAgentType.value,
    createTime: new Date(),
    updateTime: new Date()
  }

  allConversations.value.unshift(newConv)
  currentConversationId.value = newConv.id
  conversationMessages[newConv.id] = []

  // 尝试在服务端创建
  try {
    const res = await aiApi.createConversation({
      agentType: currentAgentType.value,
      title: '新对话'
    })
    if (res.data?.id || res.id) {
      const serverId = res.data?.id || res.id
      const index = allConversations.value.findIndex(c => c.id === newConv.id)
      if (index >= 0) {
        allConversations.value[index].id = serverId
        conversationMessages[serverId] = conversationMessages[newConv.id]
        delete conversationMessages[newConv.id]
        currentConversationId.value = serverId
      }
    }
  } catch (error) {
    // 继续使用临时ID
  }

  chatRef.value?.focus()
}

// 选择会话
const selectConversation = async (conv) => {
  currentConversationId.value = conv.id
  currentAgentType.value = conv.agentType || 'chat'

  // 加载历史消息
  if (!conversationMessages[conv.id]) {
    try {
      const res = await aiApi.getConversationMessages(conv.id)
      // 后端返回 { messages: [...], total, page, size }
      const rawData = res.data?.messages || res?.messages || []
      // 字段映射：messageId -> id
      conversationMessages[conv.id] = rawData.map(msg => ({
        ...msg,
        id: msg.messageId
      }))
    } catch (error) {
      conversationMessages[conv.id] = []
    }
  }
}

// 删除会话
const deleteConversation = async (conv) => {
  try {
    await ElMessageBox.confirm('确定要删除这个对话吗？', '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const index = allConversations.value.findIndex(c => c.id === conv.id)
    if (index >= 0) {
      allConversations.value.splice(index, 1)
    }

    delete conversationMessages[conv.id]

    if (currentConversationId.value === conv.id) {
      const sameTypeConvs = allConversations.value.filter(c => c.agentType === conv.agentType)
      if (sameTypeConvs.length > 0) {
        selectConversation(sameTypeConvs[0])
      } else {
        createNewConversation()
      }
    }

    try {
      await aiApi.deleteConversation(conv.id)
    } catch (error) {
      // 忽略删除失败
    }

    ElMessage.success('删除成功')
  } catch (error) {
    // 用户取消
  }
}

// 切换Agent类型
const switchAgentType = (type) => {
  if (currentAgentType.value === type) return
  currentAgentType.value = type

  const filteredConvs = allConversations.value.filter(conv => conv.agentType === type)
  if (filteredConvs.length > 0) {
    selectConversation(filteredConvs[0])
  } else {
    createNewConversation()
  }
}

// 消息发送回调
const onMessageSent = (message) => {
  if (!conversationMessages[currentConversationId.value]) {
    conversationMessages[currentConversationId.value] = []
  }
  conversationMessages[currentConversationId.value].push(message)

  if (Array.isArray(allConversations.value)) {
    const conv = allConversations.value.find(c => c.id === currentConversationId.value)
    if (conv && conv.title === '新对话' && message.content) {
      conv.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
    }
    if (conv) {
      conv.updateTime = new Date()
    }
  }
}

// 消息接收回调
const onMessageReceived = (message) => {
  const messages = conversationMessages[currentConversationId.value]
  if (messages) {
    const index = messages.findIndex(m => m.id === message.id)
    if (index >= 0) {
      messages[index] = message
    } else {
      messages.push(message)
    }
  }
}

// 错误回调
const onError = (error) => {
  console.error('Chat error:', error)
}

// 处理确认操作
const handleConfirm = async (data) => {
  try {
    await aiApi.confirmOperation(confirmationData.requestId, {
      confirmed: true,
      options: data.options
    })
    ElMessage.success('已确认')
  } catch (error) {
    ElMessage.error('确认失败')
  }
}

const handleReject = async (data) => {
  try {
    await aiApi.confirmOperation(confirmationData.requestId, {
      confirmed: false,
      options: data.options
    })
    ElMessage.info('已拒绝')
  } catch (error) {
    ElMessage.error('拒绝失败')
  }
}

// 初始化
onMounted(async () => {
  await loadConversations()

  const filteredConvs = allConversations.value.filter(c => c.agentType === currentAgentType.value)
  if (filteredConvs.length > 0) {
    await selectConversation(filteredConvs[0])
  } else {
    await createNewConversation()
  }
})
</script>

<style scoped>
@import '@/styles/ai-chat.css';

.ai-chat-page {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.ai-chat-container {
  flex: 1;
  min-height: 0;
}

.empty-conversations {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-conversations p {
  margin-bottom: 16px;
}

.chat-container-wrapper {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
