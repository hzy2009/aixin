// src/features/user_center/composables/useDemandDetail.js
import { ref, onMounted, computed, reactive } from 'vue';
import defHttp from '@/utils/http/axios'
import { message } from 'ant-design-vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useRoute } from 'vue-router'; // 用于新建成功后跳转

export function useDemandDetail({IdProp, mode, url, otherParams, queryAfter, handleformConfigsAfter}) { // 接收 props
  const demandDetail = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  const operationMode = ref(mode || (IdProp ? 'view' : 'create')); // 'create', 'view'
  const internalDemandId = ref(IdProp); // 用于内部追踪ID

  // --- 权限计算 ---
  const canEditThisDemand = computed(() => {
    if (demandDetail.value?.statusCode) {
      if (!['draft'].includes(demandDetail.value.statusCode)) {
        return false;
      }
    }
    return authStore.isVip && authStore.userInfo?.username === demandDetail.value?.createUserName
  });

  // --- 权限计算结束 ---

  async function fetchDemandDetail() {
    if (!internalDemandId.value) {
      // 新建模式或没有ID，初始化空/默认表单数据
      demandDetail.value = {
        ...otherParams,
        tenantName: authStore.userInfo.realname,
        tenantId: authStore.userInfo.loginTenantId,
        // ... 其他类型可能需要的默认字段 ...
      };
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await defHttp.get({ url: url.detail, params: {id: internalDemandId.value} });
      
      if (response.success) {
        const data = queryAfter && queryAfter(response.result) || response.result;
        demandDetail.value = data;
        handleformConfigsAfter && handleformConfigsAfter(demandDetail.value);
      } else {
        throw new Error(response.data.message || '获取需求详情失败');
      }
    } catch (err) {
      console.error("获取需求详情失败:", err);
      error.value = err.message || "加载需求详情失败。";
      demandDetail.value = null;
      message.error(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function handleSave(formData) {
    isLoading.value = true;
    error.value = null;
    let response;
    try {
      const payload = { ...formData }; // 可以根据需要调整 payload 结构
      const apiPath = payload.id ? url.edit : url.add;
      response = await defHttp.post({ url: apiPath, data: payload });
      if (response && response.success) {
        message.success(response.message);
        // if (!payload.id) {/
            // internalDemandId.value = response.result?.id; // 更新内部ID
            // const detailPath = route.path.replace('create', ''); // 获取详情路径
            // router.replace({ path: `${detailPath}${response.result?.id}` });
        // }
        // await fetchDemandDetail();
        return response.result;
      } else {
        throw new Error(response.message || '操作失败');
      }
    } catch (err) {
      console.error("提交需求失败:", err);
      error.value = err.message || "操作失败，请重试。";
      message.error(error.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function handleSubmit(formData) {
    isLoading.value = true;
    error.value = null;
    let response;
    try {
      const payload = { ...formData }; // 可以根据需要调整 payload 结构
      response = await defHttp.post({ url: url.submit, data: payload });
      if (response && response.success) {
        message.success(response.message);
        return response.result;
      } else {
        throw new Error(response.message || '操作失败');
      }
    } catch (err) {
      console.error("提交需求失败:", err);
      error.value = err.message || "操作失败，请重试。";
      message.error(error.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
      fetchDemandDetail(); // 会根据 operationMode 判断是加载还是设置默认值
  });

  return {
    demandDetail,
    isLoading,
    error,
    operationMode, // 'create' or 'view'
    canEditThisDemand,
    fetchDemandDetail, // 允许外部刷新
    handleSave,
    handleSubmit,
    internalDemandId, // 可以暴露供父组件在某些情况下使用
  };
}