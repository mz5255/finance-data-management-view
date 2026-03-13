import {reactive} from 'vue'
import {permissionApi} from '@/api/permission'

// 构建菜单树
function buildMenuTree(menus, parentId = '0') {
    const tree = []
    menus.forEach(menu => {
        // 使用宽松比较，兼容字符串和数字类型
        if (menu.parentId == parentId) {
            const children = buildMenuTree(menus, menu.menuId)
            tree.push({
                ...menu,
                children: children.length > 0 ? children : undefined
            })
        }
    })
    return tree
}

export const userStore = reactive({
    userInfo: null,
    permissions: [],
    roles: [],
    menus: [],

    async loadUserData(userId) {
        try {
            console.log('开始加载用户数据，userId:', userId)

            // 先清空旧数据，使用 splice 确保响应式更新
            this.permissions.splice(0, this.permissions.length)
            this.roles.splice(0, this.roles.length)
            this.menus.splice(0, this.menus.length)

            // 清除 localStorage 中的旧数据
            localStorage.removeItem('userPermissions')
            localStorage.removeItem('userRoles')
            localStorage.removeItem('userMenus')

            // 加载用户权限
            const permResponse = await permissionApi.getUserPermissions(userId)
            console.log('权限响应:', permResponse)
            if (permResponse.code == 200) {
                const newPermissions = permResponse.data || []
                this.permissions.push(...newPermissions)
                localStorage.setItem('userPermissions', JSON.stringify(this.permissions))
                console.log('用户权限:', this.permissions)
            }

            // 加载用户角色
            const roleResponse = await permissionApi.getUserRoles(userId)
            console.log('角色响应:', roleResponse)
            if (roleResponse.code == 200) {
                const newRoles = roleResponse.data || []
                this.roles.push(...newRoles)
                localStorage.setItem('userRoles', JSON.stringify(this.roles))
                console.log('用户角色:', this.roles)
            }

            // 加载用户菜单
            const menuResponse = await permissionApi.getUserMenus(userId)
            console.log('菜单响应:', menuResponse)
            if (menuResponse.code == 200) {
                // 后端已返回树形结构，直接使用
                const newMenus = menuResponse.data || []
                this.menus.push(...newMenus)
                localStorage.setItem('userMenus', JSON.stringify(this.menus))
                console.log('用户菜单(树形):', this.menus)
            }
        } catch (error) {
            console.error('加载用户数据失败:', error)
            // 加载失败时确保清空数据
            this.permissions.splice(0, this.permissions.length)
            this.roles.splice(0, this.roles.length)
            this.menus.splice(0, this.menus.length)
            localStorage.removeItem('userPermissions')
            localStorage.removeItem('userRoles')
            localStorage.removeItem('userMenus')
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
        this.permissions.splice(0, this.permissions.length)
        this.roles.splice(0, this.roles.length)
        this.menus.splice(0, this.menus.length)
        localStorage.removeItem('userPermissions')
        localStorage.removeItem('userRoles')
        localStorage.removeItem('userMenus')
    }
})