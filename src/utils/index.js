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
          result = `${prefix}${fileUrl}`;
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