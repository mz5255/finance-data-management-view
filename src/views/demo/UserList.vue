<template>
  <div class="user-list">
    <h2>用户列表</h2>
    <div class="actions">
      <button
          v-permission="'system:user:list'"
          class="btn-primary"
          @click="fetchUsers"
      >
        获取用户列表
      </button>
      <button
          v-permission="'system:user:delete'"
          class="btn-danger"
          @click="deleteUser"
      >
        删除用户
      </button>
      <button
          v-role="'admin'"
          class="btn-success"
          @click="addUser"
      >
        添加用户（仅管理员）
      </button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-if="users.length" class="user-table">
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>
            <button
                v-permission="'system:user:edit'"
                class="btn-sm btn-primary"
                @click="editUser(user)"
            >
              编辑
            </button>
            <button
                v-permission="'system:user:delete'"
                class="btn-sm btn-danger"
                @click="deleteUser"
            >
              删除
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!loading" class="empty-state">
      <p>暂无用户数据</p>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import {demoApi} from '@/api/demo'
import {userStore} from '@/store/user'

export default {
  name: 'UserList',
  setup() {
    const users = ref([
      {id: 1, username: '张三'},
      {id: 2, username: '李四'},
      {id: 3, username: '王五'}
    ])
    const loading = ref(false)

    const fetchUsers = async () => {
      loading.value = true
      try {
        const response = await demoApi.getUserList()
        if (response.success) {
          users.value = response.data || []
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    const deleteUser = async () => {
      if (!userStore.hasPermission('system:user:delete')) {
        alert('您没有删除用户的权限')
        return
      }

      try {
        const response = await demoApi.deleteUser()
        if (response.success) {
          alert('删除成功')
          fetchUsers()
        }
      } catch (error) {
        console.error('删除用户失败:', error)
      }
    }

    const addUser = () => {
      alert('添加用户功能')
    }

    const editUser = (user) => {
      alert(`编辑用户: ${user.username}`)
    }

    return {
      users,
      loading,
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
  padding: 20px;
}

.actions {
  margin: 20px 0;
}

.btn-primary, .btn-danger, .btn-success, .btn-sm {
  padding: 8px 16px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.user-table table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.user-table th {
  background-color: #f2f2f2;
}

.loading, .empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>