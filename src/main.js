import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';

import Antd from 'ant-design-vue';
import { initModalDrag } from './utils/modalDrag.js';

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

app.use(Antd);

// 全局配置message

app.use(VxeUIAll)
app.use(VxeUITable)
// app.use(head); // If using @vueuse/head

// 初始化全局模态框拖拽功能
initModalDrag();

app.mount('#app');