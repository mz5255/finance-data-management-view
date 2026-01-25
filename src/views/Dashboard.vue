<template>
  <div class="dashboard">
    <div class="header">
      <h1>财务数据管理系统</h1>
      <div class="user-info">
        <span>欢迎回来！</span>
        <router-link class="profile-link" to="/auth/profile">个人信息</router-link>
      </div>
    </div>

    <div class="nav-cards">
      <div class="card" @click="$router.push('/demo/users')">
        <h3>演示模块</h3>
        <p>用户列表管理</p>
      </div>

      <div class="card" @click="$router.push('/permission/management')">
        <h3>权限管理</h3>
        <p>用户角色权限分配</p>
      </div>

      <div class="card" @click="$router.push('/auth/profile')">
        <h3>个人中心</h3>
        <p>查看个人信息</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  color: white;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid white;
  border-radius: 4px;
  transition: all 0.3s;
}

.profile-link:hover {
  background: white;
  color: #667eea;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.5rem;
}

.card p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}
</style>