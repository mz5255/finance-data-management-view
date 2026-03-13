<template>
  <div class="dashboard">
    <div class="header animate-fade-in">
      <h1 class="gradient-text">综合数据管理平台</h1>
      <div class="user-info">
        <span>欢迎回来，{{ userName }}！</span>
        <el-dropdown class="user-dropdown" @command="handleCommand">
          <span class="el-dropdown-link">
            <el-icon><User/></el-icon>
            个人管理
            <el-icon class="el-icon--right"><arrow-down/></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon>
                  <User/>
                </el-icon>
                个人信息
              </el-dropdown-item>
              <el-dropdown-item command="password">
                <el-icon>
                  <Lock/>
                </el-icon>
                修改密码
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon>
                  <SwitchButton/>
                </el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="nav-cards">
      <!-- 菜单已移除，通过侧边栏菜单访问 -->
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {ArrowDown, Lock, SwitchButton, User} from '@element-plus/icons-vue'
import {authApi} from '@/api/auth'
import {userStore} from '@/store/user'

export default {
  name: 'Dashboard',
  components: {
    User,
    Lock,
    SwitchButton,
    ArrowDown
  },
  setup() {
    const router = useRouter()
    const userName = ref('用户')

    // 获取用户信息
    const loadUserInfo = async () => {
      try {
        const response = await authApi.getUserInfo()
        if (response.code == 200 && response.data) {
          userName.value = response.data.nickName || response.data.username || '用户'
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }

    // 处理下拉菜单命令
    const handleCommand = (command) => {
      switch (command) {
        case 'profile':
          router.push('/dashboard/profile')
          break
        case 'password':
          router.push('/dashboard/password')
          break
        case 'logout':
          logout()
          break
      }
    }

    // 退出登录
    const logout = async () => {
      try {
        await authApi.logout()
        userStore.clearUserData()
        localStorage.clear()
        ElMessage.success('退出登录成功')
        router.push('/auth/login')
      } catch (error) {
        console.error('退出登录失败:', error)
        ElMessage.error('退出登录失败')
      }
    }

    onMounted(() => {
      loadUserInfo()
    })

    return {
      userName,
      handleCommand
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 30px;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
}

.header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  color: rgba(235, 235, 235, 0.8);
}

.user-dropdown {
  margin-left: 8px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: rgba(235, 235, 235, 0.9);
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-dropdown-link:hover {
  background: rgba(59, 130, 246, 0.2);
  color: #3B82F6;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  padding: 40px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
  transition: left 0.5s ease;
}

.card:hover::before {
  left: 100%;
}

.card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.card-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.2));
  border-radius: 20px;
  margin: 0 auto 24px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.card:hover .card-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.card-icon i {
  font-size: 32px;
  color: #3B82F6;
}

.card h3 {
  margin: 0 0 12px 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s ease;
}

.card:hover h3 {
  color: #3B82F6;
}

.card p {
  margin: 0;
  color: rgba(235, 235, 235, 0.64);
  font-size: 14px;
  transition: all 0.3s ease;
}

.card:hover p {
  color: rgba(235, 235, 235, 0.8);
}
</style>