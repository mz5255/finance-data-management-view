<template>
  <div class="menu-management">
    <!-- 背景装饰 -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>

    <!-- 页面头部 -->
    <div class="page-header glass-card">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="url(#paint0_linear)" stroke-width="2" stroke-linecap="round"/>
              <path d="M3 6H21" stroke="url(#paint0_linear)" stroke-width="2" stroke-linecap="round"/>
              <path d="M3 18H21" stroke="url(#paint0_linear)" stroke-width="2" stroke-linecap="round"/>
              <circle cx="9" cy="6" r="1.5" fill="#3B82F6"/>
              <circle cx="15" cy="12" r="1.5" fill="#3B82F6"/>
              <circle cx="9" cy="18" r="1.5" fill="#3B82F6"/>
              <defs>
                <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#3B82F6"/>
                  <stop offset="1" stop-color="#00FFFF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="title-text">
            <h1>菜单管理</h1>
            <p>管理系统菜单权限和结构</p>
          </div>
        </div>
        <el-button type="primary" size="large" @click="handleAdd(null)" class="add-btn">
          <el-icon><Plus /></el-icon>
          新增菜单
        </el-button>
      </div>
    </div>

    <!-- 菜单表格卡片 -->
    <div class="table-card glass-card">
      <el-table
          :data="menuList"
          row-key="menuId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          default-expand-all
          stripe
          class="modern-table"
      >
        <el-table-column prop="menuName" label="菜单名称" min-width="200">
          <template #default="{ row }">
            <div class="menu-name-cell">
              <div v-if="row.icon" class="menu-icon" v-html="getIconSvg(row.icon)"></div>
              <span class="menu-name">{{ row.menuName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template #default="{ row }">
            <div v-if="row.icon" class="table-icon" v-html="getIconSvg(row.icon)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="menuType" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.menuType === 'M'" type="success" effect="dark">目录</el-tag>
            <el-tag v-else-if="row.menuType === 'C'" type="primary" effect="dark">菜单</el-tag>
            <el-tag v-else type="info" effect="dark">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="80" align="center">
          <template #default="{ row }">
            <span class="order-num">{{ row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="component" label="组件路径" min-width="150" show-overflow-tooltip />
        <el-table-column prop="perms" label="权限标识" min-width="120" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === '0'" type="success" effect="dark">正常</el-tag>
            <el-tag v-else type="danger" effect="dark">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button link type="primary" @click="handleEdit(row)" class="action-btn edit-btn">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button link type="primary" @click="handleAdd(row)" class="action-btn add-btn">
                <el-icon><Plus /></el-icon>
                新增
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)" class="action-btn delete-btn">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 菜单编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="700px"
        :close-on-click-modal="false"
        class="modern-dialog"
    >
      <el-form :model="menuForm" :rules="formRules" ref="menuFormRef" label-width="100px" class="menu-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <el-tree-select
                  v-model="menuForm.parentId"
                  :data="menuTreeOptions"
                  :props="{ label: 'menuName', value: 'menuId' }"
                  check-strictly
                  placeholder="选择上级菜单"
                  clearable
                  class="modern-select"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuForm.menuType" class="menu-type-group">
                <el-radio value="M" class="menu-type-radio">
                  <span class="radio-icon">📁</span>
                  <span>目录</span>
                </el-radio>
                <el-radio value="C" class="menu-type-radio">
                  <span class="radio-icon">📄</span>
                  <span>菜单</span>
                </el-radio>
                <el-radio value="F" class="menu-type-radio">
                  <span class="radio-icon">🔘</span>
                  <span>按钮</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="menuForm.orderNum" :min="0" :max="999" controls-position="right" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" readonly>
                <template #append>
                  <el-button @click="openIconSelector">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuForm.menuType !== 'F'">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuForm.menuType === 'C'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识" prop="perms">
              <el-input v-model="menuForm.perms" placeholder="请输入权限标识" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuForm.menuType !== 'F'">
            <el-form-item label="显示状态" prop="visible">
              <el-radio-group v-model="menuForm.visible">
                <el-radio value="0">显示</el-radio>
                <el-radio value="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态" prop="status">
              <el-radio-group v-model="menuForm.status">
                <el-radio value="0">正常</el-radio>
                <el-radio value="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="menuForm.menuType === 'C'">
            <el-form-item label="是否缓存">
              <el-radio-group v-model="menuForm.isCache">
                <el-radio :value="0">缓存</el-radio>
                <el-radio :value="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="menuForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" size="large">取消</el-button>
          <el-button type="primary" @click="handleSubmit" size="large">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图标选择器 -->
    <IconSelector ref="iconSelectorRef" v-model="menuForm.icon" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { permissionApi } from '@/api/permission'
import { getIconSvg } from '@/assets/icons/menu-icons'
import IconSelector from '@/components/IconSelector.vue'

// 状态
const menuList = ref([])
const menuTreeOptions = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const menuFormRef = ref(null)
const iconSelectorRef = ref(null)

// 表单数据
const menuForm = reactive({
  menuId: null,
  parentId: 0,
  menuName: '',
  menuType: 'C',
  orderNum: 0,
  path: '',
  component: '',
  perms: '',
  icon: '',
  visible: '0',
  status: '0',
  isCache: 0,
  remark: ''
})

// 表单验证规则
const formRules = {
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  menuType: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  orderNum: [
    { required: true, message: '请输入显示排序', trigger: 'blur' }
  ]
}

// 方法
const getMenuList = async () => {
  try {
    const response = await permissionApi.getMenuList()
    console.log('菜单列表原始数据:', response.data)
    if (response.success) {
      const tree = buildTree(response.data, 0)
      console.log('构建的菜单树:', tree)
      menuList.value = tree
    } else {
      ElMessage.error(response.message || '获取菜单列表失败')
    }
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    ElMessage.error('获取菜单列表失败')
  }
}

const getMenuTreeOptions = async () => {
  try {
    const response = await permissionApi.getMenuTree()
    if (response.success) {
      menuTreeOptions.value = [
        { menuId: 0, menuName: '顶级菜单' },
        ...response.data
      ]
    }
  } catch (error) {
    console.error('获取菜单树失败:', error)
  }
}

const buildTree = (list, parentId) => {
  const tree = []
  // 将parentId转换为字符串进行比较（因为后端Long被序列化为字符串）
  const parentIdStr = String(parentId)
  for (const item of list) {
    const itemParentId = String(item.parentId || '')
    if (itemParentId === parentIdStr) {
      const children = buildTree(list, item.menuId)
      if (children.length > 0) {
        item.children = children
      }
      tree.push(item)
    }
  }
  return tree
}

const resetForm = () => {
  Object.assign(menuForm, {
    menuId: null,
    parentId: 0,
    menuName: '',
    menuType: 'C',
    orderNum: 0,
    path: '',
    component: '',
    perms: '',
    icon: '',
    visible: '0',
    status: '0',
    isCache: 0,
    remark: ''
  })
  if (menuFormRef.value) {
    menuFormRef.value.clearValidate()
  }
}

const handleAdd = (row) => {
  resetForm()
  if (row) {
    menuForm.parentId = row.menuId
  }
  dialogTitle.value = '新增菜单'
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  resetForm()
  try {
    const response = await permissionApi.getMenuDetail(row.menuId)
    if (response.success && response.data) {
      Object.assign(menuForm, response.data)
      dialogTitle.value = '编辑菜单'
      dialogVisible.value = true
    } else {
      ElMessage.error('获取菜单详情失败')
    }
  } catch (error) {
    console.error('获取菜单详情失败:', error)
    ElMessage.error('获取菜单详情失败')
  }
}

const handleSubmit = async () => {
  if (!menuFormRef.value) return

  await menuFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let response
        if (menuForm.menuId) {
          response = await permissionApi.updateMenu(menuForm)
        } else {
          response = await permissionApi.createMenu(menuForm)
        }

        if (response.success) {
          ElMessage.success(menuForm.menuId ? '修改成功' : '新增成功')
          dialogVisible.value = false
          getMenuList()
        } else {
          ElMessage.error(response.message || '操作失败')
        }
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
      `确定要删除菜单"${row.menuName}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    try {
      const response = await permissionApi.deleteMenu(row.menuId)
      if (response.success) {
        ElMessage.success('删除成功')
        getMenuList()
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const openIconSelector = () => {
  iconSelectorRef.value?.open()
}

// 生命周期
onMounted(() => {
  console.log('MenuManagement 组件已挂载')
  getMenuList()
  getMenuTreeOptions()
})
</script>

<style scoped>
.menu-management {
  min-height: 100vh;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.bg-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 255, 255, 0.05) 100%);
  top: -100px;
  right: -100px;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.05) 100%);
  bottom: -50px;
  left: -50px;
}

/* 玻璃态卡片 */
.glass-card {
  background: rgba(17, 25, 40, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24px;
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
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(0, 255, 255, 0.1));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.icon-wrapper svg {
  width: 28px;
  height: 28px;
}

.title-text h1 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-text p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.add-btn {
  background: linear-gradient(135deg, #3B82F6 0%, #00FFFF 100%);
  border: none;
  color: #000;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

/* 表格卡片 */
.table-card {
  padding: 24px;
}

/* 表格样式 */
:deep(.modern-table) {
  background: transparent;
}

:deep(.modern-table .el-table__header-wrapper) {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
}

:deep(.modern-table th) {
  background: transparent !important;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.modern-table td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
}

:deep(.modern-table tr:hover td) {
  background: rgba(59, 130, 246, 0.08) !important;
}

:deep(.modern-table .el-table__body tr) {
  background: transparent;
}

.menu-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #3B82F6;
}

.menu-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.table-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.6);
}

.order-num {
  background: rgba(59, 130, 246, 0.15);
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 600;
  color: #3B82F6;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

/* 对话框样式 */
:deep(.modern-dialog .el-dialog__header) {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0, 255, 255, 0.05));
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.modern-dialog .el-dialog__title) {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  font-weight: 600;
}

:deep(.modern-dialog .el-dialog__body) {
  background: rgba(17, 25, 40, 0.95);
  padding: 24px;
}

:deep(.modern-dialog .el-dialog__footer) {
  background: rgba(17, 25, 40, 0.95);
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-form :deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.8);
}

.menu-form :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.menu-form :deep(.el-input__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

.menu-form :deep(.el-input__wrapper.is-focus) {
  border-color: #3B82F6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.menu-form :deep(.el-input__inner) {
  color: rgba(255, 255, 255, 0.9);
}

.menu-form :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

/* 菜单类型选择 */
.menu-type-group {
  display: flex;
  gap: 12px;
  width: 100%;
}

.menu-type-radio {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-type-radio:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.menu-type-radio.is-checked {
  background: rgba(59, 130, 246, 0.15);
  border-color: #3B82F6;
}

.radio-icon {
  font-size: 18px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Element Plus 深色主题覆盖 */
:deep(.el-button) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #3B82F6 0%, #00FFFF 100%);
  border: none;
  color: #000;
}

:deep(.el-radio) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #3B82F6;
  border-color: #3B82F6;
}

:deep(.el-input-number) {
  background: rgba(255, 255, 255, 0.05);
}

:deep(.el-input-number .el-input__wrapper) {
  background: transparent;
}

:deep(.el-tree-select) {
  width: 100%;
}

:deep(.el-tag) {
  border: none;
}
</style>
