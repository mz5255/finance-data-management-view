<template>
  <PageContainer
      :show-add="true"
      add-button-text="新增菜单"
      subtitle="管理系统菜单权限和结构"
      title="菜单管理"
      @add="handleAdd(null)"
  >
    <template #icon>
      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12H21" stroke="#3B82F6" stroke-linecap="round" stroke-width="2"/>
        <path d="M3 6H21" stroke="#3B82F6" stroke-linecap="round" stroke-width="2"/>
        <path d="M3 18H21" stroke="#3B82F6" stroke-linecap="round" stroke-width="2"/>
        <circle cx="9" cy="6" fill="#3B82F6" r="1.5"/>
        <circle cx="15" cy="12" fill="#3B82F6" r="1.5"/>
        <circle cx="9" cy="18" fill="#3B82F6" r="1.5"/>
      </svg>
    </template>

    <!-- 菜单表格 -->
    <el-table
        v-loading="loading"
        :data="menuList"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
        row-key="menuId"
        stripe
    >
      <el-table-column label="菜单名称" min-width="200" prop="menuName">
        <template #default="{ row }">
          <div class="menu-name-cell">
            <div v-if="row.icon" class="menu-icon" v-html="getIconSvg(row.icon)"></div>
            <span class="menu-name">{{ row.menuName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标" prop="icon" width="80">
        <template #default="{ row }">
          <div v-if="row.icon" class="table-icon" v-html="getIconSvg(row.icon)"></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" prop="menuType" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.menuType === 'M'" class="status-tag" effect="dark" type="success">目录</el-tag>
          <el-tag v-else-if="row.menuType === 'C'" class="status-tag" effect="dark" type="primary">菜单</el-tag>
          <el-tag v-else class="status-tag" effect="dark" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="orderNum" width="80">
        <template #default="{ row }">
          <span class="order-num">{{ row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路由地址" min-width="150" prop="path" show-overflow-tooltip/>
      <el-table-column label="组件路径" min-width="150" prop="component" show-overflow-tooltip/>
      <el-table-column label="权限标识" min-width="120" prop="perms" show-overflow-tooltip/>
      <el-table-column align="center" label="状态" prop="status" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.status === '0'" class="status-tag" effect="dark" type="success">正常</el-tag>
          <el-tag v-else class="status-tag" effect="dark" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="220">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button class="table-action-btn" link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button class="table-action-btn" link type="primary" @click="handleAdd(row)">新增</el-button>
            <el-button class="table-action-btn" link type="danger" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜单编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :close-on-click-modal="false"
        :title="dialogTitle"
        width="700px"
    >
      <el-form ref="menuFormRef" :model="menuForm" :rules="formRules" class="menu-form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <el-tree-select
                  v-model="menuForm.parentId"
                  :data="menuTreeOptions"
                  :props="{ label: 'menuName', value: 'menuId' }"
                  check-strictly
                  clearable
                  placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuForm.menuType" class="menu-type-group">
                <el-radio class="menu-type-radio" value="M">
                  <span class="radio-icon">📁</span>
                  <span>目录</span>
                </el-radio>
                <el-radio class="menu-type-radio" value="C">
                  <span class="radio-icon">📄</span>
                  <span>菜单</span>
                </el-radio>
                <el-radio class="menu-type-radio" value="F">
                  <span class="radio-icon">🔘</span>
                  <span>按钮</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="menuForm.orderNum" :max="999" :min="0" controls-position="right"
                               style="width: 100%;"/>
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
          <el-col v-if="menuForm.menuType !== 'F'" :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="menuForm.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
          <el-col v-if="menuForm.menuType === 'C'" :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="menuForm.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识" prop="perms">
              <el-input v-model="menuForm.perms" placeholder="请输入权限标识"/>
            </el-form-item>
          </el-col>
          <el-col v-if="menuForm.menuType !== 'F'" :span="12">
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
          <el-col v-if="menuForm.menuType === 'C'" :span="24">
            <el-form-item label="是否缓存">
              <el-radio-group v-model="menuForm.isCache">
                <el-radio :value="0">缓存</el-radio>
                <el-radio :value="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="menuForm.remark" :rows="3" placeholder="请输入备注" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="dialogVisible = false">取消</el-button>
          <el-button size="large" type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图标选择器 -->
    <IconSelector ref="iconSelectorRef" v-model="menuForm.icon"/>
  </PageContainer>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import PageContainer from '@/components/PageContainer.vue'
import {permissionApi} from '@/api/permission'
import {getIconSvg} from '@/assets/icons/menu-icons'
import IconSelector from '@/components/IconSelector.vue'

// 状态
const menuList = ref([])
const menuTreeOptions = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const menuFormRef = ref(null)
const iconSelectorRef = ref(null)
const loading = ref(false)

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
    {required: true, message: '请输入菜单名称', trigger: 'blur'}
  ],
  menuType: [
    {required: true, message: '请选择菜单类型', trigger: 'change'}
  ],
  orderNum: [
    {required: true, message: '请输入显示排序', trigger: 'blur'}
  ]
}

// 方法
const getMenuList = async () => {
  loading.value = true
  try {
    const response = await permissionApi.getMenuList()
    console.log('菜单列表原始数据:', response.data)
    if (response.code == 200) {
      const tree = buildTree(response.data, 0)
      console.log('构建的菜单树:', tree)
      menuList.value = tree
    } else {
      ElMessage.error(response.message || '获取菜单列表失败')
    }
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

const getMenuTreeOptions = async () => {
  try {
    const response = await permissionApi.getMenuTree()
    if (response.code == 200) {
      menuTreeOptions.value = [
        {menuId: 0, menuName: '顶级菜单'},
        ...response.data
      ]
    }
  } catch (error) {
    console.error('获取菜单树失败:', error)
  }
}

const buildTree = (list, parentId) => {
  const tree = []
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
    if (response.code == 200 && response.data) {
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

        if (response.code == 200) {
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
      if (response.code == 200) {
        ElMessage.success('删除成功')
        getMenuList()
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {
  })
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
@import '@/styles/table.css';
@import '@/styles/dialog.css';

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
</style>
