import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import Antd from 'ant-design-vue';

// Import global LESS styles
import './assets/styles/index.less';
// Import Ant Design Vue's base styles (if not relying on CDN or individual component styles)
import 'ant-design-vue/dist/reset.css'; // Or antd.css / antd.less depending on your preference

// Optional: For @vueuse/head
// import { createHead } from '@vueuse/head'
// const head = createHead()

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Antd);
// app.use(head); // If using @vueuse/head

app.mount('#app');