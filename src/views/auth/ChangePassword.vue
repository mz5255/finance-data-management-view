<template>
  <div class="change-password">
    <h2 class="page-title">修改密码</h2>

    <div class="password-card glass-card">
      <el-form
          ref="passwordFormRef"
          :model="formData"
          :rules="formRules"
          class="password-form"
          label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
              v-model="formData.oldPassword"
              clearable
              placeholder="请输入原密码"
              show-password
              type="password"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
              v-model="formData.newPassword"
              clearable
              placeholder="请输入新密码（6-20位）"
              show-password
              type="password"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              v-model="formData.confirmPassword"
              clearable
              placeholder="请再次输入新密码"
              show-password
              type="password"
          />
        </el-form-item>

        <el-form-item>
          <el-button :loading="submitting" type="primary" @click="handleSubmit">
            <el-icon><Select/></el-icon>
            确认修改
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {Select} from '@element-plus/icons-vue'
import {authApi} from '@/api/auth'

const router = useRouter()
const passwordFormRef = ref(null)
const submitting = ref(false)

// 表单数据
const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 自定义验证规则
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== formData.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const formRules = {
  oldPassword: [
    {required: true, message: '请输入原密码', trigger: 'blur'}
  ],
  newPassword: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, validator: validateConfirmPassword, trigger: 'blur'}
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const response = await authApi.changePassword({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })

        if (response.success || response.code == 200) {
          // 密码修改成功，先清除本地存储
          localStorage.clear()
          // 显示成功消息
          ElMessage.success('密码修改成功，请重新登录')
          // 立即跳转到登录页
          router.replace('/auth/login')
        } else {
          ElMessage.error(response.message || '修改密码失败')
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        // 判断是否是 401 错误（token 失效）
        if (error.response?.status === 401) {
          // token 失效说明密码修改成功，跳转到登录页
          localStorage.clear()
          ElMessage.success('密码修改成功，请重新登录')
          router.replace('/auth/login')
        } else {
          ElMessage.error(error.response?.data?.message || '修改密码失败，请检查原密码是否正确')
        }
      } finally {
        submitting.value = false
      }
    }
  })
}

// 取消修改
const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.change-password {
  padding: 30px;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 30px 0;
  font-family: 'Orbitron', sans-serif;
}

.password-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.password-form {
  margin-top: 20px;
}

.password-form :deep(.el-form-item__label) {
  color: rgba(235, 235, 235, 0.8);
}

.password-form :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.password-form :deep(.el-input__wrapper:hover),
.password-form :deep(.el-input__wrapper.is-focus) {
  border-color: #3B82F6;
}

.password-form :deep(.el-input__inner) {
  color: rgba(235, 235, 235, 0.9);
}

.password-form :deep(.el-input__inner::placeholder) {
  color: rgba(235, 235, 235, 0.4);
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
