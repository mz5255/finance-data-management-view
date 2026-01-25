<template>
  <div class="permission-management">
    <h2>权限管理</h2>

    <div class="management-tabs">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 角色分配 -->
    <div v-if="activeTab === 'roles'" class="tab-content">
      <h3>用户角色分配</h3>
      <div class="form-group">
        <label>用户ID:</label>
        <input v-model="roleForm.userId" placeholder="请输入用户ID" type="text"/>
      </div>
      <div class="form-group">
        <label>角色列表:</label>
        <div class="checkbox-group">
          <label v-for="role in availableRoles" :key="role.id" class="checkbox-item">
            <input
                v-model="roleForm.selectedRoles"
                :value="role.id"
                type="checkbox"
            />
            {{ role.name }}
          </label>
        </div>
      </div>
      <button class="btn-primary" @click="assignRoles">分配角色</button>
    </div>

    <!-- 菜单权限分配 -->
    <div v-if="activeTab === 'menus'" class="tab-content">
      <h3>角色菜单权限分配</h3>
      <div class="form-group">
        <label>角色ID:</label>
        <input v-model="menuForm.roleId" placeholder="请输入角色ID" type="text"/>
      </div>
      <div class="form-group">
        <label>菜单权限:</label>
        <div class="checkbox-group">
          <label v-for="menu in availableMenus" :key="menu.id" class="checkbox-item">
            <input
                v-model="menuForm.selectedMenus"
                :value="menu.id"
                type="checkbox"
            />
            {{ menu.name }}
          </label>
        </div>
      </div>
      <button class="btn-primary" @click="assignMenus">分配菜单权限</button>
    </div>

    <!-- 权限查询 -->
    <div v-if="activeTab === 'query'" class="tab-content">
      <h3>权限查询</h3>
      <div class="query-section">
        <div class="form-group">
          <label>用户ID:</label>
          <input v-model="queryForm.userId" placeholder="请输入用户ID" type="text"/>
        </div>
        <div class="query-actions">
          <button class="btn-info" @click="getUserRoles">查询用户角色</button>
          <button class="btn-info" @click="getUserPermissions">查询用户权限</button>
          <button class="btn-info" @click="getUserMenus">查询用户菜单</button>
        </div>
      </div>

      <div v-if="queryResult" class="query-result">
        <h4>查询结果:</h4>
        <pre>{{ JSON.stringify(queryResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- 权限检查 -->
    <div v-if="activeTab === 'check'" class="tab-content">
      <h3>权限检查</h3>
      <div class="check-section">
        <div class="form-group">
          <label>用户ID:</label>
          <input v-model="checkForm.userId" placeholder="请输入用户ID" type="text"/>
        </div>
        <div class="form-group">
          <label>权限标识:</label>
          <input v-model="checkForm.permission" placeholder="如: system:user:list" type="text"/>
        </div>
        <div class="form-group">
          <label>角色标识:</label>
          <input v-model="checkForm.role" placeholder="如: admin" type="text"/>
        </div>
        <div class="check-actions">
          <button class="btn-warning" @click="checkPermission">检查权限</button>
          <button class="btn-warning" @click="checkRole">检查角色</button>
        </div>
      </div>

      <div v-if="checkResult !== null" class="check-result">
        <h4>检查结果:</h4>
        <div :class="['result-badge', checkResult ? 'success' : 'fail']">
          {{ checkResult ? '有权限' : '无权限' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from 'vue'
import {permissionApi} from '@/api/permission'

export default {
  name: 'PermissionManagement',
  setup() {
    const activeTab = ref('roles')
    const queryResult = ref(null)
    const checkResult = ref(null)

    const tabs = [
      {key: 'roles', label: '角色分配'},
      {key: 'menus', label: '菜单权限'},
      {key: 'query', label: '权限查询'},
      {key: 'check', label: '权限检查'}
    ]

    const availableRoles = ref([
      {id: 1, name: '管理员'},
      {id: 2, name: '普通用户'},
      {id: 3, name: '客服'}
    ])

    const availableMenus = ref([
      {id: 1, name: '用户管理'},
      {id: 2, name: '权限管理'},
      {id: 3, name: '系统设置'}
    ])

    const roleForm = reactive({
      userId: '',
      selectedRoles: []
    })

    const menuForm = reactive({
      roleId: '',
      selectedMenus: []
    })

    const queryForm = reactive({
      userId: ''
    })

    const checkForm = reactive({
      userId: '',
      permission: '',
      role: ''
    })

    const assignRoles = async () => {
      try {
        const response = await permissionApi.assignRoles(roleForm.userId, roleForm.selectedRoles)
        if (response.success) {
          alert('角色分配成功')
        }
      } catch (error) {
        console.error('角色分配失败:', error)
      }
    }

    const assignMenus = async () => {
      try {
        const response = await permissionApi.assignMenus(menuForm.roleId, menuForm.selectedMenus)
        if (response.success) {
          alert('菜单权限分配成功')
        }
      } catch (error) {
        console.error('菜单权限分配失败:', error)
      }
    }

    const getUserRoles = async () => {
      try {
        const response = await permissionApi.getUserRoles(queryForm.userId)
        queryResult.value = response.data
      } catch (error) {
        console.error('查询用户角色失败:', error)
      }
    }

    const getUserPermissions = async () => {
      try {
        const response = await permissionApi.getUserPermissions(queryForm.userId)
        queryResult.value = response.data
      } catch (error) {
        console.error('查询用户权限失败:', error)
      }
    }

    const getUserMenus = async () => {
      try {
        const response = await permissionApi.getUserMenus(queryForm.userId)
        queryResult.value = response.data
      } catch (error) {
        console.error('查询用户菜单失败:', error)
      }
    }

    const checkPermission = async () => {
      try {
        const response = await permissionApi.checkPermission(checkForm.userId, checkForm.permission)
        checkResult.value = response.data
      } catch (error) {
        console.error('检查权限失败:', error)
      }
    }

    const checkRole = async () => {
      try {
        const response = await permissionApi.checkRole(checkForm.userId, checkForm.role)
        checkResult.value = response.data
      } catch (error) {
        console.error('检查角色失败:', error)
      }
    }

    return {
      activeTab,
      tabs,
      availableRoles,
      availableMenus,
      roleForm,
      menuForm,
      queryForm,
      checkForm,
      queryResult,
      checkResult,
      assignRoles,
      assignMenus,
      getUserRoles,
      getUserPermissions,
      getUserMenus,
      checkPermission,
      checkRole
    }
  }
}
</script>

<style scoped>
.permission-management {
  padding: 20px;
}

.management-tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tab-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
}

.query-actions, .check-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary, .btn-info, .btn-warning {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.btn-primary {
  background: #007bff;
}

.btn-info {
  background: #17a2b8;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.query-result, .check-result {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
}

.query-result pre {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

.result-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
}

.result-badge.success {
  background: #d4edda;
  color: #155724;
}

.result-badge.fail {
  background: #f8d7da;
  color: #721c24;
}
</style>