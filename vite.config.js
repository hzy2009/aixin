// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Import path module
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Setup @ alias for src directory
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // Example: Override Ant Design Vue default variables
          // 'primary-color': '#c92027', // Your primary red from design
          // 'link-color': '#c92027',
          'border-radius-base': '2px',
          // Or you can load a whole theme file:
          // hack: `true; @import (reference) "${path.resolve(__dirname, 'src/assets/styles/antd-theme.less')}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  server: {
    proxy: {
      '/jeecgboot': {
        target: 'http://47.115.47.114:8080/jeecg-boot/',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jeecgboot/, '') // 关键：移除前端请求中的 /jeecgboot 前缀
      },
    },
    host: '0.0.0.0', // 或者设置为 true
  },
});