<template>
  <div class="register-container">
    <div class="register-overlay"></div>
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
  justify-content: flex-end;
  align-items: flex-start;
  min-height: 100vh;
  padding: 50px 80px;
  box-sizing: border-box;
  /* 保持与登录页一致的背景图 */
  background-image: url('@/base/images/register.jpg');
  background-size: 100% 100%;
  background-position: center;
  position: relative;
}

.register-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.register-form {
  position: relative;
  z-index: 2;
  /* 全透明背景 */
  background: transparent;
  padding: 40px;
  border-radius: 20px;
  width: 420px;
  /* 极致纯净感 */
  border: none;
  box-shadow: none;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 35px;
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #ffffff;
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  color: #ffffff;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #ffffff;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.captcha-group {
  display: flex;
  gap: 12px;
}

.captcha-group input {
  flex: 1;
}

.btn-captcha {
  padding: 0 20px;
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-captcha:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-register {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
}

.btn-register:disabled {
  background: #ccc;
  box-shadow: none;
  cursor: not-allowed;
}

.actions {
  text-align: center;
  margin-top: 25px;
}

.actions a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.actions a:hover {
  color: #007bff;
  text-decoration: underline;
}
</style>
