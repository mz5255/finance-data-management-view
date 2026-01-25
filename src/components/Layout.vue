<template>
  <div class="layout">
    <div class="sidebar">
      <div class="logo">
        <h3>财务管理系统</h3>
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
        <button class="logout-btn" @click="logout">退出登录</button>
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

      // 如果 store 中已有菜单数据，直接使用
      if (userStore.menus.length > 0) {
        userMenus.value = userStore.menus
        return
      }

      // 否则重新加载
      await userStore.loadUserData(userId)
      userMenus.value = userStore.menus
      registerDynamicRoutes(userStore.menus)
    }

    const handleNavigate = (path) => {
      router.push(path)
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
}

.sidebar {
  width: 250px;
  background: #001529;
  color: white;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  border-bottom: 1px solid #333;
}

.logo h3 {
  margin: 0;
  color: white;
}

.menu {
  flex: 1;
  padding: 20px 0;
}

.user-actions {
  padding: 20px;
  border-top: 1px solid #333;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.main-content {
  flex: 1;
  background: #f0f2f5;
  overflow-y: auto;
}
</style>