// src/features/user_center/composables/useDemandDetail.js
import { ref, onMounted, computed, reactive } from 'vue';
import { addDemand, editDemand, submitDemand, deleteDemand, getDemandById, getList } from '@/api/demands.js'; // 用于获取路由参数
import apiClient from '@/utils/http/axios.js'; // 你的 Axios 实例
import { message } from 'ant-design-vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router'; // 用于新建成功后跳转

export function useDemandDetail({demandIdProp, mode, demandTypeProp}) { // 接收 props
  const demandDetail = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const authStore = useAuthStore();
  const router = useRouter();

  const operationMode = ref(mode || (demandIdProp ? 'view' : 'create')); // 'create', 'view'
  const internalDemandId = ref(demandIdProp); // 用于内部追踪ID
  const demandType = ref(demandTypeProp); // 默认为国产替代

  // --- 权限计算 ---
  const canEditThisDemand = computed(() => {
    if (!authStore.isAuthenticated) return false;
    if (operationMode.value === 'create') return true; // 创建时总是有权限填写表单
    if (!demandDetail.value) return false;

    if (authStore.isAdmin) return true;
    if (authStore.isMember && authStore.user?.id === demandDetail.value.creatorId) {
      return true;
    }
    return false;
  });

  const canViewStatusHistoryTable = computed(() => {
    if (!authStore.isAuthenticated) return false;
    return authStore.isAdmin && operationMode.value !== 'create'; // 创建时没有历史
  });
  // --- 权限计算结束 ---

  async function fetchDemandDetail() {
    if (operationMode.value === 'create' || !internalDemandId.value) {
      // 新建模式或没有ID，初始化空/默认表单数据
      demandDetail.value = {
        sourcingType: demandType == 'domestic' ? '国产替代寻源' : '原厂件寻源',
        // status: 'published', // 默认状态
        remarks: '',
        // ... 其他类型可能需要的默认字段 ...
      };
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      // 实际API: GET apm/apmSourcing/queryById
      const response = await getDemandById({ id: internalDemandId.value } );
      if (response.success) {
        demandDetail.value = response.result;
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

  async function submitDemand(formData) { // 统一的提交函数
    if (!canEditThisDemand.value && operationMode.value !== 'create') {
        message.error('您没有权限执行此操作。');
        return false;
    }
    isLoading.value = true;
    error.value = null;
    let response;
    try {
      const payload = { ...formData }; // 可以根据需要调整 payload 结构

      if (operationMode.value === 'create') {
        // 实际API: POST apm/apmSourcing/add
        response = await addDemand(payload);
      } else { // 编辑模式
        // 实际API: POST apm/apmSourcing/edit (通常编辑用 PUT，但你提供的是 POST)
        payload.id = internalDemandId.value; // 确保编辑时带上ID
        response = await aeditDemand(payload);
      }

      if (response.data && response.data.success) {
        message.success(operationMode.value === 'create' ? '需求创建成功!' : '需求更新成功!');
        const newId = operationMode.value === 'create' ? response.data.data?.id : internalDemandId.value; // 假设新建成功后后端返回新ID
        
        if (operationMode.value === 'create' && newId) {
            // 新建成功后，通常会跳转到详情页或列表页
            // 这里我们假设跳转到新创建的需求的详情页
            operationMode.value = 'view'; // 切换到查看模式
            internalDemandId.value = newId; // 更新内部ID
            // 重新获取详情，或者直接用返回的数据更新
            // demandDetail.value = response.data.data;
            await fetchDemandDetail(); // 重新获取以确保数据一致性
            // 更新浏览器URL，但不重新加载页面 (如果需要)
            router.replace({ name: 'DemandDetail', params: { demandId: newId }, query: { type: demandType.value } });

        } else {
            // 编辑成功后，重新获取详情
            await fetchDemandDetail();
        }
        return true;
      } else {
        throw new Error(response.data.message || '操作失败');
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

  // `list` 接口通常在列表页使用，这里不直接包含，但可以作为参考
  // async function fetchDemandList(params) { /* ... apiClient.get('apm/apmSourcing/list', { params }) ... */ }

  onMounted(() => {
      fetchDemandDetail(); // 会根据 operationMode 判断是加载还是设置默认值
  });

  return {
    demandDetail,
    isLoading,
    error,
    operationMode, // 'create' or 'view'
    canEditThisDemand,
    canViewStatusHistoryTable,
    fetchDemandDetail, // 允许外部刷新
    submitDemand,
    // internalDemandId, // 可以暴露供父组件在某些情况下使用
  };
}