<template>
  <div class="user-list-page">
    <!-- 背景装饰 -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>

    <!-- 页面头部 -->
    <div class="page-header glass-card">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="url(#paint0_linear)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="url(#paint0_linear)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="1" y1="7" x2="17" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#3B82F6"/>
                  <stop offset="1" stop-color="#00FFFF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="title-text">
            <h1>用户管理</h1>
            <p>管理系统用户信息</p>
          </div>
        </div>
        <el-button type="primary" size="large" @click="handleAdd" class="add-btn">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
      </div>
    </div>

    <!-- 用户表格卡片 -->
    <div class="table-card glass-card">
      <el-table :data="userList" v-loading="loading" stripe class="modern-table">
        <el-table-column prop="userId" label="用户ID" width="200" />
        <el-table-column prop="userName" label="用户名" width="120" />
        <el-table-column prop="nickName" label="昵称" width="120" />
        <el-table-column prop="telephone" label="手机号" width="130" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'" effect="dark">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button link type="primary" @click="handleEdit(row)" class="action-btn edit-btn">
                <el-icon><Edit /></el-icon>
                编辑
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { userApi } from '@/api/user'

const userList = ref([])
const loading = ref(false)

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await userApi.getUserList()
    console.log('用户列表响应:', response)
    if (response.success) {
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

const handleAdd = () => {
  ElMessage.info('新增用户功能开发中...')
}

const handleEdit = (row) => {
  ElMessage.info('编辑用户功能开发中...')
}

const handleDelete = (row) => {
  ElMessage.info('删除用户功能开发中...')
}

onMounted(() => {
  console.log('UserList 组件已挂载')
  fetchUsers()
})
</script>

<style scoped>
.user-list-page {
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

/* Element Plus 深色主题覆盖 */
:deep(.el-button) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #3B82F6 0%, #00FFFF 100%);
  border: none;
  color: #000;
}

:deep(.el-tag) {
  border: none;
}
</style>
