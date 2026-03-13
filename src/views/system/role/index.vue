<template>
  <PageContainer
      :show-add="true"
      add-button-text="新增角色"
      subtitle="管理系统角色和权限"
      title="角色管理"
      @add="handleAdd"
  >
    <template #icon>
      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 2C9.243 2 7 4.243 7 7C7 9.757 9.243 12 12 12C14.757 12 17 9.757 17 7C17 4.243 14.757 2 12 2ZM12 14C8.686 14 3 15.657 3 19V21H21V19C21 15.657 15.314 14 12 14Z"
            stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </svg>
    </template>

    <!-- 角色表格 -->
    <el-table v-loading="loading" :data="roleList" stripe>
      <el-table-column label="角色ID" prop="roleId" width="200"/>
      <el-table-column label="角色名称" prop="roleName"/>
      <el-table-column label="角色标识" prop="roleKey"/>
      <el-table-column align="center" label="显示顺序" prop="roleSort" width="100"/>
      <el-table-column align="center" label="状态" prop="status" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.status === '0'" class="status-tag" effect="dark" type="success">正常</el-tag>
          <el-tag v-else class="status-tag" effect="dark" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="180"/>
      <el-table-column label="备注" prop="remark" show-overflow-tooltip/>
      <el-table-column align="center" fixed="right" label="操作" width="260">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button class="table-action-btn" link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button class="table-action-btn" link type="primary" @click="handleAssignMenu(row)">分配菜单</el-button>
            <el-button class="table-action-btn" link type="danger" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色编辑对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :close-on-click-modal="false"
        :title="dialogTitle"
        width="600px"
    >
      <el-form ref="roleFormRef" :model="roleForm" :rules="formRules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色标识" prop="roleKey">
              <el-input v-model="roleForm.roleKey" placeholder="请输入角色标识"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="roleSort">
              <el-input-number v-model="roleForm.roleSort" :max="999" :min="0" controls-position="right"
                               style="width: 100%;"/>
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
              <el-input v-model="roleForm.remark" :rows="3" placeholder="请输入备注" type="textarea"/>
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
        :close-on-click-modal="false"
        title="分配菜单权限"
        width="700px"
    >
      <div class="menu-assign">
        <el-form label-width="100px">
          <el-form-item label="角色名称">
            <el-input :value="currentRole?.roleName" disabled/>
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-tree
                :key="menuTreeKey"
                ref="menuTreeRef"
                :data="menuTreeData"
                :default-checked-keys="checkedMenuKeys"
                :props="{ label: 'menuName', children: 'children' }"
                default-expand-all
                node-key="menuId"
                show-checkbox
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
  </PageContainer>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import PageContainer from '@/components/PageContainer.vue'
import {permissionApi} from '@/api/permission'

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
const menuTreeKey = ref(0)
const loading = ref(false)

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
    {required: true, message: '请输入角色名称', trigger: 'blur'}
  ],
  roleKey: [
    {required: true, message: '请输入角色标识', trigger: 'blur'}
  ],
  roleSort: [
    {required: true, message: '请输入显示顺序', trigger: 'blur'}
  ]
}

// 方法
const getRoleList = async () => {
  loading.value = true
  try {
    const response = await permissionApi.getRoleList()
    if (response.code == 200) {
      roleList.value = response.data
    } else {
      ElMessage.error(response.message || '获取角色列表失败')
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

const getMenuTree = async () => {
  try {
    const response = await permissionApi.getMenuTree()
    if (response.code == 200) {
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
    if (response.code == 200 && response.data) {
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
          response = await permissionApi.updateRole(roleForm)
        } else {
          response = await permissionApi.createRole(roleForm)
        }

        if (response.code == 200) {
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
      if (response.code == 200) {
        ElMessage.success('删除成功')
        getRoleList()
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

const handleAssignMenu = async (row) => {
  currentRole.value = row

  // 先清空选中状态，避免显示上一次的数据
  checkedMenuKeys.value = []

  // 获取角色已有的菜单权限
  try {
    const response = await permissionApi.getRoleMenuIds(row.roleId)
    console.log('角色菜单权限响应 - roleId:', row.roleId, response)
    if (response.code == 200) {
      // 确保数据是数组
      checkedMenuKeys.value = Array.isArray(response.data) ? response.data : []
      console.log('设置 checkedMenuKeys:', checkedMenuKeys.value)
    } else {
      checkedMenuKeys.value = []
    }
  } catch (error) {
    console.error('获取角色菜单权限失败:', error)
    checkedMenuKeys.value = []
  }

  console.log('最终回显的菜单ID:', checkedMenuKeys.value)

  // 数据更新后再更新 key，强制重新渲染
  menuTreeKey.value++

  // 使用 nextTick 确保 DOM 更新后再打开对话框
  await nextTick()
  menuDialogVisible.value = true
}

const handleSaveMenu = async () => {
  if (!menuTreeRef.value) return

  const checkedKeys = menuTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys()
  const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]

  try {
    const response = await permissionApi.assignMenus(currentRole.value.roleId, allCheckedKeys)
    if (response.code == 200) {
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
@import '@/styles/table.css';
@import '@/styles/dialog.css';

.menu-assign {
  max-height: 500px;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
