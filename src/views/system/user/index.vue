<template>
  <PageContainer
      :show-add="false"
      subtitle="管理系统用户信息"
      title="用户管理"
  >
    <template #icon>
      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <circle cx="9" cy="7" r="4" stroke="#3B82F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </svg>
    </template>

    <!-- 用户表格 -->
    <el-table v-loading="loading" :data="userList" stripe>
      <el-table-column label="用户ID" prop="userId" width="200"/>
      <el-table-column label="昵称" prop="nickName" width="120"/>
      <el-table-column label="手机号" prop="telephone" width="130"/>
      <el-table-column align="center" label="实名认证" prop="certification" width="100">
        <template #default="{ row }">
          <el-tag :type="row.certification ? 'success' : 'warning'" class="status-tag">
            {{ row.certification ? '已认证' : '未认证' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" prop="roleName" width="120">
        <template #default="{ row }">
          <el-tag class="status-tag">
            {{ row.roleName || getUserRoleLabel(row.userRole) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户状态" prop="state" width="100">
        <template #default="{ row }">
          <el-tag :type="getStateTagType(row.state)" class="status-tag">
            {{ getStateLabel(row.state) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="createTime" width="180"/>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <div class="table-actions">
            <el-dropdown class="state-dropdown" @command="(cmd) => handleStateChange(row, cmd)">
              <el-button class="table-action-btn" link type="primary">
                更改状态
                <el-icon>
                  <ArrowDown/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="INIT">创建成功</el-dropdown-item>
                  <el-dropdown-item command="AUTH">实名认证</el-dropdown-item>
                  <el-dropdown-item command="FROZEN" divided>冻结</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button class="table-action-btn" link type="danger" @click="handleDelete(row)">
              <el-icon>
                <Delete/>
              </el-icon>
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </PageContainer>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {ArrowDown, Delete} from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import {userApi} from '@/api/user'

const userList = ref([])
const loading = ref(false)

// 用户状态映射
const stateMap = {
  INIT: {label: '创建成功', type: 'info'},
  AUTH: {label: '实名认证', type: 'success'},
  FROZEN: {label: '冻结', type: 'danger'}
}

// 用户角色映射（作为备用，主要使用后端返回的 roleName）
const userRoleMap = {
  CUSTOMER: {label: '普通用户', type: ''},
  ADMIN: {label: '管理员', type: 'warning'},
  SUPERADMIN: {label: '超级管理员', type: 'danger'}
}

const getStateLabel = (state) => {
  return stateMap[state]?.label || '未知'
}

const getStateTagType = (state) => {
  return stateMap[state]?.type || 'info'
}

const getUserRoleLabel = (userRole) => {
  return userRoleMap[userRole]?.label || '未设置'
}

// 获取所有用户（包括冻结用户）
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await userApi.getAllUsers()
    console.log('用户列表响应:', response)
    if (response.code == 200) {
      userList.value = response.data.records || []
    } else {
      ElMessage.error(response.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 更改用户状态
const handleStateChange = async (row, newState) => {
  if (row.state === newState) {
    return
  }

  const stateLabel = stateMap[newState]?.label || newState

  try {
    await ElMessageBox.confirm(
        `确定要将用户"${row.nickName || row.telephone}"的状态更改为"${stateLabel}"吗？`,
        '更改用户状态',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    const response = await userApi.updateUserState(row.userId, newState)
    if (response.code == 200) {
      ElMessage.success('更改成功')
      fetchUsers()
    } else {
      ElMessage.error(response.message || '更改失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更改用户状态失败:', error)
      ElMessage.error('更改失败')
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
        `确定要删除用户"${row.nickName || row.telephone}"吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    const response = await userApi.deleteUser(row.userId)
    if (response.code == 200) {
      ElMessage.success('删除成功')
      fetchUsers()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  console.log('UserList 组件已挂载')
  fetchUsers()
})
</script>

<style scoped>
@import '@/styles/table.css';

.table-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.table-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.state-dropdown {
  display: inline-block;
}
</style>
