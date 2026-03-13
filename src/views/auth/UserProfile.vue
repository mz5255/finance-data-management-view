<template>
  <div class="user-profile">
    <h2 class="page-title">个人信息</h2>

    <div class="profile-card glass-card">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <el-skeleton-item style="width: 80px; height: 80px; margin-bottom: 20px;" variant="circle"/>
          <el-skeleton-item style="width: 60%; margin-bottom: 10px;" variant="text"/>
          <el-skeleton-item style="width: 40%;" variant="text"/>
        </template>

        <template #default>
          <div v-if="userInfo" class="profile-content">
            <!-- 用户头像和基本信息 -->
            <div class="avatar-section">
              <el-avatar :size="80" class="user-avatar">
                {{ userInfo.nickName ? userInfo.nickName.charAt(0) : 'U' }}
              </el-avatar>
              <h3 class="user-name">{{ userInfo.nickName || '未设置昵称' }}</h3>
              <p class="user-role">{{ getUserRoleLabel(userInfo.userRole) }}</p>
            </div>

            <!-- 个人信息表单 -->
            <el-form
                ref="profileFormRef"
                :model="formData"
                :rules="formRules"
                class="profile-form"
                label-width="100px"
            >
              <el-form-item label="用户ID">
                <el-input v-model="userInfo.userId" disabled/>
              </el-form-item>

              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" disabled/>
              </el-form-item>

              <el-form-item label="昵称" prop="nickName">
                <el-input
                    v-model="formData.nickName"
                    maxlength="20"
                    placeholder="请输入昵称"
                    show-word-limit
                />
              </el-form-item>

              <el-form-item label="手机号" prop="telephone">
                <el-input
                    v-model="formData.telephone"
                    maxlength="11"
                    placeholder="请输入手机号"
                />
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <el-input
                    v-model="formData.email"
                    placeholder="请输入邮箱"
                />
              </el-form-item>

              <el-form-item label="注册时间">
                <el-input v-model="userInfo.createTime" disabled/>
              </el-form-item>

              <el-form-item>
                <el-button :loading="saving" type="primary" @click="handleSave">
                  <el-icon><Select/></el-icon>
                  保存修改
                </el-button>
                <el-button @click="handleCancel">
                  取消
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {Select} from '@element-plus/icons-vue'
import {authApi} from '@/api/auth'
import {userApi} from '@/api/user'

const router = useRouter()
const userInfo = ref(null)
const loading = ref(false)
const saving = ref(false)
const profileFormRef = ref(null)

// 表单数据
const formData = reactive({
  nickName: '',
  telephone: '',
  email: ''
})

// 表单验证规则
const formRules = {
  nickName: [
    {min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  telephone: [
    {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
  ],
  email: [
    {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
  ]
}

// 用户角色映射
const userRoleMap = {
  CUSTOMER: '普通用户',
  ADMIN: '管理员',
  SUPERADMIN: '超级管理员'
}

const getUserRoleLabel = (role) => {
  return userRoleMap[role] || '未设置'
}

// 获取用户信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const response = await authApi.getUserInfo()
    if ((response.success || response.code == 200) && response.data) {
      userInfo.value = response.data
      // 填充表单数据
      formData.nickName = response.data.nickName || ''
      formData.telephone = response.data.telephone || ''
      formData.email = response.data.email || ''
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

// 保存修改
const handleSave = async () => {
  if (!profileFormRef.value) return

  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      saving.value = true
      try {
        const response = await userApi.updateUserProfile({
          userId: userInfo.value.userId,
          nickName: formData.nickName,
          telephone: formData.telephone,
          email: formData.email
        })

        if (response.success || response.code == 200) {
          ElMessage.success('个人信息修改成功')
          await fetchUserInfo() // 刷新用户信息
        } else {
          ElMessage.error(response.message || '修改失败')
        }
      } catch (error) {
        console.error('修改个人信息失败:', error)
        ElMessage.error('修改个人信息失败')
      } finally {
        saving.value = false
      }
    }
  })
}

// 取消修改
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.user-profile {
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

.profile-card {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  font-size: 32px;
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
  margin-bottom: 16px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.user-role {
  font-size: 14px;
  color: rgba(235, 235, 235, 0.6);
  margin: 0;
}

.profile-form {
  margin-top: 10px;
}

.profile-form :deep(.el-form-item__label) {
  color: rgba(235, 235, 235, 0.8);
}

.profile-form :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-form :deep(.el-input__wrapper:hover),
.profile-form :deep(.el-input__wrapper.is-focus) {
  border-color: #3B82F6;
}

.profile-form :deep(.el-input__inner) {
  color: rgba(235, 235, 235, 0.9);
}

.profile-form :deep(.el-input.is-disabled .el-input__wrapper) {
  background: rgba(0, 0, 0, 0.2);
  opacity: 0.6;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
