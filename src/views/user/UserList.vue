<template>
  <div class="user-list">
    <div class="page-header animate-fade-in">
      <h2 class="gradient-text">用户管理</h2>
      <p class="sub-title">管理系统用户信息</p>
    </div>

    <div class="actions glass-card animate-fade-in">
      <div class="action-buttons">
        <button
            v-permission="'system:user:list'"
            class="btn btn-primary animate-glow"
            @click="fetchUsers"
        >
          <i class="icon-refresh"></i>
          刷新列表
        </button>
        <button
            v-role="'admin'"
            class="btn btn-secondary"
            @click="addUser"
        >
          <i class="icon-plus"></i>
          添加用户
        </button>
      </div>
      <div class="search-bar">
        <input
            v-model="searchKeyword"
            class="search-input"
            placeholder="搜索用户..."
            type="text"
        />
        <button class="btn btn-secondary">
          <i class="icon-search"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container glass-card animate-fade-in">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-if="users.length" class="user-table-container glass-card animate-fade-in">
      <div class="table-wrapper">
        <table class="user-table">
          <thead>
          <tr>
            <th>用户ID</th>
            <th>手机号</th>
            <th>昵称</th>
            <th>角色</th>
            <th>状态</th>
            <th>认证状态</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user.userId" class="table-row">
            <td class="user-id">{{ user.userId }}</td>
            <td class="user-phone">{{ user.telephone }}</td>
            <td class="user-nickname">{{ user.nickName || '无' }}</td>
            <td class="user-role">
              <span :class="user.userRole.toLowerCase()" class="role-badge">
                {{ user.userRole }}
              </span>
            </td>
            <td class="user-state">
              <span :class="user.state.toLowerCase()" class="state-badge">
                {{ user.state }}
              </span>
            </td>
            <td class="user-certification">
              <span :class="user.certification ? 'certified' : 'uncertified'" class="cert-badge">
                {{ user.certification ? '已认证' : '未认证' }}
              </span>
            </td>
            <td class="user-actions">
              <button
                  v-permission="'system:user:edit'"
                  class="btn btn-sm btn-secondary"
                  @click="editUser(user)"
              >
                <i class="icon-edit"></i>
                编辑
              </button>
              <button
                  v-permission="'system:user:delete'"
                  class="btn btn-sm btn-secondary"
                  @click="deleteUser(user.userId)"
              >
                <i class="icon-delete"></i>
                删除
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="total">共 {{ total }} 条记录</span>
        <div class="pagination-controls">
          <button :disabled="currentPage === 1" class="btn btn-sm">上一页</button>
          <span class="page-info gradient-text">{{ currentPage }} / {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" class="btn btn-sm">下一页</button>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="empty-state glass-card animate-fade-in">
      <div class="empty-icon">
        <i class="icon-user"></i>
      </div>
      <h3>暂无用户数据</h3>
      <p>点击"添加用户"按钮创建新用户</p>
      <button
          v-role="'admin'"
          class="btn btn-primary animate-glow"
          @click="addUser"
      >
        添加用户
      </button>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue'
import {userApi} from '@/api/user'

export default {
  name: 'UserList',
  setup() {
    const users = ref([])
    const loading = ref(false)
    const searchKeyword = ref('')
    const currentPage = ref(1)
    const total = ref(0)
    const totalPages = ref(1)

    const fetchUsers = async () => {
      loading.value = true
      try {
        const response = await userApi.getUserList()
        console.log('后端返回数据:', response)
        if (response.success) {
          // 适配后端返回的IPage<UserInfo>结构
          users.value = response.data?.records || response.data || []
          total.value = response.data?.total || 0
          totalPages.value = response.data?.pages || 1
          currentPage.value = response.data?.current || 1
          console.log('解析后的数据:', users.value)
        } else {
          console.error('后端返回失败:', response.message)
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    const deleteUser = async (userId) => {
      if (confirm(`确定要删除用户 ${userId} 吗？`)) {
        try {
          const response = await userApi.deleteUser(userId)
          if (response.success) {
            alert('删除成功')
            fetchUsers()
          }
        } catch (error) {
          console.error('删除用户失败:', error)
        }
      }
    }

    const addUser = () => {
      alert('添加用户功能')
    }

    const editUser = (user) => {
      alert(`编辑用户: ${user.telephone}`)
    }

    // 页面加载时自动获取用户列表
    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      loading,
      searchKeyword,
      currentPage,
      total,
      totalPages,
      fetchUsers,
      deleteUser,
      addUser,
      editUser
    }
  }
}
</script>

<style scoped>
.user-list {
  padding: 30px;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
}

.sub-title {
  margin: 0;
  font-size: 14px;
  color: rgba(235, 235, 235, 0.64);
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  border-radius: 16px;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 14px;
  width: 280px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.search-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  border-radius: 16px;
  margin: 20px 0;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top: 3px solid #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.user-table-container {
  border-radius: 16px;
  overflow: hidden;
  margin: 20px 0;
}

.table-wrapper {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.user-table th {
  background: rgba(59, 130, 246, 0.1);
  font-weight: 600;
  color: #ffffff;
  text-align: left;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  font-family: 'Orbitron', sans-serif;
}

.user-table td {
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
  color: rgba(235, 235, 235, 0.8);
}

.table-row {
  transition: all 0.3s ease;
  cursor: pointer;
}

.table-row:hover {
  background: rgba(59, 130, 246, 0.05);
  transform: translateY(-2px);
}

.role-badge, .state-badge, .cert-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.role-badge.customer {
  background: rgba(59, 130, 246, 0.2);
  color: #60A5FA;
  border-color: rgba(59, 130, 246, 0.3);
}

.role-badge.admin {
  background: rgba(249, 115, 22, 0.2);
  color: #F97316;
  border-color: rgba(249, 115, 22, 0.3);
}

.state-badge.init {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
  border-color: rgba(82, 196, 26, 0.3);
}

.state-badge.active {
  background: rgba(59, 130, 246, 0.2);
  color: #60A5FA;
  border-color: rgba(59, 130, 246, 0.3);
}

.state-badge.inactive {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
  border-color: rgba(255, 77, 79, 0.3);
}

.cert-badge.certified {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
  border-color: rgba(82, 196, 26, 0.3);
}

.cert-badge.uncertified {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
  border-color: rgba(255, 77, 79, 0.3);
}

.user-actions {
  display: flex;
  gap: 8px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(10, 14, 39, 0.5);
}

.total {
  font-size: 14px;
  color: rgba(235, 235, 235, 0.64);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-info {
  font-size: 14px;
  font-weight: 600;
  min-width: 80px;
  text-align: center;
  font-family: 'Orbitron', sans-serif;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  border-radius: 16px;
  text-align: center;
  margin: 20px 0;
}

.empty-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  margin-bottom: 24px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.empty-icon i {
  font-size: 48px;
  color: #3B82F6;
}

.empty-state h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #ffffff;
  font-family: 'Orbitron', sans-serif;
}

.empty-state p {
  margin: 0 0 32px 0;
  font-size: 14px;
  color: rgba(235, 235, 235, 0.64);
}

/* 图标样式 */
.icon-refresh::before {
  content: '⟳';
}

.icon-plus::before {
  content: '+';
}

.icon-search::before {
  content: '🔍';
}

.icon-edit::before {
  content: '✏️';
}

.icon-delete::before {
  content: '🗑️';
}

.icon-user::before {
  content: '👤';
}
</style>