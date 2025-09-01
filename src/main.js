import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';

// 按需引入 Ant Design Vue 组件（可以显著减小包体积）
import {
  ConfigProvider,
  Spin,
  Button,
  Input,
  Form,
  FormItem,
  Select,
  SelectOption,
  Table,
  Tag,
  Modal,
  message,
  Skeleton,
  Pagination,
  Dropdown,
  Menu,
  MenuItem,
  Popconfirm,
  Tooltip
} from 'ant-design-vue';

// Import global LESS styles
import './assets/styles/index.less';
// Import Ant Design Vue's base styles (if not relying on CDN or individual component styles)
import 'ant-design-vue/dist/reset.css';

import VxeUIAll from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import '@/assets/styles/vxe-override.less'
// Optional: For @vueuse/head
// import { createHead } from '@vueuse/head'
// const head = createHead()

const app = createApp(App);

app.use(pinia);
app.use(router);

// 注册 Ant Design Vue 组件
app.use(ConfigProvider);
app.use(Spin);
app.use(Button);
app.use(Input);
app.use(Form);
app.use(FormItem);
app.use(Select);
app.use(SelectOption);
app.use(Table);
app.use(Tag);
app.use(Modal);
app.use(Skeleton);
app.use(Pagination);
app.use(Dropdown);
app.use(Menu);
app.use(MenuItem);
app.use(Popconfirm);
app.use(Tooltip);

// 全局配置message
app.config.globalProperties.$message = message;

app.use(VxeUIAll)
app.use(VxeUITable)
// app.use(head); // If using @vueuse/head

app.mount('#app');