// HTTP错误处理工具
import { message as AntMessage, Modal } from 'ant-design-vue';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import router from '@/router/index.js';

/**
 * HTTP状态码错误映射
 */
const HTTP_ERROR_MAP = {
  400: '请求参数错误',
  401: '身份认证失败，请重新登录',
  403: '您没有权限执行此操作',
  404: '请求的资源未找到',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂时不可用',
  504: '网关超时',
};

/**
 * 业务错误码映射（根据后端API定义）
 */
const BUSINESS_ERROR_MAP = {
  1001: '用户未登录',
  1002: '登录已过期',
  1003: '用户权限不足',
  2001: '参数验证失败',
  2002: '数据不存在',
  3001: '系统繁忙，请稍后重试',
};

/**
 * 错误处理类
 */
export class ErrorHandler {
  constructor() {
    this.retryCount = 0;
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  /**
   * 处理HTTP错误
   * @param {Error} error - axios错误对象
   */
  handleHttpError(error) {
    if (!error.response) {
      return this.handleNetworkError(error);
    }

    const { status, data } = error.response;
    const errorMessage = data?.message || HTTP_ERROR_MAP[status] || `请求错误 (${status})`;

    switch (status) {
      case 401:
        this.handleUnauthorizedError(data);
        break;
      case 403:
        this.handleForbiddenError(data);
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        this.handleServerError(status, data);
        break;
      default:
        AntMessage.error(errorMessage);
    }

    return Promise.reject(error);
  }

  /**
   * 处理业务逻辑错误
   * @param {Object} response - 响应数据
   */
  handleBusinessError(response) {
    const { code, message } = response;
    const errorMessage = BUSINESS_ERROR_MAP[code] || message || '操作失败';

    switch (code) {
      case 1001:
      case 1002:
        this.handleLoginExpired();
        break;
      case 1003:
        this.handlePermissionDenied();
        break;
      default:
        AntMessage.error(errorMessage);
    }

    return Promise.reject(response);
  }

  /**
   * 处理网络错误
   * @param {Error} error 
   */
  handleNetworkError(error) {
    let errorMessage = '网络连接异常';
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMessage = '请求超时，请稍后重试';
    } else if (error.message.includes('Network Error')) {
      errorMessage = '网络连接失败，请检查网络设置';
    }

    AntMessage.error(errorMessage);
    return Promise.reject(error);
  }

  /**
   * 处理401未授权错误
   */
  handleUnauthorizedError(data) {
    const authStore = useAuthStore();
    const modalStore = useModalStore();
    
    // 清除本地认证信息
    authStore.clearUser();
    
    // 显示登录模态框而不是跳转页面
    modalStore.showLogin();
    
    AntMessage.warning('登录已过期，请重新登录');
  }

  /**
   * 处理403权限不足错误
   */
  handleForbiddenError(data) {
    const message = data?.message || '您没有权限执行此操作';
    
    Modal.warning({
      title: '权限不足',
      content: message,
      okText: '我知道了',
    });
  }

  /**
   * 处理服务器错误（支持重试）
   */
  handleServerError(status, data) {
    const errorMessage = data?.message || HTTP_ERROR_MAP[status] || '服务器错误';
    
    if (this.retryCount < this.maxRetries) {
      this.scheduleRetry(errorMessage);
    } else {
      AntMessage.error(`${errorMessage}，请联系系统管理员`);
      this.retryCount = 0; // 重置重试次数
    }
  }

  /**
   * 安排重试
   */
  scheduleRetry(errorMessage) {
    this.retryCount++;
    const delay = this.retryDelay * this.retryCount;
    
    AntMessage.loading(`${errorMessage}，${delay/1000}秒后重试...`, 1);
    
    setTimeout(() => {
      // 重试逻辑由调用方处理
      console.log(`正在进行第${this.retryCount}次重试...`);
    }, delay);
  }

  /**
   * 处理登录过期
   */
  handleLoginExpired() {
    const authStore = useAuthStore();
    const modalStore = useModalStore();
    
    authStore.clearUser();
    modalStore.showLogin();
    
    AntMessage.warning('登录已过期，请重新登录');
  }

  /**
   * 处理权限不足
   */
  handlePermissionDenied() {
    Modal.confirm({
      title: '权限不足',
      content: '您没有执行此操作的权限，是否联系管理员申请权限？',
      okText: '联系管理员',
      cancelText: '取消',
      onOk() {
        // 可以跳转到联系管理员页面或显示联系方式
        AntMessage.info('请联系系统管理员申请相关权限');
      },
    });
  }

  /**
   * 重置错误状态
   */
  reset() {
    this.retryCount = 0;
  }
}

// 创建全局错误处理实例
export const errorHandler = new ErrorHandler();

// 导出便捷方法
export const handleHttpError = (error) => errorHandler.handleHttpError(error);
export const handleBusinessError = (response) => errorHandler.handleBusinessError(response);