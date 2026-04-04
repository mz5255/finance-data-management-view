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
            this.permissions.splice(0, this.permissions.length)
            this.roles.splice(0, this.roles.length)
            this.menus.splice(0, this.menus.length)

            localStorage.removeItem('userPermissions')
            localStorage.removeItem('userRoles')
            localStorage.removeItem('userMenus')

            const permResponse = await permissionApi.getUserPermissions(userId)
            if (permResponse.code == 200) {
                const newPermissions = permResponse.data || []
                this.permissions.push(...newPermissions)
                localStorage.setItem('userPermissions', JSON.stringify(this.permissions))
            }

            const roleResponse = await permissionApi.getUserRoles(userId)
            if (roleResponse.code == 200) {
                const newRoles = roleResponse.data || []
                this.roles.push(...newRoles)
                localStorage.setItem('userRoles', JSON.stringify(this.roles))
            }

            const menuResponse = await permissionApi.getUserMenus(userId)
            if (menuResponse.code == 200) {
                const newMenus = menuResponse.data || []
                this.menus.push(...newMenus)
                localStorage.setItem('userMenus', JSON.stringify(this.menus))
            }
        } catch (error) {
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