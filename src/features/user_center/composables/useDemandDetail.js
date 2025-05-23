import { ref, reactive, onMounted, computed } from 'vue';
import apiClient from '@/api'; // Your Axios instance
import { message } from 'ant-design-vue';

export function useDemandDetail(demandId, demandType) { // demandType might influence API endpoint
  const demandDetail = ref(null);
  const isLoading = ref(false);
  const isEditMode = ref(false);
  const error = ref(null);

  // --- Mock Data (Structure for "国产替代寻源详情") ---
  const mockDetailData = {
    id: demandId, // A00092347
    sourcingType: 'pump', // 寻源件类型
    sourcingTypeLabel: 'Pump', // For display if needed, or look up from options
    validUntil: '2025/12/31', // 需求有效期
    status: 'published', // 寻源件状态
    statusLabel: '寻源发布', // For display
    // ... other fields for "国产寻源基本信息" ...
    remarks: '这里是一些详细的备注信息，关于这个国产替代寻源的具体要求和背景情况。',

    // For "国产寻源代寻源状态" table
    statusHistory: [
      { seq: 1, status: '需求发布', date: '2025/02/28', orderNo: 'E0000823', time: '2025/03/01 12:01:05', note: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
      { seq: 2, status: '匹配中', date: '2025/03/12', orderNo: 'E0000928', time: '2025/03/12 15:21:15', note: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
      // Add more history items
    ]
  };
  // --- End Mock Data ---

  async function fetchDemandDetail() {
    if (!demandId) {
      error.value = "需求ID未提供";
      return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      // const response = await apiClient.get(`/api/demands/${demandType}/${demandId}`);
      // demandDetail.value = response.data;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // For mock, ensure ID from route is used if dynamic
      const currentMock = { ...mockDetailData, id: demandId };
      demandDetail.value = currentMock;

    } catch (err) {
      console.error("Failed to fetch demand detail:", err);
      error.value = "加载需求详情失败。";
      demandDetail.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function saveDemandDetail(updatedData) {
    if (!demandId) return false;
    isLoading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint for updating
      // const response = await apiClient.put(`/api/demands/${demandType}/${demandId}`, updatedData);
      // demandDetail.value = response.data; // Update with response from server

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      demandDetail.value = { ...demandDetail.value, ...updatedData }; // Merge updates
      message.success('保存成功!');
      isEditMode.value = false; // Switch back to view mode
      return true;
    } catch (err) {
      console.error("Failed to save demand detail:", err);
      error.value = "保存需求详情失败。";
      message.error('保存失败，请重试。');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  const toggleEditMode = (editState) => {
    isEditMode.value = typeof editState === 'boolean' ? editState : !isEditMode.value;
    if (!isEditMode.value && demandDetail.value) {
        // Optionally refetch or reset to original if canceling edit without save
        // fetchDemandDetail(); // Or handle reset logic if form data was modified
    }
  };

  onMounted(() => {
    fetchDemandDetail();
  });

  return {
    demandDetail,
    isLoading,
    isEditMode,
    error,
    fetchDemandDetail,
    saveDemandDetail,
    toggleEditMode,
  };
}