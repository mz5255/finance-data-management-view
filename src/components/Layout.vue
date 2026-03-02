<template>
  <div class="layout">
    <div class="sidebar glass-nav">
      <div class="logo">
        <div class="logo-content">
          <svg class="logo-icon" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#paint0_linear)" stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"/>
            <path d="M2 17L12 22L22 17" stroke="url(#paint0_linear)" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"/>
            <path d="M2 12L12 17L22 12" stroke="url(#paint0_linear)" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"/>
            <defs>
              <linearGradient id="paint0_linear" gradientUnits="userSpaceOnUse" x1="2" x2="22" y1="2" y2="22">
                <stop stop-color="#3B82F6"/>
                <stop offset="1" stop-color="#00FFFF"/>
              </linearGradient>
            </defs>
          </svg>
          <h3 class="gradient-text">综合数据管理平台</h3>
        </div>
      </div>
      <nav class="menu">
        <menu-item
            v-for="menu in userMenus"
            :key="menu.id"
            :menu="menu"
            @navigate="handleNavigate"
        />
      </nav>
      <div class="user-actions">
        <button class="btn btn-secondary logout-btn" @click="logout">
          <i class="icon-logout"></i>
          退出登录
        </button>
      </div>
    </div>
    <div class="main-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {authApi} from '@/api/auth'
import {userStore} from '@/store/user'
import {registerDynamicRoutes} from '@/router'
import MenuItem from '@/components/MenuItem.vue'

export default {
  name: 'Layout',
  components: {
    MenuItem
  },
  setup() {
    const router = useRouter()
    const userMenus = ref([])

    const loadUserMenus = async () => {
      const userId = localStorage.getItem('userId') || '1'

      if (userStore.menus.length > 0) {
        userMenus.value = userStore.menus
        return
      }

      await userStore.loadUserData(userId)
      userMenus.value = userStore.menus
      registerDynamicRoutes(userStore.menus)
    }

    const handleNavigate = (path) => {
      // 使用相对路径，去掉/dashboard前缀
      const relativePath = path.replace('/dashboard', '')
      router.push(relativePath)
    }

    const logout = async () => {
      try {
        await authApi.logout()
        userStore.clearUserData()
        localStorage.clear()
        router.push('/auth/login')
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    }

    onMounted(() => {
      loadUserMenus()
    })

    return {
      userMenus,
      handleNavigate,
      logout
    }
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  position: relative;
  z-index: 1;
}

.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.logo {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.logo h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.menu {
  flex: 1;
  padding: 24px 0;
}

.user-actions {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  justify-content: center;
}

.main-content {
  flex: 1;
  background: rgba(10, 14, 39, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow-y: auto;
  position: relative;
}

/* Icon styles */
.icon-logout::before {
  content: '🚪';
}
</style>