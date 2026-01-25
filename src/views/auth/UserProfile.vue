<template>
  <div class="user-profile">
    <h2>用户信息</h2>
    <div class="profile-card">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="userInfo" class="user-details">
        <div class="detail-item">
          <label>用户ID:</label>
          <span>{{ userInfo.id }}</span>
        </div>
        <div class="detail-item">
          <label>用户名:</label>
          <span>{{ userInfo.username }}</span>
        </div>
        <div class="detail-item">
          <label>手机号:</label>
          <span>{{ userInfo.telephone }}</span>
        </div>
        <div class="detail-item">
          <label>创建时间:</label>
          <span>{{ userInfo.createTime }}</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn-primary" @click="refreshUserInfo">刷新信息</button>
        <button class="btn-danger" @click="logout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {authApi} from '@/api/auth'

export default {
  name: 'UserProfile',
  setup() {
    const router = useRouter()
    const userInfo = ref(null)
    const loading = ref(false)

    const fetchUserInfo = async () => {
      loading.value = true
      try {
        const response = await authApi.getUserInfo({})
        if (response.success) {
          userInfo.value = response.data
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      } finally {
        loading.value = false
      }
    }

    const refreshUserInfo = () => {
      fetchUserInfo()
    }

    const logout = async () => {
      try {
        await authApi.logout()
        localStorage.removeItem('token')
        router.push('/auth/login')
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    }

    onMounted(() => {
      fetchUserInfo()
    })

    return {
      userInfo,
      loading,
      refreshUserInfo,
      logout
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.profile-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-details {
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-item label {
  font-weight: bold;
  width: 120px;
  color: #666;
}

.detail-item span {
  flex: 1;
  color: #333;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-primary, .btn-danger {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>