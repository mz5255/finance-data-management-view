<template>
  <el-dialog
      v-model="visible"
      title="选择图标"
      width="700px"
      :close-on-click-modal="false"
      @close="handleClose"
  >
    <div class="icon-selector">
      <!-- 搜索框 -->
      <el-input
          v-model="searchText"
          placeholder="搜索图标..."
          clearable
          style="margin-bottom: 16px;"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <!-- 图标列表 -->
      <div class="icon-list">
        <div
            v-for="icon in filteredIcons"
            :key="icon.key"
            :class="['icon-item', { active: selectedIcon === icon.key }]"
            @click="selectIcon(icon.key)"
        >
          <div class="icon-svg" v-html="icon.svg" :style="{ width: iconSize + 'px', height: iconSize + 'px' }"></div>
          <span class="icon-name">{{ icon.name }}</span>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
          v-if="filteredIcons.length === 0"
          description="未找到匹配的图标"
          :image-size="100"
      />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getAllIcons } from '@/assets/icons/menu-icons'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  iconSize: {
    type: Number,
    default: 24
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'confirm'])

// 状态
const visible = ref(false)
const searchText = ref('')
const selectedIcon = ref(props.modelValue)
const allIcons = getAllIcons()

// 计算属性
const filteredIcons = computed(() => {
  if (!searchText.value) {
    return allIcons
  }
  const search = searchText.value.toLowerCase()
  return allIcons.filter(icon =>
      icon.name.toLowerCase().includes(search) ||
      icon.key.toLowerCase().includes(search)
  )
})

// 方法
const open = () => {
  visible.value = true
  selectedIcon.value = props.modelValue
}

const selectIcon = (iconKey) => {
  selectedIcon.value = iconKey
}

const handleClose = () => {
  visible.value = false
  searchText.value = ''
}

const handleConfirm = () => {
  emit('update:modelValue', selectedIcon.value)
  emit('confirm', selectedIcon.value)
  handleClose()
}

// 暴露方法给父组件
defineExpose({
  open
})
</script>

<style scoped>
.icon-selector {
  max-height: 500px;
  overflow-y: auto;
}

.icon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  padding: 8px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--el-bg-color);
}

.icon-item:hover {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.icon-item.active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-8);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-5);
}

.icon-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: var(--el-text-color-regular);
}

.icon-item:hover .icon-svg,
.icon-item.active .icon-svg {
  color: var(--el-color-primary);
}

.icon-name {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: center;
  word-break: break-all;
}

.icon-item:hover .icon-name {
  color: var(--el-color-primary);
}
</style>
