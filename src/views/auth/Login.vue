<template>
  <div class="login-container">
    <div class="login-form">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>手机号:</label>
          <input v-model="loginForm.telephone" required type="tel"/>
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input v-model="loginForm.password" required type="password"/>
        </div>
        <div class="form-group">
          <label>验证码:</label>
          <div class="captcha-group">
            <input v-model="loginForm.captcha" required type="text"/>
            <button class="btn-captcha" type="button" @click="getCaptcha">获取验证码</button>
          </div>
        </div>
        <button :disabled="loading" class="btn-login" type="submit">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div class="actions">
        <router-link to="/auth/register">没有账号？去注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {authApi} from '@/api/auth'
import {userStore} from '@/store/user'
import {registerDynamicRoutes} from '@/router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const loading = ref(false)

    const loginForm = reactive({
      telephone: '',
      password: '',
      captcha: ''
    })

    const getCaptcha = async () => {
      if (!loginForm.telephone) {
        alert('请先输入手机号')
        return
      }
      try {
        await authApi.getCaptcha(loginForm.telephone)
        alert('验证码已发送')
      } catch (error) {
        console.error('获取验证码失败:', error)
      }
    }

    const handleLogin = async () => {
      loading.value = true
      try {
        const response = await authApi.login(loginForm)
        if (response.success) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('userId', response.data.userId || '1')

          // 加载用户数据和菜单
          await userStore.loadUserData(response.data.userId || '1')

          // 注册动态路由
          registerDynamicRoutes(userStore.menus)

          router.push('/dashboard')
        } else {
          alert(response.message)
        }
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      loginForm,
      loading,
      getCaptcha,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.captcha-group {
  display: flex;
  gap: 10px;
}

.captcha-group input {
  flex: 1;
}

.btn-captcha {
  padding: 10px 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-login:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.actions {
  text-align: center;
  margin-top: 20px;
}

.actions a {
  color: #007bff;
  text-decoration: none;
}
</style>