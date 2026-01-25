// 权限指令
export const permission = {
    mounted(el, binding) {
        const {value} = binding
        const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]')

        if (value && !permissions.includes(value)) {
            el.style.display = 'none'
        }
    },
    updated(el, binding) {
        const {value} = binding
        const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]')

        if (value && !permissions.includes(value)) {
            el.style.display = 'none'
        } else {
            el.style.display = ''
        }
    }
}

// 角色指令
export const role = {
    mounted(el, binding) {
        const {value} = binding
        const roles = JSON.parse(localStorage.getItem('userRoles') || '[]')

        if (value && !roles.includes(value)) {
            el.style.display = 'none'
        }
    },
    updated(el, binding) {
        const {value} = binding
        const roles = JSON.parse(localStorage.getItem('userRoles') || '[]')

        if (value && !roles.includes(value)) {
            el.style.display = 'none'
        } else {
            el.style.display = ''
        }
    }
}