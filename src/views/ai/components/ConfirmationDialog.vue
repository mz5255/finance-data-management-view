<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="confirmation-overlay" @click.self="handleCancel">
        <div class="confirmation-dialog">
          <div class="confirmation-header">
            <el-icon :size="20" color="#e6a23c">
              <Warning />
            </el-icon>
            <h4>{{ title }}</h4>
          </div>

          <div class="confirmation-body">
            <p class="confirmation-message">{{ message }}</p>
            <div v-if="details" class="confirmation-detail">
              <pre>{{ formattedDetails }}</pre>
            </div>
            <div v-if="options && options.length > 0" class="confirmation-options">
              <el-checkbox-group v-model="selectedOptions">
                <el-checkbox
                  v-for="option in options"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="confirmation-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button
              v-if="showReject"
              type="danger"
              @click="handleReject"
            >
              拒绝
            </el-button>
            <el-button type="primary" @click="handleConfirm">
              确认
            </el-button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Warning } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '操作确认'
  },
  message: {
    type: String,
    default: ''
  },
  details: {
    type: [Object, String, null],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  showReject: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel', 'reject', 'update:visible'])

const selectedOptions = ref([])

watch(() => props.visible, (val) => {
  if (val) {
    selectedOptions.value = []
  }
})

const formattedDetails = computed(() => {
  if (typeof props.details === 'string') {
    return props.details
  }
  try {
    return JSON.stringify(props.details, null, 2)
  } catch (e) {
    return String(props.details)
  }
})

const handleConfirm = () => {
  emit('confirm', {
    confirmed: true,
    options: selectedOptions.value
  })
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleReject = () => {
  emit('reject', {
    confirmed: false,
    options: selectedOptions.value
  })
  emit('update:visible', false)
}
</script>

<style scoped>
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.confirmation-dialog {
  background: #fff;
  border-radius: 12px;
  width: 480px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.confirmation-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
}

.confirmation-header h4 {
  margin: 0 0 0 10px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.confirmation-body {
  padding: 20px;
  overflow-y: auto;
}

.confirmation-message {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.confirmation-detail {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  overflow-x: auto;
}

.confirmation-detail pre {
  margin: 0;
  font-size: 13px;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-all;
}

.confirmation-options {
  margin-top: 12px;
}

.confirmation-footer {
  padding: 12px 20px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
