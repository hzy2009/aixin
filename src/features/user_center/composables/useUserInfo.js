import { ref, onMounted } from 'vue';
// import { useAuthStore } from '@/store/authStore'; // Assuming you have user ID or token here
// import apiClient from '@/api'; // Your configured Axios instance

export function useUserInfo() {
  const userInfo = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  // const authStore = useAuthStore(); // Uncomment when using real auth

  async function fetchUserInfo() {
    // if (!authStore.isAuthenticated || !authStore.user?.id) {
    //   error.value = 'User not authenticated or ID not found.';
    //   return;
    // }
    isLoading.value = true;
    error.value = null;
    try {
      // TODO: API Call: Fetch user profile information
      // Example: const response = await apiClient.get(`/api/user/profile`);
      // userInfo.value = response.data;

      // --- Mock Data (Matches design fields) ---
      await new Promise(resolve => setTimeout(resolve, 500));
      userInfo.value = {
        // Top section
        companyName: '广州XXX股份有限公司',
        memberLevel: '普通会员', // Values: '普通会员', '高级会员', 'VIP会员' etc.
        registrationDate: '2025-06-06',
        expiryDate: '2026-06-06', // '长期有效' or a date
        avatarUrl: null, // For the image on the right, you'll provide this

        // 联系人信息 (Contact Information)
        contactPerson: {
          name: '张三',
          phone: '18000012356',
          email: 'hicox3598@gmail.com',
          department: '采购部',
          position: '采购经理',
        },

        // 企业认证信息 (Company Certification Information)
        companyCertification: {
          category: '类别名称 (例如：芯片设计)',
          location: '广东省/广州市',
          isListed: '否', // '是' or '否'
          hrDepartmentContact: '人力资源部联系方式或对接人', // Design says "法人部门" but contextually might be HR/Admin for company info
          taxpayerId: '91440300618831447R',
          registeredCapital: '25,717.2395', // 万元
          businessLicenseUrl: null, // URL to the business license image
        },

        // 法人信息 (Legal Representative Information)
        legalRepresentative: {
          name: '李四',
          idCardNumber: '5XXXXXXXXXXXXXXXXX', // Masked
          incorporationDate: '2022-04-25',
          phone: '18000012357',
          position: '人力总监', // 法人职务
          email: 'legalrep@example.com',
        },
        lastInfoUpdateTime: '2023-10-26 15:30:00' // For "当前信息更新于"
      };
      // --- End Mock Data ---

    } catch (err) {
      console.error("Failed to fetch user info:", err);
      error.value = '无法加载用户信息。';
      userInfo.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUserInfo(updatedData) {
    // TODO: API Call: Update user profile information
    // const payload = { ...updatedData }; // Prepare payload for API
    // const response = await apiClient.put(`/api/user/profile`, payload);
    // userInfo.value = response.data; // Update local state with response from server

    isLoading.value = true;
    error.value = null;
    try {
      // --- Mock Update ---
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simulate partial update: merge new data with existing
      const currentData = JSON.parse(JSON.stringify(userInfo.value));

      // Deep merge for nested objects
      if (updatedData.contactPerson) {
        currentData.contactPerson = { ...currentData.contactPerson, ...updatedData.contactPerson };
      }
      if (updatedData.companyCertification) {
        currentData.companyCertification = { ...currentData.companyCertification, ...updatedData.companyCertification };
      }
      if (updatedData.legalRepresentative) {
        currentData.legalRepresentative = { ...currentData.legalRepresentative, ...updatedData.legalRepresentative };
      }
      // Update top-level fields
      Object.keys(updatedData).forEach(key => {
        if (!['contactPerson', 'companyCertification', 'legalRepresentative'].includes(key)) {
          currentData[key] = updatedData[key];
        }
      });

      currentData.lastInfoUpdateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      userInfo.value = currentData;
      console.log("Mock user info updated successfully.");
      return { success: true, data: userInfo.value };
      // --- End Mock Update ---
    } catch (err) {
      console.error("Failed to update user info:", err);
      error.value = '更新用户信息失败。';
      return { success: false, message: error.value };
    } finally {
      isLoading.value = false;
    }
  }


  onMounted(() => {
    fetchUserInfo();
  });

  return {
    userInfo,
    isLoading,
    error,
    fetchUserInfo,
    updateUserInfo,
  };
}