<template>
  <div class="dashboard">
    <div class="header animate-fade-in">
      <h1 class="gradient-text">综合数据管理平台</h1>
      <div class="user-info">
        <span>欢迎回来！</span>
        <router-link class="btn btn-secondary" to="/auth/profile">
          <i class="icon-profile"></i>
          个人信息
        </router-link>
      </div>
    </div>

    <div class="nav-cards">
      <div class="card glass-card animate-fade-in" @click="$router.push('/demo/users')">
        <div class="card-icon">
          <i class="icon-user"></i>
        </div>
        <h3>演示模块</h3>
        <p>用户列表管理</p>
      </div>

      <div class="card glass-card animate-fade-in" @click="$router.push('/permission/management')">
        <div class="card-icon">
          <i class="icon-permission"></i>
        </div>
        <h3>权限管理</h3>
        <p>用户角色权限分配</p>
      </div>

      <div class="card glass-card animate-fade-in" @click="$router.push('/auth/profile')">
        <div class="card-icon">
          <i class="icon-profile"></i>
        </div>
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

/* Icon styles */
.icon-profile::before {
  content: '👨‍💼';
}

.icon-user::before {
  content: '👤';
}

.icon-permission::before {
  content: '🔒';
}
</style>