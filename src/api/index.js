// src/api/index.js
import axios from 'axios';
import { useAuthStore } from '@/store/authStore'; // We'll create this later

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Use environment variable
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Get store instance inside interceptor
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (example for handling 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.logout(); // Or redirect to login
      // Potentially redirect to login page
      // router.push('/login'); // Make sure router is available or emit an event
      console.error('Unauthorized, logging out.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;