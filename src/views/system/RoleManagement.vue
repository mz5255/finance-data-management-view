<template>
  <div class="role-management">
    <!-- 背景装饰 -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>

    <!-- 页面头部 -->
    <div class="page-header glass-card">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9.243 2 7 4.243 7 7C7 9.757 9.243 12 12 12C14.757 12 17 9.757 17 7C17 4.243 14.757 2 12 2ZM12 14C8.686 14 3 15.657 3 19V21H21V19C21 15.657 15.314 14 12 14Z" stroke="url(#paint0_linear)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="3" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#3B82F6"/>
                  <stop offset="1" stop-color="#00FFFF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="title-text">
            <h1>角色管理</h1>
            <p>管理系统角色和权限</p>
          </div>
        </div>
        <el-button type="primary" size="large" @click="handleAdd" class="add-btn">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
      </div>
    </div>

    <!-- 角色表格卡片 -->
    <div class="table-card glass-card">
      <el-table :data="roleList" stripe class="modern-table">
        <el-table-column prop="roleId" label="角色ID" width="200" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleKey" label="角色标识" />
        <el-table-column prop="roleSort" label="显示顺序" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === '0'" type="success" effect="dark">正常</el-tag>
            <el-tag v-else type="danger" effect="dark">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column label="操作" width="260" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button link type="primary" @click="handleEdit(row)" class="action-btn edit-btn">编辑</el-button>
              <el-button link type="primary" @click="handleAssignMenu(row)" class="action-btn">分配菜单</el-button>
              <el-button link type="danger" @click="handleDelete(row)" class="action-btn delete-btn">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 角色对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        :close-on-click-modal="false"
    >
      <el-form :model="roleForm" :rules="formRules" ref="roleFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色标识" prop="roleKey">
              <el-input v-model="roleForm.roleKey" placeholder="请输入角色标识" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="roleSort">
              <el-input-number v-model="roleForm.roleSort" :min="0" :max="999" controls-position="right" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="roleForm.status">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="roleForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配菜单对话框 -->
    <el-dialog
        v-model="menuDialogVisible"
        title="分配菜单权限"
        width="700px"
        :close-on-click-modal="false"
    >
      <div class="menu-assign">
        <el-form label-width="100px">
          <el-form-item label="角色名称">
            <el-input :value="currentRole?.roleName" disabled />
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-tree
                ref="menuTreeRef"
                :data="menuTreeData"
                :props="{ label: 'menuName', children: 'children' }"
                :default-checked-keys="checkedMenuKeys"
                node-key="menuId"
                show-checkbox
                default-expand-all
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="menuDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveMenu">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { permissionApi } from '@/api/permission'

// 状态
const roleList = ref([])
const menuTreeData = ref([])
const dialogVisible = ref(false)
const menuDialogVisible = ref(false)
const dialogTitle = ref('')
const roleFormRef = ref(null)
const menuTreeRef = ref(null)
const currentRole = ref(null)
const checkedMenuKeys = ref([])

// 表单数据
const roleForm = reactive({
  roleId: null,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: '0',
  remark: ''
})

// 表单验证规则
const formRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  roleKey: [
    { required: true, message: '请输入角色标识', trigger: 'blur' }
  ],
  roleSort: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' }
  ]
}

// 方法
const getRoleList = async () => {
  try {
    const response = await permissionApi.getRoleList()
    if (response.success) {
      roleList.value = response.data
    } else {
      ElMessage.error(response.message || '获取角色列表失败')
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  }
}

const getMenuTree = async () => {
  try {
    const response = await permissionApi.getMenuTree()
    if (response.success) {
      menuTreeData.value = response.data
    }
  } catch (error) {
    console.error('获取菜单树失败:', error)
  }
}

const resetForm = () => {
  Object.assign(roleForm, {
    roleId: null,
    roleName: '',
    roleKey: '',
    roleSort: 0,
    status: '0',
    remark: ''
  })
  if (roleFormRef.value) {
    roleFormRef.value.clearValidate()
  }
}

const handleAdd = () => {
  resetForm()
  dialogTitle.value = '新增角色'
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  resetForm()
  try {
    const response = await permissionApi.getRoleDetail(row.roleId)
    if (response.success && response.data) {
      Object.assign(roleForm, response.data)
      dialogTitle.value = '编辑角色'
      dialogVisible.value = true
    } else {
      ElMessage.error('获取角色详情失败')
    }
  } catch (error) {
    console.error('获取角色详情失败:', error)
    ElMessage.error('获取角色详情失败')
  }
}

const handleSubmit = async () => {
  if (!roleFormRef.value) return

  await roleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let response
        if (roleForm.roleId) {
          // 更新
          response = await permissionApi.updateRole(roleForm)
        } else {
          // 新增
          response = await permissionApi.createRole(roleForm)
        }

        if (response.success) {
          ElMessage.success(roleForm.roleId ? '修改成功' : '新增成功')
          dialogVisible.value = false
          getRoleList()
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
      `确定要删除角色"${row.roleName}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(async () => {
    try {
      const response = await permissionApi.deleteRole(row.roleId)
      if (response.success) {
        ElMessage.success('删除成功')
        getRoleList()
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleAssignMenu = async (row) => {
  currentRole.value = row
  checkedMenuKeys.value = []
  menuDialogVisible.value = true

  // 这里可以获取角色已有的菜单权限
  // 暂时留空，需要后端提供获取角色菜单ID列表的接口
}

const handleSaveMenu = async () => {
  if (!menuTreeRef.value) return

  const checkedKeys = menuTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys()
  const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]

  try {
    const response = await permissionApi.assignMenus(currentRole.value.roleId, allCheckedKeys)
    if (response.success) {
      ElMessage.success('分配成功')
      menuDialogVisible.value = false
    } else {
      ElMessage.error(response.message || '分配失败')
    }
  } catch (error) {
    console.error('分配失败:', error)
    ElMessage.error('分配失败')
  }
}

// 生命周期
onMounted(() => {
  console.log('RoleManagement 组件已挂载')
  getRoleList()
  getMenuTree()
})
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.menu-assign {
  max-height: 500px;
  overflow-y: auto;
}
</style>
