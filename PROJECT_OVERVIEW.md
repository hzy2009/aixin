### **爱芯享电子信息服务平台 - 项目说明文档**

#### **1. 项目概述**

本项目是 **爱芯享电子信息服务平台** 的前端应用，一个专为电子信息产业打造的综合性服务平台。它基于 Vue 3 和 Vite 构建，采用现代化、模块化的开发方式，旨在为用户提供高效、稳定的在线服务体验。平台核心功能包括用户认证、需求发布、资源共享、行业资讯以及个人用户中心等。

#### **2. 技术栈**

项目采用了当前前端领域主流且成熟的技术栈，以确保开发效率和应用性能：

- **核心框架**: **Vue 3**，全面采用 **Composition API** 及 `<script setup>` 语法，提升了代码的可读性和可维护性。
- **构建工具**: **Vite**，提供了极速的开发服务器启动和热模块更新（HMR），优化了开发体验。
- **UI 组件库**:
  - **Ant Design Vue 4.x**: 用于构建项目整体的 UI 界面，提供丰富、高质量的组件。
  - **VXE Table**: 一个功能强大的表格组件库，专门用于处理复杂的数据表格和 CRUD 操作。
- **状态管理**: **Pinia**，Vue 官方推荐的状态管理库，提供类型安全、代码简洁的中央状态管理方案，并集成了持久化插件以保存用户登录状态。
- **路由管理**: **Vue Router 4**，用于管理应用的页面导航，支持嵌套路由和基于模块的路由配置。
- **HTTP 请求**: **Axios**，封装了统一的 HTTP 请求客户端，包含请求/响应拦截器，用于自动注入 Token 和集中的错误处理。
- **CSS 预处理器**: **Less**，用于编写样式，支持变量、混入等高级特性，便于维护和主题定制。

#### **3. 项目架构与目录结构**

项目采用基于功能的模块化架构，代码结构清晰，职责分明。主要目录结构如下：

```
src/
├── api/             # API 服务模块，按业务功能划分
├── assets/          # 静态资源，如图片、全局样式等
├── components/      # 全局可复用组件
│   ├── common/      # 通用基础组件（如模态框、上传组件）
│   ├── layout/      # 布局组件（如页头、页脚、侧边栏）
│   └── template/    # 业务模板组件（如标准列表页、详情页）
├── router/          # 路由配置中心
├── store/           # Pinia 状态管理模块
├── utils/           # 全局工具函数、常量和权限控制等
└── views/           # 页面视图，按业务模块划分
    ├── auth/        # 用户认证模块（登录、注册）
    ├── demand_square/ # 需求广场模块
    ├── home/        # 首页模块
    ├── user_center/ # 用户中心模块
    └── ...          # 其他业务模块
```

- **模块化设计**: `src/views` 目录下的每个子目录都代表一个独立的业务模块（如用户中心、需求广场），每个模块都包含自己的路由配置 (`routes.js`)、视图组件和业务逻辑，实现了高度的内聚和低耦合。
- **组件化策略**: `src/components` 目录对组件进行了三层抽象：
  1.  `layout/`: 负责应用的整体布局结构。
  2.  `common/`: 提供了在多个页面中可重复使用的原子组件，如 `FileUploadModal` (文件上传弹窗)、`SearchInput` (搜索框) 等。
  3.  `template/`: 封装了通用的页面模式，如 `listPage.vue` (列表页模板)，极大地减少了重复的开发工作。

##### **业务模板组件 (`src/components/template/`) 详细说明**

`src/components/template/` 目录存放了项目中用于快速构建常见业务页面（如列表页、详情页、编辑/创建页）的模板组件。这些组件是高度可配置的，通过接收 `pageData` 配置对象来动态渲染页面内容和行为，极大地提高了开发效率和代码一致性。它们遵循 Vue 3 Composition API 和 `<script setup>` 语法，并广泛使用 Ant Design Vue 和 VXE Table 组件库。

**1. `listPage.vue` (通用列表页面模板)**

- **功能**: 提供一个功能全面的通用列表页面模板，支持数据展示、搜索、筛选、统计、分页以及批量操作等。它通过配置驱动的方式，能够适应不同业务场景的列表展示需求。
- **Props**:
    - `pageData` (Object, 必填): 页面配置对象，定义了此列表页的所有行为和显示内容。
        - `filterConfigForPage` (Array<Object>, 默认值: `[]`): 筛选器配置数组。每个对象定义一个筛选条件，包含 `label` (显示名称), `field` (对应数据字段), `type` (筛选组件类型，如 'select', 'input'), `options` (当 `type` 为 'select' 时的选项), `dictKey` (字典键，用于从全局字典获取选项)。
            - **示例**:
                ```javascript
                [
                  { label: '状态', field: 'status', type: 'select', dictKey: 'demand_status' },
                  { label: '关键字', field: 'keyword', type: 'input' }
                ]
                ```
        - `tableOperations` (Array<Object>, 默认值: `[]`): 表格上方左侧操作按钮配置数组。每个对象包含 `title` (按钮文本), `btnType` (按钮类型，如 'add', 'exportXls', 'upload', 'delete'), `permission` (所需权限), `callback` (点击回调函数)。
            - **示例**:
                ```javascript
                [
                  { title: '新增', btnType: 'add', permission: ['demand:add'], callback: () => router.push('/demand/add') },
                  { title: '导出', btnType: 'exportXls', permission: ['demand:export'] }
                ]
                ```
        - `tableOperationsRight` (Array<Object>, 默认值: `[]`): 表格上方右侧操作按钮配置数组，与 `tableOperations` 类似。
        - `dateRangeConfig` (Array<Object>, 默认值: `[]`): 日期范围选择器配置数组。每个对象包含 `label` (显示名称), `field` (对应数据字段), `type` (日期选择器类型，如 'date', 'month', 'year', 'range')。
            - **示例**:
                ```javascript
                [
                  { label: '创建日期', field: 'createTime', type: 'range' }
                ]
                ```
        - `requiredRoles` (Array<String>, 默认值: `[]`): 执行页面操作所需的角色权限数组。
        - `initialFilters` (Object, 默认值: `{}`): 页面初始化时的默认筛选条件对象。
            - **示例**: `{ status: 'active' }`
        - `userStatCardVisible` (Boolean, 默认值: `false`): 控制统计卡片是否显示。
        - `showBanner` (Boolean, 默认值: `false`): 是否显示顶部Banner。
        - `pageTitle` (String, 默认值: `''`): 页面主标题。
        - `searchTitle` (String, 默认值: `''`): 搜索结果的标题后缀（例如：“个需求”）。
        - `listPageisPadding` (Boolean, 默认值: `false`): 控制页面顶部的内边距是否应用。
        - `userSearchTitle` (Boolean, 默认值: `false`): 是否显示搜索结果数量的标题。
        - `isUseFilterDelete` (Boolean, 默认值: `false`): 是否显示“已删除”筛选按钮。
        - `otherParams` (Object, 默认值: `{}`): 传递给数据请求的其他参数。
        - `apiMap` (Object, 必填): API 接口配置对象。
            - `list` (String): 获取列表数据的 API 路径。
            - `delete` (String, 可选): 删除数据的 API 路径。
            - `exportXls` (String, 可选): 导出 Excel 的 API 路径。
            - `importXls` (String, 可选): 导入 Excel 的 API 路径。
            - **示例**:
                ```javascript
                {
                  list: '/jeecg-boot/demand/list',
                  delete: '/jeecg-boot/demand/delete',
                  exportXls: '/jeecg-boot/demand/export'
                }
                ```
        - `vxeTableColumns` (Array<Object>, 必填): VXE Table 的列配置数组。
            - **示例**:
                ```javascript
                [
                  { type: 'checkbox', width: 50 },
                  { field: 'demandName', title: '需求名称' },
                  { field: 'status', title: '状态', formatter: ({ cellValue }) => selectOptions('demand_status').find(item => item.value === cellValue)?.label },
                  { title: '操作', width: 150, slots: { default: 'action' } }
                ]
                ```
- **技术特点**:
    - **高度配置化**: 通过 `pageData` 对象即可灵活配置页面的各个部分，无需修改组件内部逻辑。
    - **组合式函数 (`useUserDemandList`)**: 核心数据获取（包括异步加载）、筛选、搜索、分页、数据导出、文件上传、数据重置等逻辑被封装在 `useUserDemandList` 组合式函数中，实现了逻辑的复用和解耦。它维护了页面的核心状态（如 `stats`, `search`, `tableData`, `pagination` 等）。
    - **UI 组件集成**: 集成了 `UserStatCardSm` (统计卡片)、`UserFilterAccordion` (筛选器)、`MultiDateRangePickerGroup` (日期范围选择器)、`a-input` (搜索框) 等通用布局组件，提供统一的查询界面。
    - **数据表格**: 使用 `vxe-grid` (VXE Table) 作为主数据展示组件，支持高度灵活的列配置 (`vxeTableColumns`)、加载状态、数据多选 (`checkbox-config`)、分页 (`pager-config`) 等高级功能。
    - **权限控制**: 结合 `usePermissions` 组合式函数，对所有需要权限的搜索、筛选和操作按钮等功能进行权限检查 (`withPermission`)，未授权操作将有统一的提示。
    - **操作行为策略化**: 表格上方操作按钮通过 `btnType`（如 `exportXls`, `delete`, `upload`）触发预设处理逻辑，通过策略模式 (`operationHandlers`) 简化了代码结构，易于扩展新的操作类型。
    - **事件处理**: 使用 `@pressEnter` 触发搜索，`@focus` 记录搜索框值，`@blur` 处理清除搜索条件后的自动搜索。
- **代码示例 (核心结构)**:
    ```vue
    <template>
      <div class="list-page container">
        <UserStatCardSm :stats=stats.list v-if="pageData.userStatCardVisible" />
        <UserFilterAccordion :filter-groups="pageData.filterConfigForPage" @filters-changed="handleFiltersChange" />
        <div class="search-action-bar">
          <a-input v-model:value="search" :placeholder="`请输入${pageData.pageTitle}关键字`" @pressEnter="handleSearchWithPermission" />
          <div class="results-count-wrapper" v-if="pageData.userSearchTitle">为您找到 {{ pagination.total }} 个{{ pageData.searchTitle }}</div>
        </div>
        <div class="table-operations-bar">
          <a-space>
            <a-button v-for="op in pageData.tableOperations" :key="op.btnType" @click="() => handleOperationClick(op)">{{ op.title }}</a-button>
          </a-space>
          <a-space class="right-operations">
            <a-button v-for="op in pageData.tableOperationsRight" :key="op.btnType" @click="() => handleOperationClick(op)">{{ op.title }}</a-button>
          </a-space>
        </div>
        <vxe-grid :data="tableData" :columns="pageData.vxeTableColumns" :loading="isLoading" @page-change="handlePageChange" />
      </div>
    </template>

    <script setup lang="jsx">
    import { ref, toRefs } from 'vue';
    import { useUserDemandList } from './hooks/useUserDemandList.jsx'; // 核心逻辑 Hook
    import UserStatCardSm from '@/components/layout/UserStatCardSm.vue';
    import UserFilterAccordion from '@/components/layout/UserFilterAccordion.vue';
    import { usePermissions } from '@/utils/usePermissions';
    import { useRouter } from 'vue-router';

    const props = defineProps({
      pageData: {
        type: Object,
        required: true,
        default: () => ({})
      }
    });
    const router = useRouter();
    const pageDataRefs = toRefs(props.pageData);

    const { stats, search, isLoading, tableData, pagination,
      loadTableData, handleFiltersChange, triggerSearch, handlePageChange,
      handleOperationClick // 假设这个函数也从hook中导出
    } = useUserDemandList({ pageConfig: pageDataRefs, router }); // 传递router以便hook中进行路由跳转

    const { withPermission } = usePermissions();
    const handleSearchWithPermission = withPermission(pageDataRefs.requiredRoles.value, triggerSearch, '抱歉，您没有权限执行此搜索操作');

    defineExpose({ loadTableData });
    </script>
    ```

**2. `detail.vue` (通用详情页面模板)**

- **功能**: 提供一个高度可配置的通用详情页面模板，支持数据的查看和编辑（通过切换模式）、动态表单渲染、图片预览、状态跟踪以及自定义操作按钮。它能够灵活地展示和管理不同业务实体的详细信息。
- **Props**:
    - `pageData` (Object, 必填): 页面配置对象，定义了此详情页的所有行为和显示内容。
        - `IdProp` (String, 默认值: `'id'`): 详情数据的唯一标识字段名，例如 'id'。
        - `mode` (String, 默认值: `'view'`): 页面模式，如 `view` (查看) 或 `edit` (编辑)。
        - `pageTitle` (String, 默认值: `'详情'`): 页面标题。
        - `apiMap` (Object, 必填): API 接口配置对象。
            - `detail` (String): 获取详情数据的 API 路径。
            - `submit` (String, 可选): 提交（保存）数据的 API 路径。
            - **示例**:
                ```javascript
                {
                  detail: '/jeecg-boot/demand/queryById',
                  submit: '/jeecg-boot/demand/edit'
                }
                ```
        - `formConfigs` (Array<Object>, 必填): 表单配置数组，定义详情字段的显示方式、校验规则和表单组件类型。每个对象包含 `label` (显示名称), `field` (对应数据字段), `fieldType` (表单组件类型，如 'input', 'select', 'textarea', 'imageUpload'), `rules` (校验规则), `options` (当 `fieldType` 为 'select' 时的选项), `dictKey` (字典键)。
            - **示例**:
                ```javascript
                [
                  { label: '需求名称', field: 'demandName', fieldType: 'input', rules: [{ required: true, message: '请输入需求名称' }] },
                  { label: '需求描述', field: 'description', fieldType: 'textarea' },
                  { label: '状态', field: 'status', fieldType: 'select', dictKey: 'demand_status' },
                  { label: '附件', field: 'attachments', fieldType: 'imageUpload', multiple: true }
                ]
                ```
        - `tableSections` (Array<Object>, 默认值: `[]`): 详情页内嵌表格的配置数组，用于展示关联数据。每个对象包含 `title` (表格标题), `api` (获取表格数据的 API), `columns` (VXE Table 列配置)。
            - **示例**:
                ```javascript
                [
                  {
                    title: '关联产品',
                    api: '/jeecg-boot/demand/relatedProducts',
                    columns: [
                      { field: 'productName', title: '产品名称' },
                      { field: 'quantity', title: '数量' }
                    ]
                  }
                ]
                ```
        - `canSubmit` (Boolean, 默认值: `false`): 是否可提交的标志。
        - `showLogList` (Boolean, 默认值: `true`): 是否显示状态跟踪列表。
        - `showPageTitle` (Boolean, 默认值: `true`): 是否显示页面标题。
        - `listPath` (String, 默认值: `''`): 列表页的路由路径，用于操作成功后的跳转。
        - `actionNote` (String, 默认值: `'一键敲门'`): 提交按钮的文本。
        - `actionNotes` (Array<Object>, 默认值: `[]`): 自定义操作按钮列表。每个对象包含 `title` (按钮文本), `type` (按钮类型), `callback` (点击回调函数), `permission` (所需权限)。
            - **示例**:
                ```javascript
                [
                  { title: '审核通过', type: 'success', callback: (data) => console.log('审核通过', data), permission: ['demand:audit'] },
                  { title: '驳回', type: 'danger', callback: (data) => console.log('驳回', data), permission: ['demand:reject'] }
                ]
                ```
        - `statusTrackingTitle` (String, 默认值: `'状态跟踪'`): 状态跟踪部分的标题。
        - `isUseBack` (Boolean, 默认值: `true`): 是否显示返回按钮。
        - `localeGetDetail` (Function, 可选): 本地获取详情数据的函数，用于覆盖默认的API请求。接收 `id` 作为参数，返回 Promise。
        - `submitTpe` (String, 默认值: `'api'`): 提交类型，`'fn'` 表示调用内部函数，其他值表示触发 `emit('submit')`。
        - `handleBeforeSubmit` (Function, 可选): 提交前的钩子函数，用于数据预处理。接收表单数据作为参数，返回处理后的数据。
        - `isUseDelete` (Boolean, 默认值: `false`): 是否显示删除按钮。
        - `successTitle` (String, 默认值: `'操作成功'`): 操作成功后的提示标题。
        - `statusHistoryColumns` (Array<Object>, 默认值: `[]`): 状态历史表格的列配置。
        - `otherParams` (Object, 默认值: `{}`): 传递给数据请求的其他参数。
- **技术特点**:
    - **高度配置化**: 通过 `pageData` 对象灵活配置详情页的结构、数据源、操作和展示逻辑。
    - **多模式支持**: 通过 `isView` 响应式变量控制页面在“查看模式”和“编辑模式”之间切换，从而动态渲染只读视图或可编辑表单。
    - **组合式函数**:
        - `useDemandDetail`: 负责根据路由 `id` 获取详情数据，并处理数据的保存 (`handleSave`) 和提交 (`handleSubmit`)。
        - `useDetailForm`: 核心表单渲染逻辑。它根据 `formConfigs` 动态生成表单项 (`displayFields`, `formComponentMap`)，并管理表单的验证和数据获取 (`getAllData`)。
        - `useImagePreview`: 提供统一的图片预览功能 (`handleImagePreview`)。
    - **动态表单渲染**: 根据 `formConfigs` 定义的 `fieldType` 动态加载和渲染不同的 Ant Design Vue 表单组件（通过 `formComponentMap`），并支持通过 `slot` 自定义复杂表单项。
    - **状态跟踪**: 集成 `CustomProgressTimeline` (自定义进度时间线) 组件，配合 `formModel.progressList` 展示业务流程的状态历史和日志。
    - **操作按钮**: 底部操作区域支持自定义按钮列表 (`actionNotesList`)，每个按钮可配置标题、类型和回调，实现灵活的业务操作。
    - **路由集成**: 侦听路由参数 `id` 的变化，自动重新获取详情数据，确保页面数据与路由状态同步。
- **代码示例 (核心结构)**:
    ```vue
    <template>
      <div class="detail-view-page">
        <h2 class="page-main-heading" v-if="pageData.showPageTitle">{{ pageData.pageTitle }}</h2>
        <a-spin :spinning="isLoading">
          <div v-if="isCreating">
            <section class="info-section">
              <h3>基本信息</h3>
              <div class="basic-info-grid">
                <template v-if="isView"> <!-- 查看模式 -->
                  <div v-for="field in displayFields" :key="field.field">
                    <span>{{ field.label }}：</span>
                    <span>{{ field.value }}</span>
                  </div>
                </template>
                <template v-else> <!-- 编辑模式 -->
                  <a-form :model="formModel" :rules="formRules" layout="vertical">
                    <a-row :gutter="16">
                      <a-col :span="12" v-for="item in formConfigs" :key="item.field">
                        <a-form-item :label="item.label" :name="item.field">
                          <component :is="formComponentMap[item.fieldType]" v-model:value="formModel[item.field]" v-bind="item.props || {}" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form>
                </template>
              </div>
            </section>
            <section v-if="pageData.showLogList && formModel.progressList && formModel.progressList.length" class="info-section">
              <h3>{{ pageData.statusTrackingTitle || '状态跟踪' }}</h3>
              <CustomProgressTimeline :progressList="formModel.progressList" />
            </section>
            <div class="page-actions-footer">
              <a-button @click="handleDefaultCancel" v-if="pageData.isUseBack">返回</a-button>
              <a-button type="primary" @click="handleToEdit" v-if="isView && pageData.mode !== 'create'">修改单据</a-button>
              <a-button type="primary" @click="handleDefaultSubmit" v-else-if="pageData.mode !== 'view'">{{ pageData.actionNote }}</a-button>
              <a-button v-for="action in pageData.actionNotes" :key="action.title" :type="action.type || 'default'" @click="() => handleCustomAction(action)">
                {{ action.title }}
              </a-button>
            </div>
          </div>
          <operationResultPage v-else :pageData="{title: pageData.successTitle}" @primaryAction="handleToDetail" @secondaryAction="handleToList" />
        </a-spin>
        <a-modal :open="previewVisible" :footer="null" @cancel="handleImagePreview(null)">
          <img :src="previewImage" style="width: 100%" />
        </a-modal>
      </div>
    </template>

    <script setup>
    import { computed, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useDemandDetail } from './hooks/useDemandDetail.js';
    import { useDetailForm } from './hooks/useDetailForm.js';
    import { useImagePreview } from './hooks/useImagePreview.js';
    import operationResultPage from './operationResultPage.vue';
    import CustomProgressTimeline from '@/components/layout/CustomProgressTimeline.vue';
    import { message } from 'ant-design-vue';

    const props = defineProps({
      pageData: {
        type: Object,
        required: true,
        default: () => ({})
      }
    });

    const route = useRoute();
    const router = useRouter();
    const isView = ref(props.pageData.mode === 'view'); // 是否为查看模式
    const formModel = ref({});
    const isCreating = ref(true); // 控制是否显示详情/编辑表单，或操作结果页

    const {
      demandDetail: detailData,
      isLoading,
      fetchDemandDetail,
      handleSubmit: submitApi,
      handleSave: saveApi
    } = useDemandDetail({
      IdProp: props.pageData.IdProp,
      url: props.pageData.apiMap,
      localeGetDetail: props.pageData.localeGetDetail,
      otherParams: props.pageData.otherParams
    });

    const { previewVisible, previewImage, handleImagePreview } = useImagePreview();
    const { displayFields, formComponentMap, formRules, validateForm, getAllData } = useDetailForm(props.pageData.formConfigs, formModel, detailData);

    // 默认取消操作
    const handleDefaultCancel = () => {
      if (props.pageData.listPath) {
        router.push(props.pageData.listPath);
      } else {
        router.back();
      }
    };

    // 切换到编辑模式
    const handleToEdit = () => {
      isView.value = false;
    };

    // 默认提交操作
    const handleDefaultSubmit = async () => {
      try {
        await validateForm();
        let params = getAllData();
        if (props.pageData.handleBeforeSubmit && typeof props.pageData.handleBeforeSubmit === 'function') {
          params = props.pageData.handleBeforeSubmit(params);
          if (!params) {
            message.error('提交前置处理函数返回空，已取消提交。');
            return;
          }
        }
        const result = await submitApi(params);
        if (result) {
          isCreating.value = false; // 显示操作结果页
          detailData.value = result; // 更新详情数据以供结果页使用
        }
      } catch (error) {
        console.error('表单验证或提交失败:', error);
        message.error('表单验证失败，请检查输入项。');
      }
    };

    // 处理自定义操作按钮
    const handleCustomAction = async (action) => {
      if (action.permission) {
        // 假设usePermissions提供了checkPermission方法
        // const hasPermission = checkPermission(action.permission);
        // if (!hasPermission) {
        //   message.warning('您没有执行此操作的权限！');
        //   return;
        // }
      }
      if (action.callback && typeof action.callback === 'function') {
        await action.callback(formModel.value);
      } else {
        message.info(`执行自定义操作: ${action.title}`);
      }
    };

    // 操作成功后跳转到详情页
    const handleToDetail = () => {
      isCreating.value = true; // 重新显示表单
      if (props.pageData.detailPath && detailData.value && detailData.value[props.pageData.IdProp]) {
        router.push({ path: `${props.pageData.detailPath}/${detailData.value[props.pageData.IdProp]}` });
      } else {
        handleDefaultCancel(); // 如果没有详情路径，则返回列表或上一页
      }
    };

    // 操作成功后跳转到列表页
    const handleToList = () => {
      isCreating.value = true; // 重新显示表单
      handleDefaultCancel();
    };

    watch(() => detailData.value, (newVal) => {
      if (newVal) {
        formModel.value = { ...newVal };
      }
    }, { immediate: true });

    watch(() => route.params[props.pageData.IdProp], (newId) => {
      if (newId) {
        fetchDemandDetail(newId);
        isCreating.value = true; // 每次ID变化都重置为显示表单
        isView.value = props.pageData.mode === 'view'; // 根据mode设置初始视图
      }
    }, { immediate: true });

    defineExpose({ fetchDemandDetail, formModel });
    </script>
    ```

**3. `edit.vue` (通用编辑/创建页面模板)**

- **功能**: 提供一个高度可配置的通用页面模板，用于创建新数据或编辑现有数据。它通过动态表单渲染、数据提交处理和操作结果反馈，支持灵活的业务数据录入和修改。
- **Props**:
    - `pageData` (Object, 必填): 页面配置对象，定义了此编辑/创建页的所有行为和显示内容。
        - `IdProp` (String, 默认值: `'id'`): 详情数据的唯一标识字段名（用于编辑模式），例如 'id'。
        - `mode` (String, 默认值: `'create'`): 页面模式，如 `create` (创建) 或 `edit` (编辑)。
        - `pageTitle` (String, 默认值: `'编辑/创建'`): 页面标题。
        - `apiMap` (Object, 必填): API 接口配置对象。
            - `detail` (String, 可选): 获取详情数据的 API 路径 (仅在编辑模式下需要)。
            - `submit` (String): 提交（保存）数据的 API 路径。
            - **示例**:
                ```javascript
                {
                  detail: '/jeecg-boot/demand/queryById', // 编辑时需要
                  submit: '/jeecg-boot/demand/add' // 或 '/jeecg-boot/demand/edit'
                }
                ```
        - `formConfigs` (Array<Object>, 必填): 表单配置数组，定义表单字段的显示方式、校验规则和表单组件类型。每个对象包含 `label` (显示名称), `field` (对应数据字段), `fieldType` (表单组件类型，如 'input', 'select', 'textarea', 'imageUpload'), `rules` (校验规则), `options` (当 `fieldType` 为 'select' 时的选项), `dictKey` (字典键), `props` (传递给组件的额外属性)。
            - **示例**:
                ```javascript
                [
                  { label: '产品名称', field: 'productName', fieldType: 'input', rules: [{ required: true, message: '请输入产品名称' }] },
                  { label: '产品类型', field: 'productType', fieldType: 'select', dictKey: 'product_type' },
                  { label: '产品图片', field: 'productImages', fieldType: 'imageUpload', multiple: true, props: { maxCount: 3 } }
                ]
                ```
        - `handleBeforeSubmit` (Function, 可选): 提交前的钩子函数，用于数据预处理。接收表单数据作为参数，返回处理后的数据。
        - `handleBeforeSave` (Function, 可选): 保存前的钩子函数，用于数据预处理 (如果存在草稿保存功能)。
        - `detailPath` (String, 默认值: `''`): 详情页的路由路径，用于操作成功后的跳转。
        - `listPath` (String, 默认值: `''`): 列表页的路由路径，用于操作成功后的跳转。
        - `useFooterAction` (Boolean, 默认值: `true`): 是否显示底部操作按钮。
        - `successTitle` (String, 默认值: `'操作成功'`): 操作成功后的提示标题。
        - `otherParams` (Object, 默认值: `{}`): 传递给数据请求的其他参数。
- **技术特点**:
    - **高度配置化**: 通过 `pageData` 对象灵活配置编辑/创建页的结构、数据源、操作和展示逻辑。
    - **动态表单渲染**: 核心使用 `DynamicForm` 组件，根据 `formConfigs` 动态生成表单项，并管理表单的验证和数据获取。
    - **数据处理**: 结合 `useDemandDetail` 组合式函数处理数据的加载、保存 (`handleSave`) 和提交 (`handleSubmit`)。
    - **操作结果反馈**: 操作成功后，页面会切换到 `operationResultPage` 显示成功信息，并提供跳转到详情页或列表页的选项。
    - **表单校验与提交**: 通过 `dynamicFormRef` 引用 `DynamicForm` 组件的方法进行表单校验 (`validate`) 和数据获取 (`getAllData`)，然后调用 `handleFormAction` 统一处理提交逻辑，包括前置钩子 (`handleBeforeSubmit`) 和 API 调用。
    - **路由集成**: 侦听 `IdProp` 变化以在编辑模式下加载现有数据。
    - **插槽 (`slot`)**: 提供了 `moreForm` 插槽，允许在动态表单之后插入额外的自定义表单内容。
- **代码示例 (核心结构)**:
    ```vue
    <template>
        <div class="edit-page">
            <a-spin :spinning="isLoading">
                <div v-if="isCreating">
                    <h1 class="page-main-title">{{ pageData.pageTitle }}</h1>
                    <div class="form-section-container">
                        <h2 class="form-section-title">基本信息</h2>
                        <DynamicForm ref="dynamicFormRef" :form-config="pageData.formConfigs" :initial-model="formModel" />
                        <slot name="moreForm"></slot>
                    </div>
                    <div v-if='pageData.useFooterAction' class="page-actions-footer">
                        <a-button @click="goBack">取消</a-button>
                        <a-button type="primary" @click="handleSubmitForm" :loading="isSubmitting">{{ pageData.actionNote || '提交' }}</a-button>
                    </div>
                </div>
                <div v-else>
                    <operationResultPage :pageData="{title: pageData.successTitle}" @primaryAction="handleToDetail" @secondaryAction="handleToList" />
                </div>
            </a-spin>
        </div>
    </template>

    <script setup>
    import { ref, watch, computed } from 'vue';
    import DynamicForm from '@/components/layout/DynamicForm.vue';
    import operationResultPage from './operationResultPage.vue';
    import { useDemandDetail } from './hooks/useDemandDetail.js';
    import { useRouter, useRoute } from 'vue-router';
    import { message } from 'ant-design-vue';

    const props = defineProps({
      pageData: {
        type: Object,
        required: true,
        default: () => ({})
      }
    });

    const router = useRouter();
    const route = useRoute();
    const dynamicFormRef = ref(null);
    const isSubmitting = ref(false);
    const formModel = ref({});
    const isCreating = ref(true); // 控制是否显示编辑/创建表单，或操作结果页

    const {
      demandDetail: demandDetailData,
      isLoading,
      fetchDemandDetail,
      handleSubmit: submitApi,
      handleSave: saveApi // 如果有保存草稿功能
    } = useDemandDetail({
      IdProp: props.pageData.IdProp,
      url: props.pageData.apiMap,
      otherParams: props.pageData.otherParams
    });

    watch(demandDetailData, (newDetail) => {
        if (newDetail) {
            formModel.value = JSON.parse(JSON.stringify(newDetail));
        } else {
            formModel.value = {};
        }
    }, { deep: true, immediate: true });

    // 在编辑模式下，根据路由参数加载数据
    watch(() => route.params[props.pageData.IdProp], (newId) => {
        if (props.pageData.mode === 'edit' && newId) {
            fetchDemandDetail(newId);
            isCreating.value = true; // 每次ID变化都重置为显示表单
        } else if (props.pageData.mode === 'create') {
            formModel.value = {}; // 创建模式下清空表单
            isCreating.value = true;
        }
    }, { immediate: true });


    const handleFormAction = async (actionApi, beforeActionHook) => {
        if (!dynamicFormRef.value) return;
        try {
            await dynamicFormRef.value.validate();
            let params = dynamicFormRef.value.getAllData();
            if (beforeActionHook && typeof beforeActionHook === 'function') {
                const modifiedParams = beforeActionHook(params);
                if (modifiedParams) params = modifiedParams;
            }
            isSubmitting.value = true;
            const result = await actionApi(params);
            if (result) {
                demandDetailData.value = result; // 更新详情数据以供结果页使用
                isCreating.value = false; // 显示操作结果页
                message.success(props.pageData.successTitle || '操作成功！');
            }
        } catch (validationError) {
            console.error('表单验证或提交失败:', validationError);
            message.error('表单验证失败，请检查输入项。');
        } finally {
            isSubmitting.value = false;
        }
    };

    const handleSubmitForm = () => handleFormAction(submitApi, props.pageData.handleBeforeSubmit);
    const goBack = () => {
      if (props.pageData.listPath) {
        router.push(props.pageData.listPath);
      } else {
        router.back();
      }
    };

    const handleToDetail = () => {
      isCreating.value = true; // 重新显示表单
      if (props.pageData.detailPath && demandDetailData.value && demandDetailData.value[props.pageData.IdProp]) {
        router.push({ path: `${props.pageData.detailPath}/${demandDetailData.value[props.pageData.IdProp]}` });
      } else {
        goBack(); // 如果没有详情路径，则返回列表或上一页
      }
    };

    const handleToList = () => {
      isCreating.value = true; // 重新显示表单
      goBack();
    };

    defineExpose({ getAllData: () => dynamicFormRef.value?.getAllData(), validate: () => dynamicFormRef.value?.validate() });
    </script>
    ```

#### **4. 核心功能模块说明**

- **用户认证 (`auth`)**: 提供用户登录、注册、忘记密码等功能。通过 `authStore` 管理用户 Token 和个人信息，并利用路由守卫实现页面的访问控制。
- **首页 (`home`)**: 应用的门户页面，展示了平台的核心服务入口、Banner 广告、行业动态摘要等内容。
- **需求广场 (`demand_square`)**: 用户可以发布、浏览和搜索各类电子元器件或服务的需求，是平台的核心交易撮合功能之一。
- **用户中心 (`user_center`)**: 用户的个人工作台，包含个人信息管理、我发布的需求、我的订单、会员状态等功能。采用侧边栏布局，方便用户在不同功能间切换。
- **共济共享 (`secondTrade`)**: 一个资源共享或二手交易模块，允许用户发布和交易闲置资源。
- **行业动态 (`industryDynamics` & `rdDynamic`)**: 发布行业新闻、技术文章和研发动态，为用户提供价值资讯。

#### **5. 路由与权限系统**

- **路由管理**:
  - 在 `src/router/index.js` 中集中配置主路由，并通过动态导入 `src/views` 中各个模块的 `routes.js` 文件来加载功能路由。
  - 路由配置中包含 `meta` 信息，用于定义页面标题、面包屑导航和访问权限 (`requiresAuth`)。
- **权限控制**:
  - **页面级权限**: 通过 Vue Router 的全局前置守卫 (`beforeEach`) 实现。在用户访问需要登录的页面时，系统会检查 `authStore` 中是否存在有效的 Token，如果不存在则会弹出登录提示框。
  - **操作级权限**: 通过自定义的 `usePermissions` Hook 和 `withPermission` 高阶函数实现。它可以根据当前用户的角色，精细地控制页面上某个按钮或某个操作的可用性，未授权的操作将被隐藏或禁用。

#### **6. API 通信**

- **统一封装**: 在 `src/utils/http/axios.js` 中对 Axios 进行了封装，创建了一个全局单例。
- **请求拦截器**: 在每个请求发送前，自动从 `authStore` 中获取 Token 并添加到请求头中。
- **响应拦截器**: 对后端的响应进行预处理，统一处理业务错误（如未登录、无权限等），并向用户显示友好的中文提示。
- **API 代理**: 在 `vite.config.js` 中配置了后端接口代理，将前端的 `/jeecgboot` 请求转发到真实的后端服务地址，解决了开发环境下的跨域问题。

---