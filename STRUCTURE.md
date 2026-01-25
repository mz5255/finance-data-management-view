# 前端页面结构说明

## 项目结构

```
src/
├── views/                    # 页面组件
│   ├── auth/                # 认证模块
│   │   ├── Login.vue        # 登录页面
│   │   ├── Register.vue     # 注册页面
│   │   └── UserProfile.vue  # 用户信息页面
│   ├── demo/                # 演示模块
│   │   └── UserList.vue     # 用户列表页面
│   ├── permission/          # 权限管理模块
│   │   └── PermissionManagement.vue  # 权限管理页面
│   └── Dashboard.vue        # 仪表板页面
├── api/                     # API接口
│   ├── auth.js             # 认证相关接口
│   ├── demo.js             # 演示模块接口
│   └── permission.js       # 权限管理接口
├── utils/                   # 工具类
│   └── request.js          # HTTP请求封装
└── router/                  # 路由配置
    └── index.js            # 路由定义
```

## API对应关系

### 1. Demo模块 (`/demo`)

- **后端**: `DemoTest.java`
- **前端页面**: `UserList.vue`
- **功能**:
    - 获取用户列表 (`GET /list`)
    - 删除用户 (`POST /delete`)

### 2. 认证模块 (`/auth`)

- **后端**: `AuthController.java`
- **前端页面**:
    - `Login.vue` - 登录
    - `Register.vue` - 注册
    - `UserProfile.vue` - 用户信息
- **功能**:
    - 获取验证码 (`GET /api/finance-data/auth/captchaImage`)
    - 用户注册 (`POST /api/finance-data/auth/register`)
    - 用户登录 (`POST /api/finance-data/auth/login`)
    - 查询用户信息 (`GET /api/finance-data/auth/query`)
    - 用户登出 (`POST /api/finance-data/auth/logout`)

### 3. 权限管理模块 (`/permission`)

- **后端**: `PermissionController.java`
- **前端页面**: `PermissionManagement.vue`
- **功能**:
    - 角色分配 (`POST /api/finance-data/system/permission/assignRoles`)
    - 菜单权限分配 (`POST /api/finance-data/system/permission/assignMenus`)
    - 查询用户角色 (`GET /api/finance-data/system/permission/userRoles/{userId}`)
    - 查询用户权限 (`GET /api/finance-data/system/permission/userPermissions/{userId}`)
    - 权限检查 (`GET /api/finance-data/system/permission/checkPermission`)
    - 角色检查 (`GET /api/finance-data/system/permission/checkRole`)
    - 获取用户菜单 (`GET /api/finance-data/system/permission/getMenuTreeByUserId`)

## 路由结构

- `/` - 重定向到登录页
- `/auth/login` - 登录页面
- `/auth/register` - 注册页面
- `/auth/profile` - 用户信息页面
- `/demo/users` - 用户列表页面
- `/permission/management` - 权限管理页面
- `/dashboard` - 仪表板（登录后首页）

## 安装和运行

1. 安装依赖:

```bash
npm install
```

2. 启动开发服务器:

```bash
npm run dev
```

3. 构建生产版本:

```bash
npm run build
```