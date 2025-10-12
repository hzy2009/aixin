## 回答语言
请始终使用简体中文来回答我的所有问题和请求。

## 开发命令 (Development Commands)

- `npm run dev` - 启动开发服务器 (Vite)
- `npm run build` - 生产环境构建 (使用生产模式)
- `npm run build:prod` - 显式生产环境构建
- `npm run build:test` - 测试环境构建
- `npm run preview` - 本地预览生产构建

## 项目架构 (Project Architecture)

这是一个Vue 3 + Vite应用程序，用于集成电路信息共享平台（爱芯享信息服务平台）。应用程序采用模块化架构，基于功能的路由设计。

### 技术栈 (Tech Stack)
- **前端框架**: Vue 3 with Composition API 和 `<script setup>` 语法
- **构建工具**: Vite with 热模块替换
- **UI组件库**: Ant Design Vue 4.x + VXE Table 用于数据表格
- **状态管理**: Pinia with 持久化插件
- **路由**: Vue Router 4 with 嵌套路由
- **HTTP客户端**: Axios with 自定义包装器和拦截器
- **样式**: Less预处理器 with CSS模块支持

### 主要目录结构 (Key Directory Structure)
- `src/views/` - 按业务领域组织的功能模块:
  - `home/` - 首页和着陆页内容
  - `auth/` - 身份验证 (登录/忘记密码)
  - `demand_square/` - 需求广场，包含子分类
  - `user_center/` - 用户仪表板和个人资料管理
  - `secondTrade/` - 共济共享功能
  - `industryDynamics/` & `rdDynamic/` - 行业动态和研发更新
- `src/components/` - 可重用组件:
  - `layout/` - 布局组件 (头部、侧边栏等)
  - `common/` - 共享UI组件
  - `template/` - CRUD操作的模板组件
- `src/store/` - Pinia stores，`authStore` 处理身份验证
- `src/api/` - API服务模块
- `src/utils/` - 实用工具，包括HTTP客户端和权限管理

### 代码风格约定 (Code Style Conventions)

#### 组件风格 (Component Style)
- 使用 `<script setup>` 语法，配合 `defineProps` 和 `defineEmits`
- 组件命名采用PascalCase，文件名也使用PascalCase
- Props定义包含类型和默认值，使用中文作为默认placeholder文本
- 事件发射器使用 `update:modelValue` 实现v-model双向绑定
- 样式使用 `scoped` 和 `lang="less"`，支持深度选择器 `:deep()`

#### 状态管理模式 (State Management Pattern)
- Pinia stores使用 `defineStore` 定义
- Store中包含中文注释和明确的状态说明
- 支持状态持久化到localStorage
- Actions使用async/await处理异步操作
- 模态框状态集中管理，支持回调函数配置

#### 工具函数模式 (Utility Function Pattern)
- 工具函数使用ES6模块导出
- 包含JSDoc注释，支持中文说明
- 提供`safeGet`安全取值函数
- 日期格式化使用dayjs库
- 权限检查使用高阶函数`withPermission`包装

#### 样式组织 (Style Organization)
- Less变量以 `@` 开头，使用语义化命名
- 主色调: `@primary-color: #BC1A2C` (红色主题)
- 支持深色和浅色变体
- 间距变量: `@spacing-xs` 到 `@spacing-xxl`
- 混入函数如 `.centered-content()` 用于布局
- 字体使用PingFang SC作为首选中文字体

### 身份验证与授权 (Authentication & Authorization)
- 基于Token的身份验证，存储在Pinia中并持久化到localStorage
- 路由守卫检查 `meta.requiresAuth` 和基于角色的权限
- 自定义axios拦截器处理token注入和401响应
- 角色代码包括 `apm-super-vip-free` 和 `apm-super-vip` 用于高级功能
- 权限检查支持"all"通配符和角色数组

### API集成 (API Integration)
- 后端代理: `/jeecgboot` → `http://47.115.47.114:8080/jeecg-boot/`
- 自定义axios包装器位于 `src/utils/http/axios.js`，包含错误处理
- 响应格式期望 `{ code, data, message }` 结构
- 文件上传支持FormData处理
- 使用环境变量配置API基础URL

### 表格数据处理 (Table Data Handling)
- 使用VXE Table作为主要数据表格组件
- 表格列配置通过常量文件管理 (`src/utils/const.jsx`)
- 支持JSX语法定义复杂的单元格内容
- 列配置支持formatter函数进行数据格式化
- 状态标签使用Ant Design的Tag组件
- 操作列支持权限控制和确认弹窗

### 样式约定 (Styling Conventions)
- 全局样式位于 `src/assets/styles/`
- Less变量和混入用于一致的主题设计
- Ant Design主题自定义在 `vite.config.js` 中
- VXE Table样式覆写在专用LESS文件中
- 支持响应式设计和移动端适配

### 开发注意事项 (Development Notes)
- 使用 `@` 别名指向 `src/` 目录
- Vue DevTools支持已启用
- 开发环境配置热重载
- Docker部署使用Nginx (参见Dockerfile)
- 支持环境特定构建 (dev/test/prod)
- 使用pnpm作为包管理器

### 路由结构 (Route Structure)
所有功能路由都嵌套在 `DefaultLayout` 下，除了身份验证路由。每个功能模块导出自己的路由数组，在主路由配置中合并。路由支持元数据配置，包括标题、面包屑和权限要求。

### 权限系统设计 (Permission System Design)
- 使用 `usePermissions` composable进行权限管理
- 支持页面级和操作级权限控制
- 权限检查失败时显示登录模态框或错误提示
- 支持权限包装函数，简化事件处理器的权限检查

### 常用开发模式 (Common Development Patterns)

#### 1. 页面组件开发
```vue
<template>
  <!-- 使用中文placeholder -->
  <a-input placeholder="请输入关键字" />
</template>

<script setup>
// 使用defineProps和中文注释
const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入关键字' // 中文默认值
  }
});
</script>

<style scoped lang="less">
// 使用Less变量和深度选择器
:deep(.ant-input) {
  color: @text-color-base;
}
</style>
```

#### 2. 权限控制模式
```javascript
// 使用withPermission包装函数
const handleClick = withPermission(
  ['apm-vip'], // 需要的角色
  () => { /* 执行操作 */ },
  '抱歉，您没有权限执行此操作' // 中文错误提示
);
```

#### 3. 表格列配置
```javascript
// 在const.jsx中定义表格列
export const COLUMNS = [
  { title: '序号', type: 'seq', width: 50, align: 'center' },
  { 
    title: '状态', 
    field: 'status',
    formatter: ({ cellValue }) => {
      // 使用selectOptions进行数据转换
      return selectOptions('status_dict').find(item => item.value === cellValue)?.label;
    }
  }
];
```

### 重要提醒 (Important Notes)
- **中文优先**: 所有用户界面文本、错误提示、placeholder等都使用中文
- **组件复用**: 优先使用现有的模板组件和通用组件
- **权限检查**: 所有敏感操作都需要进行权限验证
- **错误处理**: 使用统一的错误处理机制和用户友好的中文提示
- **代码注释**: 重要的业务逻辑需要添加中文注释说明
- **样式一致性**: 遵循现有的Less变量和混入模式
- **响应式设计**: 确保在不同屏幕尺寸下的良好显示效果