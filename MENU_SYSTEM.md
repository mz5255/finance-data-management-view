# 动态菜单和权限系统

## 🎯 核心功能

### 1. 动态菜单系统

- **自动菜单生成**: 根据用户权限动态生成侧边栏菜单
- **层级菜单支持**: 支持多级菜单展开/收起
- **权限过滤**: 只显示用户有权限访问的菜单项

### 2. 动态路由注册

- **自动路由注册**: 登录时根据用户菜单自动注册路由
- **懒加载**: 页面组件按需加载
- **权限验证**: 路由级别的权限检查

### 3. 权限控制指令

- **v-permission**: 按钮级权限控制
- **v-role**: 角色级权限控制
- **编程式权限检查**: userStore.hasPermission()

## 📁 新增文件结构

```
src/
├── components/
│   ├── Layout.vue          # 主布局组件（含侧边栏菜单）
│   └── MenuItem.vue        # 菜单项组件
├── directives/
│   └── permission.js       # 权限控制指令
├── store/
│   └── user.js            # 用户状态管理
├── mock/
│   └── menu.js            # 模拟菜单数据
└── router/
    └── index.js           # 动态路由配置
```

## 🔧 使用方式

### 1. 权限指令使用

```vue
<!-- 按权限显示/隐藏按钮 -->
<button v-permission="'system:user:delete'">删除</button>

<!-- 按角色显示/隐藏按钮 -->
<button v-role="'admin'">管理员功能</button>
```

### 2. 编程式权限检查

```javascript
import { userStore } from '@/store/user'

// 检查权限
if (userStore.hasPermission('system:user:delete')) {
  // 执行删除操作
}

// 检查角色
if (userStore.hasRole('admin')) {
  // 执行管理员操作
}
```

### 3. 菜单数据格式

```javascript
{
  id: 1,
  title: '系统管理',
  path: '/dashboard/system',
  icon: 'icon-system',
  permission: 'system:view',
  component: '/system/Index.vue', // 对应 src/views 下的路径
  children: [...]
}
```

## 🚀 工作流程

1. **用户登录** → 获取token和userId
2. **加载用户数据** → 获取权限、角色、菜单
3. **注册动态路由** → 根据菜单自动注册路由
4. **渲染菜单** → 显示用户有权限的菜单项
5. **权限控制** → 页面和按钮级权限验证

## 🎨 特性

- ✅ 基于权限的动态菜单
- ✅ 自动路由注册
- ✅ 多级菜单支持
- ✅ 权限指令控制
- ✅ 路由守卫验证
- ✅ 响应式设计
- ✅ 模拟数据支持

现在用户登录后会看到基于其权限的个性化菜单，只能访问有权限的功能模块。