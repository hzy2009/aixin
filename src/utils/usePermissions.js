// src/composables/usePermissions.js

import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';

import { message } from 'ant-design-vue';

/**
 * 提供了权限检查相关功能的 Vue 3 Composable.
 *
 * @returns {object} 包含权限检查方法和用户角色列表的对象。
 */
export function usePermissions() {
  // 1. 获取 Pinia store 实例和当前用户的角色列表
  const authStore = useAuthStore();
  const modalStore = useModalStore();
  const {roleCode} = authStore.userRole; // authStore.userRoles 应该是一个 getter，以确保响应性

  /**
   * 检查当前用户是否拥有所要求的角色之一 (OR 条件).
   * @param {string[]} requiredRoles - 一个包含所需角色标识的数组, e.g., ['apm-vip', 'apm-register'].
   * @returns {boolean} 如果用户拥有至少一个所需角色，则返回 true。
   */
  const hasPermission = (requiredRoles = []) => {
    // 如果没有为按钮指定任何权限要求，则默认没有权限
    // if (!requiredRoles || requiredRoles.length === 0) {
    //   return false;
    // }
    if (requiredRoles.length === 1 && requiredRoles[0] === 'all') {
      return true;
    }
    const d = [
      ...requiredRoles,
      'apm-super-vip-free',
      'apm-super-vip'
    ]
    return d.includes(roleCode);
  };

  /**
   * 创建一个被权限保护的函数 (高阶函数).
   * 调用返回的函数时，它会先检查权限：
   * - 有权限：执行你传入的回调函数。
   * - 无权限：使用 message 弹出错误提示。
   *
   * @param {string[]} requiredRoles - 需要的角色数组。
   * @param {Function} callback - 当权限验证通过时要执行的函数。
   * @param {string} [noPermissionMessage='您没有执行此操作的权限'] - 无权限时的提示信息。
   * @returns {Function} 一个包装后的新函数, 可以直接赋值给 @click 事件。
   */
  const withPermission = (requiredRoles, callback, noPermissionMessage = '您没有执行此操作的权限') => {
    // 返回一个新函数，这个新函数才是最终被绑定的事件处理器
    return (...args) => {
      if(authStore.isLogin) {
        // 在函数被调用时进行权限检查
        if (hasPermission(requiredRoles)) {
          // 权限验证通过, 执行原始的回调函数，并传递所有参数 (例如事件对象 event)
          callback(...args);
        } else {
          // 权限验证失败, 显示错误提示
          // 如果你使用了其他 UI 库, 请在这里替换成对应的提示方法, 例如: message.error(noPermissionMessage);
          message.error(noPermissionMessage);
        }
      } else {
        modalStore.showLogin();
      }
    };
  };

  // 2. 返回所有可用的方法和状态，以便在组件中解构使用
  return {
    hasPermission,       // OR 条件检查函数
    withPermission,      // 权限包装函数（推荐用于点击事件）
  };
}