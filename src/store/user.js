import {reactive} from 'vue'
import {permissionApi} from '@/api/permission'

export const userStore = reactive({
    userInfo: null,
    permissions: [],
    roles: [],
    menus: [],

    async loadUserData(userId) {
        try {
            console.log('开始加载用户数据，userId:', userId)

            // 加载用户权限
            const permResponse = await permissionApi.getUserPermissions(userId)
            console.log('权限响应:', permResponse)
            if (permResponse.success) {
                this.permissions = permResponse.data || []
                localStorage.setItem('userPermissions', JSON.stringify(this.permissions))
                console.log('用户权限:', this.permissions)
            }

            // 加载用户角色
            const roleResponse = await permissionApi.getUserRoles(userId)
            console.log('角色响应:', roleResponse)
            if (roleResponse.success) {
                this.roles = roleResponse.data || []
                localStorage.setItem('userRoles', JSON.stringify(this.roles))
                console.log('用户角色:', this.roles)
            }

            // 加载用户菜单
            const menuResponse = await permissionApi.getUserMenus(userId)
            console.log('菜单响应:', menuResponse)
            if (menuResponse.success) {
                this.menus = menuResponse.data || []
                localStorage.setItem('userMenus', JSON.stringify(this.menus))
                console.log('用户菜单:', this.menus)
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