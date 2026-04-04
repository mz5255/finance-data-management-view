<template>
  <div class="chat-input-container" @paste="handlePaste">
    <!-- 已上传文件列表 -->
    <div v-if="uploadedFiles.length > 0" class="uploaded-files">
      <div v-for="(file, index) in uploadedFiles" :key="index" class="file-tag">
        <!-- 图片预览 -->
        <img v-if="isImage(file)" :src="getFilePreview(file)" class="file-preview"/>
        <el-icon v-else class="file-icon">
          <Document/>
        </el-icon>
        <span class="file-name">{{ file.name }}</span>
        <span class="file-size">{{ formatFileSize(file.size) }}</span>
        <el-icon class="remove-icon" @click="removeFile(index)"><Close /></el-icon>
      </div>
    </div>

    <div class="chat-input-wrapper">
      <!-- 文件上传按钮 -->
      <el-upload
        ref="uploadRef"
        class="upload-btn"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="handleFileSelect"
        multiple
        accept=".txt,.md,.json,.xml,.yaml,.yml,.sql,.html,.css,.js,.ts,.java,.py,.csv,.xlsx,.xls,.docx,.pdf,.png,.jpg,.jpeg,.gif,.webp"
      >
        <el-button type="default" :disabled="disabled || loading" class="attach-btn">
          <el-icon><Paperclip /></el-icon>
        </el-button>
      </el-upload>

      <textarea
        ref="inputRef"
        v-model="inputText"
        class="chat-input"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        rows="1"
        @keydown="handleKeydown"
        @input="autoResize"
      ></textarea>

      <!-- 停止按钮 -->
      <el-button
        v-if="showStop"
        type="danger"
        class="stop-btn"
        @click="handleStop"
      >
        <el-icon><VideoPause /></el-icon>
        停止
      </el-button>
      <!-- 发送按钮 -->
      <el-button
        v-else
        type="primary"
        class="send-btn"
        :disabled="!canSend"
        :loading="loading"
        @click="handleSend"
      >
        <el-icon v-if="!loading"><Promotion /></el-icon>
        <span v-if="loading">发送中</span>
      </el-button>
    </div>
    <div class="input-hints">
      <span class="hint">
        <el-icon><Paperclip /></el-icon>
        支持文件/图片上传，可直接粘贴图片 | 按 Enter 发送，Shift + Enter 换行
      </span>
      <span v-if="loading" class="loading-hint">
        <el-icon class="is-loading"><Loading /></el-icon>
        AI 正在思考...
      </span>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, reactive, ref} from 'vue'
import {Close, Document, Loading, Paperclip, Promotion, VideoPause} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '输入消息...'
  },
  showStop: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send', 'stop', 'sendWithFiles'])

const inputRef = ref(null)
const uploadRef = ref(null)
const inputText = ref('')
const uploadedFiles = ref([])

// 文件限制
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 5
const MAX_TOTAL_SIZE = 20 * 1024 * 1024 // 20MB

const canSend = computed(() => {
  return (inputText.value.trim() || uploadedFiles.value.length > 0) && !props.disabled && !props.loading
})

const beforeUpload = (file) => {
  // 检查文件数量
  if (uploadedFiles.value.length >= MAX_FILES) {
    ElMessage.warning(`最多上传 ${MAX_FILES} 个文件`)
    return false
  }

  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    ElMessage.warning(`文件 ${file.name} 超过 10MB 限制`)
    return false
  }

  // 检查总大小
  const currentTotal = uploadedFiles.value.reduce((sum, f) => sum + f.size, 0)
  if (currentTotal + file.size > MAX_TOTAL_SIZE) {
    ElMessage.warning('文件总大小超过 20MB 限制')
    return false
  }

  return true
}

// 处理粘贴事件
const handlePaste = async (e) => {
  const items = e.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault()
      const file = item.getAsFile()
      if (file) {
        await addFile(file, true)
      }
      break
    }
  }
}

// 添加文件
const addFile = async (file, isPaste = false) => {
  if (!beforeUpload(file)) return

  // 为粘贴的图片生成文件名
  if (isPaste && !file.name) {
    const ext = file.type.split('/')[1] || 'png'
    file = new File([file], `粘贴图片_${Date.now()}.${ext}`, {type: file.type})
  }

  uploadedFiles.value.push(file)
  ElMessage.success(`已添加: ${file.name}`)
}

// 判断是否为图片
const isImage = (file) => {
  return file.type?.startsWith('image/')
}

// 获取文件预览URL
const filePreviewUrls = reactive({})
const getFilePreview = (file) => {
  if (!isImage(file)) return null
  if (!filePreviewUrls[file.name]) {
    filePreviewUrls[file.name] = URL.createObjectURL(file)
  }
  return filePreviewUrls[file.name]
}

const handleFileSelect = (options) => {
  const file = options.file
  uploadedFiles.value.push(file)
  ElMessage.success(`已添加文件: ${file.name}`)
}

const removeFile = (index) => {
  const file = uploadedFiles.value[index]
  // 清理预览URL
  if (filePreviewUrls[file.name]) {
    URL.revokeObjectURL(filePreviewUrls[file.name])
    delete filePreviewUrls[file.name]
  }
  uploadedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const handleSend = () => {
  if (!canSend.value) return

  const message = inputText.value.trim()
  const files = [...uploadedFiles.value]

  if (files.length > 0) {
    // 有文件，使用文件上传方式
    emit('sendWithFiles', {text: message, files})
  } else if (message) {
    // 只有文本
    emit('send', message)
  }

  // 清空
  inputText.value = ''
  uploadedFiles.value = []
  // 清理预览URL
  Object.values(filePreviewUrls).forEach(url => URL.revokeObjectURL(url))
  Object.keys(filePreviewUrls).forEach(key => delete filePreviewUrls[key])

  nextTick(() => {
    autoResize()
  })
}

const handleStop = () => {
  emit('stop')
}

const autoResize = () => {
  const textarea = inputRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  focus
})
</script>

<style scoped>
.chat-input-container {
  padding: 16px 20px;
  border-top: 1px solid #e4e7ed;
  background: #fafbfc;
}

.uploaded-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.file-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 6px;
  font-size: 13px;
}

.file-preview {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
}

.file-icon {
  color: #409eff;
}

.file-name {
  color: #303133;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #909399;
  font-size: 12px;
}

.remove-icon {
  color: #909399;
  cursor: pointer;
  margin-left: 4px;
}

.remove-icon:hover {
  color: #f56c6c;
}

.chat-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  padding: 10px 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.chat-input-wrapper:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.attach-btn {
  padding: 8px;
  border: none;
  background: transparent;
}

.attach-btn:hover {
  background: #f5f7fa;
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  max-height: 120px;
  min-height: 24px;
  font-family: inherit;
  background: transparent;
  color: #303133;
}

.chat-input::placeholder {
  color: #c0c4cc;
}

.chat-input:disabled {
  cursor: not-allowed;
}

.send-btn,
.stop-btn {
  flex-shrink: 0;
  min-width: 70px;
}

.stop-btn {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.input-hints {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 0 4px;
}

.hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.loading-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #409eff;
}
</style>
