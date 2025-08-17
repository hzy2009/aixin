import { useAuthStore } from '@/store/authStore';
import dayjs from 'dayjs';

const auth = useAuthStore();
export function getFileAccessHttpUrl(fileUrl, prefix = 'http') {
  let result = fileUrl;
  try {
    if (fileUrl && fileUrl.length > 0 && !fileUrl.startsWith(prefix)) {
      //判断是否是数组格式
      let isArray = fileUrl.indexOf('[') != -1;
      if (!isArray) {
        // let prefix = `${import.meta.env.VITE_GLOB_UPLOAD_URL}/sys/common/static/`;
        let prefix = `${import.meta.env.VITE_GLOB_UPLOAD_URL}`;
        // 判断是否已包含前缀
        if (!fileUrl.startsWith(prefix)) {
          const loaction = window.location;
          result = `${loaction.origin}/jeecgboot/${fileUrl}`;
          // result = `${prefix}${fileUrl}`;
        }
      }
    }
  } catch (err) { }
  return result;
};
export function selectOptions  (dictKey) {
	if (!dictKey) return [];
	if (!auth.sysAllDictItems[dictKey]) return []
	return auth.sysAllDictItems[dictKey].map(({ label, value }) => ({ label, value })) || [];
};

export function formatDate (date, format) {
  return dayjs(date).format(format || 'YYYY-MM-DD');
}
export const getRandom = (length = 1) => {
  return '-' + parseInt(String(Math.random() * 10000 + 1), length);
};

export const maskMiddle = (str = '') => 
  str && str?.length > 2 
    ? `${str[0]}***${str.slice(-1)}` 
    : str;

/**
 * 安全地从嵌套对象中获取值。
 * @param {Object} obj - 源对象。
 * @param {String} path - 属性路径，例如 'a.b[0].c'。
 * @param {*} [defaultValue=undefined] - 如果路径不存在时返回的默认值。
 * @returns {*} 找到的值或默认值。
 */
export function safeGet(obj, path, defaultValue = undefined) {
  if (typeof path !== 'string' || !obj) {
    return defaultValue;
  }
  // 将 'a.b[0].c' 这样的路径转换为 ['a', 'b', '0', 'c']
  const pathArray = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
  
  let current = obj;
  for (let i = 0; i < pathArray.length; i++) {
    const key = pathArray[i];
    if (current === null || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, key)) {
      return defaultValue;
    }
    current = current[key];
  }
  return current;
}