<template>
  <div class="register-container">
    <!-- Background Orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- Full Screen Particles -->
    <div class="particles-container">
      <div v-for="i in 100" :key="i" :style="{animationDelay: `${i * 0.05}s`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`}"
           class="particle"></div>
    </div>

    <!-- Left Animation Section -->
    <div class="animation-section">
      <div class="animation-content">
        <!-- Background Grid -->
        <div class="grid-background"></div>

        <!-- Animated Orbs -->
        <div class="animated-orbs">
          <div class="orb orb-large"></div>
          <div class="orb orb-medium"></div>
          <div class="orb orb-small"></div>
        </div>

        <div class="hero-text">
          <h1 class="gradient-text animate-float animate-glow">综合数据管理平台</h1>
          <p class="hero-subtitle animate-fade-in">创建新账号，开启智能综合数据管理新时代</p>

          <!-- Animated Stats -->
          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-number animate-count">0.1秒</div>
              <div class="stat-label">快速注册</div>
            </div>
            <div class="stat-item">
              <div class="stat-number animate-count">24/7</div>
              <div class="stat-label">技术支持</div>
            </div>
            <div class="stat-item">
              <div class="stat-number animate-count">100%</div>
              <div class="stat-label">数据安全</div>
            </div>
          </div>
        </div>

        <!-- Animated Gradient Lines -->
        <div class="gradient-lines">
          <div class="line line-1"></div>
          <div class="line line-2"></div>
          <div class="line line-3"></div>
          <div class="line line-4"></div>
          <div class="line line-5"></div>
        </div>
      </div>
    </div>

    <!-- Middle Decorative Section -->
    <div class="decorative-section">
      <div class="decorative-elements">
        <div class="glow-circle"></div>
        <div class="glow-ring"></div>
        <div class="glow-dot"></div>
      </div>
    </div>

    <!-- Right Form Section -->
    <div class="form-section">
      <div class="register-form glass-card animate-fade-in">
        <div class="form-header">
          <div class="logo">
            <svg class="logo-icon" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#paint0_linear)" stroke-linecap="round" stroke-linejoin="round"
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
            <h1 class="gradient-text">综合数据管理平台</h1>
          </div>
          <h2>用户注册</h2>
          <p class="sub-title">创建新账号，开始您的财务管理之旅</p>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>手机号:</label>
            <input v-model="registerForm.telephone" placeholder="请输入手机号" required type="tel"/>
          </div>
          <div class="form-group">
            <label>密码:</label>
            <input v-model="registerForm.password" placeholder="请输入密码" required type="password"/>
          </div>
          <div class="form-group">
            <label>确认密码:</label>
            <input v-model="confirmPassword" placeholder="请确认密码" required type="password"/>
          </div>
          <div class="form-group">
            <label>验证码:</label>
            <div class="captcha-group">
              <input v-model="registerForm.captcha" placeholder="请输入验证码" required type="text"/>
              <img
                  v-if="captchaImage"
                  :src="captchaImage"
                  alt="验证码"
                  class="captcha-image"
                  title="点击刷新验证码"
                  @click="getCaptcha"
              />
              <button v-else class="btn btn-secondary" type="button" @click="getCaptcha">获取验证码</button>
            </div>
          </div>
          <button :disabled="loading" class="btn btn-primary animate-glow" type="submit">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>
        <div class="actions">
          <router-link to="/auth/login">已有账号？去登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {authApi} from '@/api/auth'
import {v4 as uuidv4} from 'uuid'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const confirmPassword = ref('')
    const captchaImage = ref('')
    const captchaKey = ref('')

    const registerForm = reactive({
      telephone: '13130608426',
      password: 'mazhen5255',
      captcha: '',
      captchaKey: ''
    })

    // 页面加载时自动获取验证码
    onMounted(() => {
      getCaptcha()
    })

    const getCaptcha = async () => {
      try {
        // 生成uuid+时间戳
        captchaKey.value = `${uuidv4()}_${Date.now()}`
        registerForm.captchaKey = captchaKey.value

        const imageUrl = await authApi.getCaptcha(captchaKey.value)
        captchaImage.value = imageUrl
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
          // 注册成功后存储token
          if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token)
            // 直接跳转到仪表板
            router.push('/dashboard')
          } else {
            // 如果没有返回token，跳转到登录页
            alert('注册成功')
            router.push('/auth/login')
          }
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
      captchaImage,
      getCaptcha,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  z-index: 1;
  gap: 40px;
}

/* Animation Section - Left */
.animation-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 80vh;
  overflow: hidden;
}

.animation-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

/* Grid Background */
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  z-index: 0;
}

/* Animated Orbs */
.animated-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.animated-orbs .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: orbFloat 15s infinite ease-in-out;
}

.orb-large {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(0, 255, 255, 0.1) 100%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-medium {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.1) 100%);
  bottom: -50px;
  right: 10%;
  animation-delay: 3s;
}

.orb-small {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(251, 191, 36, 0.1) 100%);
  top: 40%;
  right: -50px;
  animation-delay: 6s;
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  25% {
    transform: translate(20px, -20px) scale(1.1);
    opacity: 0.7;
  }
  50% {
    transform: translate(0, -40px) scale(1);
    opacity: 0.5;
  }
  75% {
    transform: translate(-20px, -20px) scale(0.9);
    opacity: 0.3;
  }
}

.hero-text {
  text-align: center;
  z-index: 10;
  margin-bottom: 40px;
  padding: 20px;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.hero-text h1 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  font-family: 'Orbitron', sans-serif;
  line-height: 1.2;
  text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 20px;
  color: rgba(235, 235, 235, 0.8);
  font-family: 'Exo 2', sans-serif;
  max-width: 500px;
  line-height: 1.4;
  margin-bottom: 30px;
}

/* Stats Container */
.stats-container {
  display: flex;
  gap: 30px;
  margin-top: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-radius: 0;
  border: none;
  min-width: 120px;
  transition: all 0.3s ease;
  box-shadow: none;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: none;
  border-color: transparent;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #3B82F6;
  font-family: 'Orbitron', sans-serif;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.stat-label {
  font-size: 14px;
  color: rgba(235, 235, 235, 0.6);
  font-family: 'Exo 2', sans-serif;
}

/* Particles Animation */
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #3B82F6, #00FFFF);
  border-radius: 50%;
  animation: particleFloat 8s infinite ease-in-out;
  opacity: 0.6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-30px) translateX(15px) scale(1.3);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-60px) translateX(0) scale(1);
    opacity: 0.6;
  }
  75% {
    transform: translateY(-30px) translateX(-15px) scale(0.8);
    opacity: 0.3;
  }
}

/* Gradient Lines Animation */
.gradient-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
  height: 1px;
  animation: lineMove 4s infinite ease-in-out;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.line-1 {
  top: 10%;
  width: 100%;
  animation-delay: 0s;
}

.line-2 {
  top: 30%;
  width: 80%;
  left: 10%;
  animation-delay: 0.5s;
}

.line-3 {
  top: 50%;
  width: 60%;
  left: 20%;
  animation-delay: 1s;
}

.line-4 {
  top: 70%;
  width: 80%;
  left: 10%;
  animation-delay: 1.5s;
}

.line-5 {
  top: 90%;
  width: 100%;
  animation-delay: 2s;
}

@keyframes lineMove {
  0%, 100% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    transform: translateX(100%);
    opacity: 1;
  }
}

/* Count Animation */
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-count {
  animation: countUp 1s ease-out forwards;
}

/* Enhanced Glow Animation */
@keyframes enhancedGlow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  50% {
    text-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(0, 255, 255, 0.6);
  }
}

.animate-glow {
  animation: enhancedGlow 2s ease-in-out infinite;
}

/* Decorative Section - Middle */
.decorative-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100%;
  position: relative;
}

.decorative-elements {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glow-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(0, 255, 255, 0.1) 100%);
  animation: glowPulse 3s infinite ease-in-out;
  position: absolute;
}

.glow-ring {
  width: 120px;
  height: 120px;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: ringRotate 8s infinite linear;
  position: absolute;
}

.glow-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3B82F6, #00FFFF);
  animation: dotPulse 2s infinite ease-in-out;
  position: absolute;
  top: 40%;
  right: 30%;
}

@keyframes glowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

@keyframes ringRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

/* Form Section - Right */
.form-section {
  flex: 0 0 420px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-form {
  width: 100%;
  padding: 40px;
  border-radius: 0;
  position: relative;
  z-index: 2;
  background: transparent;
  border: none;
  box-shadow: none;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.logo h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
}

.register-form h2 {
  margin: 0 0 8px 0;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
}

.sub-title {
  margin: 0;
  font-size: 14px;
  color: rgba(235, 235, 235, 0.64);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
  font-family: 'Exo 2', sans-serif;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  transition: all 0.3s ease;
  font-size: 14px;
  font-family: 'Exo 2', sans-serif;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-group input:focus {
  outline: none;
  border-color: #3B82F6;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.captcha-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-group input {
  flex: 1;
}

.captcha-image {
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.captcha-image:hover {
  border-color: #3B82F6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
}

.btn-register {
  width: 100%;
  margin-top: 16px;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  padding: 14px;
}

.actions {
  text-align: center;
  margin-top: 24px;
}

.actions a {
  color: #3B82F6;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.actions a:hover {
  color: #60A5FA;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .register-container {
    flex-direction: column;
    gap: 20px;
  }

  .animation-section {
    order: 1;
    min-height: 300px;
  }

  .decorative-section {
    order: 2;
    width: 100px;
    height: 100px;
  }

  .form-section {
    order: 3;
    flex: 1;
    max-width: 420px;
  }

  .hero-text h1 {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 16px;
  }
}
</style>
