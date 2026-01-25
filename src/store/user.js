import {reactive} from 'vue'
import {permissionApi} from '@/api/permission'

export const userStore = reactive({
    userInfo: null,
    permissions: [],
    roles: [],
    menus: [],

    async loadUserData(userId) {
        try {
            // 加载用户权限
            const permResponse = await permissionApi.getUserPermissions(userId)
            if (permResponse.success) {
                this.permissions = permResponse.data
                localStorage.setItem('userPermissions', JSON.stringify(permResponse.data))
            }

            // 加载用户角色
            const roleResponse = await permissionApi.getUserRoles(userId)
            if (roleResponse.success) {
                this.roles = roleResponse.data
                localStorage.setItem('userRoles', JSON.stringify(roleResponse.data))
            }

            // 加载用户菜单
            const menuResponse = await permissionApi.getUserMenus(userId)
            if (menuResponse.success) {
                this.menus = menuResponse.data
                localStorage.setItem('userMenus', JSON.stringify(menuResponse.data))
            }
        } catch (error) {
            console.error('加载用户数据失败:', error)
        }
    },

    hasPermission(permission) {
        return this.permissions.includes(permission)
    },

    hasRole(role) {
        return this.roles.includes(role)
    },

    clearUserData() {
        this.userInfo = null
        this.permissions = []
        this.roles = []
        this.menus = []
        localStorage.removeItem('userPermissions')
        localStorage.removeItem('userRoles')
        localStorage.removeItem('userMenus')
    }
})