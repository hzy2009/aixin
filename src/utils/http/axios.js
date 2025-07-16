// src/utils/http/axios.js
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import router from '@/router/index.js';
import { message as AntMessage, Modal } from 'ant-design-vue';
console.log('import.meta.env.VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL)
const defaultConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/jeecgboot',
  timeout: 10000,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=UTF-8', // Corrected Content-Type
  },
};

class AxiosHttpClient {
  constructor(options) {
    this.axiosInstance = axios.create({
      ...defaultConfig,
      ...options,
    });
    this.setupInterceptors();
  }

  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore();
        if (authStore.token && config.headers) {
          config.headers['x-access-token'] = `${authStore.token}`;
        }
        return config;
      },
      (error) => {
        AntMessage.error('请求发送失败: ' + error.message);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        // IMPORTANT: Customize this based on your backend's response format.
        // Example: If your API returns { code: 0, data: ..., message: '...' }
        const res = response.data;
        if (res && typeof res.code !== 'undefined' && res.code !== 0 && res.code !== 200) {
          AntMessage.error(res.message);
          return Promise.reject(res.message || 'Error from API');
        }
        return res; // Or return res.data; to directly get the data payload
      },
      (error) => {
        let errorMessage = '发生未知错误，请联系管理员';
        if (error.response) {
          const { status, data } = error.response;
          switch (status) {
            case 400: errorMessage = data?.message || '请求参数错误'; break;
            case 401:
              errorMessage = data?.message || '身份认证失败，请重新登录';
              this.handleUnauthorized();
              break;
            case 403: errorMessage = data?.message || '您没有权限执行此操作'; break;
            case 404: errorMessage = data?.message || '请求的资源未找到'; break;
            case 500: case 502: case 503: case 504:
              errorMessage = data?.message || '服务器繁忙，请稍后再试'; break;
            default:
              errorMessage = `请求错误 (${status}): ${data?.message || error.message}`;
          }
          AntMessage.error(errorMessage);
        } else if (error.request) {
          errorMessage = '网络请求超时或服务器未响应';
          AntMessage.error(errorMessage);
        } else {
          errorMessage = error.message || '请求发送失败';
          AntMessage.error(errorMessage);
        }
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }
   /**
   * 文件上传
   */
  uploadFile(config, params, callback) {
    const formData = new window.FormData();
    const customFilename = params.name || 'file';

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }
    config.baseURL = import.meta.env.VITE_GLOB_UPLOAD_URL || '/api';
    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data[key]);
      });
    }

    return this.axiosInstance
      .request<T>({
        ...config,
        method: 'POST',
        data: formData,
        headers: {
          'Content-type': ContentTypeEnum.FORM_DATA,
          ignoreCancelToken: true,
        },
      })
      .then((res) => {
        if (callback?.success && isFunction(callback?.success)) {
          callback?.success(res?.data);
        } else if (callback?.isReturnResponse) {
          return Promise.resolve(res?.data);
        } else {
          if (res.data.success == true && res.data.code == 200) {
            AntMessage.success(res.data.message);
          } else {
            AntMessage.error(res.data.message);
          }
        }
      });
  }

  handleUnauthorized() {
    const authStore = useAuthStore();
    // Prevent multiple modals if multiple 401s arrive quickly
    if (Modal._hasPromise) return; // Simple flag, AntD Modal doesn't expose this, might need custom state
    Modal._hasPromise = true; // Set flag

    if (authStore.token) {
      Modal.confirm({
        title: '会话过期',
        content: '您的登录会话已过期，请重新登录。',
        okText: '重新登录',
        cancelText: '取消',
        onOk: () => {
          try {
            authStore.logout();
            router.push({
              path: '/login',
            }).finally(() => { Modal._hasPromise = false; });
          } catch (error) {
            console.log(error);
          }
        },
        onCancel: () => {
          authStore.logout(); // Still good to logout
        },
        afterClose: () => { // Ensure flag is cleared if modal is closed by other means
          authStore.logout(); // Still good to logout
        }
      });
    } else {
       router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
       }).finally(() => { Modal._hasPromise = false; });
    }
  }

  /**
   * @description Unified request method
   * @param {object} config - Axios request config object, must include 'url' and 'method'
   * @returns {Promise}
   */
  request(config) {
    if (!config.url) {
      console.error('Axios request error: URL is required.');
      return Promise.reject(new Error('URL is required for API request.'));
    }
    return this.axiosInstance.request(config);
  }

  // --- Convenience HTTP Methods using the new object structure ---

  /**
   * @description GET request
   * @param {object} config - Axios request config, must include 'url'. 'params' can be included.
   * @returns {Promise}
   */
  get(config) {
    return this.request({ method: 'GET', ...config });
  }

  /**
   * @description POST request
   * @param {object} config - Axios request config, must include 'url'. 'data' (for body) can be included.
   * @returns {Promise}
   */
  post(config) {
    return this.request({ method: 'POST', ...config });
  }

  /**
   * @description PUT request
   * @param {object} config - Axios request config, must include 'url'. 'data' (for body) can be included.
   * @returns {Promise}
   */
  put(config) {
    return this.request({ method: 'PUT', ...config });
  }

  /**
   * @description DELETE request
   * @param {object} config - Axios request config, must include 'url'. 'params' or 'data' can be included.
   * @returns {Promise}
   */
  delete(config) {
    return this.request({ method: 'DELETE', ...config });
  }

  /**
   * @description PATCH request
   * @param {object} config - Axios request config, must include 'url'. 'data' (for body) can be included.
   * @returns {Promise}
   */
  patch(config) {
    return this.request({ method: 'PATCH', ...config });
  }

  /**
   * @description File Upload request (using FormData)
   * @param {object} config - Axios request config, must include 'url' and 'data' (as FormData).
   *                       'headers' for 'multipart/form-data' will be set.
   * @returns {Promise}
   */
  upload(config) {
    return this.request({
      method: 'POST',
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config.headers || {}), // Merge with existing headers
      },
    });
  }
}

const defHttp = new AxiosHttpClient();

export default defHttp;