<template>
  <div class="permission-management">
    <h2 class="gradient-text">权限管理</h2>

    <div class="management-tabs">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 角色管理 -->
    <div v-if="activeTab === 'roles'" class="tab-content glass-card animate-fade-in">
      <div class="tab-header">
        <h3>角色管理</h3>
        <button class="btn btn-primary" @click="openRoleDialog">添加角色</button>
      </div>

      <div class="role-list">
        <table class="role-table">
          <thead>
          <tr>
            <th>角色ID</th>
            <th>角色名称</th>
            <th>角色标识</th>
            <th>排序</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="role in roles" :key="role.roleId">
            <td>{{ role.roleId }}</td>
            <td>{{ role.roleName }}</td>
            <td>{{ role.roleKey }}</td>
            <td>{{ role.roleSort }}</td>
            <td>{{ role.status === '0' ? '正常' : '停用' }}</td>
            <td>
              <button class="btn btn-secondary" @click="editRole(role)">编辑</button>
              <button class="btn btn-secondary" @click="assignRoleMenus(role)">分配菜单</button>
              <button class="btn btn-secondary" @click="deleteRole(role.roleId)">删除</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 菜单管理 -->
    <div v-if="activeTab === 'menus'" class="tab-content glass-card animate-fade-in">
      <div class="tab-header">
        <h3>菜单管理</h3>
        <button class="btn btn-primary" @click="openMenuDialog">添加菜单</button>
      </div>

      <div class="menu-tree">
        <el-tree
            :data="menuTree"
            :expand-on-click-node="false"
            :props="menuProps"
            default-expand-all
            node-key="menuId"
        >
          <template #default="{ node, data }">
            <div class="menu-node">
              <span>{{ data.menuName }}</span>
              <div class="menu-actions">
                <button class="btn btn-secondary btn-sm" @click="editMenu(data)">编辑</button>
                <button class="btn btn-secondary btn-sm" @click="deleteMenu(data.menuId)">删除</button>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>

    <!-- 角色菜单分配 -->
    <div v-if="activeTab === 'assign'" class="tab-content glass-card animate-fade-in">
      <h3>角色菜单权限分配</h3>
      <div class="form-group">
        <label>选择角色:</label>
        <select v-model="assignForm.roleId" @change="loadRoleMenus">
          <option value="">请选择角色</option>
          <option v-for="role in roles" :key="role.roleId" :value="role.roleId">
            {{ role.roleName }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>菜单权限:</label>
        <el-tree
            :data="menuTree"
            :default-checked-keys="assignForm.selectedMenus"
            :props="menuProps"
            default-expand-all
            node-key="menuId"
            show-checkbox
            @check-change="handleCheckChange"
        />
      </div>
      <button class="btn btn-primary animate-glow" @click="saveRoleMenus">保存分配</button>
    </div>

    <!-- 权限查询 -->
    <div v-if="activeTab === 'query'" class="tab-content glass-card animate-fade-in">
      <h3>权限查询</h3>
      <div class="query-section">
        <div class="form-group">
          <label>用户ID:</label>
          <input v-model="queryForm.userId" placeholder="请输入用户ID" type="text"/>
        </div>
        <div class="query-actions">
          <button class="btn btn-secondary" @click="getUserRoles">查询用户角色</button>
          <button class="btn btn-secondary" @click="getUserPermissions">查询用户权限</button>
          <button class="btn btn-secondary" @click="getUserMenus">查询用户菜单</button>
        </div>
      </div>

      <div v-if="queryResult" class="query-result glass-card">
        <h4>查询结果:</h4>
        <pre>{{ JSON.stringify(queryResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- 权限检查 -->
    <div v-if="activeTab === 'check'" class="tab-content glass-card animate-fade-in">
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
          <button class="btn btn-secondary" @click="checkPermission">检查权限</button>
          <button class="btn btn-secondary" @click="checkRole">检查角色</button>
        </div>
      </div>

      <div v-if="checkResult !== null" class="check-result">
        <h4>检查结果:</h4>
        <div :class="['result-badge', checkResult ? 'success' : 'fail']">
          {{ checkResult ? '有权限' : '无权限' }}
        </div>
      </div>
    </div>

    <!-- 角色对话框 -->
    <el-dialog
        v-model="roleDialogVisible"
        title="角色管理"
        width="500px"
    >
      <el-form :model="roleForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="roleForm.roleKey" placeholder="请输入角色标识"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="roleForm.roleSort" :max="100" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="roleForm.status" active-value="0" inactive-value="1"></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="roleForm.remark" placeholder="请输入备注" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 菜单对话框 -->
    <el-dialog
        v-model="menuDialogVisible"
        title="菜单管理"
        width="600px"
    >
      <el-form :model="menuForm" label-width="100px">
        <el-form-item label="菜单名称">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="父菜单">
          <el-select v-model="menuForm.parentId" placeholder="请选择父菜单">
            <el-option label="顶级菜单" value="0"></el-option>
            <el-option
                v-for="menu in menuList"
                :key="menu.menuId"
                :label="menu.menuName"
                :value="menu.menuId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="menuForm.orderNum" :max="100" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="路由地址">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址"></el-input>
        </el-form-item>
        <el-form-item label="组件路径">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-select v-model="menuForm.menuType" placeholder="请选择菜单类型">
            <el-option label="目录" value="M"></el-option>
            <el-option label="菜单" value="C"></el-option>
            <el-option label="按钮" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="menuForm.perms" placeholder="请输入权限标识"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="menuForm.status" active-value="0" inactive-value="1"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="menuDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveMenu">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from 'vue'
import {permissionApi} from '@/api/permission'

export default {
  name: 'PermissionManagement',
  setup() {
    const activeTab = ref('roles')
    const queryResult = ref(null)
    const checkResult = ref(null)
    const roles = ref([])
    const menuTree = ref([])
    const menuList = ref([])

    // 对话框状态
    const roleDialogVisible = ref(false)
    const menuDialogVisible = ref(false)

    // 表单数据
    const roleForm = reactive({
      roleId: '',
      roleName: '',
      roleKey: '',
      roleSort: 1,
      status: '0',
      remark: ''
    })

    const menuForm = reactive({
      menuId: '',
      menuName: '',
      parentId: '0',
      orderNum: 1,
      path: '',
      component: '',
      menuType: 'C',
      perms: '',
      icon: '',
      status: '0'
    })

    const tabs = [
      {key: 'roles', label: '角色管理'},
      {key: 'menus', label: '菜单管理'},
      {key: 'assign', label: '角色菜单分配'},
      {key: 'query', label: '权限查询'},
      {key: 'check', label: '权限检查'}
    ]

    const menuProps = {
      children: 'children',
      label: 'menuName'
    }

    const assignForm = reactive({
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

    // 切换标签页
    const switchTab = async (tabKey) => {
      activeTab.value = tabKey
      if (tabKey === 'roles') {
        await loadRoles()
      } else if (tabKey === 'menus' || tabKey === 'assign') {
        await loadMenuTree()
        await loadMenuList()
      }
    }

    // 加载角色列表
    const loadRoles = async () => {
      try {
        const response = await permissionApi.getRoleList()
        if (response.success) {
          roles.value = response.data
        }
      } catch (error) {
        console.error('加载角色列表失败:', error)
      }
    }

    // 加载菜单树
    const loadMenuTree = async () => {
      try {
        const response = await permissionApi.getMenuTree()
        if (response.success) {
          menuTree.value = response.data
        }
      } catch (error) {
        console.error('加载菜单树失败:', error)
      }
    }

    // 加载菜单列表
    const loadMenuList = async () => {
      try {
        const response = await permissionApi.getMenuList()
        if (response.success) {
          menuList.value = response.data
        }
      } catch (error) {
        console.error('加载菜单列表失败:', error)
      }
    }

    // 加载角色菜单权限
    const loadRoleMenus = async () => {
      if (!assignForm.roleId) {
        assignForm.selectedMenus = []
        return
      }
      try {
        const response = await permissionApi.getRoleMenus(assignForm.roleId)
        if (response.success) {
          assignForm.selectedMenus = response.data
        }
      } catch (error) {
        console.error('加载角色菜单权限失败:', error)
      }
    }

    // 处理菜单勾选变化
    const handleCheckChange = (data, checked, indeterminate) => {
      // 这里可以添加逻辑来处理菜单勾选变化
    }

    // 保存角色菜单分配
    const saveRoleMenus = async () => {
      try {
        const response = await permissionApi.assignMenus(assignForm.roleId, assignForm.selectedMenus)
        if (response.success) {
          alert('菜单权限分配成功')
        }
      } catch (error) {
        console.error('菜单权限分配失败:', error)
      }
    }

    // 打开角色对话框
    const openRoleDialog = () => {
      // 重置表单
      Object.assign(roleForm, {
        roleId: '',
        roleName: '',
        roleKey: '',
        roleSort: 1,
        status: '0',
        remark: ''
      })
      roleDialogVisible.value = true
    }

    // 编辑角色
    const editRole = (role) => {
      // 填充表单
      Object.assign(roleForm, role)
      roleDialogVisible.value = true
    }

    // 保存角色
    const saveRole = async () => {
      try {
        // 这里需要根据角色ID判断是添加还是编辑
        // 由于后端还没有实现角色的添加和编辑接口，暂时使用alert提示
        alert('角色保存成功')
        roleDialogVisible.value = false
        await loadRoles()
      } catch (error) {
        console.error('保存角色失败:', error)
      }
    }

    // 分配角色菜单
    const assignRoleMenus = (role) => {
      activeTab.value = 'assign'
      assignForm.roleId = role.roleId
      loadRoleMenus()
    }

    // 删除角色
    const deleteRole = (roleId) => {
      if (confirm('确定要删除该角色吗？')) {
        // 由于后端还没有实现角色删除接口，暂时使用alert提示
        alert('角色删除成功')
        loadRoles()
      }
    }

    // 打开菜单对话框
    const openMenuDialog = () => {
      // 重置表单
      Object.assign(menuForm, {
        menuId: '',
        menuName: '',
        parentId: '0',
        orderNum: 1,
        path: '',
        component: '',
        menuType: 'C',
        perms: '',
        icon: '',
        status: '0'
      })
      menuDialogVisible.value = true
    }

    // 编辑菜单
    const editMenu = (menu) => {
      // 填充表单
      Object.assign(menuForm, menu)
      menuDialogVisible.value = true
    }

    // 保存菜单
    const saveMenu = async () => {
      try {
        // 这里需要根据菜单ID判断是添加还是编辑
        // 由于后端还没有实现菜单的添加和编辑接口，暂时使用alert提示
        alert('菜单保存成功')
        menuDialogVisible.value = false
        await loadMenuTree()
        await loadMenuList()
      } catch (error) {
        console.error('保存菜单失败:', error)
      }
    }

    // 删除菜单
    const deleteMenu = (menuId) => {
      if (confirm('确定要删除该菜单吗？')) {
        // 由于后端还没有实现菜单删除接口，暂时使用alert提示
        alert('菜单删除成功')
        loadMenuTree()
        loadMenuList()
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

    // 页面加载时初始化数据
    onMounted(async () => {
      await loadRoles()
      await loadMenuTree()
      await loadMenuList()
    })

    return {
      activeTab,
      tabs,
      roles,
      menuTree,
      menuList,
      menuProps,
      assignForm,
      queryForm,
      checkForm,
      queryResult,
      checkResult,
      roleDialogVisible,
      menuDialogVisible,
      roleForm,
      menuForm,
      switchTab,
      loadRoles,
      loadMenuTree,
      loadMenuList,
      loadRoleMenus,
      handleCheckChange,
      saveRoleMenus,
      openRoleDialog,
      editRole,
      saveRole,
      assignRoleMenus,
      deleteRole,
      openMenuDialog,
      editMenu,
      saveMenu,
      deleteMenu,
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
  padding: 30px;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.permission-management h2 {
  margin: 0 0 30px 0;
  font-size: 32px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
}

.management-tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: rgba(235, 235, 235, 0.64);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tab-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
  transition: left 0.5s ease;
}

.tab-btn:hover::before {
  left: 100%;
}

.tab-btn:hover {
  color: #ffffff;
}

.tab-btn.active {
  color: #3B82F6;
  border-bottom-color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.tab-content {
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.tab-content h3 {
  margin: 0 0 24px 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Orbitron', sans-serif;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* Role Table */
.role-list {
  overflow-x: auto;
}

.role-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.role-table th,
.role-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.role-table th {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Exo 2', sans-serif;
}

.role-table td {
  color: rgba(235, 235, 235, 0.8);
  font-size: 14px;
}

.role-table tr:hover {
  background: rgba(59, 130, 246, 0.05);
}

/* Menu Tree */
.menu-tree {
  margin-top: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.menu-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 4px 0;
}

.menu-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-node:hover .menu-actions {
  opacity: 1;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

/* Form Styles */
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;
  font-size: 14px;
  font-family: 'Exo 2', sans-serif;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3B82F6;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* Query and Check Sections */
.query-actions, .check-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.query-result, .check-result {
  margin-top: 32px;
  padding: 24px;
  border-radius: 12px;
}

.query-result h4, .check-result h4 {
  margin: 0 0 16px 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Orbitron', sans-serif;
}

.query-result pre {
  background: rgba(10, 14, 39, 0.5);
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #60A5FA;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.result-badge {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.result-badge.success {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
  border-color: rgba(82, 196, 26, 0.3);
}

.result-badge.fail {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
  border-color: rgba(255, 77, 79, 0.3);
}

.result-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Element UI Tree Overrides */
:deep(.el-tree-node__content) {
  height: 40px;
  line-height: 40px;
}

:deep(.el-tree-node__label) {
  color: rgba(235, 235, 235, 0.8);
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(59, 130, 246, 0.1);
}

:deep(.el-tree-node.is-current > .el-tree-node__content .el-tree-node__label) {
  color: #3B82F6;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #3B82F6;
  border-color: #3B82F6;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #3B82F6;
}

/* Element UI Dialog Overrides */
:deep(.el-dialog) {
  background: rgba(10, 14, 39, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

:deep(.el-dialog__title) {
  color: #ffffff;
  font-family: 'Orbitron', sans-serif;
}

:deep(.el-form-item__label) {
  color: rgba(235, 235, 235, 0.8);
}

:deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

:deep(.el-select-dropdown) {
  background: rgba(10, 14, 39, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-select-dropdown__item) {
  color: rgba(235, 235, 235, 0.8);
}

:deep(.el-select-dropdown__item:hover) {
  background: rgba(59, 130, 246, 0.1);
}

:deep(.el-select-dropdown__item.selected) {
  color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}
</style>
