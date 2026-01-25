<template>
  <div class="register-container">
    <div class="register-form">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>手机号:</label>
          <input v-model="registerForm.telephone" required type="tel"/>
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input v-model="registerForm.password" required type="password"/>
        </div>
        <div class="form-group">
          <label>确认密码:</label>
          <input v-model="confirmPassword" required type="password"/>
        </div>
        <div class="form-group">
          <label>验证码:</label>
          <div class="captcha-group">
            <input v-model="registerForm.captcha" required type="text"/>
            <button class="btn-captcha" type="button" @click="getCaptcha">获取验证码</button>
          </div>
        </div>
        <button :disabled="loading" class="btn-register" type="submit">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      <div class="actions">
        <router-link to="/auth/login">已有账号？去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {authApi} from '@/api/auth'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const confirmPassword = ref('')

    const registerForm = reactive({
      telephone: '',
      password: '',
      captcha: ''
    })

    const getCaptcha = async () => {
      if (!registerForm.telephone) {
        alert('请先输入手机号')
        return
      }
      try {
        await authApi.getCaptcha(registerForm.telephone)
        alert('验证码已发送')
      } catch (error) {
        console.error('获取验证码失败:', error)
      }
    }

    const handleRegister = async () => {
      if (registerForm.password !== confirmPassword.value) {
        alert('两次密码输入不一致')
        return
      }

      loading.value = true
      try {
        const response = await authApi.register(registerForm)
        if (response.success) {
          alert('注册成功')
          router.push('/auth/login')
        } else {
          alert(response.message)
        }
      } catch (error) {
        console.error('注册失败:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      registerForm,
      confirmPassword,
      loading,
      getCaptcha,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-form {
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

.btn-register {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-register:disabled {
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